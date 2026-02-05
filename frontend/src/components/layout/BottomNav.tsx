"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/developers", icon: "search", label: "Browse" },
  { href: "/projects", icon: "work", label: "Projects" },
  { href: "/messages", icon: "chat_bubble", label: "Messages" },
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
];

export function BottomNav() {
  const pathname = usePathname();

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
              <span className={`material-symbols-outlined text-[24px] ${isActive ? "fill" : ""}`}>
                {item.icon}
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
