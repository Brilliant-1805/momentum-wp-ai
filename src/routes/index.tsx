import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarRange, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Momentum — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Draft workplace emails, summarize meeting notes, and build realistic task plans with AI — you stay in control of every result.",
      },
      { property: "og:title", content: "Momentum — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Three AI tools in one workspace: Smart Email Generator, Meeting Notes Summarizer and AI Task Planner.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    stage: "Communicate",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a purpose, context and key points into a professional message in a formal, friendly or persuasive tone.",
    example: "Purpose → context → key points → tone",
    tint: "from-lilac to-brand",
    chip: "bg-lilac/15 text-brand",
  },
  {
    to: "/meetings",
    stage: "Understand",
    icon: FileText,
    title: "Meeting Summarizer",
    body: "Paste raw or unstructured notes and get a summary, decisions, action items with owners, and deadlines.",
    example: "Summary · decisions · actions · deadlines",
    tint: "from-sky to-mint",
    chip: "bg-sky/15 text-sky-ink",
  },
  {
    to: "/planner",
    stage: "Act",
    icon: CalendarRange,
    title: "AI Task Planner",
    body: "Give your tasks, priorities, deadlines and available time, and get a realistic day or week schedule.",
    example: "Prioritized blocks that fit your real time",
    tint: "from-peach to-candy",
    chip: "bg-candy/20 text-peach-ink",
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <div className="mb-8">
        <p className="mb-1 text-sm font-medium text-brand">
          Communicate → Understand → Act
        </p>
        <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          Your AI workplace productivity assistant
        </h1>
        <p className="mt-1.5 max-w-xl text-muted-foreground">
          Momentum brings three AI tools into one workspace: write the message, understand the
          meeting, and turn the work into a plan. Every result is editable before you use it.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="glass-panel group flex flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between">
              <div
                className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${t.tint} text-primary-foreground`}
              >
                <t.icon className="size-5" aria-hidden />
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.chip}`}>
                {t.stage}
              </span>
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{t.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{t.body}</p>
            <div className="mt-5 rounded-2xl bg-surface/70 p-3 text-xs text-muted-foreground">
              {t.example}
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
              Open tool
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="font-display text-lg font-bold">How a Momentum session works</h2>
        <p className="text-sm text-muted-foreground">
          The same input → AI → editable output pattern across all three tools.
        </p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "1",
              t: "Describe the work",
              d: "Fill in the guided fields on the left of any tool. The more context you give, the better the result.",
            },
            {
              n: "2",
              t: "AI drafts a structured result",
              d: "A purpose-built prompt keeps the output professional and grounded in what you provided.",
            },
            {
              n: "3",
              t: "Review, edit, use",
              d: "Edit the output in place, copy it, or send meeting action items straight to the Task Planner.",
            },
          ].map((s) => (
            <li key={s.n} className="rounded-2xl bg-surface/70 p-4">
              <span className="grid size-7 place-items-center rounded-lg bg-accent font-display text-xs font-bold text-brand">
                {s.n}
              </span>
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
