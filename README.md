# Momentum — AI Workplace Productivity Assistant

Momentum is a polished, responsive SaaS-style web application that brings three AI-powered workplace tools into one cohesive workspace:

- **Smart Email Generator** — draft professional emails from a brief, with tone control and editable output.
- **Meeting Notes Summarizer** — turn raw meeting notes into a structured summary with decisions, action items, deadlines, and open questions.
- **AI Task Planner / Scheduler** — generate a realistic day or week plan from a task list, priorities, and available time.

The app is built with real AI integration, careful prompt engineering, and a strong responsible-AI disclaimer. It is designed for desktop, tablet, and mobile use.

---

## Features

### Smart Email Generator

- Inputs: purpose, recipient, context, key points, tone (Formal / Friendly / Persuasive).
- Outputs: a complete, ready-to-review email with subject line, greeting, body, and sign-off.
- Actions: **Generate**, **Regenerate**, **Edit** inline, **Copy** to clipboard.
- Guardrails: the AI uses only supplied information, marks missing details as "Not specified", and never invents facts.

### Meeting Notes Summarizer

- Inputs: meeting title and free-form notes.
- Outputs:
  - Concise summary
  - Key decisions made
  - Action items with owner and deadline
  - Explicit deadlines mentioned
  - Anything unclear or incomplete
- Actions: **Summarize**, **Regenerate**, **Edit** any section, **Copy** the whole result, and **Send action items to Task Planner** for follow-up scheduling.

### AI Task Planner / Scheduler

- Inputs: task list with priorities and deadlines, planning horizon (Day / Week), available time, working hours, additional context.
- Outputs:
  - Overview of the plan
  - Time-blocked schedule
  - Deferred tasks with reasons
  - Assumptions made
- Actions: **Generate Plan**, **Regenerate**, **Edit** inline, **Copy**.
- Constraint-aware: the AI never schedules more work than the stated available time.

### Shared UX

- Sidebar navigation with active states (desktop + mobile horizontal tabs).
- Two-column workspace: inputs on the left, AI output on the right.
- Empty, loading, validation, error, and success states for every tool.
- Editable output panels.
- Copy-to-clipboard on every result.
- Responsible AI note visible throughout the app.

---

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start/) (React 19, file-based routing, SSR/SSG ready).
- **Build Tool:** Vite 8.
- **Styling:** Tailwind CSS v4 with custom design tokens (glass panels, brand gradients, semantic surfaces).
- **UI Primitives:** shadcn/ui.
- **Language:** TypeScript.
- **Validation:** Zod.
- **AI:** Lovable AI Gateway (`google/gemini-3.7-flash`) via `createServerFn` server functions.

---

## Project Structure

```
src/
├── components/
│   ├── app-shell.tsx       # Sidebar/nav + responsible-AI disclaimer
│   └── workspace.tsx       # Shared page header, input/output panels, buttons
├── lib/
│   ├── ai.functions.ts     # Server functions: generateEmail, summarizeMeeting, generatePlan
│   ├── error-capture.ts
│   ├── error-page.ts
│   ├── lovable-error-reporting.ts
│   └── utils.ts
├── routes/
│   ├── __root.tsx          # Root layout, fonts, metadata
│   ├── index.tsx           # Dashboard
│   ├── email.tsx           # Smart Email Generator
│   ├── meetings.tsx        # Meeting Notes Summarizer
│   └── planner.tsx         # AI Task Planner
├── router.tsx
├── server.ts
├── start.ts
└── styles.css              # Design tokens + utilities
```

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- `bun` or `npm`

### Install dependencies

```sh
bun install
# or
npm install
```

### Run the development server

```sh
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment variables

The AI tools require a `LOVABLE_API_KEY` to call the Lovable AI Gateway. In local development, add it to a `.env` file:

```sh
LOVABLE_API_KEY=your_api_key_here
```

In production / Lovable Cloud, the key is managed by the platform.

---

## Building for Production

```sh
bun run build
# or
npm run build
```

TanStack Start produces a production bundle suitable for edge deployment.

---

## Design Principles

- **Cohesion:** shared navigation, components, terminology, and action patterns across all three tools.
- **Usability over decoration:** clean cards, clear hierarchy, generous spacing, readable typography.
- **Responsive:** sidebar on desktop collapses to horizontal tabs on mobile; layouts reflow rather than shrink.
- **Real functionality:** every tool calls the AI gateway; no static placeholder outputs.
- **Responsible AI:** visible disclaimer that AI-generated content may contain errors and must be reviewed.
- **No fabricated data:** prompts instruct the AI to use only supplied information and say "Not specified" when details are missing.

---

## Cross-Tool Handoff

Action items extracted from meeting notes can be sent directly to the Task Planner. The meeting summarizer writes the items to session storage; the planner reads them on navigation and pre-fills the task list so you can schedule follow-up work without retyping.

---

## Roadmap / Completed Work

- [x] App shell, dashboard, and responsive sidebar navigation
- [x] Smart Email Generator with tone selection
- [x] Meeting Notes Summarizer with structured output and action-item handoff
- [x] AI Task Planner / Scheduler with day/week horizons
- [x] Shared workspace components (input/output panels, copy/edit/regenerate)
- [x] Responsible AI disclaimer
- [x] End-to-end verification that all three tools call the AI gateway

---

## License

This project was built with [Lovable](https://lovable.dev). The code is yours to modify, deploy, and own.
