import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export const NAV: Array<{
  to: string;
  label: string;
  short: string;
  icon: LucideIcon;
}> = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", short: "Email", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", short: "Notes", icon: FileText },
  { to: "/planner", label: "Task Planner", short: "Plan", icon: CalendarRange },
];

const DISCLAIMER =
  "AI-generated content may contain errors or omissions. Review and edit everything before you send it, act on it, or rely on it for a workplace decision.";

function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid place-items-center rounded-2xl gradient-brand font-display font-bold text-primary-foreground ${
          size === "sm" ? "size-9 text-sm" : "size-10"
        }`}
      >
        M
      </div>
      <div className="leading-tight">
        <p className="font-display font-bold">Momentum</p>
        <p className="text-[11px] text-muted-foreground">Workplace AI Assistant</p>
      </div>
    </div>
  );
}

export function ResponsibleAiNote({ variant = "block" }: { variant?: "block" | "inline" }) {
  if (variant === "inline") {
    return (
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground/70">Responsible AI —</span> {DISCLAIMER}
      </p>
    );
  }
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/60 p-4 text-[11px] leading-relaxed text-muted-foreground">
      <span className="font-semibold text-foreground/70">Responsible AI</span> — {DISCLAIMER}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-16 size-96 rounded-full bg-lilac/25 blur-3xl" />
        <div className="absolute top-1/3 -right-20 size-[28rem] rounded-full bg-sky/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-candy/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-1 p-6 lg:flex">
          <div className="mb-8 px-2">
            <Logo />
          </div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Workspace
          </p>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface/60"
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm bg-surface/80 backdrop-blur-md font-semibold text-brand shadow-sm",
                }}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <ResponsibleAiNote />
          </div>
        </aside>

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <Logo size="sm" />
            </div>
            <nav className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
              {NAV.map(({ to, short, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  activeOptions={{ exact: to === "/" }}
                  className="flex shrink-0 items-center gap-1.5 rounded-xl border border-border/50 bg-surface/50 px-3 py-2 text-xs font-medium text-muted-foreground"
                  activeProps={{
                    className:
                      "flex shrink-0 items-center gap-1.5 rounded-xl border border-brand/30 bg-surface px-3 py-2 text-xs font-semibold text-brand shadow-sm",
                  }}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {short}
                </Link>
              ))}
            </nav>
          </div>

          {children}

          <div className="mt-8 lg:hidden">
            <ResponsibleAiNote />
          </div>
        </main>
      </div>
    </div>
  );
}
