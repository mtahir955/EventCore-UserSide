"use client";

import {
  getLifecycleLabel,
  getModeLabel,
  getPrivacyLabel,
  type EventLifecycleStatus,
  type EventMode,
  type EventPrivacyType,
} from "@/lib/event-publishing";

const badgeClassMap: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-200",
  SCHEDULED:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100",
  PUBLISHED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100",
  UNPUBLISHED:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-100",
  "in-person":
    "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-100",
  virtual: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100",
  hybrid:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-100",
  public: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-100",
  "link-only":
    "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100",
  "password-protected":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-100",
  "invite-only":
    "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-100",
};

function Badge({
  tone,
  label,
}: {
  tone: string;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ${badgeClassMap[tone] || badgeClassMap.DRAFT}`}
    >
      {label}
    </span>
  );
}

export function EventLifecycleBadge({
  status,
}: {
  status: EventLifecycleStatus;
}) {
  return <Badge tone={status} label={getLifecycleLabel(status)} />;
}

export function EventModeBadge({ mode }: { mode: EventMode }) {
  return <Badge tone={mode} label={getModeLabel(mode)} />;
}

export function EventPrivacyBadge({
  privacyType,
}: {
  privacyType: EventPrivacyType;
}) {
  if (privacyType === "public") return null;
  return <Badge tone={privacyType} label={getPrivacyLabel(privacyType)} />;
}

