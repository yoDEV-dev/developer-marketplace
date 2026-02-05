"use client";

import { useTranslations } from "next-intl";

interface Skill {
  name: string;
  level: "Expert" | "Advanced" | "Intermediate" | "Beginner";
  years: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const levelColors = {
  Expert: "bg-primary text-white",
  Advanced: "bg-primary/80 text-white",
  Intermediate: "bg-primary/20 text-primary",
  Beginner: "bg-background-alt text-foreground",
};

const levelWidths = {
  Expert: "w-full",
  Advanced: "w-4/5",
  Intermediate: "w-3/5",
  Beginner: "w-2/5",
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const t = useTranslations("profile");

  // Group by level
  const expertSkills = skills.filter((s) => s.level === "Expert");
  const advancedSkills = skills.filter((s) => s.level === "Advanced");
  const otherSkills = skills.filter((s) => s.level === "Intermediate" || s.level === "Beginner");

  return (
    <section id="skills" className="scroll-mt-20">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">code</span>
          {t("skills")}
        </h2>

        {/* Expert Skills */}
        {expertSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-base fill">star</span>
              {t("expert")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {expertSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Advanced Skills */}
        {advancedSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
              {t("advanced")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {advancedSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        )}

        {/* Other Skills */}
        {otherSkills.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
              {t("learning")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherSkills.map((skill) => (
                <span
                  key={skill.name}
                  className="px-3 py-1.5 bg-background-alt text-foreground text-sm font-medium rounded-lg"
                >
                  {skill.name}
                  <span className="text-muted ml-1">({skill.years}y)</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const t = useTranslations("profile");
  return (
    <div className="flex items-center justify-between p-3 bg-background-alt rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${levelColors[skill.level]} flex items-center justify-center`}>
          <span className="text-sm font-bold">{skill.name.slice(0, 2)}</span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{skill.name}</p>
          <p className="text-xs text-muted">{t("years", { count: skill.years })}</p>
        </div>
      </div>
      <div className="hidden sm:block w-20">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full bg-primary rounded-full ${levelWidths[skill.level]}`} />
        </div>
      </div>
    </div>
  );
}
