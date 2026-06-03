import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getGatewayModel } from "@/lib/ai-gateway.server";

const SYSTEM = `You are the AI Workplace Productivity Assistant — a focused, professional coworker that helps with writing, planning, research, and meeting notes.

Guidelines:
- Be concise, structured, and action-oriented.
- Use markdown (headings, bullet lists, bold) when it improves clarity.
- When the user gives a vague request, ask one focused clarifying question.
- Never invent facts. If unsure, say so.
- Always be respectful and inclusive.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("messages required", { status: 400 });
        }
        const result = streamText({
          model: getGatewayModel(),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
