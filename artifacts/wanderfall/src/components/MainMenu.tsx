import { useState, useEffect } from "react";
import { getHighScore, getStartingModifiers } from "@/game/engine";
import type { StartingModifier } from "@/game/types";

interface MainMenuProps {
  onStartRun: (modifier: StartingModifier) => void;
}

export default function MainMenu({ onStartRun }: MainMenuProps) {
  const [phase, setPhase] = useState<"title" | "select">("title");
  const [modifiers, setModifiers] = useState<StartingModifier[]>([]);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setModifiers(getStartingModifiers());
    setHighScore(getHighScore());
  }, []);

  if (phase === "title") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background relative overflow-hidden" data-testid="main-menu">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground mb-2">
              WANDERFALL
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Every trip is a gamble.
            </p>
          </div>

          {highScore > 0 && (
            <div className="text-center animate-slide-up" data-testid="text-high-score">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Best Run</p>
              <p className="text-2xl font-mono font-bold text-primary">{highScore}</p>
            </div>
          )}

          <button
            onClick={() => setPhase("select")}
            className="w-full max-w-xs py-4 px-8 bg-primary text-primary-foreground rounded-xl text-lg font-bold
              active:scale-95 transition-all duration-150 animate-pulse-glow"
            data-testid="button-start"
          >
            START RUN
          </button>

          <p className="text-xs text-muted-foreground text-center max-w-[280px]">
            Travel the world. Manage your money, energy, and reputation. 
            Survive the journey. Chase the high score.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col px-4 pt-12 pb-6 bg-background" data-testid="modifier-select">
      <div className="text-center mb-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Style</h2>
        <p className="text-sm text-muted-foreground mt-1">Each choice changes your starting resources</p>
      </div>

      <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full">
        {modifiers.map((mod, i) => (
          <button
            key={mod.id}
            onClick={() => mod.unlocked && onStartRun(mod)}
            disabled={!mod.unlocked}
            className={`relative w-full p-4 rounded-xl border text-left transition-all duration-200 animate-slide-up
              ${mod.unlocked
                ? "bg-card border-border active:scale-[0.98] hover:border-primary/50"
                : "bg-muted/50 border-border/50 opacity-50 cursor-not-allowed"
              }`}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            data-testid={`button-modifier-${mod.id}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{mod.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">{mod.name}</span>
                  {!mod.unlocked && (
                    <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                      LOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                {mod.unlocked && (
                  <div className="flex gap-3 mt-2 text-xs font-mono">
                    <span className="text-primary">${mod.resourceMod.money}</span>
                    <span className="text-secondary">+{mod.resourceMod.energy}E</span>
                    <span className="text-accent">*{mod.resourceMod.reputation}R</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => setPhase("title")}
        className="mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        data-testid="button-back"
      >
        Back
      </button>
    </div>
  );
}
