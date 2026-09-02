import React, { useState, useEffect, useRef } from 'react';
import { useIntake } from '../context/IntakeContext';
import { extractIntakeFromNarrative, ExtractionResult } from '../engine/nlpExtractor';
import { determineNextQuestion, buildConversationalResponse, CopilotMessage, NextQuestionPlan } from '../engine/voiceCopilot';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  FileText, 
  Bot, 
  User, 
  Send,
  RotateCcw,
  CheckCircle2,
  Square
} from 'lucide-react';

export const StoryModeModal: React.FC = () => {
  const { 
    isStoryModalOpen, 
    setIsStoryModalOpen, 
    batchUpdate, 
    intake, 
    goToStep, 
    validation,
    isAudioMuted,
    setIsAudioMuted
  } = useIntake();

  const [activeMode, setActiveMode] = useState<'copilot' | 'freeflow'>('copilot');

  // --- Conversational Copilot States ---
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [currentPlan, setCurrentPlan] = useState<NextQuestionPlan>(() => determineNextQuestion(intake));
  const [copilotInput, setCopilotInput] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // --- Free-flow States ---
  const [freeFlowText, setFreeFlowText] = useState('');
  const [freeFlowExtraction, setFreeFlowExtraction] = useState<ExtractionResult>({
    patch: {},
    extractedKeys: [],
    confidenceSummary: [],
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const isAudioMutedRef = useRef(isAudioMuted);
  isAudioMutedRef.current = isAudioMuted;
  const intakeRef = useRef(intake);
  intakeRef.current = intake;

  // Speak AI text using Web Speech Synthesis
  const speakText = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isAudioMutedRef.current) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    
    // Pick clean natural voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN')) ||
                           voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) ||
                           voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsAiSpeaking(true);
    };

    utterance.onend = () => {
      setIsAiSpeaking(false);
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize Speech Recognition with CONTINUOUS streaming
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          let fullTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + ' ';
          }

          const currentSpoken = fullTranscript.trim();
          if (currentSpoken) {
            accumulatedTranscriptRef.current = currentSpoken;
            
            if (activeMode === 'copilot') {
              setCopilotInput(currentSpoken);

              // 2.2s silence debounce: wait for patient to finish their complete sentence
              if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
              silenceTimerRef.current = setTimeout(() => {
                const textToSubmit = accumulatedTranscriptRef.current;
                if (textToSubmit.trim().length > 0) {
                  accumulatedTranscriptRef.current = '';
                  if (recognitionRef.current) {
                    try { recognitionRef.current.stop(); } catch (e) {}
                  }
                  setIsListening(false);
                  handlePatientSpokenTurn(textToSubmit);
                }
              }, 2200);
            } else {
              setFreeFlowText(currentSpoken);
            }
          }
        };

        recognition.onerror = (err: any) => {
          if (err.error !== 'no-speech') {
            console.warn('Speech recognition notice:', err.error);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeMode]);

  // Scroll chat to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiSpeaking]);

  // Free-flow real-time extraction
  useEffect(() => {
    if (freeFlowText.trim().length > 3) {
      const result = extractIntakeFromNarrative(freeFlowText, intake);
      setFreeFlowExtraction(result);
    } else {
      setFreeFlowExtraction({ patch: {}, extractedKeys: [], confidenceSummary: [] });
    }
  }, [freeFlowText, intake]);

  // Initial Copilot greeting when modal opens
  useEffect(() => {
    if (isStoryModalOpen && activeMode === 'copilot' && messages.length === 0) {
      const initialPlan = determineNextQuestion(intakeRef.current);
      setCurrentPlan(initialPlan);

      const welcomeMsg: CopilotMessage = {
        id: 'msg-init',
        sender: 'ai',
        text: initialPlan.promptText,
        timestamp: Date.now(),
      };

      setMessages([welcomeMsg]);
      setTimeout(() => {
        speakText(initialPlan.promptText);
      }, 250);
    }
  }, [isStoryModalOpen, activeMode]);

  // Handle patient spoken / typed reply in Copilot mode
  const handlePatientSpokenTurn = (text: string) => {
    if (!text.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    // Stop listening
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);

    // Cancel any current AI speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);

    // 1. Run NLP Extraction
    const extractionResult = extractIntakeFromNarrative(text, intakeRef.current);

    // 2. Add user message with badges
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
      extractedPills: extractionResult.confidenceSummary.map(c => ({ label: c.label, value: c.value })),
    };

    // 3. Batch update form state
    if (extractionResult.extractedKeys.length > 0) {
      batchUpdate(extractionResult.patch, extractionResult.extractedKeys);
    }

    // Merge updated intake state to plan next step
    const updatedIntake = {
      ...intakeRef.current,
      ...extractionResult.patch,
      metadata: {
        ...intakeRef.current.metadata,
        ...(extractionResult.patch.metadata || {}),
      },
    };

    const nextPlan = determineNextQuestion(updatedIntake);
    setCurrentPlan(nextPlan);

    const aiResponseText = buildConversationalResponse(
      extractionResult.confidenceSummary.map(c => c.label),
      nextPlan,
      updatedIntake.metadata.patient_name,
      text
    );

    const aiMsg: CopilotMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: Date.now() + 1,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setCopilotInput('');
    accumulatedTranscriptRef.current = '';

    // Speak AI response cleanly
    setTimeout(() => {
      speakText(aiResponseText);
    }, 150);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    
    // Stop any playing speech before listening
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);

    if (isListening) {
      // User pressed Stop -> immediately submit what was spoken
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
      
      const textToSubmit = accumulatedTranscriptRef.current || copilotInput;
      accumulatedTranscriptRef.current = '';
      if (textToSubmit.trim()) {
        handlePatientSpokenTurn(textToSubmit);
      }
    } else {
      accumulatedTranscriptRef.current = '';
      setCopilotInput('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Mic start notice:', err);
        setIsListening(false);
      }
    }
  };

  const handleFinishAndReview = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsStoryModalOpen(false);
    goToStep('summary_review');
  };

  const handleApplyFreeFlow = () => {
    if (freeFlowExtraction.extractedKeys.length > 0) {
      batchUpdate(freeFlowExtraction.patch, freeFlowExtraction.extractedKeys);
    }
    setIsStoryModalOpen(false);
    goToStep('summary_review');
  };

  const handleResetConversation = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
    accumulatedTranscriptRef.current = '';
    setCopilotInput('');

    const initialPlan = determineNextQuestion(intake);
    setCurrentPlan(initialPlan);
    const welcomeMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: initialPlan.promptText,
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);
    speakText(initialPlan.promptText);
  };

  if (!isStoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0F1715] text-stone-100 rounded-3xl max-w-3xl w-full border border-emerald-900/50 shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[760px]">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-base sm:text-lg font-bold text-emerald-300">
                  Voice Consultation Copilot
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                  Continuous Stream
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Speak full sentences naturally in English or Hinglish</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Voice Mute Toggle */}
            <button
              onClick={() => {
                const nextMuted = !isAudioMuted;
                setIsAudioMuted(nextMuted);
                if (nextMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsAiSpeaking(false);
                }
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title={isAudioMuted ? "Unmute AI Voice Readout" : "Mute AI Voice Readout"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                if (recognitionRef.current) {
                  try { recognitionRef.current.stop(); } catch (e) {}
                }
                setIsStoryModalOpen(false);
              }}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs & Progress Bar */}
        <div className="px-5 py-2.5 bg-stone-900/50 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-stone-950/80 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveMode('copilot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'copilot'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Interactive Conversation</span>
            </button>
            <button
              onClick={() => setActiveMode('freeflow')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'freeflow'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>One-Shot Narrative</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-400 font-medium">Chart Progress:</span>
            <span className="font-bold text-emerald-400">{validation.progressPercent}%</span>
            <div className="w-20 bg-stone-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${validation.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* MODE 1: Interactive Conversational Copilot */}
        {activeMode === 'copilot' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Live Chat & Transcript Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-full bg-emerald-800/60 border border-emerald-600/40 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[84%] sm:max-w-[78%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAi
                          ? 'bg-stone-900 border border-stone-800 text-stone-200 rounded-tl-sm shadow-md'
                          : 'bg-emerald-700 text-white rounded-tr-sm shadow-md shadow-emerald-900/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p>{msg.text}</p>
                        {isAi && (
                          <button
                            onClick={() => speakText(msg.text)}
                            className="p-1 rounded text-stone-400 hover:text-emerald-400 transition-colors shrink-0"
                            title="Replay Audio"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Extracted Entity Badges */}
                      {msg.extractedPills && msg.extractedPills.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                          {msg.extractedPills.map((pill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-700/50"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>{pill.label}: <strong>{pill.value}</strong></span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {!isAi && (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Status Indicator when AI is speaking or Listening */}
              {isAiSpeaking && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl w-fit">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                  <span>KeshVeda Assistant is speaking...</span>
                </div>
              )}

              {isListening && (
                <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-red-950/40 border border-red-800/50 animate-in fade-in">
                  <div className="flex items-center gap-2.5 text-xs text-red-400">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shrink-0" />
                    <span>Listening... speak your complete thought.</span>
                  </div>
                  <button
                    onClick={toggleMic}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Done Speaking</span>
                  </button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Interactive Turn Controls Centerpiece */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/95 space-y-3 shrink-0">
              {/* Quick Reply Chips */}
              {currentPlan.suggestedQuickReplies.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 shrink-0 mr-1">
                    Quick Suggestions:
                  </span>
                  {currentPlan.suggestedQuickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePatientSpokenTurn(reply)}
                      className="px-2.5 py-1 rounded-lg text-xs bg-stone-800 hover:bg-emerald-950 hover:border-emerald-700/60 border border-stone-700 text-stone-300 hover:text-emerald-200 transition-all whitespace-nowrap shrink-0 active:scale-95"
                    >
                      "{reply}"
                    </button>
                  ))}
                </div>
              )}

              {/* Voice Mic & Text Input Combined Bar */}
              <div className="flex items-center gap-2">
                {/* Big Tactile Microphone Toggle */}
                <button
                  onClick={toggleMic}
                  disabled={!speechSupported}
                  className={`relative px-4 h-12 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs transition-all shadow-md shrink-0 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/40 scale-105 animate-pulse'
                      : isAiSpeaking
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
                  }`}
                  title={isListening ? "Done Speaking (Send)" : "Tap to Speak"}
                >
                  {isListening ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-5 h-5" />}
                  <span className="hidden sm:inline">
                    {isListening ? 'Done (Send)' : 'Tap to Speak'}
                  </span>
                </button>

                {/* Text Input for Typing if preferred */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePatientSpokenTurn(copilotInput);
                      }
                    }}
                    placeholder={
                      isListening
                        ? "Streaming your voice in real-time..."
                        : "Type or speak your answer in English / Hinglish..."
                    }
                    className={`w-full bg-stone-950 border rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none pr-10 transition-colors ${
                      isListening ? 'border-red-500/80 shadow-sm shadow-red-500/20' : 'border-stone-800 focus:border-emerald-500'
                    }`}
                  />
                  {copilotInput && (
                    <button
                      onClick={() => handlePatientSpokenTurn(copilotInput)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Reset Conversation Button */}
                <button
                  onClick={handleResetConversation}
                  className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                  title="Restart Voice Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Finish Handoff Bar */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  💡 Tap the mic, speak your full sentence, and tap "Done (Send)" or pause when finished.
                </span>
                <button
                  onClick={handleFinishAndReview}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Finish & Review Chart</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: One-Shot Narrative Dictation */}
        {activeMode === 'freeflow' && (
          <div className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center p-6 bg-stone-900/40 rounded-2xl border border-stone-800/80">
              <button
                onClick={toggleMic}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
              <p className="text-xs font-medium text-stone-300 mt-3">
                {isListening ? "Listening... tell your entire hair loss story" : "Tap microphone to dictate full story"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Story Text / Transcript
              </label>
              <textarea
                value={freeFlowText}
                onChange={e => setFreeFlowText(e.target.value)}
                rows={4}
                placeholder="e.g. I am 32 male, receding hairline and crown thinning for 8 months. Dad had hair loss. Used Minoxidil 5% for 3 months with mild scalp itching..."
                className="w-full bg-stone-900 border border-stone-700/80 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {freeFlowExtraction.extractedKeys.length > 0 && (
              <div className="bg-emerald-950/40 rounded-xl border border-emerald-700/40 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Extraction ({freeFlowExtraction.extractedKeys.length} Questions Populated)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {freeFlowExtraction.confidenceSummary.map((item, idx) => (
                    <div key={idx} className="bg-stone-900/80 px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                      <span className="text-stone-400">{item.label}:</span>
                      <span className="text-emerald-200 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={handleApplyFreeFlow}
                disabled={freeFlowExtraction.extractedKeys.length === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  freeFlowExtraction.extractedKeys.length > 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>Auto-Fill & Finish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
