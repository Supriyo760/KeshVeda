/**
 * Reviewer Test Personas for Hiring Evaluation
 * Allows hiring evaluators to test complete clinical edge-cases in 1-click.
 */

import { GenoRootIntakeSchema } from '../types/schema';

export interface TestPersona {
  id: string;
  name: string;
  age: number;
  sex: 'male' | 'female';
  tagline: string;
  description: string;
  data: GenoRootIntakeSchema;
}

export const MOCK_PERSONAS: TestPersona[] = [
  {
    id: 'rahul-32m',
    name: 'Rahul Sharma',
    age: 32,
    sex: 'male',
    tagline: '32M · Classic Male Pattern Baldness (AGA)',
    description: 'Began at 30, vertex thinning + receding hairline. Father had hair loss. Tried Topical Minoxidil with minor itching.',
    data: {
      age_hair_loss_began: 30,
      duration: 'Over a year',
      family_history: ['Father had hair loss'],
      pattern: ['Receding hairline', 'Thinning at crown'],
      diagnosed_conditions: ['None'],
      menstrual_cycle: 'Not applicable',
      pregnancy_related: 'Not applicable',
      adult_acne_oily_skin: 'no',
      excess_body_facial_hair: 'no',
      past_6_months: ['High stress or emotional trauma'],
      habits: {
        smoking: 'yes',
        smoking_severity: 'Mild <5/day',
        alcohol: 'yes',
        hard_water: 'yes',
        hair_wash_frequency: 'Alternate Days',
        heating_tools_styling_chemicals: 'no',
        salon_treatments: 'no',
        salon_treatment_detail: '',
      },
      products: {
        'OTC/Medicated Shampoos': { used: false, duration: null, helped: null, side_effects: null },
        'Hair Oils/Serums': { used: true, duration: '3-6mo', helped: 'no', side_effects: 'no' },
        'Topical Minoxidil': { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'yes' },
        'Oral Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
        'Supplements': { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' },
      },
      procedures: {
        'PRP/GFC/iPRF': { done: false, sessions: null, helped: null },
        'Stem Cells/Exosomes': { done: false, sessions: null, helped: null },
        'Hair Transplant': { done: false, sessions: null, helped: null },
        'Other': { done: false, sessions: null, helped: null },
      },
      past_treatment_side_effects: 'yes',
      past_treatment_side_effects_detail: 'Scalp redness and itching with Minoxidil 5% alcohol formulation.',
      sample_type: 'Saliva',
      consent: 'yes',
      metadata: {
        patient_name: 'Rahul Sharma',
        current_age: 32,
        biological_sex: 'male',
        completed_at: new Date().toISOString(),
        completion_mode: 'tap',
        auto_filled_fields: new Set(['age_hair_loss_began', 'duration', 'family_history', 'pattern', 'menstrual_cycle', 'pregnancy_related']),
      },
    },
  },
  {
    id: 'priya-28f',
    name: 'Priya Nair',
    age: 28,
    sex: 'female',
    tagline: '28F · Postpartum + PCOS Diffuse Shedding',
    description: 'Sudden shedding post-delivery + COVID recovery. Irregular menstrual cycle, adult acne, anemia history.',
    data: {
      age_hair_loss_began: 27,
      duration: '6-12 months',
      family_history: ['Mother had hair loss'],
      pattern: ['Widening part line', 'Diffuse thinning', 'Sudden excessive shedding'],
      diagnosed_conditions: ['PCOS/PCOD', 'Anemia'],
      menstrual_cycle: 'Irregular',
      pregnancy_related: 'Postpartum <1 year',
      adult_acne_oily_skin: 'yes',
      excess_body_facial_hair: 'yes',
      past_6_months: [
        'Fever with illness (COVID, Dengue, Typhoid)',
        'High stress or emotional trauma',
      ],
      habits: {
        smoking: 'no',
        smoking_severity: null,
        alcohol: 'no',
        hard_water: 'yes',
        hair_wash_frequency: 'Weekly',
        heating_tools_styling_chemicals: 'yes',
        salon_treatments: 'yes',
        salon_treatment_detail: 'Keratin treatment 4 months ago',
      },
      products: {
        'OTC/Medicated Shampoos': { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' },
        'Hair Oils/Serums': { used: true, duration: '>6mo', helped: 'no', side_effects: 'no' },
        'Topical Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
        'Oral Minoxidil': { used: false, duration: null, helped: null, side_effects: null },
        'Supplements': { used: true, duration: '>6mo', helped: 'yes', side_effects: 'no' },
      },
      procedures: {
        'PRP/GFC/iPRF': { done: true, sessions: '1-3', helped: 'yes' },
        'Stem Cells/Exosomes': { done: false, sessions: null, helped: null },
        'Hair Transplant': { done: false, sessions: null, helped: null },
        'Other': { done: false, sessions: null, helped: null },
      },
      past_treatment_side_effects: 'no',
      past_treatment_side_effects_detail: '',
      sample_type: 'Blood',
      consent: 'yes',
      metadata: {
        patient_name: 'Priya Nair',
        current_age: 28,
        biological_sex: 'female',
        completed_at: new Date().toISOString(),
        completion_mode: 'express',
        auto_filled_fields: new Set(['age_hair_loss_began', 'duration', 'pattern', 'diagnosed_conditions', 'past_6_months']),
      },
    },
  },
  {
    id: 'vikram-55m',
    name: 'Vikram Sengupta',
    age: 55,
    sex: 'male',
    tagline: '55M · Long-term Norwood V & Transplant Candidate',
    description: 'Hair loss began at 24. Heavy smoker, 6 sessions of PRP done. Seeking genetic risk confirmation for hair transplant.',
    data: {
      age_hair_loss_began: 24,
      duration: 'Over a year',
      family_history: ['Father had hair loss', 'Siblings with thinning or baldness'],
      pattern: ['Receding hairline', 'Thinning at crown', 'Diffuse thinning'],
      diagnosed_conditions: ['Diabetes'],
      menstrual_cycle: 'Not applicable',
      pregnancy_related: 'Not applicable',
      adult_acne_oily_skin: 'no',
      excess_body_facial_hair: 'no',
      past_6_months: ['Change in location/water/air quality'],
      habits: {
        smoking: 'yes',
        smoking_severity: 'Severe >10/day',
        alcohol: 'yes',
        hard_water: 'yes',
        hair_wash_frequency: 'Daily',
        heating_tools_styling_chemicals: 'no',
        salon_treatments: 'no',
        salon_treatment_detail: '',
      },
      products: {
        'OTC/Medicated Shampoos': { used: true, duration: '>6mo', helped: 'no', side_effects: 'no' },
        'Hair Oils/Serums': { used: true, duration: '>6mo', helped: 'no', side_effects: 'no' },
        'Topical Minoxidil': { used: true, duration: '>6mo', helped: 'no', side_effects: 'no' },
        'Oral Minoxidil': { used: true, duration: '3-6mo', helped: 'no', side_effects: 'no' },
        'Supplements': { used: true, duration: '>6mo', helped: 'no', side_effects: 'no' },
      },
      procedures: {
        'PRP/GFC/iPRF': { done: true, sessions: '>6', helped: 'no' },
        'Stem Cells/Exosomes': { done: true, sessions: '1-3', helped: 'no' },
        'Hair Transplant': { done: false, sessions: null, helped: null },
        'Other': { done: false, sessions: null, helped: null },
      },
      past_treatment_side_effects: 'no',
      past_treatment_side_effects_detail: '',
      sample_type: 'Either',
      consent: 'yes',
      metadata: {
        patient_name: 'Vikram Sengupta',
        current_age: 55,
        biological_sex: 'male',
        completed_at: new Date().toISOString(),
        completion_mode: 'tap',
        auto_filled_fields: new Set(['menstrual_cycle', 'pregnancy_related']),
      },
    },
  },
];
