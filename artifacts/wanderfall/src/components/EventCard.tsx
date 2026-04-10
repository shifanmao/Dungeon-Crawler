import type { GameEvent, ModifiedDestination } from "@/game/types";

interface EventCardProps {
  event: GameEvent;
  destination: ModifiedDestination | null;
  onChoice: (index: number) => void;
}

export default function EventCard({ event, destination, onChoice }: EventCardProps) {
  return (
    <div className="flex-1 flex flex-col px-4 py-4" data-testid="event-card">
      {destination && (
        <div className="text-center mb-2 animate-fade-in">
          <span className="text-xs text-muted-foreground font-mono">
            {destination.emoji} {destination.name}
          </span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5 mb-4 animate-slide-up max-w-md mx-auto w-full">
        <h3 className="text-lg font-bold text-foreground mb-2" data-testid="text-event-title">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 max-w-md mx-auto w-full">
        {event.choices.map((choice, i) => {
          const hasMoneyChange = choice.outcome.money !== 0;
          const hasEnergyChange = choice.outcome.energy !== 0;

          return (
            <button
              key={i}
              onClick={() => onChoice(i)}
              className="w-full p-4 rounded-xl border border-border bg-card/60 text-left
                active:scale-[0.98] hover:border-primary/40 transition-all duration-150 animate-slide-up"
              style={{ animationDelay: `${200 + i * 100}ms`, animationFillMode: "both" }}
              data-testid={`button-choice-${i}`}
            >
              <span className="text-sm font-medium text-foreground">{choice.text}</span>
              <div className="flex gap-2 mt-1.5">
                {hasMoneyChange && (
                  <span className={`text-[11px] font-mono ${choice.outcome.money > 0 ? "text-accent" : "text-destructive"}`}>
                    {choice.outcome.money > 0 ? "+" : ""}{choice.outcome.money}$
                  </span>
                )}
                {hasEnergyChange && (
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
          );
        })}
      </div>
    </div>
  );
}
