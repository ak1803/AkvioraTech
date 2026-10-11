# Akviora Technologies — Next.js + Node.js + Cloud Firestore Platform

**Design the experience. Automate the work. Build what's next.**

This project is architected to run **both locally on your computer** and **globally in the cloud** out of the box, combining:
- **Next.js App Router (`app/`) & Node.js Server (`server.ts`)**
- **Dual Database Persistence**: Local file-backed database (`lib/db.ts` -> `data/akviora_db.json`) **plus** real-time **Google Cloud Firestore** (`lib/firebase.ts` & `firebase-applet-config.json`)
- **Akviora AI Engine (`gemini-3.8-flash`)** (`lib/gemini.ts`)
- **Complete Technical Documentation**: See [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md) for the full API reference, backend architecture, database schema, security rules, and QA audit report.

---

## 1. How to Run Locally on Your Computer (Node.js + Full-Stack Mode)

Requirements: **Node.js v18+** installed on your machine.

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file and add your free Google Gemini API key
cp .env.example .env
# Edit .env and set: GEMINI_API_KEY="your_free_gemini_api_key"

# 3. Start the full-stack server (Frontend + Node.js API + Database)
npm run dev
```

Then open **`http://localhost:3000`** in your browser.
- Even if you haven't added a `GEMINI_API_KEY` yet, the app includes built-in intelligent fallback responses so every page, form, and AI Assistant feature works immediately offline or locally.
- Local data is automatically saved to `/data/akviora_db.json`, and Cloud Firestore (`firebase-applet-config.json`) syncs automatically when you sign in.

### Production Build (Local or Server)
```bash
npm run build
NODE_ENV=production npm start
```

---

## 2. How to Run with Standalone Next.js CLI (`app/` Router)

All Next.js App Router pages (`app/page.tsx`, `app/services/page.tsx`, `app/ai/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`) and Next.js Route Handlers (`app/api/*/route.ts`) are pre-configured in `/app`:

```bash
# Install the Next.js runtime locally if desired:
npm install next

# Start the Next.js development server on http://localhost:3000:
npm run dev:next
```

---

## Project Folder Structure

- `/app/*` — Next.js App Router pages (`/`, `/services`, `/ai`, `/work`, `/about`, `/faq`, `/contact`), global CSS (`app/globals.css`), & API Route Handlers (`/app/api/*`)
- `/components/*` — Shared UI components (`Header.tsx`, `Footer.tsx`, `WebGLBackground.tsx`, `FloatingAIAssistant.tsx`, `CinematicScroll.tsx`, `ROICalculator.tsx`, `CaseStudyModal.tsx`)
- `/lib/*` — Core backend & client modules:
  - `lib/firebase.ts` — Firebase Auth & Cloud Firestore SDK integration
  - `lib/db.ts` — Local Node.js JSON database (`data/akviora_db.json`)
  - `lib/gemini.ts` — Server-side Google Gemini AI controller (`gemini-3-flash-preview`)
  - `lib/app-context.tsx` — Unified router, state, and Firestore real-time listener context
  - `lib/data.ts` & `lib/types.ts` — Typed content store and TypeScript interfaces
- `/prisma/schema.prisma` — Prisma ORM relational schema (SQLite / PostgreSQL ready)
- `/firestore.rules` & `/firebase-blueprint.json` — Hardened Cloud Firestore security rules and schema blueprint
- `/server.ts` — Full-stack Node.js + Express entry point on port `3000`
