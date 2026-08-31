/**
 * GenoRoot Clinical Decision Support & Scoring Engine
 * Computes trichology risk indices, hormonal triage alerts, and automated SOAP notes.
 */

import { GenoRootIntakeSchema } from '../types/schema';

export interface ClinicalEvaluation {
  geneticRiskScore: number; // 0 - 100
  geneticRiskLevel: 'Low' | 'Moderate' | 'High';
  telogenEffluviumIndex: 'Low' | 'Moderate' | 'High';
  pcosEndocrineAlert: boolean;
  drugSensitivityAlert: boolean;
  primaryHypothesis: string;
  soapNote: {
    subjective: string[];
    objective: string[];
    assessment: string[];
    plan: string[];
  };
}

export function evaluateClinicalRecord(intake: GenoRootIntakeSchema): ClinicalEvaluation {
  let geneticScore = 15; // baseline

  // Genetic Risk Calculation
  if (intake.family_history.includes('Father had hair loss')) geneticScore += 35;
  if (intake.family_history.includes('Mother had hair loss')) geneticScore += 35;
  if (intake.family_history.includes('Siblings with thinning or baldness')) geneticScore += 20;
  if (intake.family_history.includes('No known family history')) geneticScore = 10;
  if (intake.age_hair_loss_began && intake.age_hair_loss_began <= 25) geneticScore += 10;

  const boundedGeneticScore = Math.min(98, Math.max(10, geneticScore));
  let geneticRiskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  if (boundedGeneticScore >= 65) geneticRiskLevel = 'High';
  else if (boundedGeneticScore >= 40) geneticRiskLevel = 'Moderate';

  // Telogen Effluvium Trigger Index
  const teTriggersCount = intake.past_6_months.length;
  const hasSuddenShedding = intake.pattern.includes('Sudden excessive shedding') || intake.pattern.includes('Diffuse thinning');
  let telogenEffluviumIndex: 'Low' | 'Moderate' | 'High' = 'Low';
  if (teTriggersCount >= 2 || (teTriggersCount >= 1 && hasSuddenShedding)) {
    telogenEffluviumIndex = 'High';
  } else if (teTriggersCount === 1 || hasSuddenShedding) {
    telogenEffluviumIndex = 'Moderate';
  }

  // PCOS / Endocrine Alert
  let endocrineFlags = 0;
  if (intake.diagnosed_conditions.includes('PCOS/PCOD')) endocrineFlags += 2;
  if (intake.menstrual_cycle === 'Irregular') endocrineFlags += 1;
  if (intake.adult_acne_oily_skin === 'yes') endocrineFlags += 1;
  if (intake.excess_body_facial_hair === 'yes') endocrineFlags += 1;
  const pcosEndocrineAlert = endocrineFlags >= 2 && intake.metadata.biological_sex !== 'male';

  // Drug Sensitivity Alert
  const drugSensitivityAlert = intake.past_treatment_side_effects === 'yes' || 
    Object.values(intake.products).some(p => p.used && p.side_effects === 'yes');

  // Primary Clinical Hypothesis
  let primaryHypothesis = 'Androgenetic Alopecia (AGA)';
  if (telogenEffluviumIndex === 'High' && boundedGeneticScore < 50) {
    primaryHypothesis = 'Acute Telogen Effluvium (Reactive Shedding)';
  } else if (telogenEffluviumIndex === 'High' && boundedGeneticScore >= 50) {
    primaryHypothesis = 'Mixed Etiology: AGA with Triggered Telogen Effluvium';
  } else if (pcosEndocrineAlert) {
    primaryHypothesis = 'Female Pattern Hair Loss / Hyperandrogenic Alopecia';
  } else if (intake.pattern.includes('Patchy loss')) {
    primaryHypothesis = 'Alopecia Areata (Autoimmune / Focal Loss)';
  }

  // Automated SOAP Note Compilation
  const name = intake.metadata.patient_name || 'Patient';
  const age = intake.metadata.current_age ? `${intake.metadata.current_age}yo` : '';
  const sex = intake.metadata.biological_sex ? intake.metadata.biological_sex.toUpperCase() : 'Individual';

  const usedProducts = Object.entries(intake.products)
    .filter(([_, u]) => u.used)
    .map(([name, u]) => `${name} (${u.duration || 'duration unspec'}${u.helped === 'yes' ? ', helped' : ''}${u.side_effects === 'yes' ? ', side-effects reported' : ''})`);

  const doneProcedures = Object.entries(intake.procedures)
    .filter(([_, u]) => u.done)
    .map(([name, u]) => `${name} (${u.sessions || 'sessions unspec'}${u.helped === 'yes' ? ', helped' : ''})`);

  const subjective = [
    `${name} (${age} ${sex}) presents with chief complaint of hair thinning.`,
    `Onset noted around age ${intake.age_hair_loss_began || 'unspecified'}, duration: ${intake.duration || 'unspecified'}.`,
    intake.pattern.length > 0 ? `Reported presentation patterns: ${intake.pattern.join(', ')}.` : 'Pattern unspecified.',
    intake.past_6_months.length > 0 ? `Precipitating triggers in past 6 mo: ${intake.past_6_months.join(', ')}.` : 'No acute systemic triggers reported.',
  ];

  const objective = [
    `Family Predisposition: ${intake.family_history.length > 0 ? intake.family_history.join(', ') : 'None documented'}.`,
    `Diagnosed Systemic Conditions: ${intake.diagnosed_conditions.length > 0 ? intake.diagnosed_conditions.join(', ') : 'None'}.`,
    intake.metadata.biological_sex !== 'male' ? `Menstrual/Pregnancy: Cycle ${intake.menstrual_cycle || 'N/A'}, Pregnancy Status: ${intake.pregnancy_related || 'N/A'}.` : 'Female endocrine panel: Not applicable (Male patient).',
    `Habits: Smoking: ${intake.habits.smoking || 'no'}${intake.habits.smoking_severity ? ` (${intake.habits.smoking_severity})` : ''}, Wash Freq: ${intake.habits.hair_wash_frequency || 'unspec'}, Salon treatments: ${intake.habits.salon_treatments || 'no'}.`,
    `Prior Medical Interventions: ${usedProducts.length > 0 ? usedProducts.join('; ') : 'No prior topical/oral therapeutics'}.`,
    `Prior In-Clinic Procedures: ${doneProcedures.length > 0 ? doneProcedures.join('; ') : 'None'}.`,
  ];

  const assessment = [
    `Primary Working Diagnostic: ${primaryHypothesis}.`,
    `Genetic AGA Risk Index: ${boundedGeneticScore}% (${geneticRiskLevel} Probability).`,
    `Telogen Effluvium Reactive Risk: ${telogenEffluviumIndex}.`,
    pcosEndocrineAlert ? 'Endocrine Flag: Clinical presentation suspicious for hyperandrogenism / PCOS correlation.' : 'No active PCOS flags.',
    drugSensitivityAlert ? 'Therapeutic Alert: Patient reported past adverse reaction or side-effects to hair therapies.' : 'No drug contraindication alerts.',
  ];

  const plan = [
    `Diagnostic Trichoscopy: Target focal miniaturization over ${intake.pattern.includes('Thinning at crown') ? 'vertex' : 'frontal hairline'}.`,
    `Diagnostic Sampling: Patient preferred ${intake.sample_type || 'Saliva / Blood'} collection for GenoRoot molecular panel.`,
    intake.consent === 'yes' ? 'Clinical & Genetic Consent: Obtained and verified.' : 'Clinical Consent: Pending patient signature.',
    'Formulate personalized restorative protocol following in-person microscopic evaluation.',
  ];

  return {
    geneticRiskScore: boundedGeneticScore,
    geneticRiskLevel,
    telogenEffluviumIndex,
    pcosEndocrineAlert,
    drugSensitivityAlert,
    primaryHypothesis,
    soapNote: {
      subjective,
      objective,
      assessment,
      plan,
    },
  };
}
