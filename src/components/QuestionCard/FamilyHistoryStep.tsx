import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { sanitizeFamilyHistory } from '../../engine/inferenceRules';
import { Users, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const FAMILY_OPTIONS: { key: GenoRootIntakeSchema['family_history'][number]; icon: string; subtitle: string }[] = [
  { key: 'Father had hair loss', icon: '👴', subtitle: 'Paternal lineage (High AGA correlation)' },
  { key: 'Mother had hair loss', icon: '👵', subtitle: 'Maternal lineage (AR gene transmission)' },
  { key: 'Siblings with thinning or baldness', icon: '👥', subtitle: 'Brothers or sisters' },
  { key: 'No known family history', icon: '🚫', subtitle: 'No biological relatives with early loss' },
];

export const FamilyHistoryStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const history = intake.family_history;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('family_history');

  const handleToggle = (item: GenoRootIntakeSchema['family_history'][number]) => {
    const updated = sanitizeFamilyHistory(history, item);
    updateField('family_history', updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section A · Question 3 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Voice Extracted
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Is there a history of hair thinning or baldness in your family?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Select all that apply. Genetic predispositions heavily guide therapeutic response.
        </p>
      </div>

      {/* Multi-Select Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FAMILY_OPTIONS.map(opt => {
          const isSelected = history.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleToggle(opt.key)}
              className={`p-4 sm:p-5 rounded-2xl border-2 text-left flex items-start justify-between transition-all tap-card ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{opt.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{opt.key}</p>
                  <p className="text-[11px] text-stone-500 font-normal mt-0.5 leading-tight">{opt.subtitle}</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                isSelected ? 'bg-emerald-700 text-white' : 'border border-stone-300 bg-white'
              }`}>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>
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
          disabled={history.length === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            history.length > 0
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Hair Loss Pattern</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
