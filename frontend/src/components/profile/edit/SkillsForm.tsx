"use client";

import { useState, useActionState } from "react";
import { updateSkills, type ActionResult } from "@/actions/profile";
import type { ProfileSkill } from "@/repositories/profile";
import type { TechTag } from "@/repositories/lookups";

interface Props {
  currentSkills: ProfileSkill[];
  techTags: TechTag[];
}

interface SelectedSkill {
  techTagId: string;
  name: string;
  skillLevel: "primary" | "secondary";
}

export function SkillsForm({ currentSkills, techTags }: Props) {
  const [state, action, pending] = useActionState(updateSkills, {
    success: false,
  } as ActionResult);

  const [selected, setSelected] = useState<SelectedSkill[]>(
    currentSkills.map((s) => ({
      techTagId: s.tech_tag_id,
      name: s.tech_tag_name,
      skillLevel: s.skill_level as "primary" | "secondary",
    })),
  );

  const [search, setSearch] = useState("");

  const filteredTags = techTags.filter(
    (t) =>
      !selected.some((s) => s.techTagId === t.id) &&
      t.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Group filtered tags by category
  const categories = new Map<string, TechTag[]>();
  for (const tag of filteredTags) {
    const cat = tag.category || "Other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(tag);
  }

  const addSkill = (tag: TechTag) => {
    if (selected.length >= 25) return;
    setSelected([
      ...selected,
      { techTagId: tag.id, name: tag.name, skillLevel: "primary" },
    ]);
    setSearch("");
  };

  const removeSkill = (techTagId: string) => {
    setSelected(selected.filter((s) => s.techTagId !== techTagId));
  };

  const toggleLevel = (techTagId: string) => {
    setSelected(
      selected.map((s) =>
        s.techTagId === techTagId
          ? {
              ...s,
              skillLevel:
                s.skillLevel === "primary" ? "secondary" : "primary",
            }
          : s,
      ),
    );
  };

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">code</span>
        Skills & Tech Stack
      </h2>

      <input
        type="hidden"
        name="skills"
        value={JSON.stringify(
          selected.map((s) => ({
            techTagId: s.techTagId,
            skillLevel: s.skillLevel,
          })),
        )}
      />

      {/* Selected Skills */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">
            Selected ({selected.length}/25)
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((skill) => (
              <div
                key={skill.techTagId}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium ${
                  skill.skillLevel === "primary"
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleLevel(skill.techTagId)}
                  className="hover:opacity-80"
                  title={`Click to change to ${skill.skillLevel === "primary" ? "secondary" : "primary"}`}
                >
                  {skill.name}
                </button>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.techTagId)}
                  className="hover:opacity-80 ml-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted">
            Click a skill to toggle primary/secondary. Solid = primary, outline
            = secondary.
          </p>
        </div>
      )}

      {/* Search & Add */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills to add..."
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {search && (
          <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-background-alt">
            {[...categories.entries()].map(([cat, tags]) => (
              <div key={cat}>
                <p className="px-3 py-1.5 text-xs font-bold text-muted uppercase bg-border-light sticky top-0">
                  {cat}
                </p>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addSkill(tag)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            ))}
            {filteredTags.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted">No matching skills</p>
            )}
          </div>
        )}
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">Skills saved!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Skills"}
      </button>
    </form>
  );
}
