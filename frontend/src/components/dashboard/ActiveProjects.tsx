"use client";

import { useLocale, useTranslations } from "next-intl";

interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  hoursLogged: number;
  hoursEstimated: number;
  status: "in_progress" | "review" | "completed" | "paused";
  dueDate: string;
}

interface ActiveProjectsProps {
  projects: Project[];
}

const statusStyles = {
  in_progress: { label: "In Progress", color: "bg-primary text-white" },
  review: { label: "In Review", color: "bg-warning text-white" },
  completed: { label: "Completed", color: "bg-accent text-white" },
  paused: { label: "Paused", color: "bg-muted text-white" },
};

export function ActiveProjects({ projects }: ActiveProjectsProps) {
  const locale = useLocale();
  const t = useTranslations("dashboard");

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">work</span>
          {t("activeProjects")}
        </h2>
        <button className="text-primary text-sm font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => {
          const dueDate = new Date(project.dueDate).toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
          });
          const statusConfig = statusStyles[project.status];

          return (
            <div
              key={project.id}
              className="p-4 bg-background-alt rounded-xl hover:bg-border/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{project.name}</h3>
                  <p className="text-sm text-muted">{project.client}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted">Progress</span>
                  <span className="font-semibold text-foreground">{project.progress}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {project.hoursLogged}h / {project.hoursEstimated}h
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">event</span>
                  Due {dueDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
