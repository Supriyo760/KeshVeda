import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { Flame, Wine, Droplets, Sparkles as SparklesIcon, ArrowRight, ArrowLeft, Scissors, Thermometer } from 'lucide-react';

const WASH_FREQUENCIES: GenoRootIntakeSchema['habits']['hair_wash_frequency'][] = [
  'Daily',
  'Alternate Days',
  'Weekly',
];

const SMOKING_SEVERITIES: NonNullable<GenoRootIntakeSchema['habits']['smoking_severity']>[] = [
  'Mild <5/day',
  'Moderate 5-10/day',
  'Severe >10/day',
];

const PRESET_SALON_TREATMENTS = [
  'Keratin Treatment',
  'Hair Rebonding',
  'Smoothening / Straightening',
  'Hair Botox / Glossing',
  'Bleaching / Highlights',
];

export const LifestyleHabitsStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const habits = intake.habits;

  const updateHabit = <K extends keyof GenoRootIntakeSchema['habits']>(
    key: K,
    value: GenoRootIntakeSchema['habits'][K]
  ) => {
    updateField('habits', {
      ...habits,
      [key]: value,
    });
  };

  const handleSalonChip = (chip: string) => {
    const current = habits.salon_treatment_detail || '';
    const items = current.split(', ').filter(Boolean);
    let updatedItems: string[];
    if (items.includes(chip)) {
      updatedItems = items.filter(i => i !== chip);
    } else {
      updatedItems = [...items, chip];
    }
    updateHabit('salon_treatment_detail', updatedItems.join(', '));
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section C · Question 11 of 16
          </span>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            Lifestyle Matrix
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Daily Habits & Hair Care Routine
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Micro-vascular health and mechanical scalp stressors directly dictate follicle longevity.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Smoking with progressive severity disclosure */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🚬</span>
              <div>
                <p className="text-sm font-bold text-stone-900">Smoking / Nicotine</p>
                <p className="text-[11px] text-stone-500">Affects scalp micro-circulation and oxidative stress</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateHabit('smoking', 'yes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  habits.smoking === 'yes'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  updateHabit('smoking', 'no');
                  updateHabit('smoking_severity', null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  habits.smoking === 'no'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Expanded Smoking Severity Chips */}
          {habits.smoking === 'yes' && (
            <div className="pt-2 border-t border-stone-200 animate-in fade-in slide-in-from-top-1">
              <p className="text-xs font-semibold text-stone-700 mb-2">Smoking Frequency / Day:</p>
              <div className="grid grid-cols-3 gap-2">
                {SMOKING_SEVERITIES.map(sev => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => updateHabit('smoking_severity', sev)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                      habits.smoking_severity === sev
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Alcohol Consumption */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🍷</span>
            <div>
              <p className="text-sm font-bold text-stone-900">Alcohol Consumption</p>
              <p className="text-[11px] text-stone-500">Regular or social drinking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateHabit('alcohol', 'yes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.alcohol === 'yes'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateHabit('alcohol', 'no')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.alcohol === 'no'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* 3. Hair Wash Frequency */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚿</span>
            <div>
              <p className="text-sm font-bold text-stone-900">Hair Wash Frequency</p>
              <p className="text-[11px] text-stone-500">How often do you shampoo your scalp?</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {WASH_FREQUENCIES.map(freq => (
              <button
                key={freq}
                type="button"
                onClick={() => updateHabit('hair_wash_frequency', freq)}
                className={`py-2.5 px-3 rounded-lg text-xs font-semibold text-center border transition-all ${
                  habits.hair_wash_frequency === freq
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                }`}
              >
                {freq}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Hard Water for Wash */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚰</span>
            <div>
              <p className="text-sm font-bold text-stone-900">Hard Water for Hair Wash</p>
              <p className="text-[11px] text-stone-500">High mineral / borewell water causing hair shaft brittleness</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateHabit('hard_water', 'yes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.hard_water === 'yes'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateHabit('hard_water', 'no')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.hard_water === 'no'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* 5. Heating Tools / Styling Chemicals */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚡</span>
            <div>
              <p className="text-sm font-bold text-stone-900">Heating Tools or Chemical Styling</p>
              <p className="text-[11px] text-stone-500">Frequent blow drying, hair straighteners, or strong dyes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateHabit('heating_tools_styling_chemicals', 'yes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.heating_tools_styling_chemicals === 'yes'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateHabit('heating_tools_styling_chemicals', 'no')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                habits.heating_tools_styling_chemicals === 'no'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {/* 6. Salon Treatments with details */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💇</span>
              <div>
                <p className="text-sm font-bold text-stone-900">Salon Treatments</p>
                <p className="text-[11px] text-stone-500">Keratin, Rebonding, Smoothening, Botox</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateHabit('salon_treatments', 'yes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  habits.salon_treatments === 'yes'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  updateHabit('salon_treatments', 'no');
                  updateHabit('salon_treatment_detail', '');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  habits.salon_treatments === 'no'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {habits.salon_treatments === 'yes' && (
            <div className="pt-2 border-t border-stone-200 animate-in fade-in slide-in-from-top-1 space-y-2">
              <p className="text-xs font-semibold text-stone-700">Select which treatments you've had:</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SALON_TREATMENTS.map(chip => {
                  const isChipActive = (habits.salon_treatment_detail || '').includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSalonChip(chip)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isChipActive
                          ? 'border-emerald-700 bg-emerald-100 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={habits.salon_treatment_detail || ''}
                onChange={e => updateHabit('salon_treatment_detail', e.target.value)}
                placeholder="Or specify treatment details..."
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white text-stone-800"
              />
            </div>
          )}
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
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-md shadow-[#0F382C]/20 transition-all"
        >
          <span>Next: Products Used</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
