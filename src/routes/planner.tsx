import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2, Wand2 } from "lucide-react";
import { generatePlan } from "@/lib/ai/generate.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { EditableOutput } from "@/components/editable-output";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workmate AI" },
      { name: "description", content: "Break goals into prioritized, time-boxed task plans with AI." },
    ],
  }),
  component: PlannerPage,
});

type Horizon = "today" | "this-week" | "this-month" | "quarter";

function PlannerPage() {
  const [goal, setGoal] = useState("");
  const [constraints, setConstraints] = useState("");
  const [horizon, setHorizon] = useState<Horizon>("this-week");
  const [output, setOutput] = useState("");

  const fn = useServerFn(generatePlan);
  const mutation = useMutation({
    mutationFn: () =>
      fn({ data: { goal, horizon, constraints: constraints || undefined } }),
    onSuccess: (res) => setOutput(res.text),
    onError: (e: Error) => toast.error(e.message || "Failed to generate plan"),
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="AI Task Planner"
        description="Tell the AI your goal — get a prioritized plan with milestones and tasks."
        badge="AI Tool"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Plan inputs</h2>

          <div className="grid gap-1.5">
            <Label htmlFor="goal">Goal or outcome</Label>
            <Textarea
              id="goal"
              placeholder="e.g. Launch v2 of the customer onboarding flow"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              maxLength={2000}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>Time horizon</Label>
            <Select value={horizon} onValueChange={(v) => setHorizon(v as Horizon)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="constraints">Constraints / context (optional)</Label>
            <Textarea
              id="constraints"
              placeholder="Team size, dependencies, budget, hard deadlines…"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              maxLength={2000}
              className="min-h-[80px]"
            />
          </div>

          <Button
            className="w-full bg-gradient-brand text-primary-foreground"
            onClick={() => mutation.mutate()}
            disabled={goal.trim().length < 3 || mutation.isPending}
          >
            {mutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Planning…</>
            ) : (
              <><Wand2 className="h-4 w-4" /> Build plan</>
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
