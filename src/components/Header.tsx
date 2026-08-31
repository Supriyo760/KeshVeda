import React, { useState } from 'react';
import { useIntake } from '../context/IntakeContext';
import { MOCK_PERSONAS } from '../data/mockPersonas';
import { Mic, Stethoscope, Volume2, VolumeX, RotateCcw, Users, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentStepIndex,
    availableSteps,
    currentStepId,
    validation,
    isAudioMuted,
    activePersona,
    loadPersona,
    resetIntake,
    setIsStoryModalOpen,
    setIsDoctorDrawerOpen,
    setIsAudioMuted,
  } = useIntake();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const currentStepInfo = availableSteps[currentStepIndex] || availableSteps[0];
  const progress = validation.progressPercent;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Clinic Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F382C] text-[#E7E5E4] flex items-center justify-center shadow-md shadow-[#0F382C]/15">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg font-bold tracking-tight text-[#0F382C]">KeshVeda</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                AI Intake
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">Trichology & Scalp Clinical Handoff</p>
          </div>
        </div>

        {/* Center Progress Bar for Active Stepper */}
        {currentStepId !== 'summary_review' && (
          <div className="hidden md:flex flex-col items-center max-w-xs w-full">
            <div className="flex items-center justify-between w-full text-xs text-stone-500 mb-1 font-medium">
              <span className="truncate">{currentStepInfo.section}</span>
              <span className="text-emerald-700 font-semibold">{progress}% filled</span>
            </div>
            <div className="w-full bg-stone-200/70 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0F382C] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Controls & Reviewer Tools */}
        <div className="flex items-center gap-2">
          {/* Voice Story Mode Trigger */}
          <button
            onClick={() => setIsStoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all transform active:scale-95"
            title="Express Voice Story Mode (Hinglish & English)"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Voice / Story Mode</span>
            <span className="sm:hidden">Voice</span>
          </button>

          {/* Test Persona Selector (Reviewer Delight) */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                activePersona
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-white/80 hover:bg-stone-100 border-stone-300 text-stone-700'
              }`}
              title="Inject preset patient persona for testing"
            >
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">
                {activePersona ? `Persona: ${activePersona.split('-')[0].toUpperCase()}` : 'Test Personas'}
              </span>
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Quick Evaluator Personas
                  </p>
                </div>
                {MOCK_PERSONAS.map(persona => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      loadPersona(persona);
                      setShowPersonaMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-emerald-50 transition-colors flex items-start justify-between ${
                      activePersona === persona.id ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-800">{persona.name} ({persona.age}{persona.sex[0].toUpperCase()})</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{persona.tagline}</p>
                    </div>
                    {activePersona === persona.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
                <div className="px-3 pt-2 border-t border-stone-100 flex justify-between items-center">
                  <button
                    onClick={() => {
                      resetIntake();
                      setShowPersonaMenu(false);
                    }}
                    className="text-[11px] text-red-600 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear / Reset Form
                  </button>
                  <span className="text-[10px] text-stone-400">1-click test</span>
                </div>
              </div>
            )}
          </div>

          {/* Audio TTS toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-200/60 transition-colors"
            title={isAudioMuted ? "Unmute Question Audio Readout" : "Mute Question Audio Readout"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Doctor Live EMR Drawer Toggle (Mobile / Floating) */}
          <button
            onClick={() => setIsDoctorDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F382C]/10 hover:bg-[#0F382C]/15 text-[#0F382C] border border-[#0F382C]/20 transition-all lg:hidden"
            title="Open Doctor Clinical Record View"
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#0F382C]" />
            <span>Doctor EMR</span>
          </button>
        </div>
      </div>

      {/* Mobile Step Progress Bar */}
      <div className="mt-2.5 md:hidden">
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
          <span className="font-medium truncate max-w-[70%]">{currentStepInfo.title}</span>
          <span className="text-emerald-700 font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#0F382C] h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
};
