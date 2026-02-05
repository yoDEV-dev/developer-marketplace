"use client";

import { useTranslations } from "next-intl";

interface Language {
  name: string;
  level: string;
}

interface Preferences {
  projectTypes: string[];
  industries: string[];
  teamSize: string;
  engagement: string[];
}

interface AboutSectionProps {
  about: string;
  languages: Language[];
  preferences: Preferences;
}

export function AboutSection({ about, languages, preferences }: AboutSectionProps) {
  const t = useTranslations("profile");

  return (
    <section id="about" className="scroll-mt-20">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          {t("about")}
        </h2>

        {/* Bio */}
        <div className="prose prose-sm max-w-none text-text-secondary mb-6">
          {about.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4 last:mb-0 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
            {t("languages")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className="flex items-center gap-2 px-3 py-2 bg-background-alt rounded-lg"
              >
                <span className="font-medium text-foreground">{lang.name}</span>
                <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded">
                  {lang.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
              {t("preferences")}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted mb-1">{t("projectTypes")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {preferences.projectTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">{t("industries")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {preferences.industries.map((industry) => (
                    <span
                      key={industry}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
              {t("workStyle")}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-muted">groups</span>
                <div>
                  <p className="text-xs text-muted">{t("teamSize")}</p>
                  <p className="font-medium text-foreground">{preferences.teamSize}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-muted">handshake</span>
                <div>
                  <p className="text-xs text-muted">{t("engagementTypes")}</p>
                  <p className="font-medium text-foreground">
                    {preferences.engagement.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
