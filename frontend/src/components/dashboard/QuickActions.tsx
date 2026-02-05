"use client";

import { useTranslations } from "next-intl";

export function QuickActions() {
  const t = useTranslations("dashboard");

  const actions = [
    { icon: "timer", label: t("logHours"), color: "bg-primary" },
    { icon: "update", label: t("updateAvailability"), color: "bg-accent" },
    { icon: "edit", label: "Edit Profile", color: "bg-warning" },
    { icon: "mail", label: "Check Messages", color: "bg-info" },
  ];

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">bolt</span>
        {t("quickActions")}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-background-alt hover:bg-border transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-white">{action.icon}</span>
            </div>
            <span className="text-xs font-medium text-foreground text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
