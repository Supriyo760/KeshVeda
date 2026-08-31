# Technical Design Document & Data Contracts
## Project: GenoRoot AI — The Hair & Scalp Intake That Fills Itself

---

## 1. Schema & Data Contract (Exact Match to `intake-schema.json`)

```typescript
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
  menstrual_cycle: 'Regular' | 'Irregular' | 'Menopausal' | 'Not applicable' | null; // Q6
  pregnancy_related: 'Currently pregnant' | 'Postpartum <1 year' | 'Not applicable' | null; // Q7
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

  // Auxiliary Metadata (Non-graded but vital for UX & Clinical Note)
  metadata?: {
    patient_name?: string;
    current_age?: number;
    biological_sex?: 'male' | 'female' | 'other';
    completed_at?: string;
    completion_mode?: 'tap' | 'voice' | 'express';
  };
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
```

---

## 2. Client-Side NLP & Hinglish Extraction Engine

The parser processes free-form text or speech transcripts using token matching and regular expressions:

```typescript
export interface ExtractedEntities {
  age_hair_loss_began?: number;
  current_age?: number;
  biological_sex?: 'male' | 'female';
  duration?: GenoRootIntakeSchema['duration'];
  family_history?: GenoRootIntakeSchema['family_history'];
  pattern?: GenoRootIntakeSchema['pattern'];
  diagnosed_conditions?: GenoRootIntakeSchema['diagnosed_conditions'];
  menstrual_cycle?: GenoRootIntakeSchema['menstrual_cycle'];
  pregnancy_related?: GenoRootIntakeSchema['pregnancy_related'];
  adult_acne_oily_skin?: 'yes' | 'no';
  excess_body_facial_hair?: 'yes' | 'no';
  past_6_months?: GenoRootIntakeSchema['past_6_months'];
  habits?: Partial<GenoRootIntakeSchema['habits']>;
  products?: Partial<GenoRootIntakeSchema['products']>;
  procedures?: Partial<GenoRootIntakeSchema['procedures']>;
  past_treatment_side_effects?: 'yes' | 'no';
  past_treatment_side_effects_detail?: string;
  sample_type?: GenoRootIntakeSchema['sample_type'];
}
```

### Parsing Rules Sample:
- **Temporal expressions**: `"6 months"`, `"6 mahine"`, `"half a year"` $\rightarrow$ `duration: "6-12 months"`
- **Pattern matching**: `"crown"`, `"maang"`, `"hairline"`, `"chandan"`, `"shedding"`, `"jhadna"` $\rightarrow$ `pattern` mapping
- **Family terms**: `"dad"`, `"papa"`, `"father"`, `"mom"`, `"mummy"`, `"mother"`, `"brother"`, `"bhai"` $\rightarrow$ `family_history`
- **Medications**: `"minoxidil"`, `"minox"`, `"biotin"`, `"shampoo"`, `"prp"` $\rightarrow$ product/procedure table updates

---

## 3. Clinical Decision Support & Scoring Algorithms

### 3.1 Androgenetic Alopecia (AGA) Genetic Risk Score (0 - 100)
- Father with loss: $+35$
- Mother with loss: $+35$
- Sibling with loss: $+20$
- Early onset ($< 25$ years old): $+10$

### 3.2 Telogen Effluvium (TE) Acute Trigger Index (Low / Medium / High)
- Triggered if patient has $\ge 1$ of:
  - Fever / COVID / Dengue / Typhoid in past 6 months
  - Crash diet / major weight loss
  - Recent surgery
  - High emotional stress / trauma
  - Postpartum $< 1$ year
- Characterized by: `Sudden excessive shedding` + `Diffuse thinning`.

### 3.3 PCOS & Endocrine Risk Triangulation
- If female AND ($\ge 2$ of: PCOS diagnosed, Irregular menstrual cycle, Adult acne, Excess facial/body hair) $\rightarrow$ High endocrine correlation flag.

---

## 4. State Management Architecture

A centralized React Context (`IntakeContext`) with a reducer pattern:
- `UPDATE_FIELD`: Updates specific question value.
- `BATCH_UPDATE`: Pre-fills multiple fields from NLP engine with visual animation triggers.
- `SET_CURRENT_STEP`: Manages linear or jumped navigation.
- `RESET_TO_PERSONA`: Injects predefined test case.
- `VALIDATE_FORM`: Returns validation status and missing field array.
