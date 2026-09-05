import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  EditableBlock,
  Field,
  InputPanel,
  OutputPanel,
  PageHeader,
  PrimaryButton,
  ToneSelect,
} from "@/components/workspace";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Momentum" },
      {
        name: "description",
        content:
          "Generate professional workplace emails from your purpose, context, key points and chosen tone, then edit the draft before sending.",
      },
      { property: "og:title", content: "Smart Email Generator — Momentum" },
      {
        property: "og:description",
        content: "AI-drafted workplace email in a formal, friendly or persuasive tone.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Persuasive"] as const;
type Tone = (typeof TONES)[number];

function EmailPage() {
  const run = useServerFn(generateEmail);

  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");

  const [status, setStatus] = useState<"empty" | "loading" | "ready" | "error">("empty");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);

  const purposeError = touched && purpose.trim().length < 3 ? "Tell the AI why you are writing." : "";

  async function generate() {
    setTouched(true);
    if (purpose.trim().length < 3) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await run({
        data: { purpose, recipient, context, keyPoints, tone },
      });
      setDraft(res.email);
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
        eyebrow="Communicate"
        title="Smart Email Generator"
        description="Describe the message you need. Momentum drafts it in your chosen tone using only the details you provide."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <InputPanel title="Your brief">
          <Field
            label="Purpose of the email"
            required
            error={purposeError}
            hint="One line on what this email needs to achieve."
          >
            <input
              className="field-input"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Request a two-day extension on the Q3 migration"
            />
          </Field>

          <Field label="Recipient" hint="Who is receiving it, and their role if relevant.">
            <input
              className="field-input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Priya Naidoo, Programme Manager"
            />
          </Field>

          <Field label="Context or background" hint="What the recipient needs to know first.">
            <textarea
              rows={3}
              className="field-input resize-y"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="The client review slipped by a week; the vendor slot is still open."
            />
          </Field>

          <Field label="Key points to include" hint="One point per line.">
            <textarea
              rows={4}
              className="field-input resize-y"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"New target date: 18 November\nNo impact on the launch date\nNeed sign-off on revised scope"}
            />
          </Field>

          <ToneSelect label="Tone" options={TONES} value={tone} onChange={setTone} />

          <PrimaryButton onClick={generate} loading={status === "loading"}>
            {draft ? "Generate again" : "Generate email"}
          </PrimaryButton>
        </InputPanel>

        <OutputPanel
          title="Draft email"
          status={status}
          error={error}
          onRegenerate={generate}
          editing={editing}
          onToggleEdit={() => setEditing((v) => !v)}
          copyText={draft}
          emptyTitle="No draft yet"
          emptyHint="Fill in the brief on the left and generate to see an editable email here."
          loadingHint={`Drafting a ${tone.toLowerCase()} email…`}
        >
          <EditableBlock value={draft} onChange={setDraft} editing={editing} rows={16} />
        </OutputPanel>
      </div>
    </AppShell>
  );
}
