"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";
import * as api from "../../lib/teamApi";

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ═══════════════════════════════════════════════════════════════════ */
const PRIORITY = {
  none:   { color: "#a8a29e", label: "None", bg: "#f5f5f4" },
  low:    { color: "#60a5fa", label: "Low", bg: "#eff6ff" },
  medium: { color: "#fbbf24", label: "Medium", bg: "#fffbeb" },
  high:   { color: "#f87171", label: "High", bg: "#fef2f2" },
};
const STATUS_COLS = [
  { key: "todo", label: "To Do", icon: "○", color: "#a8a29e" },
  { key: "in_progress", label: "In Progress", icon: "◐", color: "#3b82f6" },
  { key: "done", label: "Done", icon: "●", color: "#22c55e" },
];
const localDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tmrw = new Date(today); tmrw.setDate(tmrw.getDate()+1);
  if (date.getTime()===today.getTime()) return "Today";
  if (date.getTime()===tmrw.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-IE",{month:"short",day:"numeric"});
};
const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff/60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs/24);
  if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IE",{month:"short",day:"numeric"});
};

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
const Overlay = ({onClose,children,wide}) => (
  <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn 0.15s ease"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:16,width:wide?"90%":"100%",maxWidth:wide?640:480,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 48px rgba(0,0,0,0.2)",animation:"slideUp 0.2s ease"}}>{children}</div>
  </div>
);
const Btn = ({children,variant="primary",disabled,...p}) => (
  <button {...p} disabled={disabled} style={{padding:"10px 20px",borderRadius:10,border:variant==="primary"?"none":"1px solid var(--border)",background:variant==="primary"?"var(--accent)":variant==="danger"?"#ef4444":"white",color:variant==="primary"||variant==="danger"?"white":"var(--text)",fontSize:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,fontFamily:"inherit",transition:"all 0.15s",...(p.style||{})}}>{children}</button>
);
const Badge = ({children,color="#a8a29e",bg="#f5f5f4"}) => (
  <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6,color,background:bg,whiteSpace:"nowrap"}}>{children}</span>
);
const EmptyState = ({icon,title,desc,action}) => (
  <div style={{textAlign:"center",padding:"48px 20px",color:"var(--muted)"}}>
    <div style={{fontSize:40,marginBottom:12}}>{icon}</div>
    <div style={{fontSize:16,fontWeight:600,color:"var(--ink)",marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,marginBottom:16,maxWidth:320,margin:"0 auto 16px"}}>{desc}</div>
    {action}
  </div>
);
const Avatar = ({name,size=28}) => {
  const initial = (name||"?")[0].toUpperCase();
  const colors = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;
  return <div style={{width:size,height:size,borderRadius:"50%",background:colors[idx],color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,fontWeight:700,flexShrink:0}} title={name}>{initial}</div>;
};

/* ═══════════════════════════════════════════════════════════════════
   TASK DETAIL MODAL
   ═══════════════════════════════════════════════════════════════════ */
function TaskModal({ task, members, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "none");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "");
  const [category, setCategory] = useState(task?.category || "General");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const isNew = !task?.id;

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description,
      status,
      priority,
      assigned_to: assignedTo || null,
      category: category.trim() || "General",
      due_date: dueDate || null,
      ...(status === "done" && !task?.completed_at ? { completed_at: new Date().toISOString() } : {}),
      ...(status !== "done" ? { completed_at: null } : {})
    });
  };

  const field = { marginBottom: 16 };
  const label = { fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
  const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, color: "var(--ink)", background: "white", fontFamily: "inherit", boxSizing: "border-box", outline: "none" };

  return (
    <Overlay onClose={onClose}>
      <div style={{padding: "24px 24px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontSize:18,fontWeight:700}}>{isNew ? "New Task" : "Edit Task"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"var(--muted)",padding:4}}>×</button>
        </div>

        <div style={field}>
          <label style={label}>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title..." style={input} autoFocus />
        </div>

        <div style={field}>
          <label style={label}>Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add details..." rows={3} style={{...input,resize:"vertical",minHeight:60}} />
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,...field}}>
          <div>
            <label style={label}>Status</label>
            <select value={status} onChange={e=>setStatus(e.target.value)} style={{...input,cursor:"pointer"}}>
              {STATUS_COLS.map(s => <option key={s.key} value={s.key}>{s.icon} {s.label}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Priority</label>
            <select value={priority} onChange={e=>setPriority(e.target.value)} style={{...input,cursor:"pointer"}}>
              {Object.entries(PRIORITY).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,...field}}>
          <div>
            <label style={label}>Assigned To</label>
            <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} style={{...input,cursor:"pointer"}}>
              <option value="">Unassigned</option>
              {members.filter(m=>m.role!=="viewer").map(m => <option key={m.user_id} value={m.user_id}>{m.display_name || m.email}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Due Date</label>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={input} />
          </div>
        </div>

        <div style={field}>
          <label style={label}>Category</label>
          <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g. Design, Engineering..." style={input} />
        </div>

        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
          <div>
            {!isNew && <Btn variant="danger" onClick={()=>{if(confirm("Delete this task?"))onDelete(task.id)}} style={{padding:"10px 16px"}}>Delete</Btn>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={!title.trim()}>{isNew ? "Create Task" : "Save Changes"}</Btn>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REQUEST DETAIL MODAL (Accept / Decline)
   ═══════════════════════════════════════════════════════════════════ */
function RequestModal({ request, members, onAccept, onDecline, onClose }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(request?.priority || "medium");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("General");

  const label = { fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.5px" };
  const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, color: "var(--ink)", background: "white", fontFamily: "inherit", boxSizing: "border-box", outline: "none" };

  return (
    <Overlay onClose={onClose}>
      <div style={{padding: "24px 24px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <h3 style={{fontSize:18,fontWeight:700}}>Review Request</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"var(--muted)",padding:4}}>×</button>
        </div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:20}}>From {request.requester_name}{request.requester_email ? ` (${request.requester_email})` : ""} · {timeAgo(request.created_at)}</div>

        <div style={{background:"var(--surface)",borderRadius:12,padding:16,marginBottom:20}}>
          <div style={{fontSize:15,fontWeight:600,marginBottom:6}}>{request.title}</div>
          {request.description && <div style={{fontSize:14,color:"var(--muted)",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{request.description}</div>}
          <div style={{marginTop:8}}><Badge color={PRIORITY[request.priority]?.color} bg={PRIORITY[request.priority]?.bg}>{request.priority}</Badge></div>
        </div>

        <div style={{fontSize:13,fontWeight:700,color:"var(--ink)",marginBottom:12}}>Accept as task with these settings:</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <label style={label}>Assign To</label>
            <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} style={{...input,cursor:"pointer"}}>
              <option value="">Unassigned</option>
              {members.filter(m=>m.role!=="viewer").map(m => <option key={m.user_id} value={m.user_id}>{m.display_name || m.email}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Priority</label>
            <select value={priority} onChange={e=>setPriority(e.target.value)} style={{...input,cursor:"pointer"}}>
              {Object.entries(PRIORITY).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <label style={label}>Due Date</label>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Category</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} style={input} placeholder="General" />
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <label style={label}>Note (optional)</label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Response note..." style={input} />
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn variant="secondary" onClick={()=>{ onDecline(request.id, note); }}>Decline</Btn>
          <Btn onClick={()=>{ onAccept(request.id, { assigned_to: assignedTo || null, priority, due_date: dueDate || null, category: category || "General", response_note: note }); }}>Accept → Create Task</Btn>
        </div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADD MEMBER MODAL
   ═══════════════════════════════════════════════════════════════════ */
function AddMemberModal({ onAdd, onClose }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await onAdd(email.trim().toLowerCase(), role);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", fontSize: 14, color: "var(--ink)", background: "white", fontFamily: "inherit", boxSizing: "border-box", outline: "none" };

  return (
    <Overlay onClose={onClose}>
      <div style={{padding:"24px"}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Add Team Member</h3>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:6}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="colleague@company.com" style={input} autoFocus
            onKeyDown={e=>{if(e.key==="Enter")handleAdd()}} />
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:12,fontWeight:600,color:"var(--muted)",display:"block",marginBottom:6}}>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{...input,cursor:"pointer"}}>
            <option value="member">Member — can create & edit tasks</option>
            <option value="viewer">Viewer — read-only access</option>
            <option value="admin">Admin — can manage members</option>
          </select>
        </div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:16,lineHeight:1.5}}>
          The person must already have an Inkwell account. Ask them to sign up at the main page first, then add them here.
        </div>
        {error && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#dc2626",marginBottom:12}}>{error}</div>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={handleAdd} disabled={!email.trim()||loading}>{loading ? "Adding..." : "Add Member"}</Btn>
        </div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEAM KANBAN CARD
   ═══════════════════════════════════════════════════════════════════ */
function TaskCard({ task, members, onClick, onStatusChange }) {
  const assigned = members.find(m => m.user_id === task.assigned_to);
  const pc = PRIORITY[task.priority || "none"];

  return (
    <div
      draggable
      onDragStart={e=>{e.dataTransfer.setData("text/plain",task.id);e.dataTransfer.effectAllowed="move";}}
      onClick={()=>onClick(task)}
      style={{background:"white",borderRadius:10,padding:"12px 14px",cursor:"pointer",borderLeft:`3px solid ${pc.color}`,boxShadow:"0 1px 3px rgba(0,0,0,0.06)",transition:"box-shadow 0.15s, transform 0.15s",marginBottom:8}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)";e.currentTarget.style.transform="none";}}
    >
      <div style={{fontSize:14,fontWeight:600,color:"var(--ink)",marginBottom:6,lineHeight:1.4}}>{task.title}</div>
      {task.description && <div style={{fontSize:12,color:"var(--muted)",marginBottom:8,lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{task.description}</div>}
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        {task.priority !== "none" && <Badge color={pc.color} bg={pc.bg}>{pc.label}</Badge>}
        {task.category && task.category !== "General" && <Badge>{task.category}</Badge>}
        {task.due_date && <span style={{fontSize:11,color:new Date(task.due_date+"T23:59:59")<new Date()?"#ef4444":"var(--muted)"}}>{formatDate(task.due_date)}</span>}
        <div style={{flex:1}}/>
        {assigned && <Avatar name={assigned.display_name || assigned.email} size={22} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEAM CREATION VIEW
   ═══════════════════════════════════════════════════════════════════ */
function CreateTeamView({ user, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const team = await api.createTeam(name.trim(), user.id, user.email);
      onCreated(team);
    } catch (e) {
      alert("Error creating team: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh",padding:20}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white",margin:"0 auto 20px"}}>I</div>
        <h2 style={{fontSize:22,fontWeight:700,marginBottom:6}}>Create Your Team</h2>
        <p style={{fontSize:14,color:"var(--muted)",marginBottom:24}}>Get started by naming your team workspace. You can invite members after.</p>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Design Team, Product Ops..."
          onKeyDown={e=>{if(e.key==="Enter")handleCreate()}}
          style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"2px solid var(--border)",fontSize:15,textAlign:"center",fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:16}}
          autoFocus />
        <Btn onClick={handleCreate} disabled={!name.trim()||loading} style={{width:"100%",padding:14}}>{loading ? "Creating..." : "Create Team"}</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN TEAM PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function TeamPage() {
  /* Auth */
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  /* Team state */
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [myRole, setMyRole] = useState("member");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board"); /* board | my-tasks | requests | members */
  const [toast, setToast] = useState(null);
  const flash = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };

  /* Modals */
  const [showTaskModal, setShowTaskModal] = useState(null); /* null | {} (new) | task (edit) */
  const [showRequestModal, setShowRequestModal] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const m = window.innerWidth < 768;
    setIsMobile(m);
    if (m) setSidebar(false);
    const fn = () => { const mob = window.innerWidth < 768; setIsMobile(mob); if (mob) setSidebar(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Load teams */
  const loadTeams = useCallback(async () => {
    if (!user) return;
    try {
      const t = await api.getMyTeams();
      setTeams(t);
      if (t.length > 0 && !activeTeam) {
        setActiveTeam(t[0]);
        setMyRole(t[0].myRole);
      }
    } catch (e) {
      console.warn("Load teams error:", e);
    }
  }, [user, activeTeam]);

  useEffect(() => { if (user) loadTeams(); }, [user]);

  /* Load team data when active team changes */
  const loadTeamData = useCallback(async () => {
    if (!activeTeam) { setLoading(false); return; }
    setLoading(true);
    try {
      const [m, t, r] = await Promise.all([
        api.getTeamMembers(activeTeam.id),
        api.getTeamTasks(activeTeam.id),
        myRole !== "viewer" ? api.getTeamRequests(activeTeam.id) : Promise.resolve([])
      ]);
      setMembers(m);
      setTasks(t);
      setRequests(r);
    } catch (e) {
      console.warn("Load team data error:", e);
    } finally {
      setLoading(false);
    }
  }, [activeTeam, myRole]);

  useEffect(() => { if (activeTeam) loadTeamData(); }, [activeTeam]);

  /* Auto-refresh every 30s */
  useEffect(() => {
    if (!activeTeam) return;
    const interval = setInterval(loadTeamData, 30000);
    return () => clearInterval(interval);
  }, [activeTeam, loadTeamData]);

  /* ── Task CRUD ── */
  const handleSaveTask = async (taskData) => {
    try {
      if (showTaskModal?.id) {
        await api.updateTeamTask(showTaskModal.id, taskData);
        flash("Task updated");
      } else {
        await api.createTeamTask(activeTeam.id, taskData, user.id);
        flash("Task created");
      }
      setShowTaskModal(null);
      loadTeamData();
    } catch (e) { alert("Error: " + e.message); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTeamTask(taskId);
      flash("Task deleted");
      setShowTaskModal(null);
      loadTeamData();
    } catch (e) { alert("Error: " + e.message); }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updates = { status: newStatus };
      if (newStatus === "done") updates.completed_at = new Date().toISOString();
      else updates.completed_at = null;
      await api.updateTeamTask(taskId, updates);
      loadTeamData();
    } catch (e) { console.warn(e); }
  };

  /* ── Request handling ── */
  const handleAcceptRequest = async (requestId, overrides) => {
    try {
      await api.acceptRequest(requestId, user.id, activeTeam.id, overrides);
      flash("Request accepted → task created");
      setShowRequestModal(null);
      loadTeamData();
    } catch (e) { alert("Error: " + e.message); }
  };

  const handleDeclineRequest = async (requestId, note) => {
    try {
      await api.declineRequest(requestId, user.id, note);
      flash("Request declined");
      setShowRequestModal(null);
      loadTeamData();
    } catch (e) { alert("Error: " + e.message); }
  };

  /* ── Member handling ── */
  const handleAddMember = async (email, role) => {
    await api.inviteMember(activeTeam.id, email, role, user.id);
    flash("Member added");
    loadTeamData();
  };

  /* ── Auth gate ── */
  if (authLoading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"var(--muted)"}}>Loading...</div>;
  if (!supabase || !user) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",padding:20}}>
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"white",margin:"0 auto 16px"}}>I</div>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Inkwell Team</h2>
          <p style={{fontSize:14,color:"var(--muted)",marginBottom:20}}>Sign in on the <a href="/" style={{color:"var(--accent)"}}>main page</a> first, then come back here to access your team workspace.</p>
          <a href="/" style={{display:"inline-block",padding:"12px 24px",borderRadius:10,background:"var(--accent)",color:"white",fontSize:14,fontWeight:600,textDecoration:"none"}}>Go to Inkwell →</a>
        </div>
      </div>
    );
  }

  /* ── No teams yet ── */
  if (!loading && teams.length === 0 && !activeTeam) {
    return <CreateTeamView user={user} onCreated={(team) => { setActiveTeam({...team, myRole: "admin"}); setMyRole("admin"); setTeams([{...team, myRole:"admin"}]); }} />;
  }

  /* ── Derived data ── */
  const pendingRequests = requests.filter(r => r.status === "pending");
  const myTasks = tasks.filter(t => t.assigned_to === user.id && t.status !== "done");
  const isViewer = myRole === "viewer";
  const requestLink = typeof window !== "undefined" ? `${window.location.origin}/submit/${activeTeam?.id}` : "";
  const viewerLink = typeof window !== "undefined" ? `${window.location.origin}/dashboard/${activeTeam?.id}` : "";

  const memberName = (userId) => {
    const m = members.find(m => m.user_id === userId);
    return m?.display_name || m?.email || "Unknown";
  };

  /* ── Drag & Drop for kanban ── */
  const handleKanbanDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) handleStatusChange(taskId, targetStatus);
  };

  return (
    <div style={{display:"flex",height:"100dvh",overflow:"hidden",background:"var(--bg)",fontFamily:"var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"}}>

      {/* ═══ SIDEBAR ═══ */}
      <nav style={{width:sidebar?256:0,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden",flexShrink:0,...(isMobile?{position:"fixed",zIndex:100,height:"100dvh"}:{})}}>
        <div style={{padding:"20px 16px 12px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"white"}}>I</div>
            <span style={{fontSize:18,fontWeight:700,color:"var(--ink)",whiteSpace:"nowrap"}}>Inkwell Team</span>
          </div>
          {/* Team selector */}
          {teams.length > 1 && (
            <select value={activeTeam?.id || ""} onChange={e=>{const t=teams.find(t=>t.id===e.target.value);if(t){setActiveTeam(t);setMyRole(t.myRole);}}}
              style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid var(--border)",fontSize:13,marginBottom:12,fontFamily:"inherit",cursor:"pointer",background:"white"}}>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          {teams.length <= 1 && activeTeam && (
            <div style={{fontSize:14,fontWeight:600,color:"var(--ink)",marginBottom:12,padding:"0 4px"}}>{activeTeam.name}</div>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"0 8px"}}>
          {[
            {id:"board",label:"Team Board",icon:"▦",count:tasks.filter(t=>t.status!=="done").length},
            {id:"my-tasks",label:"My Tasks",icon:"◉",count:myTasks.length},
            ...(!isViewer ? [{id:"requests",label:"Requests",icon:"↓",count:pendingRequests.length}] : []),
            {id:"members",label:"Members",icon:"♦",count:members.length},
          ].map(item => (
            <button key={item.id} onClick={()=>{setView(item.id);if(isMobile)setSidebar(false);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:view===item.id?"white":"transparent",boxShadow:view===item.id?"0 1px 3px rgba(0,0,0,0.06)":"none",cursor:"pointer",fontSize:14,fontWeight:view===item.id?600:500,color:view===item.id?"var(--ink)":"var(--text)",marginBottom:2,fontFamily:"inherit",textAlign:"left",transition:"all 0.15s"}}>
              <span style={{fontSize:16,width:20,textAlign:"center"}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.count > 0 && <span style={{fontSize:12,fontWeight:600,color:item.id==="requests"&&pendingRequests.length>0?"#d97706":"var(--muted)",background:item.id==="requests"&&pendingRequests.length>0?"#fffbeb":"var(--surface)",padding:"2px 8px",borderRadius:10}}>{item.count}</span>}
            </button>
          ))}
        </div>

        <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",flexShrink:0}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"var(--muted)",textDecoration:"none",padding:"6px 0",fontWeight:500}}>
            ← Personal Tasks
          </a>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>☁️ {user.email}</div>
        </div>
      </nav>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebar && <div onClick={()=>setSidebar(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:99}}/>}

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column"}}>
        {/* Header */}
        <header style={{padding:"16px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"white"}}>
          {isMobile && <button onClick={()=>setSidebar(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:4}}>☰</button>}
          <h1 style={{fontSize:18,fontWeight:700,flex:1}}>
            {view === "board" && "Team Board"}
            {view === "my-tasks" && "My Tasks"}
            {view === "requests" && "Request Queue"}
            {view === "members" && "Members"}
          </h1>
          <div style={{display:"flex",gap:8}}>
            {view === "board" && !isViewer && <Btn onClick={()=>setShowTaskModal({})} style={{padding:"8px 16px"}}>+ New Task</Btn>}
            <button onClick={loadTeamData} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:13,color:"var(--muted)",fontFamily:"inherit"}} title="Refresh">↻</button>
          </div>
        </header>

        {loading && !tasks.length ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1,color:"var(--muted)"}}>Loading...</div>
        ) : (
          <div style={{flex:1,overflowY:"auto",padding:view==="board"?"0":"20px 24px"}}>

            {/* ═══ BOARD VIEW ═══ */}
            {view === "board" && (
              <div style={{display:"flex",gap:0,height:"100%",overflow:"hidden"}}>
                {STATUS_COLS.map(col => {
                  const colTasks = tasks.filter(t => t.status === col.key);
                  return (
                    <div key={col.key}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.background="#fafaf9";}}
                      onDragLeave={e=>{e.currentTarget.style.background="";}}
                      onDrop={e=>{e.currentTarget.style.background="";handleKanbanDrop(e,col.key);}}
                      style={{flex:1,display:"flex",flexDirection:"column",borderRight:"1px solid var(--border)",minWidth:0}}>
                      <div style={{padding:"16px 16px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                        <span style={{color:col.color,fontSize:14}}>{col.icon}</span>
                        <span style={{fontSize:14,fontWeight:700,color:"var(--ink)"}}>{col.label}</span>
                        <span style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{colTasks.length}</span>
                      </div>
                      <div style={{flex:1,overflowY:"auto",padding:"0 12px 16px"}}>
                        {colTasks.map(task => (
                          <TaskCard key={task.id} task={task} members={members} onClick={t=>!isViewer&&setShowTaskModal(t)} onStatusChange={handleStatusChange} />
                        ))}
                        {colTasks.length === 0 && (
                          <div style={{textAlign:"center",padding:"24px 12px",color:"var(--muted)",fontSize:13,fontStyle:"italic"}}>
                            {col.key === "todo" ? "Drag tasks here or click + New Task" : "Drag tasks here"}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ═══ MY TASKS VIEW ═══ */}
            {view === "my-tasks" && (
              myTasks.length === 0 ? (
                <EmptyState icon="🎯" title="All caught up!" desc="No tasks assigned to you right now." />
              ) : (
                <div style={{maxWidth:640}}>
                  {myTasks.map(task => (
                    <div key={task.id} onClick={()=>!isViewer&&setShowTaskModal(task)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"white",borderRadius:10,marginBottom:8,cursor:"pointer",border:"1px solid var(--border)",transition:"box-shadow 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:PRIORITY[task.priority||"none"].color,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:"var(--ink)"}}>{task.title}</div>
                        <div style={{display:"flex",gap:8,marginTop:4}}>
                          <Badge color={STATUS_COLS.find(s=>s.key===task.status)?.color}>{task.status.replace("_"," ")}</Badge>
                          {task.due_date && <span style={{fontSize:12,color:"var(--muted)"}}>{formatDate(task.due_date)}</span>}
                          {task.category !== "General" && <span style={{fontSize:12,color:"var(--muted)"}}>{task.category}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ═══ REQUESTS VIEW ═══ */}
            {view === "requests" && (
              <div style={{maxWidth:720}}>
                {/* Share link */}
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#92400e",flexShrink:0}}>📬 Request Form Link:</span>
                  <code style={{fontSize:12,background:"white",padding:"6px 10px",borderRadius:6,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0,border:"1px solid #fde68a"}}>{requestLink}</code>
                  <button onClick={()=>{navigator.clipboard.writeText(requestLink);flash("Link copied!");}} style={{background:"var(--accent)",color:"white",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>Copy</button>
                </div>

                {/* Pending */}
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                  Pending <span style={{fontSize:12,fontWeight:600,color:"var(--accent)",background:"#fffbeb",padding:"2px 8px",borderRadius:10}}>{pendingRequests.length}</span>
                </h3>
                {pendingRequests.length === 0 ? (
                  <div style={{padding:"20px",textAlign:"center",color:"var(--muted)",fontSize:14,fontStyle:"italic",marginBottom:24}}>No pending requests</div>
                ) : (
                  pendingRequests.map(req => (
                    <div key={req.id} onClick={()=>setShowRequestModal(req)}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"white",borderRadius:10,marginBottom:8,cursor:"pointer",border:"1px solid var(--border)",transition:"box-shadow 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"}
                      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:PRIORITY[req.priority||"medium"].color,flexShrink:0}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:600,color:"var(--ink)"}}>{req.title}</div>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>From {req.requester_name} · {timeAgo(req.created_at)}</div>
                      </div>
                      <Badge color={PRIORITY[req.priority||"medium"].color} bg={PRIORITY[req.priority||"medium"].bg}>{req.priority}</Badge>
                    </div>
                  ))
                )}

                {/* History */}
                {requests.filter(r=>r.status!=="pending").length > 0 && (
                  <>
                    <h3 style={{fontSize:15,fontWeight:700,marginTop:24,marginBottom:12}}>History</h3>
                    {requests.filter(r=>r.status!=="pending").map(req => (
                      <div key={req.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"var(--surface)",borderRadius:10,marginBottom:6,opacity:0.7}}>
                        <span style={{fontSize:14}}>{req.status==="accepted"?"✅":"❌"}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:13,fontWeight:500,color:"var(--ink)"}}>{req.title}</div>
                          <div style={{fontSize:12,color:"var(--muted)"}}>From {req.requester_name} · {req.status} {req.reviewed_at ? timeAgo(req.reviewed_at) : ""}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* ═══ MEMBERS VIEW ═══ */}
            {view === "members" && (
              <div style={{maxWidth:560}}>
                {myRole === "admin" && (
                  <Btn onClick={()=>setShowAddMember(true)} style={{marginBottom:20}}>+ Add Member</Btn>
                )}

                {/* Shareable links */}
                <div style={{background:"var(--surface)",borderRadius:12,padding:"16px 18px",marginBottom:20}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Shareable Links</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <span style={{fontSize:12,color:"var(--muted)",flexShrink:0,minWidth:90}}>Request form:</span>
                    <code style={{fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{requestLink}</code>
                    <button onClick={()=>{navigator.clipboard.writeText(requestLink);flash("Copied!");}} style={{background:"var(--accent)",color:"white",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Copy</button>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:"var(--muted)",flexShrink:0,minWidth:90}}>Viewer board:</span>
                    <code style={{fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{viewerLink}</code>
                    <button onClick={()=>{navigator.clipboard.writeText(viewerLink);flash("Copied!");}} style={{background:"var(--accent)",color:"white",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Copy</button>
                  </div>
                </div>

                {members.map(m => (
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"white",borderRadius:10,marginBottom:8,border:"1px solid var(--border)"}}>
                    <Avatar name={m.display_name || m.email} size={36} />
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:"var(--ink)"}}>{m.display_name || m.email.split("@")[0]}</div>
                      <div style={{fontSize:12,color:"var(--muted)"}}>{m.email}</div>
                    </div>
                    <Badge color={m.role==="admin"?"#d97706":m.role==="viewer"?"#a8a29e":"#3b82f6"} bg={m.role==="admin"?"#fffbeb":m.role==="viewer"?"#f5f5f4":"#eff6ff"}>
                      {m.role}
                    </Badge>
                    {myRole === "admin" && m.user_id !== user.id && (
                      <select value={m.role} onChange={async e=>{
                        try { await api.updateMemberRole(m.id, e.target.value); flash("Role updated"); loadTeamData(); } catch(err) { alert(err.message); }
                      }} style={{fontSize:12,border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit",background:"white"}}>
                        <option value="admin">Admin</option>
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                    {myRole === "admin" && m.user_id !== user.id && (
                      <button onClick={async()=>{if(confirm(`Remove ${m.display_name||m.email} from the team?`)){try{await api.removeMember(m.id);flash("Member removed");loadTeamData();}catch(err){alert(err.message);}}}}
                        style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:16,padding:4}} title="Remove">×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </main>

      {/* ═══ MODALS ═══ */}
      {showTaskModal && <TaskModal task={showTaskModal.id ? showTaskModal : null} members={members} onSave={handleSaveTask} onDelete={handleDeleteTask} onClose={()=>setShowTaskModal(null)} />}
      {showRequestModal && <RequestModal request={showRequestModal} members={members} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} onClose={()=>setShowRequestModal(null)} />}
      {showAddMember && <AddMemberModal onAdd={handleAddMember} onClose={()=>setShowAddMember(false)} />}

      {/* ═══ TOAST ═══ */}
      {toast && <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"var(--ink)",color:"white",padding:"10px 20px",borderRadius:12,fontSize:14,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.2)",zIndex:9999,animation:"slideUp 0.2s ease",whiteSpace:"nowrap"}}>{toast}</div>}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      `}</style>
    </div>
  );
}
