"use client";

import { useTranslations } from "next-intl";

export function MobileFilterChips() {
  const t = useTranslations("developers");

  const roles = [
    { key: "frontend", label: t("frontend") },
    { key: "backend", label: t("backend") },
    { key: "mobile", label: t("mobile") },
    { key: "devops", label: t("devops") },
  ];

  return (
    <div className="lg:hidden flex gap-3 px-4 py-3 overflow-x-auto no-scrollbar bg-surface border-b border-border">
      <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-4 text-white shadow-md">
        <span className="text-sm font-semibold">{t("allRoles")}</span>
      </button>
      {roles.map((role) => (
        <button
          key={role.key}
          className="flex h-9 shrink-0 items-center justify-center rounded-full bg-background-alt px-4 text-foreground border border-border"
        >
          <span className="text-sm font-medium">{role.label}</span>
        </button>
      ))}
    </div>
  );
}
