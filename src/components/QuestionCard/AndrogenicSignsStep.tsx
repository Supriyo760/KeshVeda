import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AndrogenicSignsStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const { adult_acne_oily_skin, excess_body_facial_hair } = intake;

  const isComplete = adult_acne_oily_skin !== null && excess_body_facial_hair !== null;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section B · Questions 8 & 9 of 16
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
            Androgenic Indicators
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Skin & Body Hair Indicators
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          DHT and sebum sensitivity often manifest as adult breakouts or hirsutism.
        </p>
      </div>

      {/* Q8: Adult Acne / Oily Skin */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              8. Do you experience adult acne or very oily skin / scalp?
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Frequent breakouts or excessive scalp sebum</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => updateField('adult_acne_oily_skin', 'yes')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              adult_acne_oily_skin === 'yes'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>Yes</span>
            {adult_acne_oily_skin === 'yes' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>

          <button
            type="button"
            onClick={() => updateField('adult_acne_oily_skin', 'no')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              adult_acne_oily_skin === 'no'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>No</span>
            {adult_acne_oily_skin === 'no' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>
        </div>
      </div>

      {/* Q9: Excess Facial / Body Hair */}
      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              9. Do you notice excess facial or body hair growth?
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Unusual density over chin, jawline, chest, or abdomen</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => updateField('excess_body_facial_hair', 'yes')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              excess_body_facial_hair === 'yes'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>Yes</span>
            {excess_body_facial_hair === 'yes' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
          </button>

          <button
            type="button"
            onClick={() => updateField('excess_body_facial_hair', 'no')}
            className={`p-3.5 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
              excess_body_facial_hair === 'no'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            <span>No</span>
            {excess_body_facial_hair === 'no' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
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
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            isComplete
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Recent Triggers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
