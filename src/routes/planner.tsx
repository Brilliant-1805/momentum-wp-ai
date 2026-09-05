import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Field,
  InputPanel,
  OutputPanel,
  PageHeader,
  PrimaryButton,
  ToneSelect,
} from "@/components/workspace";
import { generatePlan, type PlanResult } from "@/lib/ai.functions";
import { HANDOFF_KEY } from "./meetings";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Momentum" },
      {
        name: "description",
        content:
          "Turn your tasks, priorities, deadlines and available time into a realistic daily or weekly schedule you can edit.",
      },
      { property: "og:title", content: "AI Task Planner — Momentum" },
      {
        property: "og:description",
        content: "A prioritized, realistic plan built from the time you actually have.",
      },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Day", "Week"] as const;
type Horizon = (typeof HORIZONS)[number];

const PRIORITY_STYLES: Record<string, string> = {
  P1: "bg-brand/12 text-brand",
  P2: "bg-candy/25 text-peach-ink",
  P3: "bg-sky/15 text-sky-ink",
};

function toPlainText(r: PlanResult) {
  const lines = ["PLAN OVERVIEW", r.overview || "Not specified", "", "SCHEDULE"];
  r.blocks.forEach((b) => {
    lines.push(`- [${b.period}] ${b.time} — ${b.task} (${b.priority}) — ${b.rationale}`);
  });
  if (r.deferred.length) lines.push("", "DEFERRED", ...r.deferred.map((d) => `- ${d}`));
  if (r.assumptions.length) lines.push("", "ASSUMPTIONS", ...r.assumptions.map((a) => `- ${a}`));
  return lines.join("\n");
}

function PlannerPage() {
  const run = useServerFn(generatePlan);

  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("Day");
  const [availableTime, setAvailableTime] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [context, setContext] = useState("");

  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"empty" | "loading" | "ready" | "error">("empty");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PlanResult | null>(null);
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState("");
  const [handoff, setHandoff] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(HANDOFF_KEY);
    if (stored) {
      setTasks(stored);
      setHandoff(true);
      sessionStorage.removeItem(HANDOFF_KEY);
    }
  }, []);

  const tasksError = touched && tasks.trim().length < 5 ? "Add at least one task." : "";
  const timeError = touched && !availableTime.trim() ? "Tell the planner how much time you have." : "";

  async function generate() {
    setTouched(true);
    if (tasks.trim().length < 5 || !availableTime.trim()) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await run({
        data: { tasks, horizon, availableTime, workingHours, context },
      });
      setResult(res);
      setEdited(toPlainText(res));
      setEditing(false);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Act"
        title="AI Task Planner"
        description="List what needs doing and how much time you actually have. Momentum sequences the work and tells you honestly what does not fit."
      />

      {handoff && (
        <div className="mb-5 rounded-2xl border border-brand/25 bg-accent/50 px-4 py-3 text-sm text-brand">
          Action items from your meeting summary were added to the task list below.
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <InputPanel title="Your workload">
          <ToneSelect
            label="Plan for"
            options={HORIZONS}
            value={horizon}
            onChange={setHorizon}
          />

          <Field
            label="Tasks"
            required
            error={tasksError}
            hint="One task per line. Add priority and deadline where you know them."
          >
            <textarea
              rows={8}
              className="field-input resize-y"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Draft Q3 pricing memo — high priority, due Thursday, ~90 min\nPrep onboarding deck — due Friday, ~2h\nReply to vendor invoice — 20 min"}
            />
          </Field>

          <Field
            label="Available time"
            required
            error={timeError}
            hint="Be realistic — the plan will not exceed it."
          >
            <input
              className="field-input"
              value={availableTime}
              onChange={(e) => setAvailableTime(e.target.value)}
              placeholder="6 focus hours today"
            />
          </Field>

          <Field label="Working hours" hint="Optional. Without it, the plan uses relative blocks.">
            <input
              className="field-input"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="09:00 – 17:00, lunch at 13:00"
            />
          </Field>

          <Field label="Additional context" hint="Fixed meetings, energy patterns, dependencies.">
            <textarea
              rows={3}
              className="field-input resize-y"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Standup 09:15–09:30. I focus best before lunch."
            />
          </Field>

          <PrimaryButton onClick={generate} loading={status === "loading"}>
            {result ? "Generate plan again" : "Generate plan"}
          </PrimaryButton>
        </InputPanel>

        <OutputPanel
          title={`${horizon}ly plan`}
          status={status}
          error={error}
          onRegenerate={generate}
          editing={editing}
          onToggleEdit={() => setEditing((v) => !v)}
          copyText={edited}
          emptyTitle="No plan yet"
          emptyHint="Add your tasks and available time on the left to get a prioritized schedule here."
          loadingHint="Sequencing your tasks by priority, deadline and available time…"
        >
          {editing ? (
            <textarea
              rows={22}
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              className="field-input resize-y leading-relaxed"
            />
          ) : (
            result && (
              <div className="space-y-4">
                {result.overview && (
                  <p className="rounded-2xl border border-border/60 bg-surface/70 p-4 text-sm leading-relaxed">
                    {result.overview}
                  </p>
                )}

                <ol className="space-y-3">
                  {result.blocks.map((b, i) => (
                    <li key={i} className="rounded-2xl border border-border/60 bg-surface/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {b.period}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">{b.time}</span>
                      </div>
                      <div className="mt-1.5 flex items-start justify-between gap-3">
                        <p className="font-medium">{b.task}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            PRIORITY_STYLES[b.priority] ?? "bg-muted text-muted-foreground"
                          }`}
                        >
                          {b.priority}
                        </span>
                      </div>
                      {b.rationale && (
                        <p className="mt-1 text-xs text-muted-foreground">{b.rationale}</p>
                      )}
                    </li>
                  ))}
                </ol>

                {result.deferred.length > 0 && (
                  <div className="rounded-2xl border border-border/60 bg-surface/70 p-4">
                    <h3 className="font-display text-sm font-bold">Did not fit</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {result.deferred.map((d, i) => (
                        <li key={i}>• {d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.assumptions.length > 0 && (
                  <div className="rounded-2xl border border-border/60 bg-surface/70 p-4">
                    <h3 className="font-display text-sm font-bold">Assumptions made</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {result.assumptions.map((a, i) => (
                        <li key={i}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </OutputPanel>
      </div>
    </AppShell>
  );
}
