# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Wanderfall Game

A mobile-first roguelite travel game built with React + Vite. All game logic is client-side.

### Game Architecture
- `artifacts/wanderfall/src/game/types.ts` - All TypeScript types (Resources, GameState, Events, NPCs, etc.)
- `artifacts/wanderfall/src/game/data.ts` - Game content data (16 destinations, 18 events, 10 NPCs, 6 starting modifiers)
- `artifacts/wanderfall/src/game/engine.ts` - Core game engine (state management, event resolution, scoring, meta progression)
- `artifacts/wanderfall/src/components/` - UI components (MainMenu, DestinationSelect, EventCard, NPCEncounterView, StepResult, GameOver, ResourceBar)

### Game Systems
- **Event Engine**: 18 random events with 2-3 choices each, resource-affecting outcomes
- **NPC System**: 10 NPCs across 5 archetypes (merchant, guide, trickster, healer, storyteller) with mood and trust mechanics
- **Destination Modifiers**: 6 modifier types (cheap, expensive, safe, chaotic, festival, normal) randomly applied per run
- **Scoring**: Composite score from steps, money efficiency, risks taken, encounters survived, regions explored, reputation
- **Meta Progression**: Unlock new starting modifiers by achieving score thresholds and milestones
- **Persistence**: localStorage for run history, high scores, and unlocks

### Theme
- Dark theme with amber/gold primary, teal secondary, green accent
- Font: Space Grotesk + JetBrains Mono
- Custom animations: pulse-glow, slide-up, fade-in, shake

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
