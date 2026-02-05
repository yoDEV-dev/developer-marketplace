"use client";

import { useActionState, useState } from "react";
import { submitInquiry, type ActionResult } from "@/actions/inquiries";

interface ProjectType {
  id: string;
  name: string;
}

interface Props {
  developerId: string;
  developerName: string;
  projectTypes: ProjectType[];
  onClose: () => void;
}

const budgetOptions = [
  { value: "", label: "Not sure yet" },
  { value: "< $1,000", label: "< $1,000" },
  { value: "$1,000 - $5,000", label: "$1,000 - $5,000" },
  { value: "$5,000 - $15,000", label: "$5,000 - $15,000" },
  { value: "$15,000 - $50,000", label: "$15,000 - $50,000" },
  { value: "$50,000+", label: "$50,000+" },
];

const timelineOptions = [
  { value: "", label: "Flexible" },
  { value: "< 1 month", label: "< 1 month" },
  { value: "1-3 months", label: "1-3 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "6+ months", label: "6+ months" },
];

export function InquiryForm({
  developerId,
  developerName,
  projectTypes,
  onClose,
}: Props) {
  const [state, action, pending] = useActionState(submitInquiry, {
    success: false,
  } as ActionResult);

  if (state.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full text-center">
          <span className="material-symbols-outlined text-5xl text-success mb-4">
            check_circle
          </span>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Inquiry Sent!
          </h2>
          <p className="text-muted mb-6">
            Your inquiry has been sent to {developerName}. They&apos;ll be notified
            and can respond directly.
          </p>
          <button
            onClick={onClose}
            className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Request a Quote
            </h2>
            <p className="text-sm text-muted">
              Send an inquiry to {developerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background-alt transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form action={action} className="p-6 space-y-5">
          <input type="hidden" name="developerId" value={developerId} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Subject *
            </label>
            <input
              name="subject"
              required
              maxLength={200}
              placeholder="e.g. Need a React developer for my SaaS app"
              className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Project Type
            </label>
            <select
              name="projectTypeId"
              className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a project type</option>
              {projectTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Project Description *
            </label>
            <textarea
              name="description"
              required
              minLength={20}
              maxLength={5000}
              rows={5}
              placeholder="Describe your project goals, technical requirements, and what you're looking for..."
              className="px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Budget Range
              </label>
              <select
                name="budgetRange"
                className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">
                Timeline
              </label>
              <select
                name="timeline"
                className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {timelineOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.error && (
            <p className="text-sm text-error">{state.error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-border text-foreground font-semibold hover:bg-background-alt transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex-1 h-11 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {pending ? "Sending..." : "Send Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
