"use client";

import { useState } from "react";

const techStacks = ["React", "Node.js", "Python", "TypeScript", "AWS", "Flutter", "PostgreSQL", "Go"];
const availabilityOptions = [
  { value: "available", label: "Available Now", badge: "Immediate" },
  { value: "limited", label: "Limited Availability" },
  { value: "booked", label: "Currently Booked" },
];

export function FilterSidebar() {
  const [selectedTech, setSelectedTech] = useState<string[]>(["React"]);
  const [selectedAvailability, setSelectedAvailability] = useState("available");
  const [rateRange, setRateRange] = useState([35, 120]);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [hasPortfolio, setHasPortfolio] = useState(false);

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Filters</h2>
        <button className="text-primary text-sm font-semibold hover:underline">
          Clear all
        </button>
      </div>

      {/* Search Keywords */}
      <div className="mb-6">
        <label className="flex flex-col gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search keywords..."
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </label>
      </div>

      {/* Tech Stack */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
          Tech Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {techStacks.map((tech) => {
            const isSelected = selectedTech.includes(tech);
            return (
              <button
                key={tech}
                onClick={() => toggleTech(tech)}
                className={`h-9 px-4 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-white"
                    : "bg-background-alt text-foreground hover:bg-border"
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">
          Availability
        </h3>
        <div className="space-y-3">
          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAvailability === option.value
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  {selectedAvailability === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-foreground font-medium">{option.label}</span>
              </div>
              {option.badge && (
                <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded">
                  {option.badge}
                </span>
              )}
              <input
                type="radio"
                name="availability"
                value={option.value}
                checked={selectedAvailability === option.value}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="sr-only"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Hourly Rate */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
            Hourly Rate (USD)
          </h3>
          <span className="text-sm font-bold text-primary">
            ${rateRange[0]} - ${rateRange[1]}+
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute w-full h-1.5 bg-border rounded-full" />
          <div
            className="absolute h-1.5 bg-primary rounded-full"
            style={{
              left: `${(rateRange[0] / 150) * 100}%`,
              right: `${100 - (rateRange[1] / 150) * 100}%`,
            }}
          />
          <input
            type="range"
            min="10"
            max="150"
            value={rateRange[0]}
            onChange={(e) => setRateRange([parseInt(e.target.value), rateRange[1]])}
            className="absolute w-full h-6 opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted font-medium">
          <span>$10</span>
          <span>$150+</span>
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
          Experience Level
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {["1-2y", "3-5y", "5-8y", "8y+"].map((exp, i) => (
            <button
              key={exp}
              className={`h-10 rounded-lg text-xs font-bold transition-colors ${
                i === 1
                  ? "bg-primary text-white"
                  : "bg-background-alt text-foreground hover:bg-border"
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined fill text-primary">verified</span>
            <span className="font-medium text-foreground">Verified only</span>
          </div>
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              verifiedOnly ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                verifiedOnly ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-muted">folder_special</span>
            <span className="font-medium text-foreground">Has portfolio</span>
          </div>
          <button
            onClick={() => setHasPortfolio(!hasPortfolio)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              hasPortfolio ? "bg-primary" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                hasPortfolio ? "right-0.5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Apply Button (Mobile) */}
      <div className="mt-8 lg:hidden">
        <button className="w-full h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2">
          Apply Filters
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
}
