import type {
  GameState,
  Resources,
  ModifiedDestination,
  EventOutcome,
  NPCEncounter,
  RunScore,
  StartingModifier,
} from "./types";
import {
  DESTINATIONS,
  DESTINATION_MODIFIERS,
  EVENTS,
  NPC_POOL,
  NPC_GREETINGS,
  STARTING_MODIFIERS,
} from "./data";

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function getStartingModifiers(): StartingModifier[] {
  const saved = loadUnlocks();
  return STARTING_MODIFIERS.map((m) => ({
    ...m,
    unlocked: m.unlocked || saved.includes(m.id),
  }));
}

export function createInitialState(modifier: StartingModifier): GameState {
  return {
    phase: "destination_select",
    resources: {
      money: modifier.resourceMod.money ?? 100,
      energy: modifier.resourceMod.energy ?? 100,
      reputation: modifier.resourceMod.reputation ?? 5,
    },
    step: 0,
    maxSteps: rand(8, 12),
    currentDestination: null,
    destinationChoices: generateDestinationChoices(),
    currentEvent: null,
    currentNPC: null,
    selectedModifier: modifier,
    visitedDestinations: [],
    regionsExplored: new Set(),
    risksTaken: 0,
    encountersSurvived: 0,
    specialEventCount: 0,
    lastOutcome: null,
    isAlive: true,
    runHistory: loadRunHistory(),
  };
}

function generateDestinationChoices(
  visited: string[] = []
): ModifiedDestination[] {
  const available = DESTINATIONS.filter((d) => !visited.includes(d.id));
  const selected =
    available.length >= 3
      ? shuffle(available).slice(0, 3)
      : shuffle(DESTINATIONS).slice(0, 3);

  return selected.map((dest) => {
    const modifier = pick(DESTINATION_MODIFIERS);
    const actualCost = Math.round(dest.baseCost * modifier.costMultiplier);
    const actualRisk = Math.round(dest.baseRisk * modifier.riskMultiplier * 10) / 10;
    return { ...dest, modifier, actualCost, actualRisk };
  });
}

export function selectDestination(
  state: GameState,
  dest: ModifiedDestination
): GameState {
  const travelEnergyCost = Math.round(5 + dest.actualRisk * 2);
  const newResources = applyResources(state.resources, {
    money: -dest.actualCost,
    energy: -travelEnergyCost,
    reputation: dest.modifier.reputationBonus,
  }, state.selectedModifier);

  if (newResources.money < 0 || newResources.energy <= 0) {
    return {
      ...state,
      phase: "game_over",
      resources: newResources,
      currentDestination: dest,
      isAlive: false,
      lastOutcome: {
        money: -dest.actualCost,
        energy: -travelEnergyCost,
        reputation: dest.modifier.reputationBonus,
        message:
          newResources.money < 0
            ? "You ran out of money! Stranded with no way home."
            : "You collapsed from exhaustion. The journey was too much.",
      },
    };
  }

  const newStep = state.step + 1;
  const visitedDests = [...state.visitedDestinations, dest.id];
  const newRegions = new Set(state.regionsExplored);
  newRegions.add(dest.region);

  if (newStep > state.maxSteps) {
    return {
      ...state,
      phase: "game_over",
      resources: newResources,
      step: newStep,
      currentDestination: dest,
      visitedDestinations: visitedDests,
      regionsExplored: newRegions,
      isAlive: true,
      lastOutcome: {
        money: 0,
        energy: 0,
        reputation: 0,
        message: "Your journey is complete! You made it home safely.",
      },
    };
  }

  const shouldNPC = Math.random() < 0.3 && newStep > 1;

  if (shouldNPC) {
    return {
      ...state,
      phase: "npc_encounter",
      resources: newResources,
      step: newStep,
      currentDestination: dest,
      visitedDestinations: visitedDests,
      regionsExplored: newRegions,
      currentNPC: generateNPCEncounter(dest),
    };
  }

  const event = generateEvent(newStep);
  return {
    ...state,
    phase: "event",
    resources: newResources,
    step: newStep,
    currentDestination: dest,
    visitedDestinations: visitedDests,
    regionsExplored: newRegions,
    currentEvent: event,
  };
}

function generateEvent(step: number) {
  const available = EVENTS.filter((e) => !e.minStep || step >= e.minStep);
  return pick(available);
}

function generateNPCEncounter(dest: ModifiedDestination): NPCEncounter {
  const npc = { ...pick(NPC_POOL) };

  if (dest.modifier.type === "chaotic") npc.mood = "hostile";
  if (dest.modifier.type === "festival") npc.mood = "friendly";

  const greetings = NPC_GREETINGS[npc.archetype];
  const greeting = pick(greetings);

  const choices = getNPCChoices(npc);
  return { npc, greeting, choices };
}

function getNPCChoices(npc: NPC) {
  switch (npc.archetype) {
    case "merchant":
      return [
        {
          text: "Accept the deal",
          outcome: npc.mood === "friendly"
            ? { money: 15, energy: 0, reputation: 1, message: `${npc.name} gives you a great deal! You save money on your next leg.` }
            : { money: -15, energy: 0, reputation: -1, message: `${npc.name}'s deal was a ripoff. You lose money.` },
        },
        {
          text: "Decline politely",
          outcome: { money: 0, energy: 0, reputation: 0, message: `${npc.name} nods and moves on.` },
        },
        {
          text: "Counter-offer",
          outcome: npc.trust > 40
            ? { money: 10, energy: -5, reputation: 2, message: `${npc.name} respects your negotiation. A fair deal is struck.` }
            : { money: -5, energy: -5, reputation: -1, message: `${npc.name} is offended by your lowball offer.` },
        },
      ];
    case "guide":
      return [
        {
          text: "Follow their route ($10)",
          outcome: npc.mood === "friendly"
            ? { money: -10, energy: 10, reputation: 2, message: `${npc.name} leads you through a beautiful shortcut. You feel refreshed.` }
            : { money: -10, energy: -15, reputation: 0, message: `${npc.name} led you on a wild goose chase. You're exhausted.` },
        },
        {
          text: "Find your own way",
          outcome: { money: 0, energy: -10, reputation: 0, message: "You navigate on your own. It takes a while." },
        },
      ];
    case "trickster":
      return [
        {
          text: "Play along",
          outcome: Math.random() > 0.5
            ? { money: 30, energy: -10, reputation: -2, message: `${npc.name}'s scheme pays off! Risky but profitable.` }
            : { money: -25, energy: -10, reputation: -2, message: `${npc.name} double-crossed you! Money gone.` },
        },
        {
          text: "Walk away",
          outcome: { money: 0, energy: 0, reputation: 1, message: "You wisely avoid the scam." },
        },
      ];
    case "healer":
      return [
        {
          text: "Accept their help ($5)",
          outcome: { money: -5, energy: 25, reputation: 1, message: `${npc.name} works wonders. You feel rejuvenated!` },
        },
        {
          text: "Chat and rest",
          outcome: { money: 0, energy: 10, reputation: 2, message: `${npc.name} shares wisdom while you rest. Your spirits lift.` },
        },
      ];
    case "storyteller":
      return [
        {
          text: "Listen to their story",
          outcome: { money: 0, energy: -5, reputation: 4, message: `${npc.name}'s tale captivates nearby listeners. Your reputation grows.` },
        },
        {
          text: "Share your own story",
          outcome: { money: 0, energy: -5, reputation: 3, message: `${npc.name} is impressed! They spread word of your adventures.` },
        },
        {
          text: "No time for stories",
          outcome: { money: 0, energy: 5, reputation: -1, message: `${npc.name} looks hurt. "Everyone has time for a good story..."` },
        },
      ];
    default:
      return [
        {
          text: "Engage",
          outcome: { money: 0, energy: -5, reputation: 1, message: "An interesting encounter." },
        },
      ];
  }
}

function applyResources(
  current: Resources,
  delta: EventOutcome,
  modifier: StartingModifier | null
): Resources {
  let { money, energy, reputation } = delta;

  if (modifier?.effect === "amplified") {
    money = Math.round(money * 1.5);
    energy = Math.round(energy * 1.5);
    reputation = Math.round(reputation * 1.5);
  }

  if (modifier?.effect === "energy_saver" && energy < 0) {
    energy = Math.round(energy * 0.6);
  }

  return {
    money: current.money + money,
    energy: Math.min(150, current.energy + energy),
    reputation: Math.max(0, current.reputation + reputation),
  };
}

export function resolveEventChoice(
  state: GameState,
  choiceIndex: number
): GameState {
  const event = state.currentEvent;
  if (!event) return state;

  const choice = event.choices[choiceIndex];
  if (!choice) return state;

  const isRisky =
    choice.outcome.money < -10 || choice.outcome.energy < -10;
  const newResources = applyResources(
    state.resources,
    choice.outcome,
    state.selectedModifier
  );

  const isGameOver = newResources.money < 0 || newResources.energy <= 0;

  return {
    ...state,
    phase: isGameOver ? "game_over" : "step_result",
    resources: newResources,
    currentEvent: null,
    lastOutcome: choice.outcome,
    risksTaken: state.risksTaken + (isRisky ? 1 : 0),
    encountersSurvived: state.encountersSurvived + 1,
    isAlive: !isGameOver,
  };
}

export function resolveNPCChoice(
  state: GameState,
  choiceIndex: number
): GameState {
  const encounter = state.currentNPC;
  if (!encounter) return state;

  const choice = encounter.choices[choiceIndex];
  if (!choice) return state;

  const newResources = applyResources(
    state.resources,
    choice.outcome,
    state.selectedModifier
  );
  const isGameOver = newResources.money < 0 || newResources.energy <= 0;

  return {
    ...state,
    phase: isGameOver ? "game_over" : "step_result",
    resources: newResources,
    currentNPC: null,
    lastOutcome: choice.outcome,
    encountersSurvived: state.encountersSurvived + 1,
    specialEventCount: state.specialEventCount + 1,
    isAlive: !isGameOver,
  };
}

export function continueJourney(state: GameState): GameState {
  if (state.step >= state.maxSteps) {
    return { ...state, phase: "game_over", isAlive: true };
  }

  let newResources = { ...state.resources };
  if (state.selectedModifier?.effect === "reputation_drain") {
    newResources.reputation = Math.max(0, newResources.reputation - 1);
  }

  return {
    ...state,
    phase: "destination_select",
    destinationChoices: generateDestinationChoices(state.visitedDestinations),
    lastOutcome: null,
    resources: newResources,
  };
}

export function calculateScore(state: GameState): RunScore {
  const stepsCompleted = state.step;
  const moneyEfficiency = Math.max(0, state.resources.money);
  const risksTaken = state.risksTaken;
  const encountersSurvived = state.encountersSurvived;
  const specialEvents = state.specialEventCount;
  const regionsExplored = Array.from(state.regionsExplored);
  const regionBonus = regionsExplored.length * 50;

  const survivalBonus = state.isAlive ? 200 : 0;
  const totalScore =
    stepsCompleted * 30 +
    moneyEfficiency +
    risksTaken * 40 +
    encountersSurvived * 20 +
    specialEvents * 60 +
    regionBonus +
    state.resources.reputation * 10 +
    survivalBonus;

  return {
    totalScore,
    stepsCompleted,
    moneyEfficiency,
    risksTaken,
    encountersSurvived,
    specialEvents,
    destinationsVisited: state.visitedDestinations,
    regionsExplored,
  };
}

export function checkUnlocks(score: RunScore): string[] {
  const newUnlocks: string[] = [];
  const saved = loadUnlocks();

  if (score.totalScore >= 500 && !saved.includes("influencer")) {
    newUnlocks.push("influencer");
  }
  if (score.risksTaken >= 4 && !saved.includes("gambler")) {
    newUnlocks.push("gambler");
  }
  if (score.stepsCompleted >= 8 && !saved.includes("survivor")) {
    newUnlocks.push("survivor");
  }

  if (newUnlocks.length > 0) {
    saveUnlocks([...saved, ...newUnlocks]);
  }

  return newUnlocks;
}

function loadUnlocks(): string[] {
  try {
    const data = localStorage.getItem("wanderfall_unlocks");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUnlocks(unlocks: string[]) {
  localStorage.setItem("wanderfall_unlocks", JSON.stringify(unlocks));
}

function loadRunHistory(): RunScore[] {
  try {
    const data = localStorage.getItem("wanderfall_history");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveRunToHistory(score: RunScore) {
  const history = loadRunHistory();
  history.push(score);
  if (history.length > 20) history.shift();
  localStorage.setItem("wanderfall_history", JSON.stringify(history));
}

export function getHighScore(): number {
  const history = loadRunHistory();
  return history.reduce((max, r) => Math.max(max, r.totalScore), 0);
}
