"use client";

interface AiTool {
  name: string;
  category: string | null;
  expertise_level: string;
}

interface AiToolsSectionProps {
  aiTools: AiTool[];
}

const expertiseStyles: Record<string, { label: string; bg: string; text: string }> = {
  building_with: { label: "Building With", bg: "bg-accent", text: "text-white" },
  power_user: { label: "Power User", bg: "bg-primary/80", text: "text-white" },
  daily_user: { label: "Daily User", bg: "bg-primary/10", text: "text-primary" },
  beginner: { label: "Beginner", bg: "bg-muted/20", text: "text-muted" },
};

function getStyle(level: string) {
  return expertiseStyles[level] || expertiseStyles.beginner;
}

export function AiToolsSection({ aiTools }: AiToolsSectionProps) {
  if (aiTools.length === 0) return null;

  // Group by expertise level
  const buildingWith = aiTools.filter((t) => t.expertise_level === "building_with");
  const powerUser = aiTools.filter((t) => t.expertise_level === "power_user");
  const dailyUser = aiTools.filter((t) => t.expertise_level === "daily_user");
  const beginner = aiTools.filter((t) => t.expertise_level === "beginner");

  return (
    <section id="ai-tools" className="scroll-mt-20">
      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">smart_toy</span>
          AI Tools
        </h2>

        <div className="space-y-5">
          {buildingWith.length > 0 && (
            <ToolGroup label="Building With" tools={buildingWith} />
          )}
          {powerUser.length > 0 && (
            <ToolGroup label="Power User" tools={powerUser} />
          )}
          {dailyUser.length > 0 && (
            <ToolGroup label="Daily User" tools={dailyUser} />
          )}
          {beginner.length > 0 && (
            <ToolGroup label="Beginner" tools={beginner} />
          )}
        </div>
      </div>
    </section>
  );
}

function ToolGroup({ label, tools }: { label: string; tools: AiTool[] }) {
  const style = getStyle(tools[0].expertise_level);

  return (
    <div>
      <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool.name}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
          >
            {tool.name}
          </span>
        ))}
      </div>
    </div>
  );
}
