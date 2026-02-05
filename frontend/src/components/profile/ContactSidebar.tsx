"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InquiryForm } from "@/components/inquiries/InquiryForm";

interface ProjectType {
  id: string;
  name: string;
}

interface Developer {
  id: string;
  name: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  responseTime?: string;
  availability: "available" | "limited" | "booked" | "not_taking_work";
  calendarUrl?: string | null;
}

interface ContactSidebarProps {
  developer: Developer;
  projectTypes?: ProjectType[];
}

export function ContactSidebar({ developer, projectTypes = [] }: ContactSidebarProps) {
  const t = useTranslations("profile");
  const tPricing = useTranslations("pricing");
  const tAvail = useTranslations("availability");
  const [showInquiry, setShowInquiry] = useState(false);

  const availabilityStyles = {
    available: { key: "available" as const, color: "text-accent", bg: "bg-accent/10" },
    limited: { key: "limited" as const, color: "text-warning", bg: "bg-warning/10" },
    booked: { key: "booked" as const, color: "text-muted", bg: "bg-muted/10" },
    not_taking_work: { key: "notTakingWork" as const, color: "text-muted", bg: "bg-muted/10" },
  };

  const availConfig = availabilityStyles[developer.availability];

  return (
    <>
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-24">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
            {/* Pricing Summary */}
            {developer.hourlyRateMin && developer.hourlyRateMax && (
              <div className="text-center mb-6">
                <p className="text-sm text-muted mb-1">{tPricing("hourly")}</p>
                <p className="text-3xl font-bold text-foreground">
                  ${developer.hourlyRateMin} - ${developer.hourlyRateMax}
                </p>
                <p className="text-xs text-muted">USD / hour</p>
              </div>
            )}

            {/* Availability Status */}
            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl mb-6 ${availConfig.bg}`}>
              <span className={`w-2 h-2 rounded-full ${developer.availability === "available" ? "bg-accent animate-pulse" : developer.availability === "limited" ? "bg-warning" : "bg-muted"}`} />
              <span className={`font-semibold ${availConfig.color}`}>
                {tAvail(availConfig.key)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full h-12 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors shadow-md">
                <span className="material-symbols-outlined">mail</span>
                {t("message")}
              </button>

              <button
                onClick={() => setShowInquiry(true)}
                className="w-full h-12 rounded-xl bg-accent text-white font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors shadow-md"
              >
                <span className="material-symbols-outlined">request_quote</span>
                {t("requestQuote")}
              </button>

              {developer.calendarUrl ? (
                <a
                  href={developer.calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-background-alt text-foreground font-semibold flex items-center justify-center gap-2 border border-border hover:bg-border transition-colors"
                >
                  <span className="material-symbols-outlined">calendar_month</span>
                  {t("bookCall")}
                </a>
              ) : (
                <button className="w-full h-12 rounded-xl bg-background-alt text-foreground font-semibold flex items-center justify-center gap-2 border border-border hover:bg-border transition-colors">
                  <span className="material-symbols-outlined">calendar_month</span>
                  {t("bookCall")}
                </button>
              )}
            </div>

            {/* Quick Info */}
            <div className="mt-6 pt-6 border-t border-border space-y-4">
              {developer.responseTime && (
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">bolt</span>
                  <div>
                    <p className="text-xs text-muted">{t("responseTime")}</p>
                    <p className="font-medium text-foreground">{developer.responseTime}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted">security</span>
                <div>
                  <p className="text-xs text-muted">{t("paymentProtection")}</p>
                  <p className="font-medium text-foreground">yoDEV Escrow</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted">support_agent</span>
                <div>
                  <p className="text-xs text-muted">{t("support")}</p>
                  <p className="font-medium text-foreground">{t("supportAvailable")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-4 p-4 bg-surface rounded-xl border border-border">
            <div className="flex items-center justify-center gap-4 text-muted">
              <div className="flex items-center gap-1 text-xs">
                <span className="material-symbols-outlined text-base fill text-primary">verified</span>
                <span>{t("idVerified")}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="material-symbols-outlined text-base fill text-accent">workspace_premium</span>
                <span>{t("topRated")}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Inquiry Modal */}
      {showInquiry && (
        <InquiryForm
          developerId={developer.id}
          developerName={developer.name}
          projectTypes={projectTypes}
          onClose={() => setShowInquiry(false)}
        />
      )}
    </>
  );
}
