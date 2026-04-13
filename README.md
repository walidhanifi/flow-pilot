# Flow Pilot

AI-enabled kanban board for managing your workflow smarter.

Drag-and-drop task management with AI-powered insights, built for teams and individuals that move fast.

👉 **[Live Link](https://flow-pilot-beta.vercel.app/)**

---

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Framework  | Next.js 16 (App Router) + TypeScript |
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

# Develop, then run checks
npm run check   # lint + typecheck + test + build

# Commit and push
git add <files>
git commit -m "feat: add my feature"
git push
```

---

## Progress

### Done

- [x] Project setup (Next.js 16, TypeScript, Tailwind, shadcn/ui)
- [x] Vercel deployment pipeline
- [x] Supabase auth integration (email login + signup)
- [x] Auth screens (login + signup) with split-panel layout
- [x] Protected dashboard route with proxy (middleware) auth guard
- [x] Kanban board with drag-and-drop between columns
- [x] Item cards (title, organisation, status, notes, URL chip, relative date)
- [x] Add item modal with Zod-validated form
- [x] Skeleton loading states for item cards
- [x] REST API routes for items (list, create, update, delete) — all fields including notes
- [x] Postgres migrations with RLS policies
- [x] Unit tests — 143+ tests across components, hooks, proxy (Vitest + Testing Library)
- [x] Husky pre-commit (prettier + eslint) and pre-push (typecheck + test + build) hooks
- [x] Env var validation with clear error messages on missing config
- [x] Sidebar navigation — desktop fixed left + mobile bottom bar
- [x] Column customisation — rename and hide/show with localStorage persistence
- [x] Delete items — inline two-click confirmation (no modal)
- [x] Dark mode / light mode / system — persistent via localStorage, no flash on load
- [x] Settings page — theme toggle + column visibility management
- [x] Team page — invite UI shell with coming-soon overlay
- [x] Placeholder pages with animated UI — Analytics, AI Insights, Calendar, Documents, Contacts, Goals

### To Do

- [ ] Edit item details inline or via modal
- [ ] Filter and search items on the board
- [ ] Due dates on item cards
- [ ] Label / tag system
- [ ] Keyboard shortcuts for power users
- [ ] Mobile-responsive polish
- [ ] E2E tests for critical flows (Playwright)
- [ ] Notes panel / side drawer per item

### Future / AI Features

- [ ] AI task prioritisation suggestions
- [ ] AI-generated status summaries ("your week at a glance")
- [ ] AI deadline estimation based on task complexity
- [ ] Natural language item creation ("add a bug fix card to In Progress")
- [ ] AI task breakdown (split large cards into subtasks)
- [ ] AI cover letter drafting from job descriptions
- [ ] Chrome extension — add items from any webpage
- [ ] Expo mobile app (Turborepo monorepo)
- [ ] Notifications (in-app + email)
- [ ] Team / collaborative boards (multi-user, real-time)
- [ ] Activity log and audit trail
- [ ] Analytics (throughput, cycle time, velocity)
- [ ] Contacts / network tracker with follow-up reminders
- [ ] Document storage (CVs, cover letters, linked to items)
- [ ] Goals and streak tracking
