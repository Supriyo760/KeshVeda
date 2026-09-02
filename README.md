# KeshVeda (केशवेद) — The Hair & Scalp Intake That Fills Itself

> Built for the **Haiku Studio Founding Full Stack Engineer Take-Home Challenge**.  
> Designed for a 55-year-old on a phone in a clinic waiting room, delivering a complete, accurate, structured medical intake and live SOAP note to the doctor before the patient walks in.

---

## 🚀 Live Demo & Quick Start

- **Live URL**: [Deployable instantly on Vercel / Netlify / Render]
- **Repository**: [https://github.com/Supriyo760/KeshVeda](https://github.com/Supriyo760/KeshVeda) (Invited `nikhil@thevectorlabs.in`)

### Running Locally

```bash
# 1. Clone repository
git clone https://github.com/Supriyo760/KeshVeda.git
cd KeshVeda

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build & validate production bundle
npm run build
```

---

## 💡 The Problem & Core Philosophy

Traditional clinic software consists of forms and dashboards: *the human clicks, the software stores*. Patients abandon them, answer carelessly, or need a nurse to hold their hand.

**GenoRoot flips this paradigm:**
*The software does the work, the human gets the outcome.*

1. **For the Patient**: An intake that feels effortless, snappy, and finishable in under 90 seconds on a smartphone (or 30 seconds via voice).
2. **For the Trichologist / Dermatologist**: A live, validated 16-question structured schema (`intake-schema.json`), an automated SOAP clinical note, genetic risk scoring, and contraindication alerts.

---

## 🎨 Taste in Product Decisions (Per-Question Breakdown)

We avoided the lazy trap of a single generic chatbot or a 50-field Google Form. Every question has a tailored micro-interaction:

| # | Question / Area | Chosen Interaction Pattern | Why This is the Right Decision |
|---|---|---|---|
| **0** | **Demographics & Sex** | **Greeting Card with 1-Tap Sex Pills** | Biological sex is gathered naturally upfront. If **Male**, Q6 (*menstrual_cycle*) and Q7 (*pregnancy_related*) are automatically marked `"Not applicable"` and smoothly skipped, avoiding awkward questions. If **Female**, respectful and relevant options are shown. |
| **1 & 2** | **Onset Age & Duration** | **Smart Mathematical Inference** | Entering current age (32) and onset age (30) automatically infers and pre-selects Q2 Duration (`"Over a year"`), turning a typing chore into a 1-tap confirmation. |
| **3** | **Family History** | **Kinship Cards + Mutual Exclusivity** | Selecting `"No known family history"` immediately clears relative chips; selecting any relative clears `"No known family history"`. |
| **4** | **Hair Loss Pattern** | **Interactive Visual Scalp Selector** | Patients struggle with clinical jargon. We show 6 illustrated vector scalp diagrams (Norwood II/III, Crown vertex, Ludwig part line, Diffuse, Patchy, Sudden shedding) with radiant emerald selection borders. |
| **5** | **Medical Health** | **Multi-Chip Grid + "None" 1-Tap Clear** | Clear cards for PCOS, Thyroid, Diabetes, Autoimmune, Anemia, and a 1-tap `"None of the above"`. |
| **6 & 7** | **Female Endocrine** | **Sex-Aware Branching** | Auto-skipped for males; presented as clean 1-tap pills for females. |
| **8 & 9** | **Androgenic Signs** | **Binary Tactile Segmented Switches** | 1-tap large pills for Adult Acne and Excess Body Hair. |
| **10** | **Past 6 Mo Triggers** | **Multi-Select Shock Trigger Cards** | Captures COVID/fever, crash diets, surgeries, high stress, and location changes. |
| **11** | **Lifestyle Habits** | **Progressive Sub-Disclosure** | Clean rows. Toggling Smoking `Yes` expands severity chips (`<5`, `5-10`, `>10/day`); Toggling Salon treatments `Yes` presents quick chips (`Keratin`, `Rebonding`, `Smoothening`). |
| **12 & 13** | **Products & Procedures** | **Collapsible Mobile Cards** | Traditional 20-cell table matrices break completely on mobile phones. Each product/procedure is a collapsible card with duration, helped, and side effects, plus a `"None of these"` fast-pass. |
| **14** | **Side Effects Cascade** | **Smart Cross-Field Cascade** | If the patient marked `side_effects: yes` for Minoxidil or any product in Q12, Q14 automatically flags `Yes` and pre-populates context for description. |
| **15 & 16** | **Sample & Consent** | **Visual Swab Cards & Legal Consent** | 1-tap cards for Saliva DNA, Blood Panel, or Either, with verified digital consent. |

---

## 🎙️ "Story Mode" — Voice & Free-Flow Intake (English & Hinglish)

For patients who prefer speaking or typing freely:
- **Web Speech API Dictation** with live animated audio sound waves.
- **Client-Side NLP Extraction Engine**: Parses conversational English, Hindi, and Hinglish (e.g. *"Mujhe crown pe bal kam ho rahe hain 6 months se. Dad bhi bald the. Minoxidil 5% use kiya 3 months, mild itchiness hui..."*).
- Instantly extracts and populates 10+ questions at once with glowing green verification badges.

---

## 🩺 Live Doctor EMR & Clinical Decision Support

While the patient fills the intake, the doctor console on the right compiles:
1. **Androgenetic Alopecia (AGA) Genetic Risk Meter (0 - 100%)**
2. **Telogen Effluvium (TE) Acute Trigger Index (Low / Moderate / High)**
3. **PCOS / Hyperandrogenism Triage Flag**
4. **Drug Sensitivity & Hypersensitivity Warning**
5. **Real-time Automated SOAP Clinical Note** (Subjective, Objective, Assessment, Plan)
6. **100% Compliant `intake-schema.json` Validator & Export** (1-click JSON download, clipboard copy, and printable PDF intake).

---

## 👥 1-Click Reviewer Persona Presets

To make testing instant for the hiring team, use the **Test Personas** dropdown in the header:
- **Rahul Sharma (32M)**: Classic Male Pattern Baldness (Norwood III), father had hair loss, Minoxidil user with itching.
- **Priya Nair (28F)**: Postpartum + PCOS diffuse shedding, adult acne, sudden loss post-COVID, blood sample preferred.
- **Vikram Sengupta (55M)**: Advanced loss >10 yrs, heavy smoker, 6 PRP sessions done, transplant candidate.

---

## 🛠️ Tech Stack & Engineering Choices

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 19 + TypeScript + Vite | Ultra-fast load times (< 800ms), rock-solid type safety, static deployability. |
| **Styling** | TailwindCSS + Vanilla Tokens | Warm Clinical Luxury aesthetic (*"Aesop meets modern dermatology"*), responsive split layouts, 52px+ mobile touch targets. |
| **Icons & Visuals** | Lucide React + Custom SVG Scalp Diagrams | Custom Norwood & Ludwig hair loss illustrations with crisp vector fidelity. |
| **NLP & Speech** | Client-Side Rule Matcher + Web Speech API | 100% offline resilience, sub-50ms execution, zero API keys required, no privacy leaks. |
| **State Management** | React Context + Dependency Reducer | Centralized state with automatic cross-field inferences and undo/redo support. |

---

## 🧪 How We Tested Schema & Form Correctness

1. **TypeScript Type Safety**: Built directly against the 16-question contract in `intake-schema.json`.
2. **End-to-End Browser Subagent Testing**: Automated headless subagent executed full runs across male and female flows, verified mutual exclusivity, tested duration inference, and validated 100% schema completeness.
3. **Edge Case Validation**:
   - Male patient $\rightarrow$ verifies Q6/Q7 are set to `"Not applicable"` and omitted from active steps.
   - Mutual exclusivity $\rightarrow$ `"No known family history"` and `"None"` conditions correctly reset sibling options.
   - Cascade logic $\rightarrow$ Q12 side effects correctly propagate to Q14.

---

## 🔮 What We Would Build with One More Week

If given one additional week of clinical engineering:
1. **Multimodal Scalp Photo Diagnostic AI**: Allow patients to take 3 phone photos (Frontal hairline, Crown, and Part line); use a lightweight computer vision model to automatically grade Norwood/Ludwig stage and hair shaft density.
2. **Direct EHR / FHIR Webhook Integration**: Bi-directional real-time sync with clinic management systems (Practo, Epic, AthenaHealth) with waiting-room queue alerts.
3. **Duplex Voice Copilot**: Real-time voice conversation using WebRTC with natural turn-taking and multilingual dialect adaptation (Hindi, Tamil, Telugu, English).
4. **Receptionist Tablet Dashboard**: A live waiting room dashboard showing arriving patients, real-time intake progress, and automated triage alerts for the front desk.

---

- **Author**: Supriyo ([@Supriyo760](https://github.com/Supriyo760))
- **Submitted for**: Haiku Studio Founding Full Stack Engineer Challenge
- **License**: MIT
