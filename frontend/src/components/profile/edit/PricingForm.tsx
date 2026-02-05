"use client";

import { useActionState } from "react";
import { updatePricing, type ActionResult } from "@/actions/profile";
import type { EditableProfile } from "@/repositories/profile";
import type { Currency } from "@/repositories/lookups";

interface Props {
  profile: EditableProfile;
  currencies: Currency[];
  currentPricingModels: string[];
  currentPaymentMethods: string[];
}

const pricingModelOptions = [
  { value: "hourly", label: "Hourly" },
  { value: "project_based", label: "Project-Based" },
  { value: "monthly_retainer", label: "Monthly Retainer" },
  { value: "milestone", label: "Milestone" },
  { value: "get_a_quote", label: "Get a Quote" },
  { value: "equity_rev_share", label: "Equity / Revenue Share" },
];

const paymentMethodOptions = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wise", label: "Wise" },
  { value: "crypto", label: "Crypto" },
  { value: "payoneer", label: "Payoneer" },
  { value: "other", label: "Other" },
];

export function PricingForm({
  profile,
  currencies,
  currentPricingModels,
  currentPaymentMethods,
}: Props) {
  const [state, action, pending] = useActionState(updatePricing, {
    success: false,
  } as ActionResult);

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          payments
        </span>
        Pricing
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Currency
          </label>
          <select
            name="pricingCurrency"
            defaultValue={profile.pricing_currency || "USD"}
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Hourly Rate Min
          </label>
          <input
            name="hourlyRateMin"
            type="number"
            min={0}
            max={999}
            defaultValue={profile.hourly_rate_min ?? ""}
            placeholder="e.g. 45"
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Hourly Rate Max
          </label>
          <input
            name="hourlyRateMax"
            type="number"
            min={0}
            max={999}
            defaultValue={profile.hourly_rate_max ?? ""}
            placeholder="e.g. 80"
            className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">
          Project Budget Range
        </label>
        <input
          name="projectBudgetRange"
          defaultValue={profile.project_budget_range || ""}
          placeholder='e.g. "$5,000 - $15,000"'
          maxLength={30}
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="freeConsultation"
            defaultChecked={profile.free_consultation}
            className="accent-primary"
          />
          Free initial consultation
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="openToNegotiation"
            defaultChecked={profile.open_to_negotiation}
            className="accent-primary"
          />
          Open to negotiation
        </label>
      </div>

      {/* Pricing Models */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Pricing Models
        </p>
        <div className="flex flex-wrap gap-3">
          {pricingModelOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="pricingModels"
                value={opt.value}
                defaultChecked={currentPricingModels.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-muted uppercase tracking-wider">
          Payment Methods
        </p>
        <div className="flex flex-wrap gap-3">
          {paymentMethodOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <input
                type="checkbox"
                name="paymentMethods"
                value={opt.value}
                defaultChecked={currentPaymentMethods.includes(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">Pricing saved!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Pricing"}
      </button>
    </form>
  );
}
