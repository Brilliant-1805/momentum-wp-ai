import { Copy, Check, RefreshCw, Pencil, Eye, Sparkles, AlertTriangle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { ResponsibleAiNote } from "./app-shell";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
      <p className="mt-1.5 max-w-2xl text-muted-foreground">{description}</p>
    </header>
  );
}

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function ToneSelect<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={
              value === o
                ? "rounded-xl gradient-brand px-3.5 py-2 text-sm font-semibold text-primary-foreground shadow-sm"
                : "rounded-xl border border-border bg-surface/70 px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface"
            }
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={rest.disabled || loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <RefreshCw className="size-4 animate-spin" aria-hidden />
      ) : (
        <Sparkles className="size-4" aria-hidden />
      )}
      {loading ? "Generating…" : children}
    </button>
  );
}

export function GhostButton({
  children,
  icon: Icon,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: typeof Copy }) {
  return (
    <button
      {...rest}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground disabled:opacity-50"
    >
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {children}
    </button>
  );
}

export function InputPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-6">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <GhostButton
      icon={copied ? Check : Copy}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </GhostButton>
  );
}

export function OutputPanel({
  title,
  status,
  onRegenerate,
  editing,
  onToggleEdit,
  copyText,
  emptyTitle,
  emptyHint,
  loadingHint,
  error,
  extraActions,
  children,
}: {
  title: string;
  status: "empty" | "loading" | "ready" | "error";
  onRegenerate?: () => void;
  editing?: boolean;
  onToggleEdit?: () => void;
  copyText?: string;
  emptyTitle: string;
  emptyHint: string;
  loadingHint: string;
  error?: string | null;
  extraActions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="glass-panel flex flex-col rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </p>
        {status === "ready" && (
          <div className="flex flex-wrap gap-1.5">
            {extraActions}
            {copyText !== undefined && <CopyButton text={copyText} />}
            {onRegenerate && (
              <GhostButton icon={RefreshCw} onClick={onRegenerate}>
                Regenerate
              </GhostButton>
            )}
            {onToggleEdit && (
              <GhostButton icon={editing ? Eye : Pencil} onClick={onToggleEdit}>
                {editing ? "Preview" : "Edit"}
              </GhostButton>
            )}
          </div>
        )}
      </div>

      <div className="min-h-[320px] flex-1">
        {status === "empty" && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-surface/40 p-8 text-center">
            <div className="grid size-11 place-items-center rounded-2xl bg-accent text-brand">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <p className="mt-3 font-display font-semibold">{emptyTitle}</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}

        {status === "loading" && (
          <div className="rounded-2xl border border-border/60 bg-surface/50 p-5">
            <div className="space-y-2.5">
              {["w-2/3", "w-full", "w-5/6", "w-1/2", "w-11/12", "w-3/4"].map((w, i) => (
                <div
                  key={i}
                  className={`h-3 animate-pulse rounded bg-muted ${w}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{loadingHint}</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center">
            <AlertTriangle className="size-6 text-destructive" aria-hidden />
            <p className="mt-3 font-display font-semibold">Generation failed</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{error}</p>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="mt-4 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {status === "ready" && children}
      </div>

      <div className="mt-5 border-t border-border/60 pt-3">
        <ResponsibleAiNote variant="inline" />
      </div>
    </section>
  );
}

export function EditableBlock({
  value,
  onChange,
  editing,
  rows = 12,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  rows?: number;
}) {
  if (editing) {
    return (
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="field-input resize-y font-body leading-relaxed"
      />
    );
  }
  return (
    <div className="whitespace-pre-wrap rounded-2xl border border-border/60 bg-surface/70 p-4 text-sm leading-relaxed">
      {value}
    </div>
  );
}
