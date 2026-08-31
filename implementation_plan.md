# Implementation Plan: GenoRoot AI — Hair & Scalp Medical Intake

Build an intuitive, taste-driven, multimodal hair clinic medical intake web application designed for a real clinic patient (finishable effortlessly on both mobile and laptop by a 55-year-old), meeting all criteria from Haiku Studio's brief and the 16-question `intake-schema.json`.

---

## 1. UX & Product Design Principles

1. **How It Feels (Snappy & Obvious)**:
   - **Zero friction**: Big, accessible touch targets, clear typography, warm clinical luxury aesthetic (Aesop / Modern Dermatology style).
   - **Sub-2-minute completion**: Intelligent auto-advancing, smart defaults, conversational voice option, and interactive scalp visuals.
   - **Mobile-first & Desktop-optimized**: Responsive split layout on wide screens (Intake on left, Live Clinical Record & JSON on right) and fluid drawer/tabs on mobile.

2. **Taste in Decision-Making (Per-Question Tailored UX)**:
   - **Sex / Gender Handling (Q6 & Q7)**: Asked naturally in an initial welcome card ("Tell us about yourself: Name, Age, Biological Sex"). If Male, Q6 (Menstrual cycle) & Q7 (Pregnancy) are automatically set to `"Not applicable"` and gracefully skipped with visual feedback, eliminating awkwardness.
   - **Visual Scalp Norwood/Ludwig Scale (Q4)**: Illustrated interactive scalp diagrams alongside descriptive chips.
   - **Smart Inferences & Confirmations**:
     - Q1 (Age began) + Current Age $\rightarrow$ auto-infers Q2 (Duration).
     - Q3 (Family History) $\rightarrow$ "No known family history" mutually exclusive toggle.
     - Q11 (Habits) $\rightarrow$ Conditional sub-questions (e.g., smoking severity, salon treatment chips like Keratin/Rebonding) appear smoothly only when needed.
     - Q12 & Q13 (Products & Procedures Matrix) $\rightarrow$ Card-based progressive disclosure rather than a painful 20-cell table on mobile, with a 1-tap "None of these" button.
     - Q14 (Side Effects) $\rightarrow$ Pre-filled if user reported side effects in Q12.

3. **Ideas & Value Add (Beyond Requirements)**:
   - **"Express Pass" / Natural Voice & Hinglish Intake**: Speak or paste a free-flow narrative in English or Hinglish; the local NLP engine automatically pre-populates the 16-question schema in real time.
   - **Live Synchronized Doctor's EMR & Structured Schema Viewer**: Patient or reviewer can inspect the exact validated JSON and live Clinical Summary Note side-by-side.
   - **Trichologist Clinical Risk Scoring**: Computes genetic predisposition score, shedding urgency index, and flags contraindications.
   - **1-Click Reviewer Persona Presets**: Quick-load sample profiles (e.g., *Rahul, 32M with MPB & Minoxidil history*, *Priya, 28F with PCOS & Postpartum shedding*, *Vikram, 52M with Transplant query*) to test edge cases instantly.

4. **Resourcefulness & Architecture**:
   - Built with **Vite + React + TypeScript + TailwindCSS + Lucide Icons**.
   - Zero-dependency client-side NLP parser supporting English & Hinglish, with Web Speech API integration.
   - Complete unit & schema validation testing matching `intake-schema.json`.
   - Vercel/Netlify deployment ready with detailed README explaining all decisions.

---

## 2. Proposed Project Structure

```
haiku/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   └── schema.ts           # Exact 16-question schema matching intake-schema.json
│   ├── context/
│   │   └── IntakeContext.tsx   # Form state, validation, navigation, inference engine
│   ├── engine/
│   │   ├── nlpExtractor.ts     # Free-flow / Hinglish / voice narrative parser
│   │   ├── inferenceRules.ts   # Smart defaults, auto-calculations, skip-logic
│   │   └── clinicalScorer.ts   # Hair loss risk scoring & doctor SOAP summary
│   ├── components/
│   │   ├── Header.tsx          # Clinic branding, progress bar, audio toggle, persona picker
│   │   ├── StoryModeModal.tsx  # "Tell us in your own words" voice/text express intake
│   │   ├── QuestionCard/       # Tailored question components
│   │   │   ├── PersonalInfoStep.tsx
│   │   │   ├── SingleChoiceStep.tsx
│   │   │   ├── MultiChoiceStep.tsx
│   │   │   ├── ScalpPatternStep.tsx (Visual Norwood/Ludwig interactive selector)
│   │   │   ├── LifestyleHabitsStep.tsx
│   │   │   ├── TreatmentMatrixStep.tsx (Q12 & Q13 mobile-friendly cards)
│   │   │   ├── ConsentStep.tsx
│   │   │   └── ReviewStep.tsx
│   │   ├── ClinicalRecordView.tsx # Doctor's live view, SOAP notes, schema JSON output
│   │   └── Common/
│   │       ├── AudioVoiceButton.tsx
│   │       └── Tooltip.tsx
│   └── data/
│       ├── intakeSchema.json   # Reference schema
│       └── mockPersonas.ts     # Reviewer test presets
└── README.md                   # Comprehensive documentation for hiring team
```

---

## 3. Verification Plan

### Automated Verification
- Run TypeScript compiler check: `npx tsc --noEmit`
- Run Vite production build check: `npm run build`
- Validate schema output against `intake-schema.json` test suites

### Manual & Interactive Verification
- Test all 16 questions in step-by-step mode on desktop and simulated mobile viewport.
- Test Voice & Hinglish input parser with free-form sentences.
- Test male vs female flow (skipping Q6/Q7 for male vs presenting for female).
- Test treatment matrix collapsible card UI.
- Verify JSON export, SOAP doctor note generation, and 1-click persona loads.
