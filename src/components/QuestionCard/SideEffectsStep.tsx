import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { checkProductSideEffects } from '../../engine/inferenceRules';
import { AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export const SideEffectsStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const sideEffects = intake.past_treatment_side_effects;
  const detail = intake.past_treatment_side_effects_detail || '';

  // Smart cascade check from Q12
  const cascade = checkProductSideEffects(intake.products);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section D · Question 14 of 16
          </span>
          {cascade.hasSideEffect && (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              <Sparkles className="w-3 h-3" /> Auto-Flagged from Products
            </span>
          )}
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Did you experience side effects or poor response to past treatments?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Flags drug hypersensitivity, contact dermatitis, or non-responder genetics.
        </p>
      </div>

      {/* Auto-detected notification if detected from Q12 */}
      {cascade.hasSideEffect && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Prior Side Effects Reported in Products (Q12):</p>
            <p className="text-amber-800 mt-0.5">
              You noted side effects with: <span className="font-semibold">{cascade.affectedProducts.join(', ')}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Binary Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => updateField('past_treatment_side_effects', 'yes')}
          className={`p-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
            sideEffects === 'yes'
              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
              : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
          }`}
        >
          <span>Yes, Had Reactions / Poor Response</span>
          {sideEffects === 'yes' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
        </button>

        <button
          type="button"
          onClick={() => {
            updateField('past_treatment_side_effects', 'no');
            updateField('past_treatment_side_effects_detail', '');
          }}
          className={`p-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition-all tap-card ${
            sideEffects === 'no'
              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
              : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
          }`}
        >
          <span>No Side Effects</span>
          {sideEffects === 'no' && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
        </button>
      </div>

      {/* If Yes: Details description text area */}
      {sideEffects === 'yes' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Please describe the reaction or treatment issue:
          </label>
          <textarea
            value={detail}
            onChange={e => updateField('past_treatment_side_effects_detail', e.target.value)}
            placeholder="e.g. Scalp flaking, severe redness and itchiness from Minoxidil 5% alcohol base; no results after 6 months of supplements..."
            rows={3}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm font-medium transition-all"
          />
        </div>
      )}

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
          disabled={sideEffects === null}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all ${
            sideEffects !== null
              ? 'bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-[#0F382C]/20'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>Next: Sample & Consent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
