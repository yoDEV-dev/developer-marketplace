"use client";

import { useActionState } from "react";
import { updateWorkPreferences, type ActionResult } from "@/actions/profile";
import type { EditableProfile } from "@/repositories/profile";

interface Props {
  profile: EditableProfile;
}

const workArrangementOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const durationOptions = [
  { value: "short", label: "Short (< 1 month)" },
  { value: "medium", label: "Medium (1-3 months)" },
  { value: "long", label: "Long (3+ months)" },
  { value: "any", label: "Any duration" },
];

const teamOptions = [
  { value: "solo", label: "Solo" },
  { value: "small", label: "Small team (2-5)" },
  { value: "large", label: "Large team (5+)" },
  { value: "any", label: "Any size" },
];

const contractOptions = [
  { value: "freelance", label: "Freelance" },
  { value: "contract_to_hire", label: "Contract-to-hire" },
  { value: "fulltime", label: "Full-time" },
];

export function WorkPreferencesForm({ profile }: Props) {
  const [state, action, pending] = useActionState(updateWorkPreferences, {
    success: false,
  } as ActionResult);

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">work</span>
        Work Preferences
      </h2>

      {/* Work Arrangement */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Work Arrangement
        </p>
        <div className="flex flex-wrap gap-3">
          {workArrangementOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="workArrangement"
                value={opt.value}
                defaultChecked={profile.work_arrangement.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Time Overlap Note
        </label>
        <input
          name="timeOverlapNote"
          defaultValue={profile.time_overlap_note || ""}
          maxLength={200}
          placeholder='e.g. "Available 9am-5pm EST, flexible for overlap"'
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Preferred Project Duration
        </p>
        <div className="flex flex-wrap gap-3">
          {durationOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="preferredDuration"
                value={opt.value}
                defaultChecked={profile.preferred_duration.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Team Preference */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Team Size Preference
        </p>
        <div className="flex flex-wrap gap-3">
          {teamOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="teamPreference"
                value={opt.value}
                defaultChecked={profile.team_preference.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Contract Type */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Contract Types
        </p>
        <div className="flex flex-wrap gap-3">
          {contractOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="contractOpenness"
                value={opt.value}
                defaultChecked={profile.contract_openness.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="openToSubcontracting"
            defaultChecked={profile.open_to_subcontracting}
            className="accent-primary"
          />
          Open to subcontracting work to others
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="openToBeingSubbed"
            defaultChecked={profile.open_to_being_subbed}
            className="accent-primary"
          />
          Open to being subcontracted
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="ndaWilling"
            defaultChecked={profile.nda_willing}
            className="accent-primary"
          />
          Willing to sign NDAs
        </label>
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">Preferences saved!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Preferences"}
      </button>
    </form>
  );
}
