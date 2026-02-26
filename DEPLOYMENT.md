# Inkwell Team — Deployment Guide

Deploy Inkwell Team as a **new, separate project** alongside your existing personal Inkwell.

---

## Quick Overview

| Step | What | Time |
|------|------|------|
| 1 | Create GitHub repo | 2 min |
| 2 | Create Supabase project | 5 min |
| 3 | Run the database setup SQL | 3 min |
| 4 | Deploy to Vercel | 5 min |
| 5 | Test it | 5 min |

Total: ~20 minutes

---

## Step 1: Create a New GitHub Repository

1. Go to **https://github.com/new**
2. Set the name to something like `inkwell-team`
3. Set it to **Public** or **Private** (your choice)
4. **Do NOT** initialize with a README (we already have files)
5. Click **Create repository**

Now upload the code. You have two options:

### Option A: Upload via GitHub UI (easiest)
1. On the new empty repo page, click **"uploading an existing file"**
2. Drag the entire contents of the `inkwell-team` folder into the upload area
   - Make sure to include ALL folders: `app/`, `lib/`, `public/`
   - And ALL files: `package.json`, `package-lock.json`, `next.config.js`, `supabase-setup.sql`
3. Click **Commit changes**

### Option B: Upload via Git CLI
```bash
cd inkwell-team
git init
git add .
git commit -m "Initial commit — Inkwell Team"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/inkwell-team.git
git push -u origin main
```

---

## Step 2: Create a New Supabase Project

You can use your **existing Supabase account** — just create a new project.

1. Go to **https://supabase.com/dashboard**
2. Click **New Project**
3. Name it `inkwell-team` (or whatever you like)
4. Set a database password (save this somewhere)
5. Choose the same region as your existing project
6. Click **Create new project** and wait ~2 minutes

### Get your Supabase credentials:
1. In the project dashboard, go to **Settings → API**
2. Copy these two values (you'll need them for Vercel):
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

### Enable Email Auth (same as your personal Inkwell):
1. Go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. If you want magic links, ensure that's toggled on
4. If you want password auth, enable that too

---

## Step 3: Run the Database Setup SQL

This creates all the tables, indexes, and security policies.

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file `supabase-setup.sql` from the project
4. **Copy the ENTIRE contents** and paste it into the SQL editor
5. Click **Run**
6. You should see "Success. No rows returned" — that's correct

### Also create the user_data table (for personal tasks):
If this is a brand new Supabase project, you also need the personal tasks table:

```sql
CREATE TABLE IF NOT EXISTS user_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tasks JSONB DEFAULT '[]'::jsonb,
  lists JSONB DEFAULT '["Inbox","Work","Personal"]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own data" ON user_data
  FOR ALL USING (auth.uid() = user_id);
```

### Verify the tables exist:
1. Go to **Table Editor** in Supabase
2. You should see: `user_data`, `teams`, `team_members`, `team_tasks`, `team_requests`

---

## Step 4: Deploy to Vercel

1. Go to **https://vercel.com/new**
2. Click **Import** next to your `inkwell-team` GitHub repository
3. Vercel will auto-detect it as a Next.js project

### Set Environment Variables:
Before clicking Deploy, click **Environment Variables** and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL (from Step 2) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (from Step 2) |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (same as personal Inkwell — for the scan feature) |

4. Click **Deploy**
5. Wait ~1-2 minutes for the build to complete
6. You'll get a URL like `inkwell-team-abc123.vercel.app`

### (Optional) Set a custom domain:
1. In Vercel project settings → **Domains**
2. Add your custom domain or use the Vercel-provided one

---

## Step 5: Test Everything

### 5a. Personal Tasks (should work exactly like before)
1. Go to your Vercel URL: `https://your-app.vercel.app`
2. Sign up / log in with email
3. Create a task, check it works
4. Verify you see a **"♦ Team Workspace →"** link in the sidebar

### 5b. Create a Team
1. Click the **"♦ Team Workspace →"** link (or go to `/team`)
2. Enter a team name and click **Create Team**
3. You should see the Team Board with three columns: To Do, In Progress, Done

### 5c. Create a Team Task
1. Click **+ New Task**
2. Fill in title, description, priority
3. Click **Create Task**
4. Verify it appears in the "To Do" column
5. Try dragging it to "In Progress"

### 5d. Add a Team Member
1. Go to **Members** in the sidebar
2. Click **+ Add Member**
3. Enter their email (they must have signed up for Inkwell first)
4. Choose their role (Member, Viewer, or Admin)

### 5e. Test the Request Form
1. On the **Members** page, copy the **Request form** link
2. Open it in an incognito/private window (to test as an outsider)
3. Fill out the form and submit
4. Go back to your team page → **Requests**
5. You should see the pending request
6. Click it to Accept or Decline

### 5f. Test the Viewer Dashboard
1. On the **Members** page, copy the **Viewer board** link
2. Open it in an incognito/private window
3. You should see a read-only view of your team's tasks

---

## Your App's URL Structure

| URL | Purpose | Who sees it |
|-----|---------|-------------|
| `/` | Personal task manager | Logged-in user only |
| `/team` | Team workspace | Team members only |
| `/submit/{teamId}` | Request submission form | Anyone with the link |
| `/dashboard/{teamId}` | Read-only team dashboard | Anyone with the link |

---

## Troubleshooting

### "Team not found" on submit/dashboard page
- Make sure the team ID in the URL is correct
- Check that the `teams_public_read` and `tasks_public_read` RLS policies exist

### "This user needs to sign up first"
- The person you're inviting must create an account on your Inkwell app first
- They go to the main page `/`, sign up with email, then you can add them

### Tasks not showing up / permission errors
- Go to Supabase → **Authentication → Policies**
- Verify all 12+ policies exist on the correct tables
- If policies are missing, re-run the SQL setup script

### Build fails on Vercel
- Check that all 3 environment variables are set correctly
- Make sure `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
- Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` starts with `eyJ`

---

## What's Included

- ✅ Personal task management (unchanged from your existing Inkwell)
- ✅ Team board with Kanban view (To Do → In Progress → Done)
- ✅ Task creation, editing, assignment, priority, due dates
- ✅ Drag-and-drop between status columns
- ✅ Anyone on the team can edit any task
- ✅ Request queue with public submission form
- ✅ Accept/decline requests → auto-converts to tasks
- ✅ Viewer dashboard for external stakeholders
- ✅ Member management with roles (Admin, Member, Viewer)
- ✅ Strict separation between personal and team tasks
- ✅ Auto-refresh every 30s (team) / 60s (dashboard)
