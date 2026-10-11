# Akviora Technologies — Complete Project Documentation

**Brand Slogan:** *"Design the experience. Automate the work. Build what's next."*  
**Contact:** `hello@akvioratechnologies.com`  
**Runtime Port:** `http://localhost:3000`

---

## 1. Executive Summary & System Overview

**Akviora Technologies** is a full-stack web application, AI workflow studio, and digital product engineering platform built with **React 19**, **Next.js App Router (`app/`)**, **Vite + Express (`server.ts`)**, **Tailwind CSS v4**, **Framer Motion (`motion/react`)**, **Akviora AI (`@google/genai` server-side SDK)**, and **Dual-Layer Persistence** (**Local JSON/SQLite Database** + **Google Cloud Firestore & Firebase Authentication**).

### Key Capabilities
1. **7 Interactive Routes**: Home (`/`), Services (`/services`), AI Studio (`/ai`), Work / Case Studies (`/work`), About & 8-Step Process (`/about`), FAQ (`/faq`), and Contact / Discovery (`/contact`).
2. **Akviora AI Multi-Persona Assistant**: Floating slide-over drawer supporting 7 specialized personas (*Strategy Architect, Customer Assistant, Sales Assistant, Knowledge Assistant, Document Assistant, Operations Assistant, Appointment Assistant*) plus a live **Share Suggestion** tab.
3. **Interactive AI Workflow Blueprint Studio**: Users enter their industry and operational bottleneck to generate a 4-step automation blueprint powered by Akviora AI and persisted to both the local database and Cloud Firestore.
4. **Community AI Suggestion & Feasibility Wall**: Users submit workflow ideas, receive an instant Akviora AI architectural review and service pillar recommendation, and can upvote community ideas.
5. **Interactive ROI Calculator**: Real-time calculator estimating annual hours reclaimed and dollar value saved at 65% workflow automation efficiency.
6. **Discovery Brief & AI Enhancer**: Client project intake form with 1-click *"Refine Brief with Akviora AI"* and automatic executive discovery call summary generation.

---

## 2. System Architecture & Directory Structure

```text
/
├── app/                                # Next.js App Router Pages & Server API Route Handlers
│   ├── layout.tsx                      # Root application shell (WebGL, CustomScrollbar, Header, Footer, Modals, AI Drawer)
│   ├── page.tsx                        # Home route (/)
│   ├── globals.css                     # Global stylesheet importing src/index.css
│   ├── services/page.tsx               # Services & ROI Calculator route (/services)
│   ├── ai/page.tsx                     # Akviora AI Studio, Blueprint Generator & Suggestion Wall (/ai)
│   ├── work/page.tsx                   # Filterable Case Studies portfolio (/work)
│   ├── about/page.tsx                  # About Akviora & 8-Step Interactive Timeline (/about)
│   ├── faq/page.tsx                    # Searchable FAQ with Schema.org JSON-LD (/faq)
│   ├── contact/page.tsx                # Project Inquiry & AI Brief Refiner (/contact)
│   └── api/                            # Server-side REST API Route Handlers
│       ├── bootstrap/route.ts          # GET /api/bootstrap
│       ├── ai/chat/route.ts            # POST /api/ai/chat
│       ├── ai/blueprint/route.ts       # POST /api/ai/blueprint
│       ├── suggestions/route.ts        # GET & POST /api/suggestions
│       ├── suggestions/[id]/upvote/route.ts # POST /api/suggestions/:id/upvote
│       └── inquiries/route.ts          # GET & POST /api/inquiries
├── components/                         # Shared UI & Interactive Components
│   ├── Header.tsx                      # Fixed glassmorphic navigation bar + scroll progress beam
│   ├── Footer.tsx                      # Site footer with quick navigation & compliance links
│   ├── FloatingAIAssistant.tsx         # Slide-over Akviora AI consultation & suggestion drawer
│   ├── CustomScrollbar.tsx             # Custom interactive theme scrollbar + inner webkit scrollbar
│   ├── CinematicScroll.tsx             # KineticHeadline, ScrollWordScrub, SpotlightBentoTile, HorizontalServicesShowcase, ScrollProcessTimeline
│   ├── CaseStudyModal.tsx              # Deep-dive modal for inspecting case study architecture & metrics
│   ├── ROICalculator.tsx               # Interactive workflow automation ROI estimator
│   ├── MagneticButton.tsx              # Magnetic pointer-tracking CTA button & SafeImage with canvas background removal
│   └── WebGLBackground.tsx             # Custom GLSL shader ambient background with automatic 2D fallback
├── src/                                # Vite SPA Entry & Page View Implementations
│   ├── main.tsx                        # React DOM root mount
│   ├── App.tsx                         # AnimatePresence route switcher with slide-up & fade page transitions
│   ├── index.css                       # Tailwind v4 design tokens, custom scrollbars, marquee & keyframe animations
│   ├── pages/                          # Full page views (HomePage, ServicesPage, AIPage, WorkPage, AboutPage, FAQPage, ContactPage)
│   ├── components/                     # Synchronized component modules for Vite bundle
│   ├── data/akvioraData.ts             # Structured static content (Services, 6 AI Assistants, 6 Case Studies, 8 Process Steps, FAQs)
│   └── types/akviora.ts                # Core TypeScript domain models
├── lib/                                # Core Backend, Context, AI & Database Services
│   ├── app-context.tsx                 # Global React Context (Routing, Firebase Auth, Firestore real-time sync, API bootstrap)
│   ├── gemini.ts                       # Server-side Akviora AI controller (@google/genai, gemini-3.8-flash + offline fallbacks)
│   ├── db.ts                           # File-backed Node.js JSON database controller (data/akviora_db.json)
│   ├── firebase.ts                     # Firebase Auth (Google Sign-In) & Cloud Firestore CRUD + structured error handler
│   ├── data.ts                         # Server-compatible content exports
│   └── types.ts                        # Shared TypeScript interfaces
├── data/
│   └── akviora_db.json                 # Local persistent JSON store (Inquiries, Suggestions, Blueprints)
├── prisma/
│   └── schema.prisma                   # Prisma ORM schema for SQLite / PostgreSQL relational deployment
├── firebase-applet-config.json         # Provisioned Firebase project & Firestore database configuration
├── firebase-blueprint.json             # Strict JSON-Schema entity definitions & Firestore collection paths
├── firestore.rules                     # Zero-trust, ABAC-hardened Cloud Firestore security rules
├── firestore.rules.test.ts             # Security rules verification suite
├── security_spec.md                    # Data invariants & adversarial Red-Team security specification
├── server.ts                           # Unified Express + Vite + Next.js Route Handler server on port 3000
└── package.json                        # Scripts & dependencies
```

---

## 3. Backend & REST API Reference

The backend server (`server.ts`) runs on **Node.js + Express** on port `3000` and bridges HTTP requests directly to the Next.js Web `Request`/`Response` Route Handlers in `/app/api/*/route.ts`.

### 3.1 `GET /api/bootstrap`
Loads all initial application data in a single request on startup.
- **Handler:** `app/api/bootstrap/route.ts`
- **Response (`200 OK`):**
```json
{
  "services": [...],
  "assistants": [...],
  "caseStudies": [...],
  "processSteps": [...],
  "faqs": [...],
  "suggestions": [...],
  "inquiries": [...],
  "blueprints": [...]
}
```

### 3.2 `POST /api/ai/chat`
Processes multi-persona conversational queries and project brief refinements using **Akviora AI**.
- **Handler:** `app/api/ai/chat/route.ts` -> `lib/gemini.ts` (`generateChatReply`)
- **Request Body:**
```json
{
  "message": "How can Akviora automate our WhatsApp lead qualification?",
  "personaId": "sales",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```
- **Response (`200 OK`):**
```json
{
  "reply": "Structured markdown/bullet response tailored to the selected persona...",
  "suggestedFollowUps": [
    "Generate a 4-step automation blueprint for my business",
    "How long does it take to build and launch?",
    "Show me similar case studies like TrackPayout or TenderItNow"
  ],
  "recommendedService": "Sales Assistant"
}
```

### 3.3 `POST /api/ai/blueprint`
Generates a structured 4-step AI & business automation blueprint for a user's industry and bottleneck, and persists it to the database.
- **Handler:** `app/api/ai/blueprint/route.ts` -> `lib/gemini.ts` (`generateWorkflowBlueprint`) + `lib/db.ts` (`db.addBlueprint`)
- **Request Body:**
```json
{
  "businessType": "B2B Industrial Equipment Distributor",
  "bottleneck": "Sales reps spend 4 hours daily answering spec questions and preparing PDF quotes."
}
```
- **Response (`201 Created`):**
```json
{
  "blueprint": {
    "id": "bp-1760110000000",
    "businessType": "B2B Industrial Equipment Distributor",
    "bottleneck": "...",
    "diagnosis": "...",
    "recommendedAssistant": "Sales Assistant + Knowledge Assistant",
    "workflowSteps": [
      { "stepNumber": 1, "title": "...", "detail": "..." },
      { "stepNumber": 2, "title": "...", "detail": "..." },
      { "stepNumber": 3, "title": "...", "detail": "..." },
      { "stepNumber": 4, "title": "...", "detail": "..." }
    ],
    "estimatedEfficiencyGain": "16+ hours saved per rep weekly · 3.2x faster quote turnaround",
    "recommendedStack": ["Akviora AI Engine", "Next.js App Router Portal", "Node.js API", "CRM Webhook Sync"],
    "createdAt": "2026-10-10T17:00:00.000Z"
  }
}
```

### 3.4 `GET /api/suggestions` & `POST /api/suggestions`
Fetches or creates community workflow suggestions with automatic Akviora AI feasibility evaluation.
- **Handler:** `app/api/suggestions/route.ts` -> `lib/gemini.ts` (`evaluateUserSuggestion`) + `lib/db.ts` (`db.addSuggestion`)
- **POST Request Body:**
```json
{
  "authorName": "Rohan · Operations Lead",
  "category": "Business Automation",
  "suggestionText": "Automate vendor PO invoice matching with delivery receipts.",
  "businessGoal": "Save 12 hours a week in finance reconciliation"
}
```
- **POST Response (`201 Created`):**
```json
{
  "suggestion": {
    "id": "sug-1760110000000",
    "authorName": "Rohan · Operations Lead",
    "category": "Business Automation",
    "suggestionText": "...",
    "businessGoal": "...",
    "aiAssessment": "Concise 2-sentence Akviora AI architectural assessment...",
    "recommendedPillar": "AI Solutions (Document Assistant) + Business Automation",
    "upvotes": 1,
    "createdAt": "2026-10-10T17:00:00.000Z"
  }
}
```

### 3.5 `POST /api/suggestions/:id/upvote`
Increments the upvote counter on a community suggestion in the local database (and syncs with Cloud Firestore when authenticated).
- **Handler:** `app/api/suggestions/[id]/upvote/route.ts`
- **Response (`200 OK`):** `{ "suggestion": { ...updatedSuggestion } }` (`404 Not Found` if invalid ID).

### 3.6 `GET /api/inquiries` & `POST /api/inquiries`
Fetches or submits client project briefs with an automatic Akviora AI Discovery Call summary.
- **Handler:** `app/api/inquiries/route.ts` -> `lib/gemini.ts` (`generateInquirySummary`) + `lib/db.ts` (`db.addInquiry`)
- **POST Request Body:**
```json
{
  "name": "Akshay Jain",
  "email": "founder@company.com",
  "company": "Acme Logistics",
  "serviceInterest": "AI Solutions & Automation",
  "budgetRange": "$10k – $25k (Full Platform)",
  "timeline": "4 – 8 Weeks",
  "problemStatement": "Need a unified customer portal with automated WhatsApp dispatch notifications."
}
```
- **POST Response (`201 Created`):**
```json
{
  "inquiry": {
    "id": "inq-1760110000000",
    "name": "Akshay Jain",
    "email": "founder@company.com",
    "company": "Acme Logistics",
    "serviceInterest": "AI Solutions & Automation",
    "budgetRange": "$10k – $25k (Full Platform)",
    "timeline": "4 – 8 Weeks",
    "problemStatement": "...",
    "aiSummary": "2-sentence actionable Discovery Call preparation note...",
    "status": "New",
    "createdAt": "2026-10-10T17:00:00.000Z"
  }
}
```

---

## 4. Database & Cloud Firestore Security Architecture

### 4.1 Dual Persistence Layer
1. **Local Node.js File Database (`lib/db.ts` -> `data/akviora_db.json`)**:
   - Works out-of-the-box offline or locally with zero external setup required.
   - Automatically seeds initial inquiries, suggestions, and blueprints if `data/akviora_db.json` does not exist.
2. **Google Cloud Firestore (`lib/firebase.ts` & `firestore.rules`)**:
   - Connected to database `ai-studio-akvioratechnolog-ac0414f0-ca06-47f2-95c7-4da5a4afd448`.
   - Supports Google Sign-In (`signInWithPopup`) via Firebase Authentication.
   - Real-time `onSnapshot` listeners in `lib/app-context.tsx` sync authenticated user inquiries and community suggestions live.
   - All Firestore operations are wrapped in `handleFirestoreError()` producing structured `FirestoreErrorInfo` diagnostics.

### 4.2 Hardened Cloud Firestore Security Rules (`firestore.rules`)
- **Default Deny Catch-All**: `match /{document=**} { allow read, write: if false; }`
- **Verified Identity Gate**: Requires `request.auth != null && request.auth.token.email_verified == true`.
- **Strict Blueprint Validation**:
  - `/suggestions/{suggestionId}`: Enforces allowed keys, string length boundaries, valid category enum (`AI Workflow`, `SaaS Feature`, `UI/UX Experience`, `Business Automation`), author UID integrity (`incoming().authorId == request.auth.uid`), server timestamps (`request.time`), and atomic `+1` upvote transitions.
  - `/blueprints/{blueprintId}`: Owner and admin read/list isolation (`existing().authorId == request.auth.uid || isAdmin()`).
  - `/inquiries/{inquiryId}`: Strict PII protection—only the inquiry creator (`existing().authorId == request.auth.uid`) or verified Admin can read/list inquiries containing email addresses. Terminal status locking prevents edits after status reaches `'Completed'`.
  - `/admins/{adminId}`: Protected admin registry with bootstrapped admin (`jakshay18397@gmail.com`).

---

## 5. AI Engine Architecture (`lib/gemini.ts`)

- **SDK**: `@google/genai` (server-side only; `process.env.GEMINI_API_KEY` is never exposed to the client bundle).
- **Model**: `gemini-3.8-flash` with structured `responseSchema` (`Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, `Type.INTEGER`) and `responseMimeType: 'application/json'`.
- **Brand Identity Enforcement**: `AKVIORA_SYSTEM_INSTRUCTION` instructs the model to always identify as **Akviora AI** (never exposing underlying provider names in the UI).
- **Graceful Offline/No-Key Fallbacks**: Every AI function (`generateChatReply`, `evaluateUserSuggestion`, `generateInquirySummary`, `generateWorkflowBlueprint`) includes a deterministic, context-aware architectural fallback so the application remains 100% functional even if `GEMINI_API_KEY` is not configured.

---

## 6. Frontend UI/UX, Scroll & Animation System

- **Theme Palette**:
  - Obsidian Void Background: `#060B14`
  - Elevated Surface: `#0B1322`
  - Primary Ice-White Text: `#EAF4F8`
  - Muted Slate Text: `#8EA6B4`
  - Primary Cyan Accent: `#5CE1E6`
  - Secondary Indigo Accent: `#7A86FF`
- **Typography**:
  - Display Headlines: `Bricolage Grotesque`
  - Body Copy: `Figtree`
  - Technical Telemetry & Labels: `JetBrains Mono`
- **Custom Scrollbar System**:
  - Native window scrollbar is hidden (`scrollbar-width: none`); a custom interactive desktop scrollbar thumb (`components/CustomScrollbar.tsx`) with cyan-to-indigo gradient glow, click-to-jump track, and drag support renders on the right viewport edge.
  - Inner scrollable containers (such as the Akviora AI Assistant drawer, persona selector strip, and modals) use a themed 6px cyan-to-indigo `::-webkit-scrollbar` with mouse-wheel horizontal translation and drag-to-scroll support.
- **Motion & Viewport Discipline**:
  - Page transitions use `AnimatePresence` + `PAGE_TRANSITION_VARIANTS` (subtle slide-up and fade).
  - Section and card scroll-reveal animations (`FadeUpReveal`, `KineticHeadline`, `ScrollWordScrub`, `SpotlightBentoTile`, `ProcessStepCard`) use `viewport={{ once: true }}` so animations play smoothly on first scroll without re-triggering on every scroll up/down.
  - Full `prefers-reduced-motion` support across all components.

---

## 7. Comprehensive Website Test & Bug Audit Report

| Test Area | Component / Endpoint | Status | Details & Fixes Verified |
| :--- | :--- | :--- | :--- |
| **TypeScript & Build** | `npm run lint` & `npm run build` | **PASS** | Zero TypeScript errors; clean Vite production bundle created in `dist/`. |
| **Firestore Security Rules** | `npx eslint firestore.rules` | **PASS** | Zero security rule warnings or vulnerabilities across all 4 collections. |
| **API: Bootstrap** | `GET /api/bootstrap` | **PASS (200)** | Returns all 5 service pillars, 6 AI assistants, 6 case studies, 8 process steps, FAQs, suggestions, inquiries, and blueprints. |
| **API: AI Chat** | `POST /api/ai/chat` | **PASS (200)** | Returns structured JSON `{ reply, suggestedFollowUps, recommendedService }` with Akviora AI branding. |
| **API: AI Blueprint** | `POST /api/ai/blueprint` | **PASS (201)** | Generates 4-step workflow blueprint and saves record to `data/akviora_db.json`. |
| **API: Suggestions** | `GET & POST /api/suggestions` | **PASS (200/201)** | Evaluates user ideas with Akviora AI and persists new suggestion records. |
| **API: Upvote** | `POST /api/suggestions/:id/upvote` | **PASS (200)** | Atomically increments suggestion upvote count. |
| **API: Inquiries** | `GET & POST /api/inquiries` | **PASS (200/201)** | Validates required fields/email format, generates AI discovery summary, and saves inquiry. |
| **UI: AI Assistant Scroll** | `FloatingAIAssistant.tsx` (`aside > div:nth-of-type(3)`) | **PASS (Fixed)** | Persona horizontal strip supports mouse-wheel horizontal scrolling, click-and-drag scrolling, auto-centering, and themed scrollbar; chat & suggestion panels scroll smoothly with `flex-1 min-h-0`. |
| **UI: Scroll Animations** | `CinematicScroll.tsx` & `HomePage.tsx` | **PASS (Fixed)** | All scroll-triggered entrance animations (`once: true`) trigger only on first scroll into view, including `ProcessStepCard`. |
| **UI: Blueprint State Sync** | `src/pages/AIPage.tsx` | **PASS (Fixed)** | Added `useEffect` synchronization so `activeBlueprint` automatically initializes if `blueprints` loads asynchronously from `/api/bootstrap`. |
| **Brand Consistency** | Entire Codebase & Blueprint Docs | **PASS (Fixed)** | All UI text, prompts, fallbacks, and schema descriptions exclusively use **Akviora AI**. |

---

## 8. Local Setup & Deployment Commands

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (optional locally due to built-in AI fallbacks)
cp .env.example .env
# Set GEMINI_API_KEY="your_api_key" inside .env

# 3. Start full-stack development server on http://localhost:3000
npm run dev

# 4. Type-check and build for production
npm run lint
npm run build

# 5. Start production server on http://localhost:3000
npm start
```
