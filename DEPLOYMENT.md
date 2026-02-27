# Inkwell — Deployment Guide

## Architecture (Shared Workspace)

All team members share one workspace. The personal tasks UI is the only interface — there is no separate team dashboard for editing. Tasks are stored as a JSON blob in `workspace_data` (per team).

### Routes
- `/` — Main app (login → create team → shared task workspace)
- `/submit/[teamId]` — Public request submission form
- `/dashboard/[teamId]` — Read-only viewer dashboard (no login required)

### Database Tables
| Table | Purpose |
|-------|---------|
| `user_data` | Legacy (no longer used by the app) |
| `teams` | Team metadata |
| `team_members` | Who belongs to which team + roles |
| `workspace_data` | **Shared JSON blob** — tasks, lists, settings per team |
| `team_requests` | Incoming requests from the public form |
| `team_tasks` | Legacy (no longer used by the app) |

### Data Flow
1. User logs in → app finds their team via `team_members`
2. Tasks load from `workspace_data.tasks` (JSON array)
3. Every edit saves back to `workspace_data` (debounced 800ms)
4. All team members see the same tasks in real-time (30s poll + focus sync)

## Setup

### 1. Supabase
1. Run `supabase-setup.sql` in SQL Editor
2. Run `migration-shared-workspace.sql` in SQL Editor
3. Set env vars in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Vercel
```bash
npm install
npx next build
# Deploy to Vercel via GitHub push
```

### 3. Magic Link Auth
In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-domain.vercel.app`
- Redirect URLs: `https://your-domain.vercel.app`

## Team Features (in the main UI)

- **Assigned To** — dropdown in task detail panel (members only)
- **Assignee avatars** — shown on kanban cards and list rows
- **My Assigned** — sidebar view filtering to your tasks
- **Requests** — review incoming requests, accept as tasks
- **Members** — add/remove members, change roles, shareable links
- **Viewer Dashboard** — `/dashboard/[teamId]` for stakeholders
