"use client";

import { useActionState } from "react";
import { updateBasicInfo, type ActionResult } from "@/actions/profile";
import type { EditableProfile } from "@/repositories/profile";
import type { Country } from "@/repositories/lookups";

interface Props {
  profile: EditableProfile;
  countries: Country[];
}

const experienceLevels = [
  { value: "", label: "Not set" },
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10-15", label: "10-15 years" },
  { value: "15+", label: "15+ years" },
];

const availabilityOptions = [
  { value: "available", label: "Available Now" },
  { value: "limited", label: "Limited Availability" },
  { value: "booked", label: "Currently Booked" },
  { value: "not_taking_work", label: "Not Taking Work" },
];

export function BasicInfoForm({ profile, countries }: Props) {
  const [state, action, pending] = useActionState(updateBasicInfo, {
    success: false,
  } as ActionResult);

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">person</span>
        Basic Information
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Display Name *
          </label>
          <input
            name="displayName"
            defaultValue={profile.display_name}
            required
            maxLength={60}
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Availability
          </label>
          <select
            name="availabilityStatus"
            defaultValue={profile.availability_status}
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {availabilityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Headline *
        </label>
        <input
          name="headline"
          defaultValue={profile.headline}
          required
          maxLength={120}
          placeholder="e.g. Senior Full-Stack Engineer"
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Bio (English)
        </label>
        <textarea
          name="bio"
          defaultValue={profile.bio || ""}
          maxLength={2000}
          rows={4}
          placeholder="Tell clients about yourself, your experience, and what makes you stand out..."
          className="px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Bio (Spanish)
        </label>
        <textarea
          name="bioEs"
          defaultValue={profile.bio_es || ""}
          maxLength={2000}
          rows={4}
          placeholder="Cuéntale a los clientes sobre ti..."
          className="px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
        />
        <label className="flex items-center gap-2 text-sm text-muted mt-1">
          <input
            type="checkbox"
            name="bilingualProfile"
            defaultChecked={profile.bilingual_profile}
            className="accent-primary"
          />
          Show bilingual profile
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Country</label>
          <select
            name="countryCode"
            defaultValue={profile.country_code || ""}
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag_emoji} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">City</label>
          <input
            name="city"
            defaultValue={profile.city || ""}
            maxLength={100}
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Timezone
          </label>
          <input
            name="timezone"
            defaultValue={profile.timezone || ""}
            placeholder="e.g. America/Santiago"
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Experience Level
        </label>
        <select
          name="yearsExperience"
          defaultValue={profile.years_experience || ""}
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {experienceLevels.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="text-sm text-error">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-success">Saved successfully!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Basic Info"}
      </button>
    </form>
  );
}
