import { useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
  emptyHint?: string;
}

export function EditableOutput({ value, onChange, onRegenerate, isGenerating, emptyHint }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Output</h3>
        <div className="flex gap-1.5">
          {onRegenerate && (
            <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={isGenerating || !value}>
              <RotateCcw className="h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={copy} disabled={!value}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={emptyHint ?? "Generated output will appear here. You can edit it freely."}
        className="min-h-[420px] flex-1 resize-none bg-card font-mono text-sm leading-relaxed"
      />
      <p className="text-[11px] text-muted-foreground">
        Editable — make changes before copying or sending. AI-generated content may contain errors.
      </p>
    </div>
  );
}
