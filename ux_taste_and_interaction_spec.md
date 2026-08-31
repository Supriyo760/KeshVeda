# UX, Taste & Interaction Specification
## Project: GenoRoot AI — The Hair & Scalp Intake That Fills Itself

---

## 1. Aesthetic Direction & Design System

### 1.1 Visual Philosophy: "Warm Clinical Luxury"
Medical forms usually feel sterile, bureaucratic, or stressful. GenoRoot adopts an editorial, reassuring aesthetic inspired by high-end dermatology practices (warm oatmeals, deep forest greens, crisp sage accents, and polished brass highlights):

- **Color Palette**:
  - Primary / Accent: Deep Botanical Emerald (`#0F382C`) & Vibrant Sage (`#10B981` / `#059669`)
  - Backgrounds: Warm Canvas Light (`#FBF9F5`) / Modern Obsidian Dark (`#0F1412`)
  - Surface Cards: Pure Porcelain (`#FFFFFF`) with subtle shadow blur & 1px gentle border (`#E5E7EB`)
  - Text: High-contrast Charcoal (`#111827`) and muted clinical stone (`#6B7280`)
  - Alert / Accent: Warm Amber (`#F59E0B`) & Clinical Crimson (`#EF4444`)
- **Typography**:
  - Display / Headers: Playfair Display / Serif editorial (conveying clinical authority & empathy)
  - Body / UI: Plus Jakarta Sans / Inter (clean, geometric, ultra-legible at 18px on mobile)
- **Touch & Motion**:
  - Minimum touch target: 48px height x full width on mobile
  - Smooth spring transitions between steps (300ms ease-out)
  - Haptic-style visual feedback on selection (micro-scale bump, subtle glow)

---

## 2. Taste in Decision-Making: Per-Question UX Rationale

The take-home brief explicitly notes:
> *"How each question gets answered. Some are one tap, some are speech, some should be inferred from an earlier answer and just confirmed. Think per question, not one chat box for everything."*

Here is the deep UX rationale for each question:

| # | Question & Field | Chosen Interaction Pattern | Why This is the Right Decision for a Patient |
|---|---|---|---|
| **0** | **Patient Profile (Name, Age, Biological Sex)** | **Polite Greeting Card** with 1-tap sex pills (Male / Female / Prefer not to say) | Biological sex is strictly required for routing Q6 & Q7 without embarrassing male patients or asking irrelevant questions later. Gathering current age also enables automatic calculation of Q2 duration. |
| **1** | **`age_hair_loss_began`** | **Visual Number Stepper / Quick Decade Chips (e.g. 18, 25, 30, 40+) + Direct Input** | Patients easily remember approximate milestones. Big touch increments prevent clumsy mobile keyboard toggling. |
| **2** | **`duration`** | **Smart Auto-Inference with 1-Tap Confirmation** | If current age is 32 and onset was 31, the system pre-highlights `"6-12 months"`. The patient simply taps to confirm or adjust in < 1 second. |
| **3** | **`family_history`** | **Multi-Select Kinship Cards with Smart Mutual Exclusivity** | Large cards for Father, Mother, Siblings. Selecting `"No known family history"` immediately clears others and proceeds smoothly. |
| **4** | **`pattern`** | **Interactive Visual Scalp Selector (Norwood & Ludwig Diagrams)** | Patients struggle to describe hair loss in clinical terms. Showing clean, labeled scalp illustrations (Receding hairline, Crown thinning, Widening part, Diffuse shedding) makes identification instant and unambiguous. |
| **5** | **`diagnosed_conditions`** | **Multi-Chip Health Grid + "None" 1-Tap Clear** | Common endocrine and systemic triggers (PCOS, Thyroid, Anemia) with tooltips explaining relevance. Tapping `"None"` clears all selections. |
| **6** | **`menstrual_cycle`** | **Female-Only Step (Auto-skipped & marked "Not applicable" for Males)** | Eliminates irrelevant questions for male patients. For female patients, offers discreet, respectful single-tap cards (Regular / Irregular / Menopausal). |
| **7** | **`pregnancy_related`** | **Female-Only Step (Auto-skipped & marked "Not applicable" for Males)** | Crucial for identifying telogen effluvium post-pregnancy without cluttering the intake for others. |
| **8** | **`adult_acne_oily_skin`** | **1-Tap Binary Segmented Switch (Yes / No)** | Large horizontal pill with micro-haptic animation. |
| **9** | **`excess_body_facial_hair`** | **1-Tap Binary Segmented Switch (Yes / No)** | Paired with Q8 for assessing androgenic activity. Fast single-tap completion. |
| **10** | **`past_6_months`** | **Multi-Select Trigger Cards (Stress, COVID/Fever, Crash Diet, Surgery, Relocation)** | High visual distinction for acute physiological triggers that precipitate shedding. |
| **11** | **`habits`** | **Clean Segmented Lifestyle Cards with Progressive Sub-Disclosure** | Rather than a messy table, each habit is a clean row. Smoking expands only if "Yes" to select severity (<5, 5-10, >10/day). Salon treatments expands quick chips for "Keratin", "Rebonding", "Smoothening". |
| **12** | **`products`** | **Card-Based Progressive Disclosure Matrix** | Traditional 5-column matrix tables break on mobile screens. Each product (Minoxidil, Medicated Shampoos, Supplements, etc.) has a primary `"Have you used this?"` toggle. If No, it remains compact. If Yes, it smoothly unfolds Duration, Helped, and Side Effects. Includes a `"None of these"` quick button! |
| **13** | **`procedures`** | **Card-Based In-Clinic Procedure History** | PRP/GFC, Stem Cells, Transplant cards with simple session count selectors (1-3, 4-6, >6) and satisfaction indicator. |
| **14** | **`past_treatment_side_effects`** | **Cascading Auto-Fill + Voice / Text Dictation** | If the patient marked `side_effects: yes` on any product in Q12, this is automatically set to `Yes` and prompts for details with a quick voice mic button. |
| **15** | **`sample_type`** | **Visual Sample Cards (Saliva DNA / Blood Panel / Either)** | Clear icons illustrating non-invasive genetic swab vs blood draw. |
| **16** | **`consent`** | **Legal Medical Checkbox & 1-Tap Sign Off** | Compliant consent for genetic & diagnostic analysis before generating doctor review. |

---

## 3. The "Story Mode" (Conversational & Voice Narrative) Model

### 3.1 Interaction Flow
1. Patient can click **"🎙️ Tell us in your own words"** at any point.
2. Web Speech API activates with live waveform and real-time transcript streaming.
3. Natural Language Parser processes English, Hindi, and Hinglish phrasing.
4. Extracted data shows a **"Pre-filled summary"** banner with glowing green checks next to populated fields.
5. Patient is guided: *"We've filled 11 answers for you! Let's check the remaining 5."*

### 3.2 Supported Hinglish & Natural Language Examples
- *"Mujhe crown pe bal kam ho rahe hain 6 months se. Dad bhi bald the. Minoxidil 5% use kiya tha 3 months."*
  - $\rightarrow$ `age_hair_loss_began`: inferred, `duration`: "6-12 months", `pattern`: ["Thinning at crown"], `family_history`: ["Father had hair loss"], `products`: { "Topical Minoxidil": { used: true, duration: "3-6mo" } }
- *"Heavy hair fall after typhoid 2 months back, no family history, don't smoke, wash hair alternate days."*
  - $\rightarrow$ `past_6_months`: ["Fever with illness (COVID, Dengue, Typhoid)"], `family_history`: ["No known family history"], `habits`: { smoking: "no", hair_wash_frequency: "Alternate Days" }

---

## 4. Mobile vs Desktop Responsive Layout Strategy

- **Mobile Viewport (< 768px)**:
  - Top: Slim progress bar & voice assist button.
  - Center: Single focused question card with full-width tap targets.
  - Bottom: Floating action bar (Back, Skip/Next, and a swipeable drawer handle for "Live Doctor Preview").
- **Desktop Viewport (>= 1024px)**:
  - Left (60% width): Elegant focused intake card stream with smooth transitions.
  - Right (40% width): Live Clinic EMR panel showing real-time validated JSON schema, Trichologist Risk Score, and automated SOAP doctor note.
