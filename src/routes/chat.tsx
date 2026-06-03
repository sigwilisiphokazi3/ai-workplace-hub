import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageSquare, Plus, Sparkle } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workmate AI" },
      { name: "description", content: "Chat with your AI workplace assistant for brainstorming, drafting, and Q&A." },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "workmate-chat-v1";

function loadInitial(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

const SUGGESTIONS = [
  "Draft a quick stand-up update from these bullet points…",
  "Brainstorm 5 angles for a Q4 customer retention campaign.",
  "Explain OKRs vs KPIs as if I'm onboarding to a new team.",
  "Help me prepare for a difficult conversation with a teammate.",
];

function ChatPage() {
  const [initialMessages] = useState<UIMessage[]>(() => loadInitial());
  const [chatKey, setChatKey] = useState(0);
  const [input, setInput] = useState("");
  const transportRef = useRef(new DefaultChatTransport({ api: "/api/chat" }));

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: `workmate-${chatKey}`,
    messages: initialMessages,
    transport: transportRef.current,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* quota */
    }
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    setInput("");
  };

  const newChat = () => {
    setMessages([]);
    setChatKey((k) => k + 1);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-5xl flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          icon={<MessageSquare className="h-5 w-5" />}
          title="AI Chatbot"
          description="Your always-on AI coworker for drafting, brainstorming, and quick questions."
          badge="Beta"
        />
        <Button variant="outline" size="sm" onClick={newChat} disabled={messages.length === 0}>
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <Conversation className="flex-1">
          <ConversationContent className="px-4 py-4 sm:px-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Sparkle className="h-7 w-7 text-primary" />}
                title="Ask me anything about your work"
                description="Drafting, summarizing, brainstorming, learning — I've got you."
              >
                <div className="mt-4 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setInput(s)}
                      className="rounded-lg border bg-background/60 p-3 text-left text-xs leading-snug text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              <>
                {messages.map((m) => (
                  <Message from={m.role === "user" ? "user" : "assistant"} key={m.id}>
                    {m.role === "assistant" ? (
                      <div className="w-full max-w-full space-y-2">
                        {m.parts.map((part, i) =>
                          part.type === "text" ? (
                            <MessageResponse key={i}>{part.text}</MessageResponse>
                          ) : null,
                        )}
                      </div>
                    ) : (
                      <MessageContent>
                        {m.parts
                          .map((p) => (p.type === "text" ? p.text : ""))
                          .join("")}
                      </MessageContent>
                    )}
                  </Message>
                ))}
                {status === "submitted" && (
                  <Message from="assistant">
                    <Shimmer>Thinking…</Shimmer>
                  </Message>
                )}
                {error && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                    {error.message || "Something went wrong. Please try again."}
                  </div>
                )}
              </>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background/40 p-3 sm:p-4">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Workmate AI…"
              autoFocus
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() || isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
