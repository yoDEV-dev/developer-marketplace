"use client";

import { useTranslations } from "next-intl";
import { DeveloperCard, type DeveloperCardProps } from "./DeveloperCard";

interface DevelopersContentProps {
  developers: DeveloperCardProps[];
  totalCount: number;
}

export function DevelopersContent({ developers, totalCount }: DevelopersContentProps) {
  const t = useTranslations("developers");
  const tCommon = useTranslations("common");

  return (
    <div className="flex-1 p-4 lg:p-6">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted text-sm font-medium">
          {t("resultsCount", { count: developers.length })}
        </p>
        <div className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-wider cursor-pointer">
          <span>{t("sortRecommended")}</span>
          <span className="material-symbols-outlined text-sm">expand_more</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {developers.map((dev) => (
          <DeveloperCard key={dev.id} {...dev} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex flex-col items-center gap-4 py-8">
        <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
          <span>{tCommon("loadMore")}</span>
          <span className="material-symbols-outlined">expand_more</span>
        </button>
        <p className="text-muted text-xs">
          {tCommon("showingOf", { count: developers.length, total: totalCount })}
        </p>
      </div>
    </div>
  );
}
