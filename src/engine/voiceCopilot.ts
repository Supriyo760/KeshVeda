/**
 * GenoRoot Voice Copilot & Conversational Dialogue Engine
 * Powers interactive duplex-style voice consultations where the patient can fill 
 * the entire 16-question medical intake naturally through back-and-forth speech.
 */

import { GenoRootIntakeSchema } from '../types/schema';
import { validateIntakeSchema } from './inferenceRules';

export interface CopilotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
  extractedPills?: { label: string; value: string }[];
}

export type ConversationTopic = 
  | 'welcome'
  | 'onset_and_duration'
  | 'family_history'
  | 'hair_pattern'
  | 'medical_conditions'
  | 'female_endocrine'
  | 'androgenic_indicators'
  | 'recent_triggers'
  | 'lifestyle_habits'
  | 'treatments_matrix'
  | 'sample_and_consent'
  | 'all_complete';

export interface NextQuestionPlan {
  topic: ConversationTopic;
  promptText: string;
  shortLabel: string;
  suggestedQuickReplies: string[];
}

/**
 * Determine the next missing or highest-priority clinical question to ask.
 */
export function determineNextQuestion(intake: GenoRootIntakeSchema): NextQuestionPlan {
  const isMale = intake.metadata.biological_sex === 'male';
  const name = intake.metadata.patient_name || '';

  // 1. Profile / Demographics
  if (!intake.metadata.biological_sex || !intake.metadata.current_age) {
    if (name && !intake.metadata.biological_sex) {
      return {
        topic: 'welcome',
        promptText: `Nice to meet you, ${name}! What is your current age and biological sex (Male or Female)?`,
        shortLabel: "Age & Sex",
        suggestedQuickReplies: [
          "I am 30 male",
          "28 female",
          "32 years old male"
        ]
      };
    }
    return {
      topic: 'welcome',
      promptText: "What is your current age and biological sex (Male or Female)?",
      shortLabel: "Age & Sex",
      suggestedQuickReplies: [
        "Rahul, 30 male",
        "Priya, 28 female",
        "32 years old male"
      ]
    };
  }

  // 2. Onset & Duration
  if (!intake.age_hair_loss_began || !intake.duration) {
    return {
      topic: 'onset_and_duration',
      promptText: `At what age did you first notice your hair loss, and how long has it been happening — under 6 months, 6 to 12 months, or over a year?`,
      shortLabel: "Onset & Duration",
      suggestedQuickReplies: [
        "Started at 28, over a year",
        "Noticed 6 months ago",
        "Recent shedding, under 6 months"
      ]
    };
  }

  // 3. Hair Pattern
  if (intake.pattern.length === 0) {
    return {
      topic: 'hair_pattern',
      promptText: `Where on your scalp are you noticing hair thinning? For example, receding hairline at temples, crown thinning, widening part line, or sudden all-over shedding?`,
      shortLabel: "Hair Loss Pattern",
      suggestedQuickReplies: [
        "Receding hairline and crown thinning",
        "Widening part line and diffuse loss",
        "Sudden excessive shedding everywhere"
      ]
    };
  }

  // 4. Family Genetics
  if (intake.family_history.length === 0) {
    return {
      topic: 'family_history',
      promptText: `Is there any history of hair thinning in your family, such as your father, mother, or siblings — or no known family history?`,
      shortLabel: "Family History",
      suggestedQuickReplies: [
        "Father had hair loss",
        "Mother and brother have hair loss",
        "No known family history"
      ]
    };
  }

  // 5. Medical Conditions
  if (intake.diagnosed_conditions.length === 0) {
    return {
      topic: 'medical_conditions',
      promptText: `Do you have any diagnosed health conditions, like thyroid disorder, PCOS, diabetes, anemia, or none of these?`,
      shortLabel: "Medical Conditions",
      suggestedQuickReplies: [
        "No medical conditions, healthy",
        "Diagnosed with Thyroid disorder",
        "PCOS and Anemia"
      ]
    };
  }

  // 6. Female Endocrine (if female)
  if (!isMale && (!intake.menstrual_cycle || !intake.pregnancy_related)) {
    return {
      topic: 'female_endocrine',
      promptText: `Is your menstrual cycle regular or irregular, and are you currently pregnant or postpartum within the last year?`,
      shortLabel: "Hormonal Cycle",
      suggestedQuickReplies: [
        "Regular cycle, not pregnant",
        "Irregular periods, postpartum 6 months",
        "Menopausal"
      ]
    };
  }

  // 7. Androgenic Signs
  if (intake.adult_acne_oily_skin === null || intake.excess_body_facial_hair === null) {
    return {
      topic: 'androgenic_indicators',
      promptText: `Do you experience oily skin, adult acne breakouts, or excess facial and body hair growth?`,
      shortLabel: "Skin & Androgen Signs",
      suggestedQuickReplies: [
        "Yes oily skin and acne, no excess hair",
        "No acne, no excess body hair",
        "Yes to both acne and facial hair"
      ]
    };
  }

  // 8. Recent Triggers
  if (intake.past_6_months.length === 0) {
    return {
      topic: 'recent_triggers',
      promptText: `In the past 6 months, did you have any major triggers like COVID/fever, high stress, crash dieting, surgery, or moving to a hard water area?`,
      shortLabel: "Past 6 Mo Triggers",
      suggestedQuickReplies: [
        "High stress and fever post-COVID",
        "Shifted city with hard water",
        "No major triggers in past 6 months"
      ]
    };
  }

  // 9. Habits
  if (intake.habits.smoking === null || intake.habits.hair_wash_frequency === null) {
    return {
      topic: 'lifestyle_habits',
      promptText: `How often do you wash your hair — daily, alternate days, or weekly? And do you smoke or drink alcohol?`,
      shortLabel: "Hair Wash & Habits",
      suggestedQuickReplies: [
        "Wash alternate days, non-smoker, occasional alcohol",
        "Daily wash, smoker under 5 a day",
        "Wash weekly, no smoking or drinking"
      ]
    };
  }

  // 10. Treatments & Procedures
  const hasProductsFilled = Object.values(intake.products).some(p => p.used);
  const hasProceduresFilled = Object.values(intake.procedures).some(p => p.done);
  if (!hasProductsFilled && !hasProceduresFilled && intake.past_treatment_side_effects === null) {
    return {
      topic: 'treatments_matrix',
      promptText: `Have you tried any hair loss treatments like Minoxidil, hair oils, shampoos, or procedures like PRP? And did you experience any side effects?`,
      shortLabel: "Products & Treatments",
      suggestedQuickReplies: [
        "Used topical Minoxidil for 3 months, mild itching",
        "Did 4 sessions of PRP, helped a lot",
        "None of these, never tried treatments"
      ]
    };
  }

  // 11. Sample & Consent
  if (!intake.sample_type || intake.consent === null) {
    return {
      topic: 'sample_and_consent',
      promptText: `For your GenoRoot diagnostic panel, would you prefer a saliva swab or blood sample? And do you consent to the clinical genetic analysis?`,
      shortLabel: "Sample Type & Consent",
      suggestedQuickReplies: [
        "Prefer saliva swab, I agree and consent",
        "Blood panel preferred, I consent",
        "Either sample is fine, I agree"
      ]
    };
  }

  // All complete!
  return {
    topic: 'all_complete',
    promptText: `Excellent! All your clinical information has been gathered and structured for your physician. Let's review your final clinical intake report.`,
    shortLabel: "Intake Complete",
    suggestedQuickReplies: [
      "Review my clinical note",
      "Show Doctor EMR summary"
    ]
  };
}

/**
 * Generate a dynamic, empathetic doctor voice response that acknowledges 
 * what the patient just said and naturally pivots to the next question.
 */
export function buildConversationalResponse(
  extractedLabels: string[],
  nextPlan: NextQuestionPlan,
  patientName?: string,
  rawUserInput?: string
): string {
  if (nextPlan.topic === 'all_complete') {
    return `Thank you${patientName ? `, ${patientName}` : ''}! I have recorded and validated all 16 clinical areas for your doctor. Your EMR note and genetic risk profile are ready for review.`;
  }

  if (extractedLabels.length > 0) {
    const summary = extractedLabels.slice(0, 3).join(', ');
    return `Recorded your ${summary}. ${nextPlan.promptText}`;
  }

  return `I noted that. ${nextPlan.promptText}`;
}
