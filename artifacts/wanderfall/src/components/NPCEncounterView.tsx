import type { NPCEncounter, ModifiedDestination } from "@/game/types";

interface NPCEncounterViewProps {
  encounter: NPCEncounter;
  destination: ModifiedDestination | null;
  onChoice: (index: number) => void;
}

function getArchetypeColor(archetype: string): string {
  switch (archetype) {
    case "merchant": return "text-primary";
    case "guide": return "text-secondary";
    case "trickster": return "text-destructive";
    case "healer": return "text-accent";
    case "storyteller": return "text-chart-4";
    default: return "text-foreground";
  }
}

function getMoodIndicator(mood: string): string {
  switch (mood) {
    case "friendly": return "Friendly";
    case "neutral": return "Neutral";
    case "hostile": return "Hostile";
    default: return "";
  }
}

function getMoodColor(mood: string): string {
  switch (mood) {
    case "friendly": return "bg-accent/20 text-accent";
    case "neutral": return "bg-muted text-muted-foreground";
    case "hostile": return "bg-destructive/20 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function NPCEncounterView({ encounter, destination, onChoice }: NPCEncounterViewProps) {
  const { npc, greeting, choices } = encounter;

  return (
    <div className="flex-1 flex flex-col px-4 py-4" data-testid="npc-encounter">
      {destination && (
        <div className="text-center mb-2 animate-fade-in">
          <span className="text-xs text-muted-foreground font-mono">
            {destination.emoji} {destination.name}
          </span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5 mb-4 animate-slide-up max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{npc.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold ${getArchetypeColor(npc.archetype)}`} data-testid="text-npc-name">
                {npc.name}
              </h3>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${getMoodColor(npc.mood)}`}>
                {getMoodIndicator(npc.mood)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground capitalize">
              {npc.archetype} - {npc.effect}
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground/90 italic leading-relaxed">
          {greeting}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 max-w-md mx-auto w-full">
        {choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoice(i)}
            className="w-full p-4 rounded-xl border border-border bg-card/60 text-left
              active:scale-[0.98] hover:border-primary/40 transition-all duration-150 animate-slide-up"
            style={{ animationDelay: `${200 + i * 100}ms`, animationFillMode: "both" }}
            data-testid={`button-npc-choice-${i}`}
          >
            <span className="text-sm font-medium text-foreground">{choice.text}</span>
            <div className="flex gap-2 mt-1.5">
              {choice.outcome.money !== 0 && (
                <span className={`text-[11px] font-mono ${choice.outcome.money > 0 ? "text-accent" : "text-destructive"}`}>
                  {choice.outcome.money > 0 ? "+" : ""}{choice.outcome.money}$
                </span>
              )}
              {choice.outcome.energy !== 0 && (
                <span className={`text-[11px] font-mono ${choice.outcome.energy > 0 ? "text-accent" : "text-destructive"}`}>
                  {choice.outcome.energy > 0 ? "+" : ""}{choice.outcome.energy}E
                </span>
              )}
              {choice.outcome.reputation !== 0 && (
                <span className={`text-[11px] font-mono ${choice.outcome.reputation > 0 ? "text-accent" : "text-destructive"}`}>
                  {choice.outcome.reputation > 0 ? "+" : ""}{choice.outcome.reputation}R
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
