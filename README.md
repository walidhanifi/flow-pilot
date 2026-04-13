# Flow Pilot

AI-enabled kanban board for managing your workflow smarter.

Drag-and-drop task management with AI-powered insights, built for teams and individuals that move fast.

**Live:** _deploying soon_

---

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | Next.js 15 (App Router) + TypeScript |
| Styling    | Tailwind CSS + shadcn/ui             |
| Auth       | Supabase Auth (email)                |
| Database   | Supabase (Postgres + RLS)            |
| Data       | TanStack Query (React Query)         |
| Validation | Zod (client + server)                |
| Testing    | Vitest + Testing Library             |
| Hosting    | Vercel                               |

---

## Local Development

### First time setup

```bash
git clone https://github.com/walidhanifi/flow-pilot
cd flow-pilot
npm install
cp .env.local.example .env.local   # fill in your Supabase credentials
npx supabase link --project-ref <your-ref>
npx supabase db push               # apply all migrations
npm run dev                        # http://localhost:3000
```

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Day to day

```bash
# Pull latest + install any new deps
git pull && npm install

# Create a feature branch
git checkout -b feat/my-feature

# Develop, then run tests
npm test

# Commit and push
git add <files>
git commit -m "feat: add my feature"
git push
```

---

## Progress

### Done

- [x] Project setup (Next.js 15, TypeScript, Tailwind, shadcn/ui)
- [x] Vercel deployment pipeline
- [x] Supabase auth integration (email login + signup)
- [x] Auth screens (login + signup) with split-panel layout
- [x] Protected dashboard route with proxy (middleware) auth guard
- [x] Dashboard layout with header (user email + logout)
- [x] Kanban board with drag-and-drop between columns
- [x] Job cards (title, company, status, notes)
- [x] Add job modal with Zod-validated form
- [x] Skeleton loading states for job cards
- [x] REST API routes for jobs (list, create, update, delete) — all fields including notes
- [x] Postgres migrations with RLS policies
- [x] Notes field on jobs (DB + API + UI)
- [x] Unit tests — 134 tests across components, hooks, proxy (Vitest + Testing Library)
- [x] Husky pre-commit (prettier + eslint) and pre-push (typecheck + test + build) hooks
- [x] Env var validation with clear error messages on missing config

### To Do

- [ ] Edit job details inline or via modal
- [ ] Delete job with confirmation
- [ ] Filter and search jobs on the board
- [ ] Column customization (rename, add, remove)
- [ ] Due dates on job cards
- [ ] Label / tag system for jobs
- [ ] User settings page (profile, preferences)
- [ ] Keyboard shortcuts for power users
- [ ] Mobile-responsive polish
- [ ] E2E tests for critical flows (Playwright)

### Future / AI Features

- [ ] AI task prioritization suggestions
- [ ] AI-generated status summaries ("your week at a glance")
- [ ] AI deadline estimation based on task complexity
- [ ] Natural language task creation ("add a bug fix card to In Progress")
- [ ] AI task breakdown (split large cards into subtasks)
- [ ] Chrome extension — add tasks from any webpage
- [ ] Expo mobile app (Turborepo monorepo)
- [ ] Notifications (in-app + email)
- [ ] Team / collaborative boards (multi-user)
- [ ] Activity log and audit trail
- [ ] Analytics (throughput, cycle time, velocity)
