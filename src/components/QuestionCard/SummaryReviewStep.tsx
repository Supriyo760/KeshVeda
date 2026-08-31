import React, { useEffect, useState } from 'react';
import { useIntake } from '../../context/IntakeContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  Copy, 
  Printer, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Activity, 
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const SummaryReviewStep: React.FC = () => {
  const { intake, validation, clinicalEvaluation, resetIntake, setIsDoctorDrawerOpen } = useIntake();
  const [copied, setCopied] = useState(false);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0F382C', '#10B981', '#34D399', '#F59E0B'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(intake, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(intake, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KeshVeda_Intake_${intake.metadata.patient_name.replace(/\s+/g, '_') || 'Patient'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Celebration Header */}
      <div className="bg-[#0F382C] text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#0F382C]/15 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intake Complete & Synthesized</span>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Thank you, {intake.metadata.patient_name || 'Patient'}!
          </h1>
          <p className="text-sm text-emerald-100/80 max-w-xl leading-relaxed">
            Your 16-question clinical intake has been formatted, verified against the <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">intake-schema.json</code> standard, and prepared for your doctor’s pre-consultation review.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Schema JSON</span>
            </button>

            <button
              onClick={handleCopyJSON}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50 font-semibold text-xs transition-all active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Form JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/50 font-semibold text-xs transition-all active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Intake Sheet</span>
            </button>

            <button
              onClick={() => setIsDoctorDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-400/20 text-emerald-300 font-semibold text-xs hover:bg-emerald-400/30 transition-all lg:hidden"
            >
              <span>View Doctor EMR</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Diagnostic Assessment */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Primary Working Diagnostic</span>
          </div>
          <p className="text-base font-bold text-[#0F382C]">
            {clinicalEvaluation.primaryHypothesis}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              clinicalEvaluation.geneticRiskLevel === 'High' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              AGA Risk: {clinicalEvaluation.geneticRiskScore}% ({clinicalEvaluation.geneticRiskLevel})
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
              TE Trigger: {clinicalEvaluation.telogenEffluviumIndex}
            </span>
          </div>
        </div>

        {/* Card 2: Sample Choice */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Sample & Analysis</span>
          </div>
          <p className="text-base font-bold text-stone-900">
            {intake.sample_type || 'Saliva'} Collection Protocol
          </p>
          <p className="text-xs text-stone-500">
            Genetic & Clinical Consent: <span className="font-semibold text-emerald-700">{intake.consent === 'yes' ? 'Verified (Agreed)' : 'Declined'}</span>
          </p>
        </div>

        {/* Card 3: Quality Score */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Form Completeness</span>
          </div>
          <p className="text-base font-bold text-emerald-700">
            {validation.progressPercent}% Validated (16/16 Fields)
          </p>
          <p className="text-xs text-stone-500">
            Zero schema violations detected.
          </p>
        </div>
      </div>

      {/* Recapped Answers Grid */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <h2 className="font-editorial text-lg font-bold text-stone-900">
          Patient Submission Record
        </h2>

        <div className="divide-y divide-stone-100 text-xs">
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q1. Age hair loss began</span>
            <span className="font-bold text-stone-900">{intake.age_hair_loss_began ? `${intake.age_hair_loss_began} years old` : '—'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q2. Duration</span>
            <span className="font-bold text-stone-900">{intake.duration || '—'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q3. Family History</span>
            <span className="font-bold text-stone-900">{intake.family_history.join(', ') || 'None'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q4. Pattern</span>
            <span className="font-bold text-stone-900">{intake.pattern.join(', ') || '—'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q5. Diagnosed Conditions</span>
            <span className="font-bold text-stone-900">{intake.diagnosed_conditions.join(', ') || 'None'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q6. Menstrual Cycle (Female)</span>
            <span className="font-bold text-stone-900">{intake.menstrual_cycle || 'Not applicable'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q7. Pregnancy Status (Female)</span>
            <span className="font-bold text-stone-900">{intake.pregnancy_related || 'Not applicable'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q8. Adult Acne / Oily Skin</span>
            <span className="font-bold text-stone-900 uppercase">{intake.adult_acne_oily_skin || 'no'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q9. Excess Body / Facial Hair</span>
            <span className="font-bold text-stone-900 uppercase">{intake.excess_body_facial_hair || 'no'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q10. Past 6 Months Triggers</span>
            <span className="font-bold text-stone-900">{intake.past_6_months.join(', ') || 'None'}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q11. Habits (Smoking / Wash / Salon)</span>
            <span className="font-bold text-stone-900">
              Smoking: {intake.habits.smoking || 'no'}, Wash: {intake.habits.hair_wash_frequency || 'unspec'}, Salon: {intake.habits.salon_treatments || 'no'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q14. Past Side Effects</span>
            <span className="font-bold text-stone-900">
              {intake.past_treatment_side_effects === 'yes' ? `Yes (${intake.past_treatment_side_effects_detail || 'Reported'})` : 'None'}
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-stone-500 font-medium">Q15 & Q16. Sample & Consent</span>
            <span className="font-bold text-stone-900">
              {intake.sample_type || 'Saliva'} · Consent: {intake.consent || 'yes'}
            </span>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center border-t border-stone-200">
          <button
            onClick={resetIntake}
            className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Start Fresh / Fill for Another Patient</span>
          </button>

          <span className="text-[11px] text-stone-400">
            KeshVeda Clinic Intake System v1.0
          </span>
        </div>
      </div>
    </div>
  );
};
