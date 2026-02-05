"use client";

import { useState } from "react";

export function ProjectFilters() {
  const [budgetType, setBudgetType] = useState<"all" | "fixed" | "hourly">("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = ["React", "Node.js", "Python", "TypeScript", "AWS", "Mobile", "AI/ML", "DevOps"];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <aside className="lg:w-72 shrink-0">
      <div className="bg-surface rounded-xl border border-border p-6 lg:sticky lg:top-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Filters</h2>
          <button className="text-primary text-sm font-semibold hover:underline">
            Clear all
          </button>
        </div>

        {/* Budget Type */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            Budget Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "fixed", label: "Fixed Price" },
              { value: "hourly", label: "Hourly" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setBudgetType(option.value as typeof budgetType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  budgetType === option.value
                    ? "bg-primary text-white"
                    : "bg-background-alt text-foreground hover:bg-border"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            Budget Range
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Min ($)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full h-10 px-3 rounded-lg bg-background-alt border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Max ($)</label>
              <input
                type="number"
                placeholder="10000"
                className="w-full h-10 px-3 rounded-lg bg-background-alt border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            Skills Required
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-background-alt text-foreground hover:bg-border"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Length */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            Project Length
          </h3>
          <div className="space-y-2">
            {["Less than 1 month", "1-3 months", "3-6 months", "6+ months", "Ongoing"].map((duration) => (
              <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {duration}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Client Type */}
        <div>
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            Client
          </h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <span className="text-sm text-foreground">Verified clients only</span>
          </label>
        </div>

        {/* Apply Button - Mobile */}
        <div className="mt-6 lg:hidden">
          <button className="w-full h-12 bg-primary text-white font-bold rounded-xl">
            Apply Filters
          </button>
        </div>
      </div>
    </aside>
  );
}
