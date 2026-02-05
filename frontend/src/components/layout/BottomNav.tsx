"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface BadgeCounts {
  inquiries?: number;
  messages?: number;
}

interface BottomNavProps {
  badges?: BadgeCounts;
}

export function BottomNav({ badges = {} }: BottomNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}/developers`, icon: "search", label: t("browse"), badge: 0 },
    { href: `/${locale}/inquiries`, icon: "request_quote", label: t("inquiries"), badge: badges.inquiries || 0 },
    { href: `/${locale}/messages`, icon: "chat_bubble", label: t("messages"), badge: badges.messages || 0 },
    { href: `/${locale}/dashboard`, icon: "dashboard", label: t("dashboard"), badge: 0 },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] py-2 ${
                isActive ? "text-primary" : "text-muted"
              }`}
            >
              <span className="relative">
                <span className={`material-symbols-outlined text-[24px] ${isActive ? "fill" : ""}`}>
                  {item.icon}
                </span>
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      {/* iOS Home Indicator spacer */}
      <div className="h-2 bg-surface" />
    </nav>
  );
}
