import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema } from '../../types/schema';
import { Dna, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

const SAMPLE_OPTIONS: { key: NonNullable<GenoRootIntakeSchema['sample_type']>; title: string; subtitle: string; icon: string }[] = [
  { key: 'Saliva', title: 'Saliva DNA Swab', subtitle: 'Non-invasive cheek swab for GenoRoot genetic risk profile', icon: '🧬' },
  { key: 'Blood', title: 'Clinical Blood Panel', subtitle: 'Venipuncture for ferritin, thyroid, vitamins & hormone markers', icon: '🩸' },
  { key: 'Either', title: 'Either / Doctor’s Choice', subtitle: 'Whichever sample type your trichologist recommends', icon: '✨' },
];

export const SampleConsentStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const { sample_type, consent } = intake;

  const isComplete = Boolean(sample_type && consent !== null);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section E · Questions 15 & 16 of 16
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
            Final Step
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Diagnostic Sampling & Genetic Consent
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          GenoRoot utilizes molecular profiling to match you with targeted anti-androgen and peptide therapies.
        </p>
      </div>

      {/* Q15: Sample Type */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          15. Preferred Sample Type: <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_OPTIONS.map(opt => {
            const isSelected = sample_type === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => updateField('sample_type', opt.key)}
                className={`p-4 rounded-xl border-2 text-left flex items-start justify-between transition-all tap-card ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div>
                  <span className="text-2xl">{opt.icon}</span>
                  <p className="text-sm font-semibold mt-2">{opt.title}</p>
                  <p className="text-[11px] text-stone-500 font-normal mt-0.5">{opt.subtitle}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Q16: Consent */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3 pt-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              16. Consent to sample collection & clinical genetic analysis <span className="text-red-500">*</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              I authorize GenoRoot Clinic to collect biological samples (saliva or blood) and process hair-loss gene polymorphisms (5-alpha-reductase, androgen receptor sensitivity, inflammatory biomarkers) solely for diagnostic personalization.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => updateField('consent', 'yes')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              consent === 'yes'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>I Agree & Consent</span>
            {consent === 'yes' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>

          <button
            type="button"
            onClick={() => updateField('consent', 'no')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              consent === 'no'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>Decline Genetic Testing</span>
            {consent === 'no' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>
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
          className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
            isComplete
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/25 animate-pulse-glow'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Complete Intake & Generate Handoff</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
