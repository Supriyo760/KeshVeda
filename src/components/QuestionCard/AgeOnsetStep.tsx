import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { Calendar, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export const AgeOnsetStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const currentAge = intake.metadata.current_age || 30;
  const ageBegan = intake.age_hair_loss_began;
  const isAutoFilled = intake.metadata.auto_filled_fields.has('age_hair_loss_began');

  const presetAges = [18, 21, 25, 30, 35, 40, 45, 50].filter(a => a <= currentAge);

  const handleSelectAge = (age: number) => {
    updateField('age_hair_loss_began', age);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Question Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section A · Question 1 of 16
          </span>
          {isAutoFilled && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <Sparkles className="w-3 h-3" /> Auto-Filled from Voice
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          At what age did you first notice hair loss or thinning?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          An approximation is completely fine. This helps the trichologist assess progression velocity.
        </p>
      </div>

      {/* Number Input & Stepper */}
      <div className="flex flex-col items-center py-4 bg-stone-50 rounded-2xl border border-stone-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSelectAge(Math.max(12, (ageBegan || 25) - 1))}
            className="w-12 h-12 rounded-xl bg-white border border-stone-300 text-stone-700 text-xl font-bold hover:bg-stone-100 active:scale-95 shadow-sm transition-all"
          >
            -
          </button>

          <div className="text-center min-w-[120px]">
            <input
              type="number"
              min={12}
              max={currentAge}
              value={ageBegan ?? ''}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) handleSelectAge(val);
              }}
              placeholder="e.g. 28"
              className="w-28 text-center text-4xl font-extrabold text-[#0F382C] bg-transparent focus:outline-none focus:ring-0 font-sans"
            />
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mt-0.5">Years Old</p>
          </div>

          <button
            type="button"
            onClick={() => handleSelectAge(Math.min(currentAge, (ageBegan || 25) + 1))}
            className="w-12 h-12 rounded-xl bg-white border border-stone-300 text-stone-700 text-xl font-bold hover:bg-stone-100 active:scale-95 shadow-sm transition-all"
          >
            +
          </button>
        </div>

        {/* Quick Milestone Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 px-4">
          <span className="text-[11px] text-stone-400 mr-1">Quick Select:</span>
          {presetAges.map(age => (
            <button
              key={age}
              type="button"
              onClick={() => handleSelectAge(age)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all tap-card ${
                ageBegan === age
                  ? 'bg-[#0F382C] text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {age}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
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
          disabled={!ageBegan || ageBegan <= 0}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            ageBegan && ageBegan > 0
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Duration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
