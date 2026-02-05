"use client";

import Image from "next/image";
import { useLocale } from "next-intl";

interface Client {
  name: string;
  avatarUrl?: string;
  verified: boolean;
}

interface Project {
  id: string;
  title: string;
  client: Client;
  description: string;
  budget: { min: number; max: number; type: "fixed" | "hourly" };
  duration: string;
  skills: string[];
  postedAt: string;
  proposals: number;
  status: "open" | "in_progress" | "completed" | "closed";
}

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const locale = useLocale();

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-surface rounded-xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-background-alt">
                    {project.client.avatarUrl ? (
                      <Image
                        src={project.client.avatarUrl}
                        alt={project.client.name}
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-muted text-sm">business</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted">{project.client.name}</span>
                  {project.client.verified && (
                    <span className="material-symbols-outlined fill text-primary text-sm">verified</span>
                  )}
                </div>
                <span className="text-muted">•</span>
                <span className="text-sm text-muted">{formatTimeAgo(project.postedAt)}</span>
              </div>
            </div>

            <button className="text-muted hover:text-foreground transition-colors">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
              >
                {skill}
              </span>
            ))}
            {project.skills.length > 5 && (
              <span className="px-2 py-1 bg-background-alt text-muted text-xs font-medium rounded">
                +{project.skills.length - 5} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-6">
              {/* Budget */}
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-accent text-lg">payments</span>
                <span className="font-bold text-foreground">
                  ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                </span>
                <span className="text-xs text-muted">
                  {project.budget.type === "hourly" ? "/hr" : " fixed"}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-1 text-muted">
                <span className="material-symbols-outlined text-lg">schedule</span>
                <span className="text-sm">{project.duration}</span>
              </div>

              {/* Proposals */}
              <div className="flex items-center gap-1 text-muted">
                <span className="material-symbols-outlined text-lg">description</span>
                <span className="text-sm">{project.proposals} proposals</span>
              </div>
            </div>

            <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors">
              Submit Proposal
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
