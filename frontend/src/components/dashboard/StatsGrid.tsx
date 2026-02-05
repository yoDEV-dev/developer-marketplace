"use client";

import { useTranslations } from "next-intl";

interface Stats {
  earnings: { amount: number; change: number; period: string };
  hours: { amount: number; change: number; period: string };
  views: { amount: number; change: number; period: string };
  activeProjects: number;
}

interface StatsGridProps {
  stats: Stats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const t = useTranslations("dashboard");

  const statCards = [
    {
      label: t("earnings"),
      value: `$${stats.earnings.amount.toLocaleString()}`,
      change: stats.earnings.change,
      icon: "payments",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: t("hours"),
      value: stats.hours.amount.toString(),
      change: stats.hours.change,
      icon: "schedule",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: t("views"),
      value: stats.views.amount.toString(),
      change: stats.views.change,
      icon: "visibility",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: t("activeProjects"),
      value: stats.activeProjects.toString(),
      icon: "work",
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-surface rounded-xl border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            </div>
            {stat.change !== undefined && (
              <span className={`text-xs font-semibold ${stat.change >= 0 ? "text-accent" : "text-error"}`}>
                {stat.change >= 0 ? "+" : ""}{stat.change}%
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
