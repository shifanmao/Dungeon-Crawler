import type { Resources } from "@/game/types";

interface ResourceBarProps {
  resources: Resources;
  step: number;
  maxSteps: number;
}

function ResourcePill({
  label,
  value,
  max,
  color,
  icon,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isLow = pct < 25;

  return (
    <div className="flex flex-col items-center gap-1 flex-1" data-testid={`resource-${label.toLowerCase()}`}>
      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <span>{icon}</span>
        <span className="hidden sm:inline">{label}</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color} ${isLow ? "animate-pulse" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm font-mono font-bold ${isLow ? "text-destructive" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export default function ResourceBar({ resources, step, maxSteps }: ResourceBarProps) {
  return (
    <div className="w-full px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border" data-testid="resource-bar">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          Step {step}/{maxSteps}
        </span>
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden ml-2">
          <div
            className="h-full bg-primary/60 rounded-full transition-all duration-300"
            style={{ width: `${(step / maxSteps) * 100}%` }}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <ResourcePill label="Money" value={resources.money} max={200} color="bg-primary" icon="$" />
        <ResourcePill label="Energy" value={resources.energy} max={150} color="bg-secondary" icon="+" />
        <ResourcePill label="Rep" value={resources.reputation} max={30} color="bg-accent" icon="*" />
      </div>
    </div>
  );
}
