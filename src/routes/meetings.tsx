import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Field,
  GhostButton,
  InputPanel,
  OutputPanel,
  PageHeader,
  PrimaryButton,
} from "@/components/workspace";
import { summarizeMeeting, type MeetingResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Momentum" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, decisions, action items with owners, and deadlines — editable before you share them.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Momentum" },
      {
        property: "og:description",
        content: "Structured decisions, action items and deadlines from unstructured meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

export const HANDOFF_KEY = "momentum:planner-handoff";

function SectionCard({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold">{title}</h3>
        {count !== undefined && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-brand">
            {count}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function toPlainText(r: MeetingResult) {
  const lines = [
    "MEETING SUMMARY",
    r.summary || "Not specified",
    "",
    "KEY DECISIONS",
    ...(r.decisions.length ? r.decisions.map((d) => `- ${d}`) : ["- None recorded"]),
    "",
    "ACTION ITEMS",
    ...(r.actionItems.length
      ? r.actionItems.map((a) => `- ${a.task} (Owner: ${a.owner}; Due: ${a.deadline})`)
      : ["- None recorded"]),
    "",
    "DEADLINES",
    ...(r.deadlines.length
      ? r.deadlines.map((d) => `- ${d.item}: ${d.date}`)
      : ["- None recorded"]),
  ];
  if (r.unclear.length) {
    lines.push("", "NEEDS CONFIRMATION", ...r.unclear.map((u) => `- ${u}`));
  }
  return lines.join("\n");
}

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"empty" | "loading" | "ready" | "error">("empty");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [editing, setEditing] = useState(false);
  const [edited, setEdited] = useState("");

  const notesError =
    touched && notes.trim().length < 20 ? "Paste at least a few lines of notes to summarize." : "";

  async function summarize() {
    setTouched(true);
    if (notes.trim().length < 20) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await run({ data: { notes, title } });
      setResult(res);
      setEdited(toPlainText(res));
      setEditing(false);
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  function sendToPlanner() {
    if (!result) return;
    const tasks = result.actionItems
      .map(
        (a) =>
          `${a.task} — priority: not specified; owner: ${a.owner}; deadline: ${a.deadline}`,
      )
      .join("\n");
    sessionStorage.setItem(HANDOFF_KEY, tasks);
    navigate({ to: "/planner" });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Understand"
        title="Meeting Notes Summarizer"
        description="Paste messy notes from any meeting. Momentum extracts only what the notes actually contain — no invented owners, decisions or dates."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <InputPanel title="Meeting notes">
          <Field label="Meeting title" hint="Optional, helps frame the summary.">
            <input
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Q3 planning sync"
            />
          </Field>

          <Field
            label="Notes"
            required
            error={notesError}
            hint="Rough bullets, a transcript or free-form text all work."
          >
            <textarea
              rows={14}
              className="field-input resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={"Paste your notes here…\n\nsam - budget approved for the new tooling\nneed migration plan by fri\nlena to talk to vendor"}
            />
          </Field>

          <PrimaryButton onClick={summarize} loading={status === "loading"}>
            {result ? "Summarize again" : "Summarize notes"}
          </PrimaryButton>
        </InputPanel>

        <OutputPanel
          title="Structured summary"
          status={status}
          error={error}
          onRegenerate={summarize}
          editing={editing}
          onToggleEdit={() => setEditing((v) => !v)}
          copyText={edited}
          emptyTitle="Nothing summarized yet"
          emptyHint="Paste your meeting notes on the left to get a summary, decisions, action items and deadlines."
          loadingHint="Reading the notes and extracting decisions, owners and deadlines…"
          extraActions={
            result?.actionItems.length ? (
              <GhostButton icon={ArrowRight} onClick={sendToPlanner}>
                Send actions to planner
              </GhostButton>
            ) : null
          }
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
              <div className="space-y-3">
                <SectionCard title="Meeting summary">
                  <p className="text-sm leading-relaxed">{result.summary || "Not specified"}</p>
                </SectionCard>

                <SectionCard title="Key decisions" count={result.decisions.length}>
                  {result.decisions.length ? (
                    <ul className="space-y-1.5 text-sm">
                      {result.decisions.map((d, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No decisions were recorded in these notes.
                    </p>
                  )}
                </SectionCard>

                <SectionCard title="Action items" count={result.actionItems.length}>
                  {result.actionItems.length ? (
                    <ul className="space-y-2">
                      {result.actionItems.map((a, i) => (
                        <li key={i} className="rounded-xl bg-accent/40 p-3 text-sm">
                          <p className="font-medium">{a.task}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Owner: {a.owner} · Due: {a.deadline}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No action items were recorded in these notes.
                    </p>
                  )}
                </SectionCard>

                <SectionCard title="Deadlines" count={result.deadlines.length}>
                  {result.deadlines.length ? (
                    <ul className="space-y-1.5 text-sm">
                      {result.deadlines.map((d, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span>{d.item}</span>
                          <span className="shrink-0 font-medium text-brand">{d.date}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No deadlines were mentioned in these notes.
                    </p>
                  )}
                </SectionCard>

                {result.unclear.length > 0 && (
                  <SectionCard title="Needs confirmation" count={result.unclear.length}>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {result.unclear.map((u, i) => (
                        <li key={i}>• {u}</li>
                      ))}
                    </ul>
                  </SectionCard>
                )}
              </div>
            )
          )}
        </OutputPanel>
      </div>
    </AppShell>
  );
}
