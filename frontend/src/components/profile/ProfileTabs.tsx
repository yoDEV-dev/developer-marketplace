"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function ProfileTabs() {
  const t = useTranslations("profile");
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: t("about"), icon: "person" },
    { id: "skills", label: t("skills"), icon: "code" },
    { id: "portfolio", label: t("portfolio"), icon: "work" },
    { id: "reviews", label: t("reviews"), icon: "star" },
    { id: "pricing", label: t("pricing"), icon: "payments" },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-sm border-b border-border -mx-4 px-4 lg:mx-0 lg:px-0 lg:rounded-xl lg:border lg:bg-surface">
      <div className="flex gap-1 overflow-x-auto no-scrollbar py-2 lg:py-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg lg:rounded-none lg:border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary/10 text-primary lg:bg-transparent lg:border-primary"
                : "text-muted hover:text-foreground lg:border-transparent"
            }`}
          >
            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
