"use client";

import { useActionState, useState } from "react";
import { submitReview, type ActionResult } from "@/actions/reviews";

interface Props {
  developerId: string;
  developerName: string;
  inquiryId?: string;
  onClose: () => void;
}

function StarRating({
  name,
  label,
  required,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-28 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setValue(star)}
            className="p-0.5"
          >
            <span
              className={`material-symbols-outlined text-xl ${
                star <= (hover || value)
                  ? "fill text-warning"
                  : "text-border"
              }`}
            >
              star
            </span>
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value || ""} />
      {required && value === 0 && (
        <span className="text-xs text-error">Required</span>
      )}
    </div>
  );
}

export function ReviewForm({
  developerId,
  developerName,
  inquiryId,
  onClose,
}: Props) {
  const [state, action, pending] = useActionState(submitReview, {
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
            Review Submitted!
          </h2>
          <p className="text-muted mb-6">
            Thank you for reviewing {developerName}.
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
              Write a Review
            </h2>
            <p className="text-sm text-muted">
              Rate your experience with {developerName}
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
          {inquiryId && (
            <input type="hidden" name="inquiryId" value={inquiryId} />
          )}

          {/* Ratings */}
          <div className="space-y-3">
            <StarRating
              name="ratingOverall"
              label="Overall *"
              required
            />
            <StarRating
              name="ratingCommunication"
              label="Communication"
            />
            <StarRating
              name="ratingQuality"
              label="Code Quality"
            />
            <StarRating
              name="ratingTimeliness"
              label="Timeliness"
            />
            <StarRating
              name="ratingValue"
              label="Value"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Your Review
            </label>
            <textarea
              name="reviewText"
              maxLength={2000}
              rows={4}
              placeholder="Share your experience working with this developer..."
              className="px-3 py-2 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="isAnonymous"
              className="accent-primary"
            />
            Submit anonymously
          </label>

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
              {pending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
