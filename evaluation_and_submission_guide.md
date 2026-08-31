# Evaluation, Submission & Video Walkthrough Guide
## Project: GenoRoot AI — The Hair & Scalp Intake That Fills Itself

---

## 1. Direct Alignment with Haiku Studio Evaluation Criteria

| Criteria | How GenoRoot Delivers Full Points |
|---|---|
| **1. How it feels** | • Snappy, responsive, finishable by a 55-year-old on a phone in < 90 seconds.<br/>• Large 48px+ touch targets, 0 cognitive friction, micro-haptic visual feedback.<br/>• Zero medical jargon with gentle tooltips (e.g. PRP explained in plain words). |
| **2. Taste in decisions** | • Per-question tailored UX: Visual Norwood/Ludwig diagrams for patterns (Q4), auto-calculating duration from age (Q2), progressive disclosure cards for treatment matrices (Q12, Q13) instead of cramped mobile tables.<br/>• Biological sex asked naturally in welcome card to auto-handle Q6 & Q7 without embarrassing male patients.<br/>• Treatment side-effects automatically cascade to Q14. |
| **3. Ideas (Value add)** | • **"Story Mode / Express Pass"**: Free-form voice/text intake in English & Hinglish that fills 10+ questions at once.<br/>• **Live Doctor EMR View**: Real-time SOAP note compiler & Clinical Risk Scoring (Androgenetic Alopecia risk, Telogen Effluvium index, PCOS flags).<br/>• **1-Click Reviewer Persona Injector**: Test Rahul, Priya, or Vikram in 1 second. |
| **4. Resourcefulness** | • Instant client-side NLP rule engine that works 100% offline with zero external API key requirements.<br/>• Built on modern Vite + React + TypeScript + TailwindCSS for ultra-fast load times and static deployability (Vercel/Netlify).<br/>• Complete schema validation matching `intake-schema.json`. |

---

## 2. 2-Minute Screen Recording Script (For Your Video Submission)

Use this structured script when recording your 2-minute walkthrough video:

### [0:00 - 0:25] Introduction & The Core Philosophy
> *"Hi Haiku team! This is GenoRoot — an intake built on one simple premise: the software does the work, so the human gets the outcome. We designed this to be effortless for a 55-year-old sitting in a clinic waiting room on their phone, while giving the doctor a complete, structured medical record before the patient even walks in."*

### [0:25 - 0:55] Decision 1: Per-Question UX Taste & Smart Inferences
*(Demonstrate the Step-by-Step Flow)*
> *"First decision: We avoided a generic chatbot and tailored each question individually. Notice how:
> 1. We ask biological sex upfront so male patients never see female-only questions like menstrual cycles, which are automatically set to 'Not applicable'.
> 2. Entering age 32 and onset at 31 auto-calculates and pre-selects the duration.
> 3. For hair patterns, we don't ask patients to decipher clinical terms — we show interactive visual scalp illustrations.
> 4. For treatment tables in Q12 and Q13, instead of a broken 20-cell table on mobile, we use 1-tap expandable cards with a 'None of these' fast pass."*

### [0:55 - 1:30] Decision 2: The "Express Pass" & Hinglish Voice Engine
*(Click the "Voice Story Mode" button and demonstrate speaking / pasting Hinglish text)*
> *"Second decision: For patients who prefer speaking, we built 'Story Mode'. A patient can speak or type naturally in English or Hinglish:
> 'Dad ka hair loss tha, crown pe thinning ho rahi hai 6 months se, used Minoxidil 5% for 3 months.'
> Watch how our local NLP engine parses this instantly, auto-fills 11 questions with green badges, and lets the patient finish in 30 seconds."*

### [1:30 - 1:55] Decision 3: Live Doctor EMR & Clinical Synthesis
*(Highlight the right-hand Doctor EMR View / mobile drawer)*
> *"Third decision: On the clinic side, the doctor gets a live structured SOAP note, an Androgenetic Alopecia genetic risk score, and Telogen Effluvium urgency flags — plus the exact 16-question JSON matching `intake-schema.json` ready for 1-click export."*

### [1:55 - 2:00] Conclusion
> *"Everything runs client-side with zero latency and 100% offline resilience. Thank you!"*

---

## 3. "What We Would Do with One More Week"

If given one additional week of engineering and clinical product time:
1. **Multimodal Scalp Photo Diagnostic AI**: Allow the patient to snap 3 quick phone photos (Frontal hairline, Vertex/Crown, and Part line); use a lightweight computer vision model to automatically grade Norwood/Ludwig stage and hair density.
2. **Direct EHR / FHIR / EMR Integration**: Bi-directional webhook syncing into clinic management systems (AthenaHealth, Epic, Practo, or custom clinic CRM) with real-time patient queue status.
3. **Conversational Audio Voice Copilot**: Real-time duplex voice streaming using WebRTC with natural turn-taking and Hindi/Tamil/Telugu/English dialect adaptation.
4. **Clinic Receptionist Tablet Dashboard**: A live waiting room dashboard showing all arriving patients, their completion progress, and automated triage alerts.
