import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema, ProductUsage } from '../../types/schema';
import { Pill, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

const PRODUCT_KEYS: (keyof GenoRootIntakeSchema['products'])[] = [
  'OTC/Medicated Shampoos',
  'Hair Oils/Serums',
  'Topical Minoxidil',
  'Oral Minoxidil',
  'Supplements',
];

const PRODUCT_METAS: Record<keyof GenoRootIntakeSchema['products'], { icon: string; desc: string }> = {
  'OTC/Medicated Shampoos': { icon: '🧴', desc: 'Ketoconazole, Salicylic Acid, Zinc Pyrithione' },
  'Hair Oils/Serums': { icon: '🌿', desc: 'Rosemary, Redensyl, Procapil, Ayurvedic Oils' },
  'Topical Minoxidil': { icon: '🧪', desc: 'Minoxidil 2% or 5% Solution / Foam' },
  'Oral Minoxidil': { icon: '💊', desc: 'Low-dose Oral Minoxidil tablets (1.25mg - 5mg)' },
  'Supplements': { icon: '✨', desc: 'Biotin, Amino Acids, Zinc, Follihair' },
};

const DURATION_OPTS: NonNullable<ProductUsage['duration']>[] = ['<3mo', '3-6mo', '>6mo'];

export const ProductsMatrixStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const products = intake.products;

  const updateProductUsage = (
    key: keyof GenoRootIntakeSchema['products'],
    patch: Partial<ProductUsage>
  ) => {
    updateField('products', {
      ...products,
      [key]: {
        ...products[key],
        ...patch,
      },
    });
  };

  const handleToggleUsed = (key: keyof GenoRootIntakeSchema['products']) => {
    const current = products[key];
    const willBeUsed = !current.used;
    updateProductUsage(key, {
      used: willBeUsed,
      duration: willBeUsed ? (current.duration || '3-6mo') : null,
      helped: willBeUsed ? (current.helped || 'yes') : null,
      side_effects: willBeUsed ? (current.side_effects || 'no') : null,
    });
  };

  const handleNoneOfThese = () => {
    const cleared: GenoRootIntakeSchema['products'] = {
      'OTC/Medicated Shampoos': { used: false, duration: null, helped: null, side_effects: null },
      'Hair Oils/Serums': { used: false, duration: null, helped: null, side_effects: null },
      'Topical Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
      'Oral Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
      'Supplements': { used: false, duration: null, helped: null, side_effects: null },
    };
    updateField('products', cleared);
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section D · Question 12 of 16
          </span>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            Product History
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Which hair loss products have you tried?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Tap the products you have used. Expand to indicate duration, efficacy, and any adverse reactions.
        </p>
      </div>

      {/* Collapsible Product Cards */}
      <div className="space-y-3">
        {PRODUCT_KEYS.map(key => {
          const usage = products[key];
          const isUsed = usage.used;
          const meta = PRODUCT_METAS[key];

          return (
            <div
              key={key}
              className={`rounded-2xl border-2 transition-all overflow-hidden ${
                isUsed
                  ? 'border-emerald-700 bg-emerald-50/40 shadow-sm'
                  : 'border-stone-200 bg-stone-50/60'
              }`}
            >
              {/* Product Header Row */}
              <div
                onClick={() => handleToggleUsed(key)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{key}</h3>
                    <p className="text-xs text-stone-500">{meta.desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                      isUsed
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white border border-stone-300 text-stone-600'
                    }`}
                  >
                    {isUsed ? 'Used' : 'Not Used'}
                  </span>
                </div>
              </div>

              {/* Expanded Details when product is used */}
              {isUsed && (
                <div className="px-4 pb-4 pt-2 border-t border-emerald-200/60 bg-white/70 space-y-3 animate-in fade-in slide-in-from-top-1">
                  {/* Duration Chips */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Duration of Use:
                    </span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {DURATION_OPTS.map(dur => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => updateProductUsage(key, { duration: dur })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                            usage.duration === dur
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Did it Help & Side Effects (Binary Toggles) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Did it help?
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={() => updateProductUsage(key, { helped: 'yes' })}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            usage.helped === 'yes'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-stone-200 text-stone-700'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductUsage(key, { helped: 'no' })}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            usage.helped === 'no'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-stone-200 text-stone-700'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        Side effects?
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <button
                          type="button"
                          onClick={() => updateProductUsage(key, { side_effects: 'yes' })}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            usage.side_effects === 'yes'
                              ? 'bg-amber-600 text-white'
                              : 'bg-white border border-stone-200 text-stone-700'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => updateProductUsage(key, { side_effects: 'no' })}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                            usage.side_effects === 'no'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-stone-200 text-stone-700'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
            onClick={handleNoneOfThese}
            className="px-4 py-3 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            None of these
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-md shadow-[#0F382C]/20 transition-all"
          >
            <span>Next: In-Clinic Procedures</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
