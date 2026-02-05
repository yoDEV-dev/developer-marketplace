"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSelector } from "@/components/LanguageSelector";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export function TopBar({ title, showSearch = true }: TopBarProps) {
  const t = useTranslations("developers");
  const locale = useLocale();
  const displayTitle = title || t("directory");

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Mobile: Menu + Title */}
        <div className="flex items-center gap-3 lg:hidden">
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-background-alt text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-lg font-bold text-foreground">{displayTitle}</h1>
        </div>

        {/* Desktop: Search Bar */}
        {showSearch && (
          <div className="hidden lg:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                search
              </span>
              <input
                type="text"
                placeholder={t("searchPlaceholderLong")}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-background-alt text-muted hover:text-foreground transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          <Link
            href={`/${locale}/profile`}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-primary/20"
          >
            <span className="material-symbols-outlined text-primary">person</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                search
              </span>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full h-12 pl-12 pr-4 rounded-full bg-background-alt border-none text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
