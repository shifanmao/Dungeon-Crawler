import { useState, useCallback } from "react";
import MainMenu from "@/components/MainMenu";
import ResourceBar from "@/components/ResourceBar";
import DestinationSelect from "@/components/DestinationSelect";
import EventCard from "@/components/EventCard";
import NPCEncounterView from "@/components/NPCEncounterView";
import StepResult from "@/components/StepResult";
import GameOver from "@/components/GameOver";
import type { GameState, StartingModifier, ModifiedDestination } from "@/game/types";
import {
  createInitialState,
  selectDestination,
  resolveEventChoice,
  resolveNPCChoice,
  continueJourney,
  calculateScore,
  saveRunToHistory,
} from "@/game/engine";

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const handleStartRun = useCallback((modifier: StartingModifier) => {
    setGameState(createInitialState(modifier));
  }, []);

  const handleSelectDestination = useCallback((dest: ModifiedDestination) => {
    setGameState((prev) => (prev ? selectDestination(prev, dest) : prev));
  }, []);

  const handleEventChoice = useCallback((index: number) => {
    setGameState((prev) => (prev ? resolveEventChoice(prev, index) : prev));
  }, []);

  const handleNPCChoice = useCallback((index: number) => {
    setGameState((prev) => (prev ? resolveNPCChoice(prev, index) : prev));
  }, []);

  const handleContinue = useCallback(() => {
    setGameState((prev) => (prev ? continueJourney(prev) : prev));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState(null);
  }, []);

  if (!gameState) {
    return <MainMenu onStartRun={handleStartRun} />;
  }

  if (gameState.phase === "game_over") {
    const score = calculateScore(gameState);
    saveRunToHistory(score);
    return (
      <GameOver
        score={score}
        survived={gameState.isAlive}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" data-testid="game-screen">
      <ResourceBar
        resources={gameState.resources}
        step={gameState.step}
        maxSteps={gameState.maxSteps}
      />

      {gameState.phase === "destination_select" && (
        <DestinationSelect
          destinations={gameState.destinationChoices}
          resources={gameState.resources}
          onSelect={handleSelectDestination}
        />
      )}

      {gameState.phase === "event" && gameState.currentEvent && (
        <EventCard
          event={gameState.currentEvent}
          destination={gameState.currentDestination}
          onChoice={handleEventChoice}
        />
      )}

      {gameState.phase === "npc_encounter" && gameState.currentNPC && (
        <NPCEncounterView
          encounter={gameState.currentNPC}
          destination={gameState.currentDestination}
          onChoice={handleNPCChoice}
        />
      )}

      {gameState.phase === "step_result" && gameState.lastOutcome && (
        <StepResult
          outcome={gameState.lastOutcome}
          destination={gameState.currentDestination}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}

export default App;
