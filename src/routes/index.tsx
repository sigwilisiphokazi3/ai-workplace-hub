import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workmate AI" },
      {
        name: "description",
        content:
          "Your AI productivity dashboard: smart emails, meeting summaries, task planning, research, and a chat assistant.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails with the right tone in seconds.",
    href: "/email",
    icon: Mail,
    color: "from-violet-500 to-indigo-500",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into clear summaries and action items.",
    href: "/summarize",
    icon: FileText,
    color: "from-sky-500 to-cyan-500",
  },
  {
    title: "AI Task Planner",
    description: "Break goals into prioritized, time-boxed task plans.",
    href: "/planner",
    icon: ListChecks,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefings on any topic with key findings.",
    href: "/research",
    icon: Search,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "AI Chatbot",
    description: "Conversational coworker for brainstorming and Q&A.",
    href: "/chat",
    icon: MessageSquare,
    color: "from-rose-500 to-pink-500",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-surface p-8 shadow-elegant">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkle className="h-3 w-3 text-primary" />
            Powered by Lovable AI
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
            Your AI workplace productivity assistant
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Automate the repetitive parts of your workday — emails, meeting notes, planning, and
            research — so you can focus on the work that matters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:scale-[1.02]"
            >
              <MessageSquare className="h-4 w-4" /> Open AI Chat
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Mail className="h-4 w-4" /> Draft an email
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Stat icon={Clock} label="Tasks automated" value="5 tools" hint="Email, notes, plans, research, chat" />
        <Stat icon={Sparkle} label="Model" value="Gemini 3 Flash" hint="Fast, accurate responses" />
        <Stat icon={ShieldCheck} label="Privacy" value="Your edits stay local" hint="Outputs are editable before use" />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Productivity tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.href}
              to={t.href}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${t.color} text-white shadow-sm`}
              >
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{t.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.description}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ResponsibleAiNotice />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1.5 text-lg font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}
