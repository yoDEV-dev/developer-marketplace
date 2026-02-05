"use client";

import { useTranslations } from "next-intl";

interface Pricing {
  hourlyRate: { min: number; max: number };
  projectMinimum?: number;
  retainerMonthly?: number;
  openToEquity?: boolean;
  freeConsultation?: boolean;
  openToNegotiation?: boolean;
}

interface PricingSectionProps {
  pricing: Pricing;
}

export function PricingSection({ pricing }: PricingSectionProps) {
  const t = useTranslations("pricing");

  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">payments</span>
          {t("hourly")}
        </h2>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {/* Hourly Rate */}
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span className="text-sm font-medium text-muted">{t("hourly")}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              ${pricing.hourlyRate.min} - ${pricing.hourlyRate.max}
            </p>
            <p className="text-xs text-muted mt-1">USD / hour</p>
          </div>

          {/* Project Minimum */}
          {pricing.projectMinimum && (
            <div className="p-4 bg-background-alt rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-muted">work</span>
                <span className="text-sm font-medium text-muted">{t("minProject")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${pricing.projectMinimum.toLocaleString()}
              </p>
              <p className="text-xs text-muted mt-1">USD</p>
            </div>
          )}

          {/* Monthly Retainer */}
          {pricing.retainerMonthly && (
            <div className="p-4 bg-background-alt rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-muted">event_repeat</span>
                <span className="text-sm font-medium text-muted">{t("retainer")}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${pricing.retainerMonthly.toLocaleString()}
              </p>
              <p className="text-xs text-muted mt-1">USD / month</p>
            </div>
          )}
        </div>

        {/* Additional Options */}
        <div className="flex flex-wrap gap-3">
          {pricing.freeConsultation && (
            <div className="flex items-center gap-2 px-3 py-2 bg-accent/10 text-accent rounded-lg">
              <span className="material-symbols-outlined text-lg">videocam</span>
              <span className="text-sm font-medium">{t("freeConsultation")}</span>
            </div>
          )}
          {pricing.openToNegotiation && (
            <div className="flex items-center gap-2 px-3 py-2 bg-background-alt text-foreground rounded-lg">
              <span className="material-symbols-outlined text-lg text-muted">handshake</span>
              <span className="text-sm font-medium">{t("openToNegotiation")}</span>
            </div>
          )}
          {pricing.openToEquity && (
            <div className="flex items-center gap-2 px-3 py-2 bg-background-alt text-foreground rounded-lg">
              <span className="material-symbols-outlined text-lg text-muted">trending_up</span>
              <span className="text-sm font-medium">{t("equity")}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
