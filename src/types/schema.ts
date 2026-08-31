/**
 * GenoRoot Hair & Scalp Medical Intake - Strict Schema Types
 * Exactly mirrors intake-schema.json and Haiku form requirements.
 */

export interface GenoRootIntakeSchema {
  // Section A: Personal & Family Hair Loss History
  age_hair_loss_began: number | null; // Q1
  duration: 'Less than 6 months' | '6-12 months' | 'Over a year' | null; // Q2
  family_history: Array<
    'Father had hair loss' | 
    'Mother had hair loss' | 
    'Siblings with thinning or baldness' | 
    'No known family history'
  >; // Q3
  pattern: Array<
    'Receding hairline' | 
    'Thinning at crown' | 
    'Widening part line' | 
    'Diffuse thinning' | 
    'Patchy loss' | 
    'Sudden excessive shedding'
  >; // Q4

  // Section B: Hormonal & Health Influences
  diagnosed_conditions: Array<
    'PCOS/PCOD' | 
    'Thyroid disorder' | 
    'Diabetes' | 
    'Autoimmune disease' | 
    'Anemia' | 
    'None'
  >; // Q5
  menstrual_cycle: 'Regular' | 'Irregular' | 'Menopausal' | 'Not applicable' | null; // Q6 (Female-only)
  pregnancy_related: 'Currently pregnant' | 'Postpartum <1 year' | 'Not applicable' | null; // Q7 (Female-only)
  adult_acne_oily_skin: 'yes' | 'no' | null; // Q8
  excess_body_facial_hair: 'yes' | 'no' | null; // Q9

  // Section C: Lifestyle & Environmental Triggers
  past_6_months: Array<
    'Crash dieting or major weight loss' | 
    'High stress or emotional trauma' | 
    'Fever with illness (COVID, Dengue, Typhoid)' | 
    'Recent surgery' | 
    'Change in location/water/air quality'
  >; // Q10
  habits: {
    smoking: 'yes' | 'no' | null;
    smoking_severity?: 'Mild <5/day' | 'Moderate 5-10/day' | 'Severe >10/day' | null;
    alcohol: 'yes' | 'no' | null;
    hard_water: 'yes' | 'no' | null;
    hair_wash_frequency: 'Daily' | 'Alternate Days' | 'Weekly' | null;
    heating_tools_styling_chemicals: 'yes' | 'no' | null;
    salon_treatments: 'yes' | 'no' | null;
    salon_treatment_detail?: string | null;
  }; // Q11

  // Section D: Current Hair Care & Treatments
  products: {
    'OTC/Medicated Shampoos': ProductUsage;
    'Hair Oils/Serums': ProductUsage;
    'Topical Minoxidil': ProductUsage;
    'Oral Minoxidil': ProductUsage;
    'Supplements': ProductUsage;
  }; // Q12
  procedures: {
    'PRP/GFC/iPRF': ProcedureUsage;
    'Stem Cells/Exosomes': ProcedureUsage;
    'Hair Transplant': ProcedureUsage;
    'Other': ProcedureUsage;
  }; // Q13
  past_treatment_side_effects: 'yes' | 'no' | null; // Q14
  past_treatment_side_effects_detail?: string | null;

  // Section E: Sample Collection & Consent
  sample_type: 'Saliva' | 'Blood' | 'Either' | null; // Q15
  consent: 'yes' | 'no' | null; // Q16

  // Patient Profile Metadata (Used for polite routing & clinical notes)
  metadata: PatientMetadata;
}

export interface ProductUsage {
  used: boolean;
  duration?: '<3mo' | '3-6mo' | '>6mo' | null;
  helped?: 'yes' | 'no' | null;
  side_effects?: 'yes' | 'no' | null;
}

export interface ProcedureUsage {
  done: boolean;
  sessions?: '1-3' | '4-6' | '>6' | null;
  helped?: 'yes' | 'no' | null;
}

export interface PatientMetadata {
  patient_name: string;
  current_age: number | null;
  biological_sex: 'male' | 'female' | 'other' | null;
  completed_at?: string | null;
  completion_mode?: 'tap' | 'voice' | 'express';
  auto_filled_fields: Set<string>; // tracks fields populated by AI/inference
}

export const INITIAL_INTAKE_STATE: GenoRootIntakeSchema = {
  age_hair_loss_began: null,
  duration: null,
  family_history: [],
  pattern: [],
  diagnosed_conditions: [],
  menstrual_cycle: null,
  pregnancy_related: null,
  adult_acne_oily_skin: null,
  excess_body_facial_hair: null,
  past_6_months: [],
  habits: {
    smoking: null,
    smoking_severity: null,
    alcohol: null,
    hard_water: null,
    hair_wash_frequency: null,
    heating_tools_styling_chemicals: null,
    salon_treatments: null,
    salon_treatment_detail: '',
  },
  products: {
    'OTC/Medicated Shampoos': { used: false, duration: null, helped: null, side_effects: null },
    'Hair Oils/Serums': { used: false, duration: null, helped: null, side_effects: null },
    'Topical Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
    'Oral Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
    'Supplements': { used: false, duration: null, helped: null, side_effects: null },
  },
  procedures: {
    'PRP/GFC/iPRF': { done: false, sessions: null, helped: null },
    'Stem Cells/Exosomes': { done: false, sessions: null, helped: null },
    'Hair Transplant': { done: false, sessions: null, helped: null },
    'Other': { done: false, sessions: null, helped: null },
  },
  past_treatment_side_effects: null,
  past_treatment_side_effects_detail: '',
  sample_type: null,
  consent: null,
  metadata: {
    patient_name: '',
    current_age: null,
    biological_sex: null,
    completed_at: null,
    completion_mode: 'tap',
    auto_filled_fields: new Set<string>(),
  },
};
