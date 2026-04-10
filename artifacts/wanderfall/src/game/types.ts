export interface Resources {
  money: number;
  energy: number;
  reputation: number;
}

export interface Destination {
  id: string;
  name: string;
  region: string;
  emoji: string;
  baseRisk: number;
  baseCost: number;
}

export interface DestinationModifier {
  type: "cheap" | "expensive" | "safe" | "chaotic" | "festival" | "normal";
  label: string;
  emoji: string;
  costMultiplier: number;
  riskMultiplier: number;
  reputationBonus: number;
}

export interface ModifiedDestination extends Destination {
  modifier: DestinationModifier;
  actualCost: number;
  actualRisk: number;
}

export interface EventChoice {
  text: string;
  outcome: EventOutcome;
}

export interface EventOutcome {
  money: number;
  energy: number;
  reputation: number;
  message: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  minStep?: number;
}

export interface NPC {
  id: string;
  name: string;
  archetype: "merchant" | "guide" | "trickster" | "healer" | "storyteller";
  mood: "friendly" | "neutral" | "hostile";
  trust: number;
  emoji: string;
  effect: string;
}

export interface NPCEncounter {
  npc: NPC;
  greeting: string;
  choices: EventChoice[];
}

export interface StartingModifier {
  id: string;
  name: string;
  description: string;
  emoji: string;
  resourceMod: Partial<Resources>;
  effect: string;
  unlocked: boolean;
}

export interface RunScore {
  totalScore: number;
  stepsCompleted: number;
  moneyEfficiency: number;
  risksTaken: number;
  encountersSurvived: number;
  specialEvents: number;
  destinationsVisited: string[];
  regionsExplored: string[];
}

export type GamePhase =
  | "menu"
  | "modifier_select"
  | "destination_select"
  | "event"
  | "npc_encounter"
  | "step_result"
  | "game_over";

export interface GameState {
  phase: GamePhase;
  resources: Resources;
  step: number;
  maxSteps: number;
  currentDestination: ModifiedDestination | null;
  destinationChoices: ModifiedDestination[];
  currentEvent: GameEvent | null;
  currentNPC: NPCEncounter | null;
  selectedModifier: StartingModifier | null;
  visitedDestinations: string[];
  regionsExplored: Set<string>;
  risksTaken: number;
  encountersSurvived: number;
  specialEventCount: number;
  lastOutcome: EventOutcome | null;
  isAlive: boolean;
  runHistory: RunScore[];
}
