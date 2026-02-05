"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface Developer {
  id: string;
  name: string;
  headline: string;
  photoUrl?: string;
  coverUrl?: string;
  countryFlag?: string;
  country?: string;
  city?: string;
  timezone?: string;
  rating: number;
  reviewCount: number;
  availability: "available" | "limited" | "booked" | "not_taking_work";
  responseTime?: string;
  memberSince: string;
  verified?: boolean;
  topRated?: boolean;
}

interface ProfileHeaderProps {
  developer: Developer;
}

const availabilityStyles = {
  available: { key: "available" as const, color: "bg-accent", textColor: "text-accent" },
  limited: { key: "limited" as const, color: "bg-warning", textColor: "text-warning" },
  booked: { key: "booked" as const, color: "bg-muted", textColor: "text-muted" },
  not_taking_work: { key: "notTakingWork" as const, color: "bg-muted", textColor: "text-muted" },
};

export function ProfileHeader({ developer }: ProfileHeaderProps) {
  const locale = useLocale();
  const t = useTranslations("profile");
  const tAvail = useTranslations("availability");

  const availConfig = availabilityStyles[developer.availability];
  const memberDate = new Date(developer.memberSince).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="relative">
      {/* Back Button - Mobile */}
      <div className="absolute top-4 left-4 z-20 lg:hidden">
        <Link
          href={`/${locale}/developers`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 lg:h-64 bg-gradient-to-br from-primary to-primary-dark">
        {developer.coverUrl && (
          <Image
            src={developer.coverUrl}
            alt=""
            fill
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:gap-6 -mt-16 lg:-mt-20">
          {/* Avatar */}
          <div className="relative z-10 mb-4 lg:mb-0">
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl border-4 border-surface bg-surface overflow-hidden shadow-xl">
              {developer.photoUrl ? (
                <Image
                  src={developer.photoUrl}
                  alt={developer.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-background-alt">
                  <span className="material-symbols-outlined text-5xl text-muted">person</span>
                </div>
              )}
            </div>
            {/* Online Indicator */}
            <div
              className={`absolute bottom-2 right-2 w-5 h-5 ${availConfig.color} rounded-full border-3 border-surface`}
            />
          </div>

          {/* Name & Info */}
          <div className="flex-1 pb-4 lg:pb-6">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {developer.name}
              </h1>
              {developer.countryFlag && (
                <span className="text-2xl">{developer.countryFlag}</span>
              )}
              {developer.verified && (
                <span className="material-symbols-outlined fill text-primary text-xl" title={t("verified")}>
                  verified
                </span>
              )}
              {developer.topRated && (
                <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-bold uppercase">
                  {t("topRated")}
                </span>
              )}
            </div>

            <p className="text-lg text-primary font-semibold mb-2">{developer.headline}</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {developer.city && developer.country && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {developer.city}, {developer.country}
                </span>
              )}
              {developer.timezone && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  {developer.timezone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">calendar_month</span>
                {t("memberSince", { date: memberDate })}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {/* Rating */}
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined fill text-accent text-lg">star</span>
                <span className="font-bold text-foreground">{developer.rating.toFixed(1)}</span>
                <span className="text-muted">({t("reviews_count", { count: developer.reviewCount })})</span>
              </div>

              {/* Availability */}
              <div className={`flex items-center gap-1.5 ${availConfig.textColor}`}>
                <span className={`w-2 h-2 rounded-full ${availConfig.color} ${developer.availability === "available" ? "animate-pulse" : ""}`} />
                <span className="font-medium text-sm">{tAvail(availConfig.key)}</span>
              </div>

              {/* Response Time */}
              {developer.responseTime && (
                <div className="flex items-center gap-1 text-muted text-sm">
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>{t("responseTime")}: {developer.responseTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3 pb-6">
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-background-alt border border-border text-muted hover:text-foreground transition-colors">
              <span className="material-symbols-outlined">bookmark</span>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl bg-background-alt border border-border text-muted hover:text-foreground transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border p-4 safe-area-bottom">
        <div className="flex gap-3">
          <button className="flex-1 h-14 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg">
            <span className="material-symbols-outlined">mail</span>
            {t("message")}
          </button>
          <button className="flex-1 h-14 rounded-xl bg-accent text-white font-bold flex items-center justify-center gap-2 shadow-lg">
            <span className="material-symbols-outlined">request_quote</span>
            {t("requestQuote")}
          </button>
        </div>
      </div>
    </div>
  );
}
