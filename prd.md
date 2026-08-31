# Product Requirements Document (PRD)
## Project: GenoRoot AI — The Hair & Scalp Intake That Fills Itself

---

## 1. Executive Summary & Problem Definition

### 1.1 The Context
At modern hair and scalp clinics, patients undergo a 16-question medical intake before their clinical consultation. Today, this process is plagued by:
- **Paper forms & clumsy typing**: High friction, illegible handwriting, and tedious data entry by clinic staff.
- **Form abandonment & careless answering**: Patients rush through complex checkboxes, skip critical medical history (such as thyroid or past Minoxidil side effects), or require a nurse to handhold them through technical terms.
- **Legacy UI paradigm failure**: Traditional software treats the patient as a data-entry clerk (clicking 40+ dropdowns), rather than doing the cognitive work for the human.

### 1.2 The Vision
**"The software does the work, the human gets the outcome."**
The outcome is a doctor who receives a complete, accurate, structured clinical intake and triage note before the patient walks into the consultation room — while the patient feels they barely filled anything at all.

---

## 2. Target Users & Personas

| User Persona | Profile & Context | Core Needs & Constraints |
|---|---|---|
| **1. The Patient (e.g., 55-year-old on Mobile)** | Non-technical, opening the clinic link on a smartphone while sitting in the waiting area. | Large, readable fonts (18px+), zero medical jargon, tap-first micro-cards, zero typing friction, high contrast, smooth voice input option. |
| **2. The Young Professional (e.g., 29-year-old on Laptop)** | Tech-savvy, wants to express their hair loss story quickly in their own words (English or Hinglish). | "Tell us in your own words" Voice/Express Pass mode that auto-fills 80% of the intake in 30 seconds; visual scalp pattern selector. |
| **3. The Consulting Trichologist / Dermatologist** | Reviewing intake data 60 seconds before patient consultation. | Instant SOAP summary note, high-risk clinical alerts (e.g., Telogen Effluvium trigger post-fever, Minoxidil flaking, PCOS flags), 100% compliant structured JSON matching `intake-schema.json`. |
| **4. The Hiring Reviewer / Evaluator** | Evaluating product taste, UX finesse, speed, and architectural resourcefulness. | 1-click test persona injectors, live side-by-side doctor EMR view, instant schema validator, crisp README explaining design decisions. |

---

## 3. Core Product Features & Scope

### 3.1 Multimodal Input Modes
1. **Adaptive Tap-First Flow**:
   - Single-tap selection with auto-advancement where appropriate.
   - Micro-animations for high perceived performance.
   - Interactive visual scalp selector (Norwood / Ludwig scales).
   - Collapsible, card-based product and procedure history (no 20-cell mobile table traps).
2. **Express Pass / Story Mode (Voice & Hinglish Narrative)**:
   - Patient speaks or types freely (e.g., *"Dad ka hair loss tha, 6 months se crown pe ho raha hai, Minoxidil 5% use kiya 3 mahine"*).
   - Real-time client-side NLP parses and populates matching fields with glowing confirmation badges.
   - Seamlessly transitions to review & confirm remaining fields.

### 3.2 Dynamic Question Dependency & Inference Engine
- **Upfront Patient Profiling**: Gathers Name, Age, and Biological Sex naturally.
  - *If Male*: Automatically marks Q6 (*menstrual_cycle*) and Q7 (*pregnancy_related*) as `"Not applicable"` and cleanly skips them.
  - *If Female*: Displays polite, considerate questions for menstrual cycle and postpartum timing.
- **Smart Duration Inference**: If Age hair loss began (Q1) is 31 and current age is 32, Q2 (*duration*) is automatically calculated and pre-selected as `"6-12 months"`.
- **Mutual Exclusivity Enforcement**: Selecting `"No known family history"` unchecks other relatives; selecting `"None"` in diagnosed conditions clears other items.
- **Treatment Side-Effects Cascade**: If any product in Q12 reports `side_effects: yes`, Q14 (*past_treatment_side_effects*) is automatically toggled to `yes` with prompt context pre-filled.

### 3.3 Live Doctor Clinical View & Decision Support
- **Dual-view split screen** (Intake UI on left, Live EMR & Clinical Score on right for desktop; fluid floating drawer on mobile).
- **Automated Clinical SOAP Note**:
  - **S**: Subjective patient narrative & chief complaint.
  - **O**: Chronological history, family pedigree, treatment trials.
  - **A**: Clinical differential (Androgenetic Alopecia, Telogen Effluvium, Hormonal Alopecia).
  - **P**: Suggested trichoscopy targets & sample collection recommendation.
- **Clinical Risk Indicators**:
  - Genetic Predisposition Score (High / Moderate / Low).
  - Shedding Urgency Index (Acute TE vs Chronic AGA).
  - Hormonal / PCOS Triage Flag.
  - Drug Sensitivity & Side Effect Alerts.

### 3.4 Data Export & Compliance
- Full conformity to `intake-schema.json`.
- 1-click JSON download & copy-to-clipboard.
- Printable / PDF-ready Doctor Clinical Summary report.

---

## 4. Non-Functional Requirements

| Metric | Requirement | Justification |
|---|---|---|
| **Speed & Latency** | < 100ms UI interaction latency; < 300ms NLP extraction speed | Zero lag ensures snappy, native-app feel. |
| **Accessibility (a11y)** | WCAG 2.1 AA compliant, 48px+ minimum touch targets, high contrast text | Essential for a 55-year-old patient on mobile. |
| **Offline Capability** | 100% functional client-side NLP and state management | Works reliably in clinic waiting rooms with spotty cellular Wi-Fi. |
| **Zero Privacy Leakage** | All processing is local by default; no real PII stored; no API keys in repository. | Strict medical privacy and hiring test compliance. |
| **Browser Support** | Chrome, Safari (iOS), Edge, Firefox across mobile, tablet, and desktop. | Clinic patients use diverse mobile devices. |

---

## 5. Success Metrics & Evaluation Criteria

1. **Completion Time**: Average completion time < 90 seconds in tap mode, < 40 seconds in Express Pass story mode.
2. **Abandonment Rate**: < 2% simulated drop-off due to zero confusing jargon and progressive disclosure.
3. **Form Correctness**: 100% schema validation score against all 16 fields in `intake-schema.json`.
4. **Perceived Delight & Taste**: Measured by intuitive question tailoring, rich typography, smooth transitions, and high-value clinical insights.
