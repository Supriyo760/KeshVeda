# KeshVeda — Hair & Scalp Clinic Intake

> **Haiku Studio Founding Full Stack Engineer Take-Home**  
> A 16-question clinical intake for a hair & scalp clinic. Designed for a 55-year-old on a phone. The only fixed thing is the output: a fully structured doctor-ready schema. Everything else was a design decision.

- **Live**: [https://kesh-veda.vercel.app](https://kesh-veda.vercel.app)
- **Repo**: [https://github.com/Supriyo760/KeshVeda](https://github.com/Supriyo760/KeshVeda) · invited `nikhil@thevectorlabs.in`

---

## How to Run

```bash
git clone https://github.com/Supriyo760/KeshVeda.git
cd KeshVeda
npm install
npm run dev        # development server at localhost:5173
npm run build      # production bundle (validates TypeScript + Vite)
```

No environment variables. No API keys. Runs entirely offline.

---

## My Choices

### Models & Services

**No external AI model was used at runtime.** I made this choice deliberately:

- A clinic waiting room needs sub-100ms responses. Any cloud LLM round-trip would add 1–3 seconds of latency per question.
- Patients in a waiting room may be on a slow mobile network.
- HIPAA-adjacent data should not leave the device if avoidable.

Instead I built a **client-side rule-based NLP extractor** (`src/engine/nlpExtractor.ts`) that parses conversational English and Hinglish using regex rules and a dictionary. It runs in ~10ms, works offline, and extracts 10+ clinical entities from a single typed or dictated sentence.

For the **Story Mode Pass** (free-text/voice shortcut), I used the browser's native **Web Speech API** for dictation — no cloud transcription service, no cost.

### Bought vs. Built

| What | Decision | Reason |
|---|---|---|
| UI component library | **Built from scratch** (TailwindCSS + Lucide icons) | No component library fits a clinical luxury aesthetic out of the box. Every question card needed custom interaction design. |
| NLP / entity extraction | **Built** (regex + rules) | Zero latency, zero API keys, works offline, no vendor lock-in. |
| Voice transcription | **Browser Web Speech API** (free, built-in) | No setup, no cost. Works in Chrome on both phone and laptop. |
| Deployment | **Vercel** (free tier, zero config) | Push to main → live in 30 seconds. |
| Schema validation | **TypeScript types** matching `intake-schema.json` exactly | Build-time correctness: if a field is missing or typed wrong, `tsc` fails before deployment. |
| Scalp pattern illustrations | **Built** (custom SVG descriptions via Lucide + CSS) | Required per-patient visual recognition aid. No stock asset matched the clinical requirement. |

### How I Tested the Fill

1. **TypeScript compile-time**: The entire `intake` state tree is typed directly against the `intake-schema.json` contract. Any missing or mistyped field is a compiler error, caught before `git push`.

2. **Three test personas** built into the app (top-right "Test Personas" button):
   - **Rahul, 32M** — classic male pattern baldness, Minoxidil user, family history. Tests that Q6 (menstrual cycle) and Q7 (pregnancy) are auto-skipped and marked `null` for male patients.
   - **Priya, 28F** — PCOS, postpartum shedding, post-COVID trigger. Tests female-specific branches, hormone fields, trigger cascade.
   - **Vikram, 55M** — advanced chronic loss, smoker, 6 PRP sessions. Tests progressive sub-disclosure on lifestyle habits and procedure matrix.

3. **Cross-field logic verification**:
   - Onset age + current age → duration auto-calculated (if onset 28, age 30 → `"1-2 years"` pre-selected).
   - `"No known family history"` clears all relative chips (mutual exclusivity).
   - Product side effects in Q12 cascade into Q14 auto-flag.
   - Male sex → Q6/Q7 steps removed from the step list, fields set to `null`.

4. **JSON schema export**: The live Doctor EMR panel has a `JSON Schema` tab that renders the raw structured output. I validated this manually against `intake-schema.json` for all three personas.

---

## What I Would Do with One More Week

**1. Scalp photo grading (highest clinical value)**  
Let the patient take 3 photos (frontal hairline, crown, part line) from their phone camera. Run a lightweight vision model (e.g. MobileNet fine-tuned on a Norwood/Ludwig dataset) to auto-grade hair loss stage and shaft density. The patient taps one confirmation; the doctor gets a machine-graded severity score alongside the intake.

**2. Real LLM integration for the narrative field**  
Replace the regex NLP extractor with a small, fast model (GPT-4o-mini or Gemini Flash) called once on the Story Mode narrative. This unlocks proper handling of ambiguous descriptions ("mera hair thoda patla ho gaya hai") that rules miss.

**3. EHR push via FHIR**  
One API call to push the structured intake as a FHIR `QuestionnaireResponse` resource into the clinic's system (Practo, Epic, or a homegrown webhook). The doctor sees it in their existing workflow with zero copy-paste.

**4. Receptionist queue dashboard**  
A second route (`/staff`) showing a live waiting room table: patient name, intake % complete, triage risk flags, time in queue. Gives the front desk an at-a-glance view before the doctor walks in.

**5. Proper automated test suite**  
Replace manual persona testing with Playwright end-to-end tests that assert field values in the JSON output after each persona run. Run in CI on every push.

---

**Author**: Supriyo ([@Supriyo760](https://github.com/Supriyo760))  
**Submitted for**: Haiku Studio Founding Full Stack Engineer Challenge
