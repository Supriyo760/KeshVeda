/**
 * GenoRoot NLP Entity Extraction Engine
 * Zero-dependency, client-side NLP parser supporting English, Hindi & Hinglish narratives.
 * Designed to extract 10+ clinical intake fields from free-form speech or text within 50ms.
 */

import { GenoRootIntakeSchema, ProductUsage, ProcedureUsage } from '../types/schema';

export interface ExtractionResult {
  patch: Partial<GenoRootIntakeSchema>;
  extractedKeys: string[];
  confidenceSummary: { key: string; label: string; value: string }[];
}

export function extractIntakeFromNarrative(rawText: string, currentIntake?: GenoRootIntakeSchema): ExtractionResult {
  const text = rawText.toLowerCase().trim();
  const patch: Partial<GenoRootIntakeSchema> = {};
  const extractedKeys: string[] = [];
  const confidenceSummary: { key: string; label: string; value: string }[] = [];

  const addExtraction = (key: string, label: string, valueStr: string) => {
    if (!extractedKeys.includes(key)) {
      extractedKeys.push(key);
      confidenceSummary.push({ key, label, value: valueStr });
    }
  };

  // 0. Patient Name Extraction (Metadata)
  const nameMatch = text.match(/(?:my name is|i am|i'm|this is|naam hai|mera naam)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
  if (nameMatch) {
    const candidate = nameMatch[1].trim();
    const blacklist = ['a', 'the', 'male', 'female', 'guy', 'girl', 'boy', 'experiencing', 'noticing', 'having', 'suffering', 'losing', 'facing', 'taking'];
    if (!blacklist.includes(candidate.toLowerCase())) {
      const formatted = candidate.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      patch.metadata = {
        ...(currentIntake?.metadata || { patient_name: '', current_age: null, biological_sex: null, completed_at: null, completion_mode: 'voice', auto_filled_fields: new Set() }),
        patient_name: formatted,
        auto_filled_fields: currentIntake?.metadata.auto_filled_fields || new Set(),
      };
      addExtraction('patient_name', 'Patient Name', formatted);
    }
  } else if (!currentIntake?.metadata.patient_name && /^[a-zA-Z]{3,15}(?:\s+[a-zA-Z]{3,15})?$/.test(text) && !/(male|female|none|yes|no|saliva|blood|covid|thyroid|pcos|sugar|smoke|alcohol|minoxidil|prp|hair)/i.test(text)) {
    // Single or two word name input
    const formatted = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    patch.metadata = {
      ...(currentIntake?.metadata || { patient_name: '', current_age: null, biological_sex: null, completed_at: null, completion_mode: 'voice', auto_filled_fields: new Set() }),
      patient_name: formatted,
      auto_filled_fields: currentIntake?.metadata.auto_filled_fields || new Set(),
    };
    addExtraction('patient_name', 'Patient Name', formatted);
  }

  // 1. Biological Sex Extraction (Metadata)
  if (/\b(male|man|guy|boy|ladka|purush|mard)\b/i.test(text) || /\b(\d{2})m\b/i.test(text)) {
    patch.metadata = {
      ...(patch.metadata || currentIntake?.metadata || { patient_name: '', current_age: null, completed_at: null, completion_mode: 'voice', auto_filled_fields: new Set() }),
      biological_sex: 'male',
      auto_filled_fields: currentIntake?.metadata.auto_filled_fields || new Set(),
    };
    patch.menstrual_cycle = 'Not applicable';
    patch.pregnancy_related = 'Not applicable';
    addExtraction('biological_sex', 'Biological Sex', 'Male (Q6/Q7 auto-skipped)');
  } else if (/\b(female|woman|lady|girl|ladki|mahila|aurat)\b/i.test(text) || /\b(\d{2})f\b/i.test(text)) {
    patch.metadata = {
      ...(patch.metadata || currentIntake?.metadata || { patient_name: '', current_age: null, completed_at: null, completion_mode: 'voice', auto_filled_fields: new Set() }),
      biological_sex: 'female',
      auto_filled_fields: currentIntake?.metadata.auto_filled_fields || new Set(),
    };
    addExtraction('biological_sex', 'Biological Sex', 'Female');
  }

  // 2. Age & Age Began (Q1)
  const ageOnsetMatch = text.match(/(?:started|began|shuru|noticed|from age|at age|since age|jab main)\s*(?:around|at|of)?\s*(\d{2})/i) ||
                        text.match(/(\d{2})\s*(?:saal ki umar|ki age mein|years old when)/i);
  if (ageOnsetMatch) {
    const age = parseInt(ageOnsetMatch[1], 10);
    if (age >= 12 && age <= 80) {
      patch.age_hair_loss_began = age;
      addExtraction('age_hair_loss_began', 'Age Began', `${age} yrs`);
    }
  }

  const currentAgeMatch = text.match(/(?:i am|i'm|age is|umar)\s*(\d{2})/i) ||
                          text.match(/\b(\d{2})\s*(?:years old|saal ka|saal ki|yo|years)\b/i) ||
                          text.match(/\b(\d{2})[mf]\b/i) ||
                          text.match(/^\s*(\d{2})\s*$/);
  if (currentAgeMatch && !patch.age_hair_loss_began) {
    const age = parseInt(currentAgeMatch[1], 10);
    if (age >= 12 && age <= 90) {
      patch.metadata = {
        ...(patch.metadata || currentIntake?.metadata || { patient_name: '', biological_sex: null, completed_at: null, completion_mode: 'voice', auto_filled_fields: new Set() }),
        current_age: age,
        auto_filled_fields: currentIntake?.metadata.auto_filled_fields || new Set(),
      };
      addExtraction('current_age', 'Current Age', `${age} yrs`);
    }
  }

  // 3. Duration (Q2)
  if (/(?:less than 6 months|<6 months|under 6 months|kuch mahine|2-3 months|3 months|4 months|few months|recent|haali mein)/i.test(text)) {
    patch.duration = 'Less than 6 months';
    addExtraction('duration', 'Duration', 'Less than 6 months');
  } else if (/(?:6-12 months|6 to 12 months|half a year|saal bhar se kam|8 months|9 months|10 months|chhe mahine|6 mahine)/i.test(text)) {
    patch.duration = '6-12 months';
    addExtraction('duration', 'Duration', '6-12 months');
  } else if (/(?:over a year|>1 year|more than a year|saalon se|2 years|3 years|5 years|several years|kisi saal se|bahut time se)/i.test(text)) {
    patch.duration = 'Over a year';
    addExtraction('duration', 'Duration', 'Over a year');
  }

  // 4. Family History (Q3)
  const familyHist: GenoRootIntakeSchema['family_history'] = [];
  if (/\b(dad|father|papa|pitaji|baap)\b/i.test(text) && /(bald|loss|thinning|bal|baal|hair)/i.test(text)) {
    familyHist.push('Father had hair loss');
  }
  if (/\b(mom|mother|mummy|mataji|maa)\b/i.test(text) && /(bald|loss|thinning|bal|baal|hair)/i.test(text)) {
    familyHist.push('Mother had hair loss');
  }
  if (/\b(brother|sister|bhai|behen|sibling|siblings)\b/i.test(text) && /(bald|loss|thinning|bal|baal|hair)/i.test(text)) {
    familyHist.push('Siblings with thinning or baldness');
  }
  if (/\b(no family history|kisi ko nahi|family mein kisi ko nahi|no genetic|none in family)\b/i.test(text)) {
    familyHist.length = 0;
    familyHist.push('No known family history');
  }
  if (familyHist.length > 0) {
    patch.family_history = familyHist;
    addExtraction('family_history', 'Family History', familyHist.join(', '));
  }

  // 5. Hair Loss Pattern (Q4)
  const patterns: GenoRootIntakeSchema['pattern'] = [];
  if (/(receding|hairline|aage se|temple|frontal|forehead|norwood)/i.test(text)) {
    patterns.push('Receding hairline');
  }
  if (/(crown|vertex|top of head|bich mein|chandan|taal)/i.test(text)) {
    patterns.push('Thinning at crown');
  }
  if (/(part line|parting|maang|center line|widening)/i.test(text)) {
    patterns.push('Widening part line');
  }
  if (/(diffuse|all over|har jagah se|overall thinning|har taraf)/i.test(text)) {
    patterns.push('Diffuse thinning');
  }
  if (/(patchy|patches|circular|gol gol|areata|spots)/i.test(text)) {
    patterns.push('Patchy loss');
  }
  if (/(sudden|excessive shedding|bunch of hair|guchha|lots of hair falling|acute|rapid|bahut jhad)/i.test(text)) {
    patterns.push('Sudden excessive shedding');
  }
  if (patterns.length > 0) {
    patch.pattern = patterns;
    addExtraction('pattern', 'Hair Loss Pattern', patterns.join(', '));
  }

  // 6. Diagnosed Conditions (Q5)
  const conditions: GenoRootIntakeSchema['diagnosed_conditions'] = [];
  if (/(pcos|pcod|polycystic)/i.test(text)) conditions.push('PCOS/PCOD');
  if (/(thyroid|hypothyroid|hyperthyroid)/i.test(text)) conditions.push('Thyroid disorder');
  if (/(diabetes|sugar|diabetic)/i.test(text)) conditions.push('Diabetes');
  if (/(autoimmune|lupus|alopecia areata|hashimoto)/i.test(text)) conditions.push('Autoimmune disease');
  if (/(anemia|anaemia|low iron|iron deficiency|ferritin|khoon ki kami)/i.test(text)) conditions.push('Anemia');
  if (/(no medical condition|no disease|healthy|kuch nahi|no health issues)/i.test(text)) {
    conditions.length = 0;
    conditions.push('None');
  }
  if (conditions.length > 0) {
    patch.diagnosed_conditions = conditions;
    addExtraction('diagnosed_conditions', 'Health Conditions', conditions.join(', '));
  }

  // 7. Menstrual & Pregnancy (Q6, Q7)
  if (patch.metadata?.biological_sex !== 'male') {
    if (/(irregular period|irregular cycle|late period|missed period|anirmit)/i.test(text)) {
      patch.menstrual_cycle = 'Irregular';
      addExtraction('menstrual_cycle', 'Menstrual Cycle', 'Irregular');
    } else if (/(regular period|normal cycle|regular cycle|monthly on time)/i.test(text)) {
      patch.menstrual_cycle = 'Regular';
      addExtraction('menstrual_cycle', 'Menstrual Cycle', 'Regular');
    } else if (/(menopause|menopausal|periods stopped)/i.test(text)) {
      patch.menstrual_cycle = 'Menopausal';
      addExtraction('menstrual_cycle', 'Menstrual Cycle', 'Menopausal');
    }

    if (/(currently pregnant|pregnant|garbhvati|expecting)/i.test(text)) {
      patch.pregnancy_related = 'Currently pregnant';
      addExtraction('pregnancy_related', 'Pregnancy Status', 'Currently pregnant');
    } else if (/(postpartum|after delivery|baby born|recent delivery|baccha hua)/i.test(text)) {
      patch.pregnancy_related = 'Postpartum <1 year';
      addExtraction('pregnancy_related', 'Pregnancy Status', 'Postpartum <1 year');
    }
  }

  // 8. Acne / Oily skin & Excess Hair (Q8, Q9)
  if (/(no acne|no pimples|clear skin|no oily skin|no breakout)/i.test(text)) {
    patch.adult_acne_oily_skin = 'no';
    addExtraction('adult_acne_oily_skin', 'Adult Acne / Oily Skin', 'No');
  } else if (/(acne|pimples|oily skin|teliy twacha|breakouts|sebum)/i.test(text)) {
    patch.adult_acne_oily_skin = 'yes';
    addExtraction('adult_acne_oily_skin', 'Adult Acne / Oily Skin', 'Yes');
  }

  if (/(no facial hair|no excess body hair|no excess hair|normal body hair)/i.test(text)) {
    patch.excess_body_facial_hair = 'no';
    addExtraction('excess_body_facial_hair', 'Excess Facial/Body Hair', 'No');
  } else if (/(facial hair|excess body hair|hirsutism|chin hair|chehre pe baal)/i.test(text)) {
    patch.excess_body_facial_hair = 'yes';
    addExtraction('excess_body_facial_hair', 'Excess Facial/Body Hair', 'Yes');
  }

  // 9. Past 6 Months Triggers (Q10)
  const triggers: GenoRootIntakeSchema['past_6_months'] = [];
  if (/(no triggers|no illness|nothing major|no major trigger|healthy past 6 months)/i.test(text)) {
    patch.past_6_months = [];
    addExtraction('past_6_months', 'Recent Triggers', 'None');
  }
  if (/(crash diet|weight loss|vajan kam|fasting|keto|dieting)/i.test(text)) {
    triggers.push('Crash dieting or major weight loss');
  }
  if (/(stress|tension|trauma|anxiety|breakup|job loss|exam stress)/i.test(text)) {
    triggers.push('High stress or emotional trauma');
  }
  if (/(covid|dengue|typhoid|fever|bukhar|viral infection|malaria)/i.test(text)) {
    triggers.push('Fever with illness (COVID, Dengue, Typhoid)');
  }
  if (/(surgery|operation|anesthesia|hospitalized)/i.test(text)) {
    triggers.push('Recent surgery');
  }
  if (/(shifted|city change|water change|air quality|pollution|relocated|hard water area)/i.test(text)) {
    triggers.push('Change in location/water/air quality');
  }
  if (triggers.length > 0) {
    patch.past_6_months = triggers;
    addExtraction('past_6_months', 'Recent Triggers', triggers.join(', '));
  }

  // 10. Habits (Q11)
  const habitsPatch = { ...(currentIntake?.habits || {}) };
  if (/(smoke|smoking|cigarette|bidi|sutta)/i.test(text)) {
    if (/(don't smoke|no smoking|quit smoking|non-smoker|nahi peeta)/i.test(text)) {
      habitsPatch.smoking = 'no';
      habitsPatch.smoking_severity = null;
      addExtraction('smoking', 'Smoking', 'No');
    } else {
      habitsPatch.smoking = 'yes';
      if (/(heavy|more than 10|>10|15|20|pack)/i.test(text)) {
        habitsPatch.smoking_severity = 'Severe >10/day';
      } else if (/(5-10|moderate|6|7|8)/i.test(text)) {
        habitsPatch.smoking_severity = 'Moderate 5-10/day';
      } else {
        habitsPatch.smoking_severity = 'Mild <5/day';
      }
      addExtraction('smoking', 'Smoking', `Yes (${habitsPatch.smoking_severity})`);
    }
  }

  if (/(alcohol|drinking|sharab|beer|wine|whiskey)/i.test(text)) {
    if (/(don't drink|no alcohol|non-drinker|nahi peeta)/i.test(text)) {
      habitsPatch.alcohol = 'no';
      addExtraction('alcohol', 'Alcohol', 'No');
    } else {
      habitsPatch.alcohol = 'yes';
      addExtraction('alcohol', 'Alcohol', 'Yes');
    }
  }

  if (/(hard water|khara pani|borewell water)/i.test(text)) {
    habitsPatch.hard_water = 'yes';
    addExtraction('hard_water', 'Hard Water', 'Yes');
  }

  if (/(wash daily|daily wash|roj shampoo|every day)/i.test(text)) {
    habitsPatch.hair_wash_frequency = 'Daily';
    addExtraction('hair_wash_frequency', 'Wash Frequency', 'Daily');
  } else if (/(alternate days|ek din chhod kar|2-3 times a week|3 times a week)/i.test(text)) {
    habitsPatch.hair_wash_frequency = 'Alternate Days';
    addExtraction('hair_wash_frequency', 'Wash Frequency', 'Alternate Days');
  } else if (/(weekly|once a week|hafte mein ek baar)/i.test(text)) {
    habitsPatch.hair_wash_frequency = 'Weekly';
    addExtraction('hair_wash_frequency', 'Wash Frequency', 'Weekly');
  }

  if (/(keratin|rebonding|smoothening|botox treatment|hair straightening|bleach)/i.test(text)) {
    habitsPatch.salon_treatments = 'yes';
    const detailMatches = text.match(/(keratin|rebonding|smoothening|botox|straightening|bleach)/gi) || [];
    habitsPatch.salon_treatment_detail = Array.from(new Set(detailMatches)).join(', ');
    addExtraction('salon_treatments', 'Salon Treatments', `Yes (${habitsPatch.salon_treatment_detail})`);
  }

  patch.habits = habitsPatch as GenoRootIntakeSchema['habits'];

  // 11. Products Table (Q12)
  const productsPatch = { ...(currentIntake?.products || {}) };

  if (/(topical minoxidil|minoxidil solution|minoxidil foam|minox 5%|minox 2%|mintop|tugain)/i.test(text)) {
    const prod: ProductUsage = { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' };
    if (/(under 3 months|<3mo|1 month|2 months|few weeks)/i.test(text)) prod.duration = '<3mo';
    else if (/(>6 months|over 6 months|1 year|long time)/i.test(text)) prod.duration = '>6mo';
    if (/(didn't help|no change|koi fayda nahi|fayda nahi hua)/i.test(text)) prod.helped = 'no';
    if (/(itchy|itchiness|flakes|dandruff|rashes|side effect|khujli)/i.test(text)) {
      prod.side_effects = 'yes';
      patch.past_treatment_side_effects = 'yes';
      patch.past_treatment_side_effects_detail = 'Itching/flaking from topical minoxidil';
    }
    productsPatch['Topical Minoxidil'] = prod;
    addExtraction('products_topical_minoxidil', 'Topical Minoxidil', `Used (${prod.duration || '3-6mo'})`);
  }

  if (/(oral minoxidil|minoxidil tablet|minoxidil pill)/i.test(text)) {
    productsPatch['Oral Minoxidil'] = { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' };
    addExtraction('products_oral_minoxidil', 'Oral Minoxidil', 'Used');
  }

  if (/(biotin|supplements|hair multivitamin|follihair|zinc tablet)/i.test(text)) {
    productsPatch['Supplements'] = { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' };
    addExtraction('products_supplements', 'Supplements', 'Used');
  }

  if (/(hair oil|serum|rosemary|castor oil|onion oil|bhringraj)/i.test(text)) {
    productsPatch['Hair Oils/Serums'] = { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' };
    addExtraction('products_hair_oils', 'Hair Oils/Serums', 'Used');
  }

  if (/(medicated shampoo|ketoconazole|scalpe|anti-dandruff shampoo|salicylic acid shampoo)/i.test(text)) {
    productsPatch['OTC/Medicated Shampoos'] = { used: true, duration: '3-6mo', helped: 'yes', side_effects: 'no' };
    addExtraction('products_shampoos', 'Medicated Shampoos', 'Used');
  }

  patch.products = productsPatch as GenoRootIntakeSchema['products'];

  // 12. In-Clinic Procedures (Q13)
  const proceduresPatch = { ...(currentIntake?.procedures || {}) };
  if (/(prp|gfc|iprf|platelet rich plasma|growth factor)/i.test(text)) {
    proceduresPatch['PRP/GFC/iPRF'] = { done: true, sessions: '4-6', helped: 'yes' };
    addExtraction('procedures_prp', 'PRP/GFC Injections', 'Done (4-6 sessions)');
  }
  if (/(stem cells|exosomes)/i.test(text)) {
    proceduresPatch['Stem Cells/Exosomes'] = { done: true, sessions: '1-3', helped: 'yes' };
    addExtraction('procedures_stem_cells', 'Stem Cells/Exosomes', 'Done');
  }
  if (/(hair transplant|fue|fut|transplant karwaya)/i.test(text)) {
    proceduresPatch['Hair Transplant'] = { done: true, sessions: '1-3', helped: 'yes' };
    addExtraction('procedures_transplant', 'Hair Transplant', 'Done');
  }
  patch.procedures = proceduresPatch as GenoRootIntakeSchema['procedures'];

  // 13. Sample Type & Consent (Q15, Q16)
  if (/(saliva|saliva sample|dna swab|thook)/i.test(text)) {
    patch.sample_type = 'Saliva';
    addExtraction('sample_type', 'Sample Type', 'Saliva Swab');
  } else if (/(blood|blood sample|khoon|blood draw)/i.test(text)) {
    patch.sample_type = 'Blood';
    addExtraction('sample_type', 'Sample Type', 'Blood Panel');
  } else if (/(either|any sample|kuch bhi chalega)/i.test(text)) {
    patch.sample_type = 'Either';
    addExtraction('sample_type', 'Sample Type', 'Either');
  }

  if (/(consent|agree|ready|i agree|haan manzoor hai)/i.test(text)) {
    patch.consent = 'yes';
    addExtraction('consent', 'Clinical Consent', 'Yes');
  }

  return { patch, extractedKeys, confidenceSummary };
}
