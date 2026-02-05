"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

interface UserInfo {
  sub: string;
  profileId: string;
  name: string;
  email: string;
  picture: string;
}

interface BadgeCounts {
  inquiries?: number;
  messages?: number;
}

interface SidebarProps {
  user?: UserInfo | null;
  badges?: BadgeCounts;
}

export function Sidebar({ user, badges = {} }: SidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}/developers`, icon: "search", label: t("browse"), badge: 0 },
    { href: `/${locale}/projects`, icon: "work", label: t("projects"), badge: 0 },
    { href: `/${locale}/inquiries`, icon: "request_quote", label: t("inquiries"), badge: badges.inquiries || 0 },
    { href: `/${locale}/messages`, icon: "chat_bubble", label: t("messages"), badge: badges.messages || 0 },
    { href: `/${locale}/dashboard`, icon: "dashboard", label: t("dashboard"), badge: 0 },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 bg-surface border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">yD</span>
          </div>
          <span className="text-lg font-bold text-foreground">yoDEV</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-background-alt hover:text-foreground"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "fill" : ""}`}>
                {item.icon}
              </span>
              <span className="font-medium flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-error text-white text-xs font-bold flex items-center justify-center">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        {user ? (
          <>
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-alt transition-colors"
            >
              {user.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted truncate">{user.email}</p>
              </div>
            </Link>
            <Link
              href={`/${locale}/profile/edit`}
              className="flex items-center gap-3 px-4 py-2 mt-1 rounded-lg text-muted hover:bg-background-alt hover:text-foreground transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>{t("profile")}</span>
            </Link>
            <a
              href="/api/auth/logout"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted hover:bg-background-alt hover:text-foreground transition-colors text-sm"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>{t("logout")}</span>
            </a>
          </>
        ) : (
          <a
            href="/api/auth/login"
            className="flex items-center justify-center gap-2 w-full h-12 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined">login</span>
            <span>Sign In</span>
          </a>
        )}
      </div>
    </aside>
  );
}
