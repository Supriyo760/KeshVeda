import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { Clock, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const DURATION_OPTIONS: GenoRootIntakeSchema['duration'][] = [
  'Less than 6 months',
  '6-12 months',
  'Over a year',
];

export const DurationStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const duration = intake.duration;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('duration');

  const handleSelect = (opt: GenoRootIntakeSchema['duration']) => {
    updateField('duration', opt);
    // Smooth auto-advancement on tap
    setTimeout(() => {
      nextStep();
    }, 200);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Question Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section A · Question 2 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Inferred from Age
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          How long have you been experiencing active hair loss?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Tap one option. Your choice will smoothly advance to the next step.
        </p>
      </div>

      {/* 3 Large Touch Cards */}
      <div className="space-y-3">
        {DURATION_OPTIONS.map(opt => {
          const isSelected = duration === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all tap-card ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-semibold">{opt}</p>
                  <p className="text-xs text-stone-500 font-normal">
                    {opt === 'Less than 6 months' && 'Recent onset / sudden trigger'}
                    {opt === '6-12 months' && 'Moderate progression / seasonal shift'}
                    {opt === 'Over a year' && 'Long-standing / gradual thinning'}
                  </p>
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
              ) : (
                <span className="w-5 h-5 rounded-full border border-stone-300 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={!duration}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            duration
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Family Genetics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
