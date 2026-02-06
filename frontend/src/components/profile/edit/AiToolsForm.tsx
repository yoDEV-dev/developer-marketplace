"use client";

import { useState, useActionState } from "react";
import { updateAiTools, type ActionResult } from "@/actions/profile";
import type { ProfileAiTool } from "@/repositories/profile";
import type { AiTool } from "@/repositories/lookups";

interface Props {
  currentAiTools: ProfileAiTool[];
  aiTools: AiTool[];
}

type ExpertiseLevel = "beginner" | "daily_user" | "power_user" | "building_with";

interface SelectedTool {
  aiToolId: string;
  name: string;
  expertiseLevel: ExpertiseLevel;
}

const expertiseLevels: { value: ExpertiseLevel; label: string; color: string }[] = [
  { value: "beginner", label: "Beginner", color: "bg-muted/20 text-muted" },
  { value: "daily_user", label: "Daily User", color: "bg-primary/10 text-primary" },
  { value: "power_user", label: "Power User", color: "bg-primary/80 text-white" },
  { value: "building_with", label: "Building With", color: "bg-accent text-white" },
];

function getExpertiseStyle(level: ExpertiseLevel) {
  return expertiseLevels.find((e) => e.value === level)?.color || "bg-muted/20 text-muted";
}

function getExpertiseLabel(level: ExpertiseLevel) {
  return expertiseLevels.find((e) => e.value === level)?.label || level;
}

export function AiToolsForm({ currentAiTools, aiTools }: Props) {
  const [state, action, pending] = useActionState(updateAiTools, {
    success: false,
  } as ActionResult);

  const [selected, setSelected] = useState<SelectedTool[]>(
    currentAiTools.map((t) => ({
      aiToolId: t.ai_tool_id,
      name: t.ai_tool_name,
      expertiseLevel: t.expertise_level as ExpertiseLevel,
    })),
  );

  const [search, setSearch] = useState("");

  const filteredTools = aiTools.filter(
    (t) =>
      !selected.some((s) => s.aiToolId === t.id) &&
      t.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by category
  const categories = new Map<string, AiTool[]>();
  for (const tool of filteredTools) {
    const cat = tool.category || "Other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(tool);
  }

  const addTool = (tool: AiTool) => {
    if (selected.length >= 20) return;
    setSelected([
      ...selected,
      { aiToolId: tool.id, name: tool.name, expertiseLevel: "daily_user" },
    ]);
    setSearch("");
  };

  const removeTool = (aiToolId: string) => {
    setSelected(selected.filter((s) => s.aiToolId !== aiToolId));
  };

  const cycleExpertise = (aiToolId: string) => {
    const order: ExpertiseLevel[] = ["beginner", "daily_user", "power_user", "building_with"];
    setSelected(
      selected.map((s) => {
        if (s.aiToolId !== aiToolId) return s;
        const idx = order.indexOf(s.expertiseLevel);
        return { ...s, expertiseLevel: order[(idx + 1) % order.length] };
      }),
    );
  };

  return (
    <form
      action={action}
      className="bg-surface rounded-xl border border-border p-6 space-y-5"
    >
      <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">smart_toy</span>
        AI Tools
      </h2>
      <p className="text-sm text-muted">
        Which AI tools do you use? Select them and set your expertise level.
      </p>

      <input
        type="hidden"
        name="aiTools"
        value={JSON.stringify(
          selected.map((s) => ({
            aiToolId: s.aiToolId,
            expertiseLevel: s.expertiseLevel,
          })),
        )}
      />

      {/* Selected Tools */}
      {selected.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-muted uppercase tracking-wider">
            Selected ({selected.length}/20)
          </p>
          <div className="flex flex-wrap gap-2">
            {selected.map((tool) => (
              <div
                key={tool.aiToolId}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium ${getExpertiseStyle(tool.expertiseLevel)}`}
              >
                <button
                  type="button"
                  onClick={() => cycleExpertise(tool.aiToolId)}
                  className="hover:opacity-80"
                  title={`Click to change level (${getExpertiseLabel(tool.expertiseLevel)})`}
                >
                  {tool.name}
                </button>
                <button
                  type="button"
                  onClick={() => removeTool(tool.aiToolId)}
                  className="hover:opacity-80 ml-1"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    close
                  </span>
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            {expertiseLevels.map((e) => (
              <span key={e.value} className="flex items-center gap-1">
                <span className={`inline-block w-3 h-3 rounded-full ${e.color.split(" ")[0]}`} />
                {e.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted">
            Click a tool to cycle through expertise levels.
          </p>
        </div>
      )}

      {/* Search & Add */}
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search AI tools to add..."
          className="h-11 px-3 rounded-lg bg-background-alt border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {search && (
          <div className="max-h-48 overflow-y-auto border border-border rounded-lg bg-background-alt">
            {[...categories.entries()].map(([cat, tools]) => (
              <div key={cat}>
                <p className="px-3 py-1.5 text-xs font-bold text-muted uppercase bg-border-light sticky top-0">
                  {cat}
                </p>
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => addTool(tool)}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-primary/5 transition-colors"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            ))}
            {filteredTools.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted">No matching AI tools</p>
            )}
          </div>
        )}
      </div>

      {state.error && <p className="text-sm text-error">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-success">AI tools saved!</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-11 px-6 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save AI Tools"}
      </button>
    </form>
  );
}
