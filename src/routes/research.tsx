import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Wand2 } from "lucide-react";
import { researchTopic } from "@/lib/ai/generate.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { EditableOutput } from "@/components/editable-output";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workmate AI" },
      { name: "description", content: "Get structured AI briefings with key findings, perspectives, and next steps." },
    ],
  }),
  component: ResearchPage,
});

type Depth = "brief" | "standard" | "deep";

function ResearchPage() {
  const [question, setQuestion] = useState("");
  const [depth, setDepth] = useState<Depth>("standard");
  const [output, setOutput] = useState("");

  const fn = useServerFn(researchTopic);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { question, depth } }),
    onSuccess: (res) => setOutput(res.text),
    onError: (e: Error) => toast.error(e.message || "Failed to research"),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Ask a question — get a structured briefing with key findings and trade-offs."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Research query</h2>

          <div className="grid gap-1.5">
            <Label htmlFor="question">Question or topic</Label>
            <Textarea
              id="question"
              placeholder="e.g. What are the key trade-offs between async-first and synchronous-first remote work cultures?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={2000}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={(v) => setDepth(v as Depth)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief overview</SelectItem>
                <SelectItem value="standard">Standard briefing</SelectItem>
                <SelectItem value="deep">Deep dive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-gradient-brand text-primary-foreground"
            onClick={() => mutation.mutate()}
            disabled={question.trim().length < 3 || mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Researching…</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Research</>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground">
            The assistant draws on its training knowledge and flags uncertain claims with <em>(verify)</em>.
            It does not browse the live web.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <EditableOutput
            value={output}
            onChange={setOutput}
            onRegenerate={() => mutation.mutate()}
            isGenerating={mutation.isPending}
          />
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
