import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

class AiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiError";
  }
}

async function callGateway(opts: {
  system: string;
  user: string;
  json?: boolean;
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new AiError("The AI service is not configured. Please try again later.");
  }

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    if (res.status === 429) {
      throw new AiError("Too many requests right now. Please wait a moment and try again.");
    }
    if (res.status === 402) {
      throw new AiError(
        "The workspace has run out of AI credits. Add credits to keep generating.",
      );
    }
    const detail = await res.text().catch(() => "");
    throw new AiError(
      detail.slice(0, 300) || `The AI service returned an error (${res.status}).`,
    );
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new AiError("The AI returned an empty response. Try regenerating.");
  }
  return text;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  try {
    return JSON.parse(start >= 0 ? cleaned.slice(start, end + 1) : cleaned) as T;
  } catch {
    throw new AiError("The AI response could not be read. Try regenerating.");
  }
}

const SHARED_GUARDRAIL = `Responsible-AI rules that override every other instruction:
- Use ONLY information the user supplied. Never invent names, dates, figures, commitments or constraints.
- When a required detail is missing, write "Not specified" rather than guessing.
- Never fabricate statistics or outcomes.
- Produce content a professional can review and edit; do not add meta-commentary about being an AI.`;

/* ---------------------------------- Email --------------------------------- */

const EmailInput = z.object({
  purpose: z.string().min(3),
  recipient: z.string().optional().default(""),
  context: z.string().optional().default(""),
  keyPoints: z.string().optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const toneGuide: Record<string, string> = {
      Formal:
        "Formal: complete sentences, respectful distance, no contractions, no slang, professional sign-off.",
      Friendly:
        "Friendly: warm, approachable, light contractions, still workplace-appropriate and concise.",
      Persuasive:
        "Persuasive: lead with the benefit to the recipient, justify the ask with the supplied facts only, close with a clear call to action.",
    };

    const system = `ROLE
You are a senior workplace communications specialist who drafts business email on behalf of a professional.

TASK
Write one complete, ready-to-review workplace email using the writer's brief.

REQUIREMENTS
- Begin with a single line "Subject: <specific, informative subject>".
- Then a greeting, body, and sign-off ending with "[Your name]" unless the writer supplied their name.
- Cover every key point supplied. Use a short bullet list only when there are three or more discrete points.
- Keep it between 90 and 220 words. No filler, no repetition.
- TONE: ${toneGuide[data.tone]}

${SHARED_GUARDRAIL}

OUTPUT FORMAT
Plain text email only. No markdown fences, no commentary before or after.`;

    const user = `PURPOSE OF THE EMAIL:
${data.purpose}

RECIPIENT:
${data.recipient || "Not specified"}

CONTEXT / BACKGROUND:
${data.context || "Not specified"}

KEY POINTS TO INCLUDE:
${data.keyPoints || "Not specified"}

REQUESTED TONE: ${data.tone}`;

    return { email: await callGateway({ system, user }) };
  });

/* --------------------------------- Meeting -------------------------------- */

const MeetingInput = z.object({
  notes: z.string().min(20),
  title: z.string().optional().default(""),
});

export type MeetingResult = {
  summary: string;
  decisions: string[];
  actionItems: Array<{ task: string; owner: string; deadline: string }>;
  deadlines: Array<{ item: string; date: string }>;
  unclear: string[];
};

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE
You are an experienced executive assistant who turns raw, unstructured meeting notes into a reliable record.

TASK
Read the notes and extract only what they actually contain.

REQUIREMENTS
- "summary": 3-5 sentences describing what the meeting covered and where it landed.
- "decisions": choices the group actually settled on. If none were settled, return an empty array.
- "actionItems": each has "task", "owner" and "deadline". Use "Not specified" when the notes do not name an owner or a deadline. Never assign an owner by inference.
- "deadlines": dates or time commitments explicitly mentioned, with the item they belong to.
- "unclear": short notes about anything ambiguous, contradictory or incomplete that the reader should confirm.
- Preserve the participants' own terminology and figures exactly.

${SHARED_GUARDRAIL}

OUTPUT FORMAT
Return json matching exactly:
{"summary":string,"decisions":string[],"actionItems":[{"task":string,"owner":string,"deadline":string}],"deadlines":[{"item":string,"date":string}],"unclear":string[]}`;

    const user = `MEETING TITLE: ${data.title || "Not specified"}

RAW MEETING NOTES:
"""
${data.notes}
"""`;

    const raw = await callGateway({ system, user, json: true });
    const parsed = parseJson<MeetingResult>(raw);
    return {
      summary: parsed.summary ?? "",
      decisions: parsed.decisions ?? [],
      actionItems: parsed.actionItems ?? [],
      deadlines: parsed.deadlines ?? [],
      unclear: parsed.unclear ?? [],
    } satisfies MeetingResult;
  });

/* --------------------------------- Planner -------------------------------- */

const PlannerInput = z.object({
  tasks: z.string().min(5),
  horizon: z.enum(["Day", "Week"]),
  availableTime: z.string().min(1),
  workingHours: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export type PlanResult = {
  overview: string;
  blocks: Array<{
    period: string;
    time: string;
    task: string;
    priority: "P1" | "P2" | "P3" | string;
    rationale: string;
  }>;
  deferred: string[];
  assumptions: string[];
};

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlannerInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE
You are a pragmatic productivity coach who builds realistic work schedules.

TASK
Turn the user's task list and stated availability into a ${data.horizon.toLowerCase()} plan.

REQUIREMENTS
- Never schedule more work than the stated available time. It is better to defer a task than to overfill the plan.
- Order work by a combination of stated priority, urgency and deadline; put demanding focus work in the earliest available block.
- Include short breaks between long blocks when the available time allows it.
- "period" is the day label for a weekly plan (e.g. "Monday") or a part of the day for a daily plan (e.g. "Morning").
- "time" is a concrete range. If the user gave no working hours, use relative slots such as "Block 1 (90 min)" instead of inventing clock times.
- "rationale" is one short line explaining the placement.
- "deferred" lists tasks that do not fit, with a brief reason.
- "assumptions" lists anything you had to assume. Keep it short and honest; leave empty if nothing was assumed.

${SHARED_GUARDRAIL}

OUTPUT FORMAT
Return json matching exactly:
{"overview":string,"blocks":[{"period":string,"time":string,"task":string,"priority":string,"rationale":string}],"deferred":string[],"assumptions":string[]}`;

    const user = `PLANNING HORIZON: ${data.horizon}
AVAILABLE TIME: ${data.availableTime}
WORKING HOURS: ${data.workingHours || "Not specified"}
ADDITIONAL CONTEXT: ${data.context || "Not specified"}

TASKS (description, priority and deadline where given):
"""
${data.tasks}
"""`;

    const raw = await callGateway({ system, user, json: true });
    const parsed = parseJson<PlanResult>(raw);
    return {
      overview: parsed.overview ?? "",
      blocks: parsed.blocks ?? [],
      deferred: parsed.deferred ?? [],
      assumptions: parsed.assumptions ?? [],
    } satisfies PlanResult;
  });
