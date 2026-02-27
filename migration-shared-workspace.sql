-- ═══════════════════════════════════════════════════════════════════
-- INKWELL MIGRATION: Shared Workspace
-- Run this in Supabase SQL Editor AFTER the initial supabase-setup.sql
-- ═══════════════════════════════════════════════════════════════════

-- Shared workspace data — one JSON blob per team, all members read/write
CREATE TABLE IF NOT EXISTS workspace_data (
  team_id UUID PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
  tasks JSONB DEFAULT '[]'::jsonb,
  lists JSONB DEFAULT '["Inbox","Work","Personal"]'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE workspace_data ENABLE ROW LEVEL SECURITY;

-- Team members can read workspace data
CREATE POLICY "ws_select" ON workspace_data FOR SELECT USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid())
);

-- Team members (admin + member, not viewer) can insert
CREATE POLICY "ws_insert" ON workspace_data FOR INSERT WITH CHECK (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('admin','member'))
  OR
  team_id IN (SELECT id FROM teams WHERE created_by = auth.uid())
);

-- Team members (admin + member, not viewer) can update
CREATE POLICY "ws_update" ON workspace_data FOR UPDATE USING (
  team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND role IN ('admin','member'))
);

-- Public read for the viewer dashboard (unauthenticated users with the link)
-- This allows /dashboard/[teamId] to work without login
CREATE POLICY "ws_public_read" ON workspace_data FOR SELECT USING (true);

-- Auto-update timestamp
CREATE OR REPLACE TRIGGER set_ws_updated_at
  BEFORE UPDATE ON workspace_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════
-- DONE! Now redeploy the app.
-- ═══════════════════════════════════════════════════════════════════
