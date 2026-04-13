# Flow Pilot

AI-enabled kanban board. Next.js web app, potential Expo mobile expansion later.
Smart kanban with AI-powered features and a chrome extension.

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Supabase (Postgres, auth, storage)
- Zod for validation (client and server)
- TanStack Query (React Query) for client-side data fetching

## Architecture

- Server Components by default — no `use client` unless interactivity or browser APIs needed
- Client Components: `use client` at top, keep minimal, extract logic to hooks
- API routes in `app/api/` for all backend logic — never query DB from client components
- Server actions for mutations (forms etc.)
- Middleware in `middleware.ts` refreshes auth tokens and protects routes globally

## File Structure

```
src/
  app/
    (auth)/           # Login, signup pages
    (dashboard)/      # Protected pages
    api/              # API route handlers
    layout.tsx
  components/
    ui/               # shadcn/ui components
    forms/            # Form components
    dashboard/        # Feature-specific components
  hooks/              # Custom React hooks (useWorkouts, useUser etc.)
  lib/
    supabase/         # Supabase client factories (server + browser)
    utils.ts          # General utilities — no framework deps, portable to mobile
  types/              # Shared TypeScript types and Zod schemas
supabase/
  migrations/         # All DB changes go here, never modify DB directly
```

## Database

- All queries via Supabase client with RLS enabled — never bypass RLS
- Always `select()` with explicit columns, never `select('*')`
- Always `.limit()` on user-facing queries
- Migrations in `supabase/migrations/` only

## Authentication

- Use `createServerClient()` from `@supabase/ssr` in Server Components and API routes
- Use `createBrowserClient()` from `@supabase/ssr` in Client Components
- Always use `getUser()` for auth checks — never trust `getSession()` alone
- Middleware handles token refresh and route protection globally

## Data Fetching

- All data fetching logic in custom hooks (e.g. `useWorkouts()`, `useUser()`)
- Never fetch inline in components — hooks are reusable when mobile is added
- Use TanStack Query for client-side fetching, caching, and invalidation
- Business logic (calculations, transformations) in `lib/utils.ts` — no framework deps

## Validation

- Zod schemas for all API request bodies — validate at route handler before touching DB
- Zod schemas for all forms on the client
- All schemas in `types/` folder, shared between client and server

## API Design

- RESTful route naming: `/api/workouts`, `/api/workouts/[id]`
- Consistent response format:

```ts
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string; code?: string };
```

- Validate JWT at the top of every API route before doing anything

## Code Style

- No emojis in code or comments
- Immutable patterns — spread operator, never mutate objects directly
- No logic in page files — pages compose components only
- TypeScript everywhere, no plain JS

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # Server-only, never expose to client
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Git Workflow

- `feat:` new features, `fix:` bugs, `refactor:` code changes
- Feature branches from `main`, merge via PR
- Vercel auto-deploys preview on PR, production on merge to `main`

## Future Mobile Expansion

A React Native / Expo mobile app may be added later in a Turborepo monorepo.
To keep that migration easy:

- All hooks in `hooks/` must have zero framework dependencies beyond React
- All business logic in `lib/utils.ts` must be portable (no Next.js imports)
- API routes must be the single source of truth — mobile will call the same endpoints

## Commits

use conventional commits with short lowercase messages like feat: add auth or fix: handle null user

## Offline Testing — Always Before Pushing

MANDATORY before every commit/push:

1. `npm run typecheck` — catch type errors
2. `npm run test` — run all unit tests
3. `npm run build` — verify production build passes

Or run all at once: `npm run check`

These are also enforced by Husky:

- **pre-commit**: prettier format + eslint fix on staged files
- **pre-push**: typecheck + test + build

Never push code that fails any of these checks locally.

## README Maintenance

You are responsible for keeping README.md up to date. After every task that adds, completes, or plans a feature:

- Move completed items from "To Do" to "Done"
- Add new planned features to "To Do" or "Future / AI Features"
- Commit the README update alongside the code change
