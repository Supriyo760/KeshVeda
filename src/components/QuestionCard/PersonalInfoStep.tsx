import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const PersonalInfoStep: React.FC = () => {
  const { intake, updateMetadata, nextStep, setIsStoryModalOpen } = useIntake();
  const { patient_name, current_age, biological_sex } = intake.metadata;

  const handleSexSelect = (sex: 'male' | 'female' | 'other') => {
    updateMetadata({ biological_sex: sex });
  };

  const isComplete = Boolean(biological_sex && current_age && current_age > 10);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Welcome Clinical Banner */}
      <div className="bg-emerald-900/10 border border-emerald-800/20 rounded-2xl p-5 text-stone-800">
        <div className="flex items-center gap-2.5 text-emerald-800 font-semibold text-xs tracking-wider uppercase mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Clinical Triage Intake · KeshVeda Hair & Scalp Clinic</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F382C] mt-1">
          Welcome to your Hair & Scalp Consultation
        </h1>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
          Before your doctor consultation, we'll guide you through a 16-question clinical profile in under 2 minutes. What you enter is synthesized directly into your physician's pre-exam chart.
        </p>
      </div>

      {/* Patient Profile Inputs */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm space-y-6">
        <h2 className="font-editorial text-lg font-bold text-stone-900 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" />
          <span>Step 0 · Patient Demographics</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Patient Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Full Name (or Preferred Name)
            </label>
            <input
              type="text"
              value={patient_name}
              onChange={e => updateMetadata({ patient_name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium transition-all"
            />
          </div>

          {/* Current Age */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Current Age (Years) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={12}
              max={95}
              value={current_age || ''}
              onChange={e => updateMetadata({ current_age: parseInt(e.target.value, 10) || null })}
              placeholder="e.g. 32"
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {/* Biological Sex (Crucial for clinical question routing) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
              Biological Sex <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-stone-400">Used to filter sex-specific endocrine questions (Q6 & Q7)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSexSelect('male')}
              className={`p-4 rounded-xl border-2 font-medium text-sm flex items-center justify-between transition-all tap-card ${
                biological_sex === 'male'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👨</span>
                <div className="text-left">
                  <p className="font-semibold">Male</p>
                  <p className="text-[11px] text-stone-500 font-normal">Auto-skips female-only questions</p>
                </div>
              </div>
              {biological_sex === 'male' && (
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">✓</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSexSelect('female')}
              className={`p-4 rounded-xl border-2 font-medium text-sm flex items-center justify-between transition-all tap-card ${
                biological_sex === 'female'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm font-bold'
                  : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👩</span>
                <div className="text-left">
                  <p className="font-semibold">Female</p>
                  <p className="text-[11px] text-stone-500 font-normal">Includes menstrual & pregnancy triggers</p>
                </div>
              </div>
              {biological_sex === 'female' && (
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs">✓</span>
              )}
            </button>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={nextStep}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
              isComplete
                ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>Begin 16-Question Intake</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
