import type { EventOutcome, ModifiedDestination } from "@/game/types";

interface StepResultProps {
  outcome: EventOutcome;
  destination: ModifiedDestination | null;
  onContinue: () => void;
}

export default function StepResult({ outcome, destination, onContinue }: StepResultProps) {
  const isPositive = (outcome.money >= 0 && outcome.energy >= 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" data-testid="step-result">
      <div className="max-w-md w-full text-center">
        {destination && (
          <div className="mb-3 animate-fade-in">
            <span className="text-xs text-muted-foreground font-mono">
              {destination.emoji} {destination.name}
            </span>
          </div>
        )}

        <div className={`bg-card border border-border rounded-2xl p-6 mb-6 animate-slide-up ${!isPositive ? "animate-shake" : ""}`}>
          <p className="text-foreground text-base leading-relaxed" data-testid="text-outcome">
            {outcome.message}
          </p>

          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            {outcome.money !== 0 && (
              <div className={`text-center ${outcome.money > 0 ? "text-accent" : "text-destructive"}`}>
                <p className="text-xl font-mono font-bold">
                  {outcome.money > 0 ? "+" : ""}{outcome.money}
                </p>
                <p className="text-[10px] uppercase tracking-wider">Money</p>
              </div>
            )}
            {outcome.energy !== 0 && (
              <div className={`text-center ${outcome.energy > 0 ? "text-accent" : "text-destructive"}`}>
                <p className="text-xl font-mono font-bold">
                  {outcome.energy > 0 ? "+" : ""}{outcome.energy}
                </p>
                <p className="text-[10px] uppercase tracking-wider">Energy</p>
              </div>
            )}
            {outcome.reputation !== 0 && (
              <div className={`text-center ${outcome.reputation > 0 ? "text-accent" : "text-destructive"}`}>
                <p className="text-xl font-mono font-bold">
                  {outcome.reputation > 0 ? "+" : ""}{outcome.reputation}
                </p>
                <p className="text-[10px] uppercase tracking-wider">Rep</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full max-w-xs mx-auto py-3.5 px-6 bg-primary text-primary-foreground rounded-xl text-base font-bold
            active:scale-95 transition-all duration-150"
          data-testid="button-continue"
        >
          Continue Journey
        </button>
      </div>
    </div>
  );
}
