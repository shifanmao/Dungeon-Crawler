import { useState, useEffect } from "react";
import type { RunScore } from "@/game/types";
import { checkUnlocks, getHighScore } from "@/game/engine";
import { STARTING_MODIFIERS } from "@/game/data";

interface GameOverProps {
  score: RunScore;
  survived: boolean;
  onRestart: () => void;
}

export default function GameOver({ score, survived, onRestart }: GameOverProps) {
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [isHighScore, setIsHighScore] = useState(false);

  useEffect(() => {
    const unlocked = checkUnlocks(score);
    setNewUnlocks(unlocked);
    const prev = getHighScore();
    setIsHighScore(score.totalScore > prev || prev === score.totalScore);
  }, [score]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-10 pb-6 bg-background" data-testid="game-over">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-1">
            {survived ? "Journey Complete" : "Journey Over"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {survived
              ? "You made it home in one piece!"
              : "The road was too much this time."}
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 mb-4 animate-slide-up text-center">
          {isHighScore && (
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1 animate-pulse">
              New High Score!
            </div>
          )}
          <p className="text-5xl font-mono font-bold text-primary mb-1" data-testid="text-total-score">
            {score.totalScore}
          </p>
          <p className="text-xs text-muted-foreground">Total Score</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 mb-4 animate-slide-up"
          style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <div className="grid grid-cols-2 gap-3">
            <ScoreStat label="Steps" value={score.stepsCompleted} icon=">" />
            <ScoreStat label="Money Left" value={`$${score.moneyEfficiency}`} icon="$" />
            <ScoreStat label="Risks Taken" value={score.risksTaken} icon="!" />
            <ScoreStat label="Encounters" value={score.encountersSurvived} icon="&" />
            <ScoreStat label="Special Events" value={score.specialEvents} icon="*" />
            <ScoreStat label="Regions" value={score.regionsExplored.length} icon="#" />
          </div>

          {score.regionsExplored.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Regions Explored</p>
              <div className="flex flex-wrap gap-1.5">
                {score.regionsExplored.map((r) => (
                  <span key={r} className="text-xs bg-muted px-2 py-0.5 rounded-full text-foreground font-mono">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {newUnlocks.length > 0 && (
          <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 mb-4 animate-slide-up"
            style={{ animationDelay: "200ms", animationFillMode: "both" }}>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">New Unlock!</p>
            {newUnlocks.map((id) => {
              const mod = STARTING_MODIFIERS.find((m) => m.id === id);
              if (!mod) return null;
              return (
                <div key={id} className="flex items-center gap-2" data-testid={`unlock-${id}`}>
                  <span className="text-xl">{mod.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{mod.name}</p>
                    <p className="text-xs text-muted-foreground">{mod.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl text-lg font-bold
            active:scale-95 transition-all duration-150 animate-pulse-glow"
          data-testid="button-restart"
        >
          One More Run
        </button>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Can you beat {score.totalScore}?
        </p>
      </div>
    </div>
  );
}

function ScoreStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: string;
}) {
  return (
    <div className="text-center p-2 bg-muted/50 rounded-lg" data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`}>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        <span className="text-xs text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-mono font-bold text-foreground">{value}</p>
    </div>
  );
}
