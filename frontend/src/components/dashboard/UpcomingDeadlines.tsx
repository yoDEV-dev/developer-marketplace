"use client";

import { useLocale, useTranslations } from "next-intl";

interface Deadline {
  id: string;
  task: string;
  project: string;
  date: string;
  priority: "high" | "medium" | "low";
}

interface UpcomingDeadlinesProps {
  deadlines: Deadline[];
}

const priorityStyles = {
  high: "bg-error/10 text-error border-error/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted/10 text-muted border-muted/20",
};

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-warning">event</span>
        {t("upcomingDeadlines")}
      </h2>

      <div className="space-y-3">
        {deadlines.map((deadline) => {
          const date = new Date(deadline.date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

          let dateLabel = date.toLocaleDateString(locale, { month: "short", day: "numeric" });
          if (isToday) dateLabel = "Today";
          if (isTomorrow) dateLabel = "Tomorrow";

          return (
            <div
              key={deadline.id}
              className={`p-3 rounded-lg border ${priorityStyles[deadline.priority]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {deadline.task}
                  </p>
                  <p className="text-xs text-muted truncate">{deadline.project}</p>
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {dateLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {deadlines.length === 0 && (
        <p className="text-muted text-sm text-center py-4">No upcoming deadlines</p>
      )}
    </div>
  );
}
