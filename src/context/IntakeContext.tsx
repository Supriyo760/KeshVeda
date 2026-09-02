import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { GenoRootIntakeSchema, INITIAL_INTAKE_STATE } from '../types/schema';
import { inferDurationFromAges, validateIntakeSchema } from '../engine/inferenceRules';
import { evaluateClinicalRecord, ClinicalEvaluation } from '../engine/clinicalScorer';
import { MOCK_PERSONAS, TestPersona } from '../data/mockPersonas';

export type StepId = 
  | 'welcome'           // 0: Profile (Name, Age, Biological Sex)
  | 'age_onset'         // 1: Q1 Age began
  | 'duration'          // 2: Q2 Duration
  | 'family_history'    // 3: Q3 Family history
  | 'pattern'           // 4: Q4 Scalp visual pattern
  | 'conditions'        // 5: Q5 Diagnosed health conditions
  | 'female_hormones'   // 6 & 7: Q6 Menstrual cycle & Q7 Pregnancy (female only)
  | 'androgenic_signs'  // 8 & 9: Q8 Acne & Q9 Excess body/facial hair
  | 'triggers'          // 10: Q10 Past 6 months triggers
  | 'lifestyle'         // 11: Q11 Habits table
  | 'products'          // 12: Q12 Products matrix
  | 'procedures'        // 13: Q13 Procedures matrix
  | 'side_effects'      // 14: Q14 Treatment side-effects cascade
  | 'sample_consent'    // 15 & 16: Q15 Sample type & Q16 Consent
  | 'summary_review';   // Final: Complete Doctor & Patient handoff view

export const ALL_STEPS: { id: StepId; title: string; section: string; sectionId: string }[] = [
  { id: 'welcome', title: 'Patient Profile', section: 'Getting Started', sectionId: '0' },
  { id: 'age_onset', title: 'Hair Loss Onset', section: 'Personal & Family History', sectionId: 'A' },
  { id: 'duration', title: 'Loss Duration', section: 'Personal & Family History', sectionId: 'A' },
  { id: 'family_history', title: 'Family Genetics', section: 'Personal & Family History', sectionId: 'A' },
  { id: 'pattern', title: 'Hair Loss Pattern', section: 'Personal & Family History', sectionId: 'A' },
  { id: 'conditions', title: 'Medical Health', section: 'Hormonal & Health Influences', sectionId: 'B' },
  { id: 'female_hormones', title: 'Hormonal Profile', section: 'Hormonal & Health Influences', sectionId: 'B' },
  { id: 'androgenic_signs', title: 'Androgenic Indicators', section: 'Hormonal & Health Influences', sectionId: 'B' },
  { id: 'triggers', title: 'Past 6 Months Triggers', section: 'Lifestyle & Environmental Triggers', sectionId: 'C' },
  { id: 'lifestyle', title: 'Daily Habits', section: 'Lifestyle & Environmental Triggers', sectionId: 'C' },
  { id: 'products', title: 'Products Used', section: 'Current Care & Treatments', sectionId: 'D' },
  { id: 'procedures', title: 'Clinical Procedures', section: 'Current Care & Treatments', sectionId: 'D' },
  { id: 'side_effects', title: 'Treatment Reactions', section: 'Current Care & Treatments', sectionId: 'D' },
  { id: 'sample_consent', title: 'Sample & Consent', section: 'Sample Collection & Consent', sectionId: 'E' },
  { id: 'summary_review', title: 'Clinical Review', section: 'Final Review', sectionId: 'Done' },
];

interface IntakeContextType {
  intake: GenoRootIntakeSchema;
  currentStepId: StepId;
  currentStepIndex: number;
  availableSteps: typeof ALL_STEPS;
  clinicalEvaluation: ClinicalEvaluation;
  validation: ReturnType<typeof validateIntakeSchema>;
  isStoryModalOpen: boolean;
  isDoctorDrawerOpen: boolean;
  isAudioMuted: boolean;
  activePersona: string | null;
  updateField: <K extends keyof GenoRootIntakeSchema>(
    key: K,
    value: GenoRootIntakeSchema[K] | ((prevVal: GenoRootIntakeSchema[K]) => GenoRootIntakeSchema[K])
  ) => void;
  updateMetadata: (patch: Partial<GenoRootIntakeSchema['metadata']>) => void;
  batchUpdate: (patch: Partial<GenoRootIntakeSchema>, extractedKeys?: string[]) => void;
  goToStep: (stepId: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  loadPersona: (persona: TestPersona) => void;
  resetIntake: () => void;
  setIsStoryModalOpen: (open: boolean) => void;
  setIsDoctorDrawerOpen: (open: boolean) => void;
  setIsAudioMuted: (muted: boolean) => void;
  speakText: (text: string) => void;
}

const IntakeContext = createContext<IntakeContextType | undefined>(undefined);

export const IntakeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [intake, setIntake] = useState<GenoRootIntakeSchema>(INITIAL_INTAKE_STATE);
  const [currentStepId, setCurrentStepId] = useState<StepId>('welcome');
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [isDoctorDrawerOpen, setIsDoctorDrawerOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activePersona, setActivePersona] = useState<string | null>(null);

  // Compute available steps based on biological sex (Male skips female_hormones)
  const availableSteps = useMemo(() => {
    const isMale = intake.metadata.biological_sex === 'male';
    if (isMale) {
      return ALL_STEPS.filter(s => s.id !== 'female_hormones');
    }
    return ALL_STEPS;
  }, [intake.metadata.biological_sex]);

  const currentStepIndex = useMemo(() => {
    const idx = availableSteps.findIndex(s => s.id === currentStepId);
    return idx >= 0 ? idx : 0;
  }, [availableSteps, currentStepId]);

  // Real-time clinical evaluation
  const clinicalEvaluation = useMemo(() => {
    return evaluateClinicalRecord(intake);
  }, [intake]);

  // Real-time validation
  const validation = useMemo(() => {
    return validateIntakeSchema(intake);
  }, [intake]);

  // TTS audio assistant
  const speakText = useCallback((text: string) => {
    if (isAudioMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  }, [isAudioMuted]);

  // Update a single field with smart inference cascades
  const updateField = useCallback(<K extends keyof GenoRootIntakeSchema>(
    key: K, 
    value: GenoRootIntakeSchema[K] | ((prevVal: GenoRootIntakeSchema[K]) => GenoRootIntakeSchema[K])
  ) => {
    setIntake(prev => {
      const resolvedValue = typeof value === 'function' 
        ? (value as (prevVal: GenoRootIntakeSchema[K]) => GenoRootIntakeSchema[K])(prev[key]) 
        : value;
      const next = { ...prev, [key]: resolvedValue };

      // Smart duration inference from age began
      if (key === 'age_hair_loss_began' && typeof resolvedValue === 'number') {
        const inferredDuration = inferDurationFromAges(prev.metadata.current_age, resolvedValue);
        if (inferredDuration && !prev.duration) {
          next.duration = inferredDuration;
        }
      }

      return next;
    });
  }, []);

  const updateMetadata = useCallback((patch: Partial<GenoRootIntakeSchema['metadata']>) => {
    setIntake(prev => {
      const nextMeta = { ...prev.metadata, ...patch };
      const next = { ...prev, metadata: nextMeta };

      // If biological sex set to male, auto-fill female-only questions
      if (patch.biological_sex === 'male') {
        next.menstrual_cycle = 'Not applicable';
        next.pregnancy_related = 'Not applicable';
      }

      // If current age changed, recheck duration inference
      if (typeof patch.current_age === 'number' && prev.age_hair_loss_began) {
        const inferred = inferDurationFromAges(patch.current_age, prev.age_hair_loss_began);
        if (inferred && !prev.duration) {
          next.duration = inferred;
        }
      }

      return next;
    });
  }, []);

  // Batch update from NLP extraction
  const batchUpdate = useCallback((patch: Partial<GenoRootIntakeSchema>, extractedKeys: string[] = []) => {
    setIntake(prev => {
      const autoFilled = new Set(prev.metadata.auto_filled_fields);
      extractedKeys.forEach(k => autoFilled.add(k));

      return {
        ...prev,
        ...patch,
        habits: { ...prev.habits, ...(patch.habits || {}) },
        products: { ...prev.products, ...(patch.products || {}) },
        procedures: { ...prev.procedures, ...(patch.procedures || {}) },
        metadata: {
          ...prev.metadata,
          ...(patch.metadata || {}),
          auto_filled_fields: autoFilled,
        },
      };
    });
  }, []);

  const goToStep = useCallback((stepId: StepId) => {
    setCurrentStepId(stepId);
  }, []);

  const nextStep = useCallback(() => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < availableSteps.length) {
      setCurrentStepId(availableSteps[nextIdx].id);
    }
  }, [currentStepIndex, availableSteps]);

  const prevStep = useCallback(() => {
    const prevIdx = currentStepIndex - 1;
    if (prevIdx >= 0) {
      setCurrentStepId(availableSteps[prevIdx].id);
    }
  }, [currentStepIndex, availableSteps]);

  const loadPersona = useCallback((persona: TestPersona) => {
    setIntake(persona.data);
    setActivePersona(persona.id);
    setCurrentStepId('summary_review');
  }, []);

  const resetIntake = useCallback(() => {
    setIntake(INITIAL_INTAKE_STATE);
    setActivePersona(null);
    setCurrentStepId('welcome');
  }, []);

  return (
    <IntakeContext.Provider
      value={{
        intake,
        currentStepId,
        currentStepIndex,
        availableSteps,
        clinicalEvaluation,
        validation,
        isStoryModalOpen,
        isDoctorDrawerOpen,
        isAudioMuted,
        activePersona,
        updateField,
        updateMetadata,
        batchUpdate,
        goToStep,
        nextStep,
        prevStep,
        loadPersona,
        resetIntake,
        setIsStoryModalOpen,
        setIsDoctorDrawerOpen,
        setIsAudioMuted,
        speakText,
      }}
    >
      {children}
    </IntakeContext.Provider>
  );
};

export const useIntake = () => {
  const context = useContext(IntakeContext);
  if (!context) {
    throw new Error('useIntake must be used within an IntakeProvider');
  }
  return context;
};
