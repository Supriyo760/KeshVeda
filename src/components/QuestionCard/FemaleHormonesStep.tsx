import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { Sparkles, ArrowRight, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';

const CYCLE_OPTIONS: GenoRootIntakeSchema['menstrual_cycle'][] = [
  'Regular',
  'Irregular',
  'Menopausal',
];

const PREGNANCY_OPTIONS: GenoRootIntakeSchema['pregnancy_related'][] = [
  'Currently pregnant',
  'Postpartum <1 year',
  'Not applicable',
];

export const FemaleHormonesStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const { menstrual_cycle, pregnancy_related } = intake;

  const isComplete = Boolean(menstrual_cycle && pregnancy_related);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section B · Questions 6 & 7 of 16
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
            Female Health Profile
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Menstrual & Postpartum Hormonal Influences
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Hormonal estrogen and progesterone fluctuations significantly modulate the hair growth cycle.
        </p>
      </div>

      {/* Q6: Menstrual Cycle */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          6. How would you describe your menstrual cycle? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CYCLE_OPTIONS.map(opt => {
            const isSelected = menstrual_cycle === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => updateField('menstrual_cycle', opt)}
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all tap-card ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{opt}</p>
                  <p className="text-[11px] text-stone-500 font-normal">
                    {opt === 'Regular' && '28-35 day predictable'}
                    {opt === 'Irregular' && 'Skipped/fluctuating'}
                    {opt === 'Menopausal' && 'Peri/Post-menopause'}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q7: Pregnancy Status */}
      <div className="space-y-3 pt-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          7. Pregnancy or postpartum status: <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PREGNANCY_OPTIONS.map(opt => {
            const isSelected = pregnancy_related === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => updateField('pregnancy_related', opt)}
                className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all tap-card ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{opt}</p>
                  <p className="text-[11px] text-stone-500 font-normal">
                    {opt === 'Currently pregnant' && 'Active pregnancy'}
                    {opt === 'Postpartum <1 year' && 'Recent delivery (TE risk)'}
                    {opt === 'Not applicable' && 'None of the above'}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
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
          disabled={!isComplete}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            isComplete
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Androgenic Signs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
