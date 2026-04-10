import type { ModifiedDestination, Resources } from "@/game/types";

interface DestinationSelectProps {
  destinations: ModifiedDestination[];
  resources: Resources;
  onSelect: (dest: ModifiedDestination) => void;
}

function getRiskColor(risk: number): string {
  if (risk <= 3) return "text-accent";
  if (risk <= 6) return "text-primary";
  return "text-destructive";
}

function getRiskLabel(risk: number): string {
  if (risk <= 2) return "Safe";
  if (risk <= 4) return "Moderate";
  if (risk <= 6) return "Risky";
  return "Dangerous";
}

export default function DestinationSelect({
  destinations,
  resources,
  onSelect,
}: DestinationSelectProps) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4" data-testid="destination-select">
      <div className="text-center mb-4 animate-fade-in">
        <h2 className="text-xl font-bold text-foreground">Where to next?</h2>
        <p className="text-xs text-muted-foreground mt-1">Choose your destination wisely</p>
      </div>

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {destinations.map((dest, i) => {
          const canAfford = resources.money >= dest.actualCost;
          const energyCost = Math.round(5 + dest.actualRisk * 2);

          return (
            <button
              key={dest.id}
              onClick={() => canAfford && onSelect(dest)}
              disabled={!canAfford}
              className={`relative w-full p-4 rounded-xl border text-left transition-all duration-200 animate-slide-up
                ${canAfford
                  ? "bg-card border-border active:scale-[0.98] hover:border-primary/50"
                  : "bg-muted/30 border-border/50 opacity-60 cursor-not-allowed"
                }`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
              data-testid={`button-destination-${dest.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{dest.emoji}</span>
                    <span className="font-bold text-foreground text-lg">{dest.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{dest.region}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-mono bg-muted/80 px-2 py-0.5 rounded flex items-center gap-1">
                      {dest.modifier.emoji} {dest.modifier.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <div className="text-sm font-mono font-bold text-primary" data-testid={`text-cost-${dest.id}`}>
                    ${dest.actualCost}
                  </div>
                  <div className="text-xs font-mono text-secondary">
                    -{energyCost}E
                  </div>
                  <div className={`text-xs font-bold ${getRiskColor(dest.actualRisk)}`}>
                    {getRiskLabel(dest.actualRisk)}
                  </div>
                  {dest.modifier.reputationBonus > 0 && (
                    <div className="text-xs font-mono text-accent">
                      +{dest.modifier.reputationBonus}R
                    </div>
                  )}
                </div>
              </div>

              {!canAfford && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/40 rounded-xl">
                  <span className="text-xs font-bold text-destructive bg-card/90 px-3 py-1 rounded-full">
                    Can't afford
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
