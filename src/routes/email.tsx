import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2, Wand2 } from "lucide-react";
import { generateEmail } from "@/lib/ai/generate.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { EditableOutput } from "@/components/editable-output";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workmate AI" },
      { name: "description", content: "Draft professional emails with the right tone in seconds using AI." },
    ],
  }),
  component: EmailPage,
});

type Tone = "professional" | "friendly" | "concise" | "persuasive" | "apologetic";
type Length = "short" | "medium" | "long";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [length, setLength] = useState<Length>("medium");
  const [output, setOutput] = useState("");

  const fn = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () =>
      fn({ data: { recipient, topic, tone, length, context: context || undefined } }),
    onSuccess: (res) => setOutput(res.text),
    onError: (e: Error) => toast.error(e.message || "Failed to generate email"),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <PageHeader
        icon={<Mail className="h-5 w-5" />}
        title="Smart Email Generator"
        description="Describe what you need — get a polished email draft you can edit and send."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Prompt</h2>

          <div className="grid gap-1.5">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. Sarah, our marketing director"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="topic">What's the email about?</Label>
            <Textarea
              id="topic"
              placeholder="e.g. Follow up on Q3 launch timeline and request her feedback by Friday."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={2000}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Length</Label>
              <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="context">Additional context (optional)</Label>
            <Textarea
              id="context"
              placeholder="Prior conversation, key dates, links, names…"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              maxLength={4000}
              className="min-h-[80px]"
            />
          </div>

          <Button
            className="w-full bg-gradient-brand text-primary-foreground"
            onClick={() => mutation.mutate()}
            disabled={!recipient.trim() || !topic.trim() || mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Generate email</>
            )}
          </Button>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <EditableOutput
            value={output}
            onChange={setOutput}
            onRegenerate={() => mutation.mutate()}
            isGenerating={mutation.isPending}
            emptyHint="Your generated email will appear here. It's fully editable."
          />
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
