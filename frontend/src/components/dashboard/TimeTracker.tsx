"use client";

import { useState, useEffect, useRef, useTransition, useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  startTimer,
  stopTimer,
  submitTimeEntry,
  type ActionResult,
} from "@/actions/time-entries";

interface Project {
  id: string;
  name: string;
}

interface ActiveTimer {
  timer_started_at: string | null;
  project_name: string | null;
}

interface TimeTrackerProps {
  projects: Project[];
  activeTimer?: ActiveTimer | null;
  weeklyHours?: number;
}

export function TimeTracker({ projects, activeTimer, weeklyHours = 0 }: TimeTrackerProps) {
  const t = useTranslations("timeTracking");
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || "");
  const [isTracking, setIsTracking] = useState(!!activeTimer);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [timerPending, startTimerTransition] = useTransition();

  const [entryState, entryAction, entryPending] = useActionState(submitTimeEntry, {
    success: false,
  } as ActionResult);

  // Initialize elapsed from active timer
  useEffect(() => {
    if (activeTimer?.timer_started_at) {
      const started = new Date(activeTimer.timer_started_at).getTime();
      setElapsed(Math.floor((Date.now() - started) / 1000));
      setIsTracking(true);
    }
  }, [activeTimer]);

  // Run the interval when tracking
  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTracking]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;
  const formatTime = (num: number) => num.toString().padStart(2, "0");

  const selectedProjectName = projects.find((p) => p.id === selectedProject)?.name;

  function handleToggle() {
    if (isTracking) {
      // Stop timer
      startTimerTransition(async () => {
        await stopTimer();
        setIsTracking(false);
        setElapsed(0);
      });
    } else {
      // Start timer
      startTimerTransition(async () => {
        await startTimer(selectedProjectName);
        setIsTracking(true);
        setElapsed(0);
      });
    }
  }

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">timer</span>
          {t("title")}
        </h2>
        <span className="text-xs text-muted">
          {t("totalHoursWeek")}: <span className="font-bold text-foreground">{weeklyHours}h</span>
        </span>
      </div>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted mb-2">
          {t("selectProject")}
        </label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          disabled={isTracking}
          className="w-full h-12 px-4 rounded-xl bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Timer Display */}
      <div className="bg-background-alt rounded-xl p-6 mb-6">
        <p className="text-xs text-muted uppercase tracking-wider mb-2 text-center">
          {t("activeTracking")}
        </p>
        <div className="flex items-center justify-center gap-2 text-4xl font-mono font-bold text-foreground">
          <div className="flex flex-col items-center">
            <span>{formatTime(hours)}</span>
            <span className="text-xs text-muted font-normal">{t("hours")}</span>
          </div>
          <span className="text-muted">:</span>
          <div className="flex flex-col items-center">
            <span>{formatTime(minutes)}</span>
            <span className="text-xs text-muted font-normal">{t("minutes")}</span>
          </div>
          <span className="text-muted">:</span>
          <div className="flex flex-col items-center">
            <span>{formatTime(seconds)}</span>
            <span className="text-xs text-muted font-normal">{t("seconds")}</span>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={timerPending}
          className={`w-full mt-6 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${
            isTracking
              ? "bg-error text-white hover:bg-error/90"
              : "bg-accent text-white hover:bg-accent/90"
          }`}
        >
          <span className="material-symbols-outlined">
            {isTracking ? "stop" : "play_arrow"}
          </span>
          {timerPending ? "..." : isTracking ? t("stopTimer") : t("startTimer")}
        </button>
      </div>

      {/* Manual Entry */}
      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">{t("manualEntry")}</h3>

        <form action={entryAction}>
          <input type="hidden" name="projectName" value={selectedProjectName || ""} />
          <input type="hidden" name="isBillable" value="on" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-muted mb-1">{t("date")}</label>
              <input
                name="entryDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full h-10 px-3 rounded-lg bg-background-alt border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">{t("duration")}</label>
              <input
                name="hours"
                type="number"
                step="0.25"
                min="0.01"
                max="24"
                placeholder="2.5"
                className="w-full h-10 px-3 rounded-lg bg-background-alt border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-muted mb-1">{t("workDescription")}</label>
            <textarea
              name="description"
              placeholder={t("workDescriptionPlaceholder")}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {entryState.error && (
            <p className="text-sm text-error mb-3">{entryState.error}</p>
          )}
          {entryState.success && (
            <p className="text-sm text-success mb-3">Time logged!</p>
          )}

          <button
            type="submit"
            disabled={entryPending}
            className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {entryPending ? "Saving..." : t("submitLog")}
          </button>
        </form>
      </div>
    </div>
  );
}
