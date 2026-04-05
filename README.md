# Chess

A full-stack multiplayer chess platform built as a Turborepo monorepo. The project combines a React frontend, an Express backend for authentication, a dedicated WebSocket server for real-time gameplay, and a shared Prisma database package for persistence.

## Overview

This repository goes beyond a basic chess demo where moves are simply mirrored between two clients. It adds the supporting product layers needed for a more complete multiplayer experience:

- OAuth-based authentication
- Real-time game creation and matchmaking
- Persistent game and move storage
- Rejoin flow for existing games
- Shared packages for UI, state, linting, and TypeScript configuration

## Architecture

### Applications

- `apps/frontend` - React + Vite client for landing, login, and gameplay screens
- `apps/backend` - Express server handling auth and API routes
- `apps/ws` - WebSocket server managing matchmaking, room membership, and game events

### Shared packages

- `packages/db` - Prisma schema, migrations, and database client
- `packages/store` - shared Recoil state and hooks
- `packages/ui` - reusable UI components
- `packages/eslint-config` - shared lint rules
- `packages/typescript-config` - shared TypeScript configuration

## Core Features

- Play live multiplayer chess over WebSockets
- Start a random game and sync moves between connected players
- Authenticate users with OAuth providers
- Persist games and move history in PostgreSQL via Prisma
- Reconstruct previously created games from stored move history
- Show player metadata and move table in the game UI
- Support pawn promotion and basic game-over handling

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Recoil
- Backend: Node.js, Express, Passport
- Realtime: `ws`
- Chess engine: `chess.js`
- Database: PostgreSQL, Prisma
- Monorepo tooling: Turborepo, Yarn Workspaces

## Repository Structure

```text
.
|-- apps
|   |-- backend
|   |-- frontend
|   `-- ws
|-- packages
|   |-- db
|   |-- eslint-config
|   |-- store
|   |-- tailwind-Config
|   |-- typescript-config
|   `-- ui
|-- package.json
`-- turbo.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.x
- PostgreSQL

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment variables

Create the required environment files based on the examples already present in the repo.

For the database package:

```bash
cp packages/db/.env.example packages/db/.env
```

Set:

```env
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

For the backend app:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Set your OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### 3. Run Prisma migrations

Run Prisma against your configured PostgreSQL database from the `packages/db` package.

```bash
cd packages/db
npx prisma migrate deploy
```

If you are developing locally and want Prisma to generate the client after schema changes:

```bash
npx prisma generate
```

### 4. Start the services

Open separate terminals and run:

Frontend:

```bash
cd apps/frontend
yarn dev
```

Backend:

```bash
cd apps/backend
yarn dev
```

WebSocket server:

```bash
cd apps/ws
yarn dev
```

## Default Local Ports

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- WebSocket server: `ws://localhost:8080`

## Development Notes

- The frontend opens a WebSocket connection using the authenticated user token.
- The backend is responsible for session and OAuth handling.
- The WebSocket server validates the token, creates or joins games, broadcasts moves, and updates persistent game state.
- Prisma migrations live in `packages/db/prisma/migrations`.

## Typical Flow

1. A user lands on the frontend and signs in.
2. The frontend connects to the WebSocket server with the user token.
3. A player starts a random game or joins an existing room.
4. The WebSocket server pairs players and creates the game session.
5. Moves are validated with `chess.js`, broadcast to both players, and stored in the database.
6. Players can later rejoin and reconstruct the board from persisted move history.

## Scripts

From the repository root:

```bash
yarn build
yarn dev
yarn lint
yarn format
```

App-specific scripts:

- `apps/frontend`: `yarn dev`, `yarn build`, `yarn preview`
- `apps/backend`: `yarn dev`, `yarn build`, `yarn start`
- `apps/ws`: `yarn dev`

## Current Scope

This repository already covers the core multiplayer chess product workflow, but there is still room for production hardening in areas like:

- stronger session and cookie security configuration
- improved reconnect and disconnect handling
- deeper move validation and edge-case coverage
- testing, monitoring, and deployment setup
- rating, matchmaking rules, and player profiles
