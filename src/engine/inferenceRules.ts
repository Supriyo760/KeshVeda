/**
 * GenoRoot Smart Inference & Dependency Rules Engine
 * Implements cross-field dependencies, auto-calculations, and mutual exclusivity.
 */

import { GenoRootIntakeSchema } from '../types/schema';

/**
 * Infer duration from current age and age when hair loss began.
 */
export function inferDurationFromAges(currentAge: number | null, ageBegan: number | null): GenoRootIntakeSchema['duration'] | null {
  if (!currentAge || !ageBegan || currentAge < ageBegan) return null;
  const diff = currentAge - ageBegan;
  if (diff < 0.5) return 'Less than 6 months';
  if (diff <= 1) return '6-12 months';
  return 'Over a year';
}

/**
 * Handle mutual exclusivity for Family History (Q3).
 * If "No known family history" is selected, clears other relatives.
 * If any relative is selected, clears "No known family history".
 */
export function sanitizeFamilyHistory(
  prevHistory: GenoRootIntakeSchema['family_history'],
  toggledItem: GenoRootIntakeSchema['family_history'][number]
): GenoRootIntakeSchema['family_history'] {
  if (toggledItem === 'No known family history') {
    return prevHistory.includes('No known family history') ? [] : ['No known family history'];
  }

  const filtered = prevHistory.filter(item => item !== 'No known family history');
  if (filtered.includes(toggledItem)) {
    return filtered.filter(item => item !== toggledItem);
  } else {
    return [...filtered, toggledItem];
  }
}

/**
 * Handle mutual exclusivity for Diagnosed Conditions (Q5).
 */
export function sanitizeConditions(
  prevConditions: GenoRootIntakeSchema['diagnosed_conditions'],
  toggledItem: GenoRootIntakeSchema['diagnosed_conditions'][number]
): GenoRootIntakeSchema['diagnosed_conditions'] {
  if (toggledItem === 'None') {
    return prevConditions.includes('None') ? [] : ['None'];
  }

  const filtered = prevConditions.filter(item => item !== 'None');
  if (filtered.includes(toggledItem)) {
    return filtered.filter(item => item !== toggledItem);
  } else {
    return [...filtered, toggledItem];
  }
}

/**
 * Check if any product in Q12 has reported side-effects.
 * If yes, cascades to auto-suggest Q14 = 'yes'.
 */
export function checkProductSideEffects(products: GenoRootIntakeSchema['products']): { hasSideEffect: boolean; affectedProducts: string[] } {
  const affected: string[] = [];
  Object.entries(products).forEach(([name, usage]) => {
    if (usage.used && usage.side_effects === 'yes') {
      affected.push(name);
    }
  });
  return {
    hasSideEffect: affected.length > 0,
    affectedProducts: affected,
  };
}

/**
 * Validate completion state and identify any missing required fields.
 */
export function validateIntakeSchema(schema: GenoRootIntakeSchema): { isValid: boolean; missingFields: string[]; progressPercent: number } {
  const missing: string[] = [];
  let completedCount = 0;
  const isMale = schema.metadata.biological_sex === 'male';
  const totalQuestions = isMale ? 14 : 16;

  // Q1
  if (schema.age_hair_loss_began !== null && schema.age_hair_loss_began > 0) completedCount++;
  else missing.push('Q1: Age when hair loss began');

  // Q2
  if (schema.duration !== null) completedCount++;
  else missing.push('Q2: Hair loss duration');

  // Q3
  if (schema.family_history.length > 0) completedCount++;
  else missing.push('Q3: Family history');

  // Q4
  if (schema.pattern.length > 0) completedCount++;
  else missing.push('Q4: Hair loss pattern');

  // Q5
  if (schema.diagnosed_conditions.length > 0) completedCount++;
  else missing.push('Q5: Diagnosed conditions');

  // Q6 & Q7 (Female only)
  if (!isMale) {
    if (schema.menstrual_cycle !== null) completedCount++;
    else missing.push('Q6: Menstrual cycle');

    if (schema.pregnancy_related !== null) completedCount++;
    else missing.push('Q7: Pregnancy status');
  }

  // Q8 & Q9
  if (schema.adult_acne_oily_skin !== null) completedCount++;
  else missing.push('Q8: Adult acne / oily skin');

  if (schema.excess_body_facial_hair !== null) completedCount++;
  else missing.push('Q9: Excess body / facial hair');

  // Q10
  if (schema.past_6_months.length > 0) completedCount++;
  else missing.push('Q10: Past 6 months triggers');

  // Q11
  if (schema.habits.smoking !== null && schema.habits.hair_wash_frequency !== null) completedCount++;
  else missing.push('Q11: Lifestyle habits');

  // Q12 & Q13
  completedCount += 2; // Always has defaults

  // Q14
  if (schema.past_treatment_side_effects !== null) completedCount++;
  else missing.push('Q14: Past treatment side effects');

  // Q15 & Q16
  if (schema.sample_type !== null) completedCount++;
  else missing.push('Q15: Preferred sample type');

  if (schema.consent !== null) completedCount++;
  else missing.push('Q16: Clinical consent');

  const progressPercent = Math.min(100, Math.round((completedCount / totalQuestions) * 100));

  return {
    isValid: missing.length === 0,
    missingFields: missing,
    progressPercent,
  };
}
