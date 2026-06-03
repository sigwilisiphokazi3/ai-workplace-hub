import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
}

export function PageHeader({ title, description, icon, badge }: Props) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-elegant">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {badge && (
            <span className="rounded-full border bg-accent/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
