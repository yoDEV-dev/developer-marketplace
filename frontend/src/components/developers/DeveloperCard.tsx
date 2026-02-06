"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toggleBookmark } from "@/actions/bookmarks";

export interface DeveloperCardProps {
  id: string;
  name: string;
  headline: string;
  photoUrl?: string;
  countryFlag?: string;
  rating: number;
  reviewCount: number;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  availability: "available" | "limited" | "booked" | "not_taking_work";
  skills: string[];
  aiToolNames?: string[];
  isFavorite?: boolean;
}

const availabilityStyles = {
  available: {
    key: "available" as const,
    bgColor: "bg-accent/10",
    textColor: "text-accent",
    dotColor: "bg-accent",
    animate: true,
  },
  limited: {
    key: "limited" as const,
    bgColor: "bg-warning/10",
    textColor: "text-warning",
    dotColor: "bg-warning",
    animate: false,
  },
  booked: {
    key: "booked" as const,
    bgColor: "bg-muted/10",
    textColor: "text-muted",
    dotColor: "bg-muted",
    animate: false,
  },
  not_taking_work: {
    key: "notTakingWork" as const,
    bgColor: "bg-muted/10",
    textColor: "text-muted",
    dotColor: "bg-muted",
    animate: false,
  },
};

export function DeveloperCard({
  id,
  name,
  headline,
  photoUrl,
  countryFlag,
  rating,
  reviewCount,
  hourlyRateMin,
  hourlyRateMax,
  availability,
  skills,
  aiToolNames = [],
  isFavorite = false,
}: DeveloperCardProps) {
  const locale = useLocale();
  const t = useTranslations("availability");
  const tDev = useTranslations("developers");
  const tProfile = useTranslations("profile");
  const [favorited, setFavorited] = useState(isFavorite);
  const [pending, startTransition] = useTransition();
  const availConfig = availabilityStyles[availability];
  const displayedSkills = skills.slice(0, 3);
  const remainingSkills = skills.length - 3;

  function handleToggleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFavorited((prev) => !prev); // Optimistic update
    startTransition(async () => {
      const result = await toggleBookmark(id);
      if (result.success && result.bookmarked !== undefined) {
        setFavorited(result.bookmarked);
      }
    });
  }

  return (
    <div className="flex flex-col bg-surface rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex gap-4">
          {/* Avatar with availability indicator */}
          <div className="relative w-20 h-20 shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-primary/20 overflow-hidden bg-background-alt">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted">
                  <span className="material-symbols-outlined text-3xl">person</span>
                </div>
              )}
            </div>
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 ${availConfig.dotColor} rounded-full border-2 border-surface`}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between items-start">
              <h3 className="text-foreground text-lg font-bold leading-tight">
                {name} {countryFlag}
              </h3>
              <button
                onClick={handleToggleBookmark}
                disabled={pending}
                className="text-muted hover:text-error transition-colors disabled:opacity-50"
              >
                <span className={`material-symbols-outlined ${favorited ? "fill text-error" : ""}`}>
                  favorite
                </span>
              </button>
            </div>
            <p className="text-primary text-sm font-semibold">{headline}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-accent">
                <span className="material-symbols-outlined fill text-sm">star</span>
                <span className="text-xs font-bold ml-1">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted text-xs">({tProfile("reviews_count", { count: reviewCount })})</span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${availConfig.bgColor} ${availConfig.textColor} w-fit`}
        >
          <span
            className={`w-2 h-2 rounded-full ${availConfig.dotColor} ${
              availConfig.animate ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wide">
            {t(availConfig.key)}
          </span>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-2">
          {displayedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold"
            >
              {skill}
            </span>
          ))}
          {remainingSkills > 0 && (
            <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
              +{remainingSkills}
            </span>
          )}
        </div>

        {/* AI Tools */}
        {aiToolNames.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>{aiToolNames.slice(0, 3).join(", ")}</span>
            {aiToolNames.length > 3 && <span>+{aiToolNames.length - 3}</span>}
          </div>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-border-light" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {hourlyRateMin && hourlyRateMax ? (
              <>
                <p className="text-foreground text-base font-bold">
                  ${hourlyRateMin} - ${hourlyRateMax}
                </p>
                <p className="text-muted text-[10px] font-medium uppercase tracking-tight">
                  {tDev("hourlyRateRange")}
                </p>
              </>
            ) : (
              <p className="text-muted text-sm">{tDev("projectBased")}</p>
            )}
          </div>
          <Link
            href={`/${locale}/developers/${id}`}
            className="flex items-center justify-center min-w-[120px] h-10 px-4 bg-primary text-white text-sm font-bold rounded-full shadow-md hover:bg-primary-dark transition-colors"
          >
            {tDev("viewProfile")}
          </Link>
        </div>
      </div>
    </div>
  );
}
