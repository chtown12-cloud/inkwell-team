import { supabase } from "./supabase";

/* ═══════════════════════════════════════════════════════════════════
   TEAM OPERATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function createTeam(name, userId, userEmail) {
  /* Generate slug from name */
  const { data: slugData, error: slugErr } = await supabase.rpc("generate_team_slug", { team_name: name });
  const slug = slugErr ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now() : slugData;

  const { data: team, error } = await supabase
    .from("teams")
    .insert({ name, slug, created_by: userId })
    .select()
    .single();
  if (error) throw error;

  /* Add creator as admin */
  const { error: memErr } = await supabase
    .from("team_members")
    .insert({ team_id: team.id, user_id: userId, email: userEmail, display_name: userEmail.split("@")[0], role: "admin", invited_by: userId });
  if (memErr) throw memErr;

  return team;
}

export async function getMyTeams() {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id, role, teams(id, name, slug, created_at)")
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(d => ({ ...d.teams, myRole: d.role }));
}

export async function getTeamBySlug(slug) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

/* ═══════════════════════════════════════════════════════════════════
   MEMBER OPERATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getTeamMembers(teamId) {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("team_id", teamId)
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function inviteMember(teamId, email, role, invitedBy) {
  /* First check if user exists in auth */
  /* We'll store the email — when they sign up and access the team page, they'll be linked */
  /* For now, we need to find if there's already a user with this email */

  /* Try to find existing user by looking at team_members across all teams */
  /* If not found, we create a placeholder that gets linked on login */
  const { data: existing } = await supabase
    .from("team_members")
    .select("user_id, email")
    .eq("email", email.toLowerCase())
    .limit(1)
    .single();

  if (existing?.user_id) {
    /* User exists — add them directly */
    const { data, error } = await supabase
      .from("team_members")
      .insert({
        team_id: teamId,
        user_id: existing.user_id,
        email: email.toLowerCase(),
        display_name: email.split("@")[0],
        role,
        invited_by: invitedBy
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /* New user — they need to sign up first. For now, show an error. */
  throw new Error("This user needs to sign up for Inkwell first, then you can add them.");
}

export async function updateMemberRole(memberId, role) {
  const { error } = await supabase
    .from("team_members")
    .update({ role })
    .eq("id", memberId);
  if (error) throw error;
}

export async function removeMember(memberId) {
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}

/* ═══════════════════════════════════════════════════════════════════
   TASK OPERATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getTeamTasks(teamId) {
  const { data, error } = await supabase
    .from("team_tasks")
    .select("*")
    .eq("team_id", teamId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTeamTask(teamId, task, userId) {
  const { data, error } = await supabase
    .from("team_tasks")
    .insert({
      team_id: teamId,
      title: task.title,
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "none",
      assigned_to: task.assigned_to || null,
      category: task.category || "General",
      due_date: task.due_date || null,
      subtasks: task.subtasks || [],
      created_by: userId,
      source_request_id: task.source_request_id || null
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTeamTask(taskId, changes) {
  const { data, error } = await supabase
    .from("team_tasks")
    .update(changes)
    .eq("id", taskId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTeamTask(taskId) {
  const { error } = await supabase
    .from("team_tasks")
    .delete()
    .eq("id", taskId);
  if (error) throw error;
}

/* ═══════════════════════════════════════════════════════════════════
   REQUEST OPERATIONS
   ═══════════════════════════════════════════════════════════════════ */

export async function getTeamRequests(teamId) {
  const { data, error } = await supabase
    .from("team_requests")
    .select("*")
    .eq("team_id", teamId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function submitRequest(teamId, request) {
  const { data, error } = await supabase
    .from("team_requests")
    .insert({
      team_id: teamId,
      title: request.title,
      description: request.description || "",
      priority: request.priority || "medium",
      requester_name: request.requester_name,
      requester_email: request.requester_email || ""
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function acceptRequest(requestId, userId, teamId, taskOverrides = {}) {
  /* Create a team task from the request */
  const { data: req } = await supabase
    .from("team_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (!req) throw new Error("Request not found");

  const task = await createTeamTask(teamId, {
    title: taskOverrides.title || req.title,
    description: taskOverrides.description || req.description,
    priority: taskOverrides.priority || req.priority,
    assigned_to: taskOverrides.assigned_to || null,
    category: taskOverrides.category || "General",
    due_date: taskOverrides.due_date || null,
    source_request_id: requestId
  }, userId);

  /* Update request status */
  const { error } = await supabase
    .from("team_requests")
    .update({
      status: "accepted",
      converted_task_id: task.id,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      response_note: taskOverrides.response_note || ""
    })
    .eq("id", requestId);
  if (error) throw error;

  return task;
}

export async function declineRequest(requestId, userId, note = "") {
  const { error } = await supabase
    .from("team_requests")
    .update({
      status: "declined",
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
      response_note: note
    })
    .eq("id", requestId);
  if (error) throw error;
}

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC (NO AUTH) OPERATIONS — for request form and viewer
   ═══════════════════════════════════════════════════════════════════ */

export async function getTeamPublicInfo(teamId) {
  /* This uses the anon key — only works if we have a policy for it */
  const { data, error } = await supabase
    .from("teams")
    .select("id, name, slug")
    .eq("id", teamId)
    .single();
  if (error) return null;
  return data;
}
