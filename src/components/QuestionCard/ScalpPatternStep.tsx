import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { ScalpPatternIcon } from '../ScalpPatternVisuals';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const PATTERN_OPTIONS: { key: GenoRootIntakeSchema['pattern'][number]; title: string; subtitle: string }[] = [
  { key: 'Receding hairline', title: 'Receding Hairline', subtitle: 'Frontal temples retreating (Norwood II/III)' },
  { key: 'Thinning at crown', title: 'Thinning at Crown', subtitle: 'Vertex circular loss / top of head' },
  { key: 'Widening part line', title: 'Widening Part Line', subtitle: 'Central parting thinning (Ludwig scale)' },
  { key: 'Diffuse thinning', title: 'Diffuse Thinning', subtitle: 'Overall density reduction across entire scalp' },
  { key: 'Patchy loss', title: 'Patchy Focal Loss', subtitle: 'Discrete circular bald spots (Alopecia Areata)' },
  { key: 'Sudden excessive shedding', title: 'Excessive Shedding', subtitle: 'Large hair clumps in shower / brush (Telogen Effluvium)' },
];

export const ScalpPatternStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const selectedPatterns = intake.pattern;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('pattern');

  const handleToggle = (patternKey: GenoRootIntakeSchema['pattern'][number]) => {
    let updated: GenoRootIntakeSchema['pattern'];
    if (selectedPatterns.includes(patternKey)) {
      updated = selectedPatterns.filter(p => p !== patternKey);
    } else {
      updated = [...selectedPatterns, patternKey];
    }
    updateField('pattern', updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section A · Question 4 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Voice Recognized
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Where on your scalp are you noticing hair thinning?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Tap the visual diagrams that look closest to your current hair pattern. (Select all that match)
        </p>
      </div>

      {/* 6 Illustrated Visual Scalp Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {PATTERN_OPTIONS.map(opt => {
          const isSelected = selectedPatterns.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleToggle(opt.key)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all tap-card relative ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md shadow-emerald-700/10 font-bold ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Vector SVG Diagram */}
              <div className="my-1">
                <ScalpPatternIcon patternKey={opt.key} className="w-20 h-20" isSelected={isSelected} />
              </div>

              <p className="text-xs sm:text-sm font-bold text-stone-900 mt-2 leading-tight">
                {opt.title}
              </p>
              <p className="text-[10px] sm:text-[11px] text-stone-500 font-normal mt-1 leading-snug">
                {opt.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
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
          disabled={selectedPatterns.length === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            selectedPatterns.length > 0
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Medical Conditions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
