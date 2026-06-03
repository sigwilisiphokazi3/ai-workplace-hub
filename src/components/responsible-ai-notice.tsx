import { ShieldAlert } from "lucide-react";

export function ResponsibleAiNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-2.5 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs leading-relaxed text-foreground/80 " +
        className
      }
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> Outputs are AI-generated
        and may be inaccurate, biased, or incomplete. Always review for accuracy, confidentiality,
        and compliance before sharing externally or acting on them.
      </p>
    </div>
  );
}
