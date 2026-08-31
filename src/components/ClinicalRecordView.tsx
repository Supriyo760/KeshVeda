import React, { useState } from 'react';
import { useIntake } from '../context/IntakeContext';
import { 
  Stethoscope, 
  Dna, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  X,
  Sparkles
} from 'lucide-react';

export const ClinicalRecordView: React.FC<{ isDrawer?: boolean; onClose?: () => void }> = ({ 
  isDrawer = false, 
  onClose 
}) => {
  const { intake, clinicalEvaluation, validation } = useIntake();
  const [activeTab, setActiveTab] = useState<'soap' | 'schema' | 'analytics'>('soap');
  const [copied, setCopied] = useState(false);

  const jsonContent = JSON.stringify(intake, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KeshVeda_Clinical_Schema_${intake.metadata.patient_name.replace(/\s+/g, '_') || 'Patient'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-full flex flex-col bg-[#0F1715] text-stone-200 ${
      isDrawer ? 'p-5' : 'p-6 border-l border-stone-800'
    }`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-editorial text-base font-bold text-emerald-300">Doctor Clinical Record</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                Live EMR
              </span>
            </div>
            <p className="text-[11px] text-stone-400">Real-time trichology synthesis & schema output</p>
          </div>
        </div>

        {isDrawer && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Patient Mini Banner */}
      <div className="mt-3.5 p-3 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between shrink-0">
        <div className="truncate">
          <p className="text-xs font-bold text-white">
            {intake.metadata.patient_name || 'Anonymous Patient'}
          </p>
          <p className="text-[11px] text-stone-400">
            {intake.metadata.current_age ? `${intake.metadata.current_age} yrs` : 'Age unspec'} • {intake.metadata.biological_sex ? intake.metadata.biological_sex.toUpperCase() : 'Sex unspec'}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-stone-400 block">Schema Fill</span>
          <span className="text-xs font-bold text-emerald-400">{validation.progressPercent}%</span>
        </div>
      </div>

      {/* Clinical Risk Meters */}
      <div className="grid grid-cols-2 gap-2 mt-3 shrink-0">
        {/* Genetic AGA Risk Meter */}
        <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">AGA Risk</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              clinicalEvaluation.geneticRiskLevel === 'High' 
                ? 'bg-red-950 text-red-300 border border-red-800/50'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
            }`}>
              {clinicalEvaluation.geneticRiskLevel}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-white font-sans">{clinicalEvaluation.geneticRiskScore}%</span>
            <span className="text-[10px] text-stone-500">score</span>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                clinicalEvaluation.geneticRiskLevel === 'High' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${clinicalEvaluation.geneticRiskScore}%` }}
            />
          </div>
        </div>

        {/* Telogen Effluvium Urgency */}
        <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">TE Trigger</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              clinicalEvaluation.telogenEffluviumIndex === 'High'
                ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
            }`}>
              {clinicalEvaluation.telogenEffluviumIndex}
            </span>
          </div>
          <p className="text-xs font-bold text-white truncate pt-0.5">
            {clinicalEvaluation.telogenEffluviumIndex === 'High' ? 'Acute Reactive' : 'Low Trigger'}
          </p>
          <p className="text-[10px] text-stone-500 truncate">
            {intake.past_6_months.length} trigger(s) noted
          </p>
        </div>
      </div>

      {/* Alerts Row */}
      {(clinicalEvaluation.pcosEndocrineAlert || clinicalEvaluation.drugSensitivityAlert) && (
        <div className="mt-2 space-y-1.5 shrink-0">
          {clinicalEvaluation.pcosEndocrineAlert && (
            <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-300 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>PCOS / Endocrine correlation alert</span>
            </div>
          )}
          {clinicalEvaluation.drugSensitivityAlert && (
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-[11px] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Prior therapy sensitivity / side-effects reported</span>
            </div>
          )}
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 mt-4 p-1 bg-stone-900 rounded-xl border border-stone-800 shrink-0">
        <button
          onClick={() => setActiveTab('soap')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'soap'
              ? 'bg-[#0F382C] text-emerald-200 shadow-sm border border-emerald-700/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>SOAP Note</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'schema'
              ? 'bg-[#0F382C] text-emerald-200 shadow-sm border border-emerald-700/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>JSON Schema</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1">
        {activeTab === 'soap' && (
          <div className="space-y-3.5 text-xs text-stone-300">
            {/* Subjective */}
            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800/80 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                S · Subjective (Patient Narrative)
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                {clinicalEvaluation.soapNote.subjective.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Objective */}
            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800/80 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                O · Objective / Clinical History
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                {clinicalEvaluation.soapNote.objective.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Assessment */}
            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800/80 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                A · Assessment & Differential
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                {clinicalEvaluation.soapNote.assessment.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Plan */}
            <div className="p-3.5 rounded-xl bg-stone-900/50 border border-stone-800/80 space-y-1">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                P · Recommended Plan & Sampling
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-300">
                {clinicalEvaluation.soapNote.plan.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-stone-400 pb-1">
              <span className="font-mono">intake-schema.json compliant</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2 py-1 rounded bg-emerald-800 hover:bg-emerald-700 text-emerald-100 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
              {jsonContent}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
        <span>KeshVeda EMR Link Active</span>
        <span className="text-emerald-400 font-medium">100% Client-Side Sync</span>
      </div>
    </div>
  );
};
