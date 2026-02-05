"use client";

import { useTransition } from "react";
import { changeInquiryStatus } from "@/actions/inquiries";
import type { InquiryStatus } from "@/repositories/inquiries";

interface Inquiry {
  id: string;
  subject: string;
  description: string;
  project_type_name: string | null;
  budget_range: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
}

interface Props {
  inquiries: Inquiry[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "New", color: "text-primary", bg: "bg-primary/10" },
  viewed: { label: "Viewed", color: "text-info", bg: "bg-info/10" },
  responded: { label: "Responded", color: "text-accent", bg: "bg-accent/10" },
  in_discussion: { label: "In Discussion", color: "text-warning", bg: "bg-warning/10" },
  accepted: { label: "Accepted", color: "text-success", bg: "bg-success/10" },
  declined: { label: "Declined", color: "text-muted", bg: "bg-muted/10" },
  completed: { label: "Completed", color: "text-success", bg: "bg-success/10" },
  cancelled: { label: "Cancelled", color: "text-muted", bg: "bg-muted/10" },
};

function StatusActions({ inquiry }: { inquiry: Inquiry }) {
  const [pending, startTransition] = useTransition();

  function handleAction(newStatus: InquiryStatus) {
    startTransition(async () => {
      await changeInquiryStatus(inquiry.id, newStatus);
    });
  }

  if (pending) {
    return <span className="text-xs text-muted">Updating...</span>;
  }

  switch (inquiry.status) {
    case "pending":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("responded")}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Respond
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:bg-background-alt transition-colors"
          >
            Decline
          </button>
        </div>
      );
    case "viewed":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("responded")}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Respond
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:bg-background-alt transition-colors"
          >
            Decline
          </button>
        </div>
      );
    case "responded":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("accepted")}
            className="text-xs px-3 py-1.5 rounded-lg bg-success text-white font-semibold hover:bg-success/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:bg-background-alt transition-colors"
          >
            Decline
          </button>
        </div>
      );
    case "in_discussion":
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleAction("accepted")}
            className="text-xs px-3 py-1.5 rounded-lg bg-success text-white font-semibold hover:bg-success/90 transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => handleAction("declined")}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:bg-background-alt transition-colors"
          >
            Decline
          </button>
        </div>
      );
    case "accepted":
      return (
        <button
          onClick={() => handleAction("completed")}
          className="text-xs px-3 py-1.5 rounded-lg bg-success text-white font-semibold hover:bg-success/90 transition-colors"
        >
          Mark Complete
        </button>
      );
    default:
      return null;
  }
}

export function InquiryInbox({ inquiries }: Props) {
  if (inquiries.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8 text-center">
        <span className="material-symbols-outlined text-5xl text-muted mb-4">
          inbox
        </span>
        <h3 className="text-lg font-bold text-foreground mb-1">
          No inquiries yet
        </h3>
        <p className="text-sm text-muted">
          When clients send you inquiries, they&apos;ll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => {
        const config = statusConfig[inquiry.status] || statusConfig.pending;
        const date = new Date(inquiry.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={inquiry.id}
            className="bg-surface rounded-xl border border-border p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground truncate">
                  {inquiry.subject}
                </h3>
                <p className="text-xs text-muted mt-0.5">{date}</p>
              </div>
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}
              >
                {config.label}
              </span>
            </div>

            <p className="text-sm text-muted line-clamp-3">
              {inquiry.description}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-muted">
              {inquiry.project_type_name && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    category
                  </span>
                  {inquiry.project_type_name}
                </span>
              )}
              {inquiry.budget_range && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    payments
                  </span>
                  {inquiry.budget_range}
                </span>
              )}
              {inquiry.timeline && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    schedule
                  </span>
                  {inquiry.timeline}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end pt-1">
              <StatusActions inquiry={inquiry} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
