import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { getGatewayModel } from "../ai-gateway.server";

const EmailInput = z.object({
  recipient: z.string().min(1).max(200),
  topic: z.string().min(1).max(2000),
  tone: z.enum(["professional", "friendly", "concise", "persuasive", "apologetic"]),
  length: z.enum(["short", "medium", "long"]),
  context: z.string().max(4000).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Write an email with the following requirements.

Recipient: ${data.recipient}
Topic / goal: ${data.topic}
Tone: ${data.tone}
Length: ${data.length}
${data.context ? `Additional context:\n${data.context}` : ""}

Return ONLY the final email in markdown, beginning with a "Subject:" line, followed by a blank line, then the body. No commentary.`;
    const { text } = await generateText({ model: getGatewayModel(), prompt });
    return { text };
  });

const SummaryInput = z.object({
  notes: z.string().min(10).max(20000),
  format: z.enum(["executive", "detailed", "action-items"]).default("executive"),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummaryInput.parse(input))
  .handler(async ({ data }) => {
    const formatInstr =
      data.format === "executive"
        ? "Provide a short executive summary (3-5 bullets), then a 'Key Decisions' section, then an 'Action Items' table with Owner | Task | Due."
        : data.format === "detailed"
          ? "Provide a structured summary with sections: Overview, Discussion Points, Decisions, Action Items (Owner | Task | Due), Open Questions."
          : "Extract ONLY action items as a markdown table with columns: Owner | Task | Due | Priority.";
    const prompt = `You are summarizing meeting notes. ${formatInstr}

Meeting notes:
"""
${data.notes}
"""

Return clean markdown.`;
    const { text } = await generateText({ model: getGatewayModel(), prompt });
    return { text };
  });

const PlanInput = z.object({
  goal: z.string().min(3).max(2000),
  horizon: z.enum(["today", "this-week", "this-month", "quarter"]).default("this-week"),
  constraints: z.string().max(2000).optional(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlanInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `Act as a senior productivity coach. Build a concrete, prioritized task plan.

Goal: ${data.goal}
Time horizon: ${data.horizon}
${data.constraints ? `Constraints / context: ${data.constraints}` : ""}

Return markdown with:
1. **Objective** — one sentence restating the goal.
2. **Milestones** — 3-5 numbered milestones.
3. **Task breakdown** — markdown table: Task | Priority (P1/P2/P3) | Est. effort | Due.
4. **Risks & mitigations** — short bullet list.

Be concrete and actionable. No filler.`;
    const { text } = await generateText({ model: getGatewayModel(), prompt });
    return { text };
  });

const ResearchInput = z.object({
  question: z.string().min(3).max(2000),
  depth: z.enum(["brief", "standard", "deep"]).default("standard"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const prompt = `You are a research analyst. Provide a structured briefing on the question below using your training knowledge. Be transparent about uncertainty and avoid fabricating sources.

Question: ${data.question}
Depth: ${data.depth}

Return markdown with sections:
- **TL;DR** (2-3 sentences)
- **Key findings** (bulleted)
- **Background & context**
- **Different perspectives / trade-offs**
- **Open questions to investigate further**
- **Suggested next steps**

Do not invent URLs or citations. If you reference a study or figure you are not sure about, mark it with *(verify)*.`;
    const { text } = await generateText({ model: getGatewayModel(), prompt });
    return { text };
  });
