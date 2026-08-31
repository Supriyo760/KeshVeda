import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { sanitizeConditions } from '../../engine/inferenceRules';
import { Activity, ArrowRight, ArrowLeft, Check, Sparkles, HelpCircle } from 'lucide-react';

const CONDITIONS_OPTIONS: { key: GenoRootIntakeSchema['diagnosed_conditions'][number]; label: string; desc: string; icon: string }[] = [
  { key: 'PCOS/PCOD', label: 'PCOS / PCOD', desc: 'Polycystic ovary syndrome (Hormonal androgen elevation)', icon: '🩺' },
  { key: 'Thyroid disorder', label: 'Thyroid Disorder', desc: 'Hypothyroid, Hyperthyroid, Hashimoto’s', icon: '🦋' },
  { key: 'Diabetes', label: 'Diabetes / High Sugar', desc: 'Type 1 or Type 2 / Insulin resistance', icon: '🩸' },
  { key: 'Autoimmune disease', label: 'Autoimmune Condition', desc: 'Lupus, Rheumatoid, Alopecia Areata, Vitiligo', icon: '🛡️' },
  { key: 'Anemia', label: 'Anemia / Low Ferritin', desc: 'Low iron / hemoglobin levels causing follicle starvation', icon: '⚡' },
  { key: 'None', label: 'None of the above', desc: 'No diagnosed systemic or endocrine conditions', icon: '✨' },
];

export const ConditionsStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const selectedConditions = intake.diagnosed_conditions;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('diagnosed_conditions');

  const handleToggle = (item: GenoRootIntakeSchema['diagnosed_conditions'][number]) => {
    const updated = sanitizeConditions(selectedConditions, item);
    updateField('diagnosed_conditions', updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section B · Question 5 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Voice Recognized
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Do you have any diagnosed medical or endocrine conditions?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Select all that apply. Many systemic conditions directly impact hair follicle cycling.
        </p>
      </div>

      {/* Grid of Medical Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CONDITIONS_OPTIONS.map(opt => {
          const isSelected = selectedConditions.includes(opt.key);
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
                  <p className="text-sm font-semibold text-stone-900">{opt.label}</p>
                  <p className="text-[11px] text-stone-500 font-normal mt-0.5 leading-tight">{opt.desc}</p>
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
          disabled={selectedConditions.length === 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            selectedConditions.length > 0
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Hormonal Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
