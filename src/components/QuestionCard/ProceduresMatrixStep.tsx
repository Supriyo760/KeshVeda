import React from 'react';
import { useIntake } from '../../context/IntakeContext';
import { GenoRootIntakeSchema, ProcedureUsage } from '../../types/schema';
import { Stethoscope, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const PROCEDURE_KEYS: (keyof GenoRootIntakeSchema['procedures'])[] = [
  'PRP/GFC/iPRF',
  'Stem Cells/Exosomes',
  'Hair Transplant',
  'Other',
];

const PROCEDURE_METAS: Record<keyof GenoRootIntakeSchema['procedures'], { icon: string; desc: string }> = {
  'PRP/GFC/iPRF': { icon: '💉', desc: 'Platelet-Rich Plasma / Growth Factor Concentrate Scalp Injections' },
  'Stem Cells/Exosomes': { icon: '🧬', desc: 'Cellular regenerative micro-injections' },
  'Hair Transplant': { icon: '🔬', desc: 'FUE or FUT surgical follicle grafting' },
  'Other': { icon: '✨', desc: 'LLLT Laser Helmets, Mesotherapy, Micro-needling' },
};

const SESSIONS_OPTS: NonNullable<ProcedureUsage['sessions']>[] = ['1-3', '4-6', '>6'];

export const ProceduresMatrixStep: React.FC = () => {
  const { intake, updateField, nextStep, prevStep } = useIntake();
  const procedures = intake.procedures;

  const updateProcedureUsage = (
    key: keyof GenoRootIntakeSchema['procedures'],
    patch: Partial<ProcedureUsage>
  ) => {
    updateField('procedures', {
      ...procedures,
      [key]: {
        ...procedures[key],
        ...patch,
      },
    });
  };

  const handleToggleDone = (key: keyof GenoRootIntakeSchema['procedures']) => {
    const current = procedures[key];
    const willBeDone = !current.done;
    updateProcedureUsage(key, {
      done: willBeDone,
      sessions: willBeDone ? (current.sessions || '1-3') : null,
      helped: willBeDone ? (current.helped || 'yes') : null,
    });
  };

  const handleNoneDone = () => {
    const cleared: GenoRootIntakeSchema['procedures'] = {
      'PRP/GFC/iPRF': { done: false, sessions: null, helped: null },
      'Stem Cells/Exosomes': { done: false, sessions: null, helped: null },
      'Hair Transplant': { done: false, sessions: null, helped: null },
      'Other': { done: false, sessions: null, helped: null },
    };
    updateField('procedures', cleared);
    nextStep();
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            Section D · Question 13 of 16
          </span>
          <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            In-Clinic History
          </span>
        </div>
        <h2 className="font-editorial text-2xl font-bold text-stone-900 mt-2">
          Have you had any in-clinic hair procedures done?
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Prior clinical interventions provide essential baseline data for future graft yield and regenerative response.
        </p>
      </div>

      {/* Procedure Cards */}
      <div className="space-y-3">
        {PROCEDURE_KEYS.map(key => {
          const usage = procedures[key];
          const isDone = usage.done;
          const meta = PROCEDURE_METAS[key];

          return (
            <div
              key={key}
              className={`rounded-2xl border-2 transition-all overflow-hidden ${
                isDone
                  ? 'border-emerald-700 bg-emerald-50/40 shadow-sm'
                  : 'border-stone-200 bg-stone-50/60'
              }`}
            >
              {/* Header Row */}
              <div
                onClick={() => handleToggleDone(key)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-stone-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{key}</h3>
                    <p className="text-xs text-stone-500">{meta.desc}</p>
                  </div>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-700 text-white'
                      : 'bg-white border border-stone-300 text-stone-600'
                  }`}
                >
                  {isDone ? 'Done' : 'Not Done'}
                </span>
              </div>

              {/* Expanded details when done */}
              {isDone && (
                <div className="px-4 pb-4 pt-2 border-t border-emerald-200/60 bg-white/70 space-y-3 animate-in fade-in slide-in-from-top-1">
                  {/* Sessions */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Total Sessions Completed:
                    </span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {SESSIONS_OPTS.map(sess => (
                        <button
                          key={sess}
                          type="button"
                          onClick={() => updateProcedureUsage(key, { sessions: sess })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                            usage.sessions === sess
                              ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                              : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {sess} Sessions
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Did it Help */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Did it help your hair density?
                    </span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => updateProcedureUsage(key, { helped: 'yes' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          usage.helped === 'yes'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white border border-stone-200 text-stone-700'
                        }`}
                      >
                        Yes, Noticeable Improvement
                      </button>
                      <button
                        type="button"
                        onClick={() => updateProcedureUsage(key, { helped: 'no' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          usage.helped === 'no'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-white border border-stone-200 text-stone-700'
                        }`}
                      >
                        No / Minimal Change
                      </button>
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
            onClick={handleNoneDone}
            className="px-4 py-3 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            None Done
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-[#0F382C] hover:bg-[#164e3d] text-white shadow-md shadow-[#0F382C]/20 transition-all"
          >
            <span>Next: Side Effects</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
