import React, { useState, useEffect, useRef } from 'react';
import { useIntake } from '../context/IntakeContext';
import { extractIntakeFromNarrative, ExtractionResult } from '../engine/nlpExtractor';
import { Mic, MicOff, Sparkles, X, Check, ArrowRight, Volume2 } from 'lucide-react';

export const StoryModeModal: React.FC = () => {
  const { isStoryModalOpen, setIsStoryModalOpen, batchUpdate, intake, goToStep } = useIntake();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [extraction, setExtraction] = useState<ExtractionResult>({
    patch: {},
    extractedKeys: [],
    confidenceSummary: [],
  });

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Optimized for Indian English & Hinglish pronunciation

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          setInputText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Run real-time NLP extraction as text changes
  useEffect(() => {
    if (inputText.trim().length > 3) {
      const result = extractIntakeFromNarrative(inputText, intake);
      setExtraction(result);
    } else {
      setExtraction({ patch: {}, extractedKeys: [], confidenceSummary: [] });
    }
  }, [inputText, intake]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  };

  const handleApplyExtraction = () => {
    if (extraction.extractedKeys.length > 0) {
      batchUpdate(extraction.patch, extraction.extractedKeys);
    }
    setIsStoryModalOpen(false);
    // Smoothly route to review or remaining questions
    goToStep('summary_review');
  };

  const samplePrompts = [
    "Dad ka hair loss tha, crown pe 8 mahine se bal kam ho rahe hain. Minoxidil 5% use kiya 3 months, mild itchiness hui thi. Prefer saliva DNA test.",
    "28F, heavy hair shedding since 4 months after typhoid fever and high stress. Irregular periods, PCOS diagnosed. Wash hair alternate days.",
    "52M, receding hairline and crown thinning for over a year. Father and brother both bald. Smoker 5-10/day, tried PRP 4 sessions.",
  ];

  if (!isStoryModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0F1715] text-stone-100 rounded-2xl max-w-2xl w-full border border-emerald-900/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-lg font-bold text-emerald-300">Story Mode — Voice & Free-Flow Intake</h2>
              <p className="text-xs text-stone-400">Speak or write in English, Hindi or Hinglish</p>
            </div>
          </div>
          <button
            onClick={() => setIsStoryModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Microphone Capture Centerpiece */}
          <div className="flex flex-col items-center justify-center p-6 bg-stone-900/40 rounded-xl border border-stone-800/80">
            <div className="relative mb-3">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
              )}
              <button
                onClick={toggleListening}
                disabled={!speechSupported}
                className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                } ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={isListening ? "Stop Recording" : "Start Voice Recording"}
              >
                {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>
            </div>

            <p className="text-xs font-medium text-stone-300">
              {isListening ? (
                <span className="flex items-center gap-2 text-emerald-400 font-semibold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Listening... speak naturally in English or Hinglish
                </span>
              ) : speechSupported ? (
                "Tap the microphone to speak your hair loss story"
              ) : (
                "Voice input not supported in this browser; type below"
              )}
            </p>

            {/* Audio Waveform Animation when listening */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 mt-3 h-8">
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-1" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-2" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-3" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-4" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-5" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-2" />
                <span className="w-1 bg-emerald-400 rounded-full wave-bar-4" />
              </div>
            )}
          </div>

          {/* Transcript / Text Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Live Transcript or Written Narrative
            </label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="e.g. I am 32, noticed receding hairline and thinning at crown 8 months ago. Dad had baldness. Tried Minoxidil for 3 months with mild scalp itching. Don't smoke..."
              rows={3}
              className="w-full bg-stone-900 border border-stone-700/80 rounded-xl p-3.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
            />
          </div>

          {/* Quick Presets / Hinglish Examples */}
          <div>
            <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
              Try a Quick Story Prompt:
            </p>
            <div className="space-y-1.5">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(prompt)}
                  className="w-full text-left text-xs p-2.5 rounded-lg bg-stone-900/60 hover:bg-emerald-950/40 border border-stone-800 hover:border-emerald-700/50 text-stone-300 transition-all"
                >
                  <span className="text-emerald-400 font-semibold mr-1.5">Prompt {idx + 1}:</span>
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Live Extracted Fields Preview */}
          {extraction.extractedKeys.length > 0 && (
            <div className="bg-emerald-950/40 rounded-xl border border-emerald-700/40 p-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Real-time AI Extraction ({extraction.extractedKeys.length} Questions Populated)
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Ready to confirm</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {extraction.confidenceSummary.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-stone-900/70 px-2.5 py-1.5 rounded-lg border border-emerald-800/30">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <div className="truncate text-xs">
                      <span className="text-stone-400 font-medium">{item.label}: </span>
                      <span className="text-emerald-200 font-semibold">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-900/90 flex items-center justify-between gap-3">
          <button
            onClick={() => setInputText('')}
            className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
          >
            Clear Text
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsStoryModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-stone-300 hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyExtraction}
              disabled={extraction.extractedKeys.length === 0}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-md ${
                extraction.extractedKeys.length > 0
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <span>Auto-Fill & Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
