import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2, Wand2 } from "lucide-react";
import { summarizeMeeting } from "@/lib/ai/generate.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { EditableOutput } from "@/components/editable-output";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";

export const Route = createFileRoute("/summarize")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workmate AI" },
      { name: "description", content: "Turn raw meeting notes into clear summaries and action items with AI." },
    ],
  }),
  component: SummarizePage,
});

type Format = "executive" | "detailed" | "action-items";

function SummarizePage() {
  const [notes, setNotes] = useState("");
  const [format, setFormat] = useState<Format>("executive");
  const [output, setOutput] = useState("");

  const fn = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: () => fn({ data: { notes, format } }),
    onSuccess: (res) => setOutput(res.text),
    onError: (e: Error) => toast.error(e.message || "Failed to summarize"),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <PageHeader
        icon={<FileText className="h-5 w-5" />}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a structured summary with decisions and action items."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Notes</h2>

          <div className="grid gap-1.5">
            <Label>Output format</Label>
            <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive summary</SelectItem>
                <SelectItem value="detailed">Detailed minutes</SelectItem>
                <SelectItem value="action-items">Action items only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="notes">Paste meeting notes or transcript</Label>
            <Textarea
              id="notes"
              placeholder="Paste raw notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={20000}
              className="min-h-[340px] font-mono text-sm"
            />
            <p className="text-[11px] text-muted-foreground">{notes.length.toLocaleString()} / 20,000 characters</p>
          </div>

          <Button
            className="w-full bg-gradient-brand text-primary-foreground"
            onClick={() => mutation.mutate()}
            disabled={notes.trim().length < 10 || mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Summarizing…</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Summarize</>
            )}
          </Button>
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
