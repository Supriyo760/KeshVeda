import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { AlertCircle, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const TRIGGER_OPTIONS: { key: GenoRootIntakeSchema['past_6_months'][number]; icon: string; title: string; desc: string }[] = [
  { key: 'Crash dieting or major weight loss', icon: '🥗', title: 'Crash Dieting / Rapid Weight Loss', desc: 'Caloric restriction, extreme fasting, or rapid BMI shift' },
  { key: 'High stress or emotional trauma', icon: '🧠', title: 'High Stress / Emotional Shock', desc: 'Severe work/personal stress, grief, or burnout' },
  { key: 'Fever with illness (COVID, Dengue, Typhoid)', icon: '🌡️', title: 'High Fever / Systemic Infection', desc: 'COVID-19, Dengue, Typhoid, Malaria, or severe flu' },
  { key: 'Recent surgery', icon: '🏥', title: 'Recent Surgery / Anesthesia', desc: 'Major or minor surgical procedures under anesthesia' },
  { key: 'Change in location/water/air quality', icon: '✈️', title: 'Location / Water / Climate Shift', desc: 'Relocation to hard water area, pollution changes' },
];

export const TriggersStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const selectedTriggers = intake.past_6_months;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('past_6_months');

  const handleToggle = (triggerKey: GenoRootIntakeSchema['past_6_months'][number]) => {
    let updated: GenoRootIntakeSchema['past_6_months'];
    if (selectedTriggers.includes(triggerKey)) {
      updated = selectedTriggers.filter(t => t !== triggerKey);
    } else {
      updated = [...selectedTriggers, triggerKey];
    }
    updateField('past_6_months', updated);
  };

  const handleNone = () => {
    updateField('past_6_months', []);
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section C · Question 10 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Voice Recognized
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          In the past 6 months, did you experience any of these triggers?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Acute physiological shock typically triggers hair shedding (Telogen Effluvium) 2-3 months after the event.
        </p>
      </div>

      {/* Trigger Options Grid */}
      <div className="space-y-3">
        {TRIGGER_OPTIONS.map(opt => {
          const isSelected = selectedTriggers.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleToggle(opt.key)}
              className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left flex items-center justify-between transition-all tap-card ${
                isSelected
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{opt.title}</p>
                  <p className="text-xs text-stone-500 font-normal mt-0.5">{opt.desc}</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNone}
            className="px-4 py-3 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            None of these
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-md shadow-[#0F382C]/20 transition-all"
          >
            <span>Next: Lifestyle Habits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
