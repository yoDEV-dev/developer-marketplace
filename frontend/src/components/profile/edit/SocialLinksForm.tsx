"use client";

import { useActionState } from "react";
import { updateSocialLinks, type ActionResult } from "@/actions/profile";
import type { EditableProfile } from "@/repositories/profile";

interface Props {
  profile: EditableProfile;
}

const linkFields = [
  { name: "calendarUrl", label: "Calendar (Calendly, Cal.com)", icon: "calendar_month", placeholder: "https://calendly.com/you" },
  { name: "websiteUrl", label: "Website", icon: "language", placeholder: "https://yoursite.com" },
  { name: "githubUrl", label: "GitHub", icon: "code", placeholder: "https://github.com/username" },
  { name: "linkedinUrl", label: "LinkedIn", icon: "badge", placeholder: "https://linkedin.com/in/username" },
  { name: "stackoverflowUrl", label: "Stack Overflow", icon: "help", placeholder: "https://stackoverflow.com/users/123456" },
  { name: "twitterUrl", label: "Twitter / X", icon: "tag", placeholder: "https://x.com/username" },
] as const;

export function SocialLinksForm({ profile }: Props) {
  const [state, action, pending] = useActionState(updateSocialLinks, {
    success: false,
  } as ActionResult);

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">link</span>
        Links & Contact
      </h2>

      <div className="space-y-4">
        {linkFields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-muted text-[18px]">
                {field.icon}
              </span>
              {field.label}
            </label>
            <input
              name={field.name}
              type="url"
              defaultValue={
                (profile[field.name as keyof EditableProfile] as string) || ""
              }
              placeholder={field.placeholder}
              className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">Links saved!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Links"}
      </button>
    </form>
  );
}
