"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
const PRIO_ORDER = {high:0,medium:1,low:2,none:3};
const STATUS_META = {
  todo:        { icon: "○", label: "To Do", color: "#a8a29e", bg: "#f5f5f4" },
  in_progress: { icon: "◐", label: "In Progress", color: "#3b82f6", bg: "#eff6ff" },
  done:        { icon: "●", label: "Done", color: "#22c55e", bg: "#f0fdf4" },
};
const STATUS_KEYS = ["todo","in_progress","done"];
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tmrw = new Date(today); tmrw.setDate(tmrw.getDate()+1);
  if (date.getTime()===today.getTime()) return "Today";
  if (date.getTime()===tmrw.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-IE",{month:"short",day:"numeric"});
};
const isOverdue = (d) => d && new Date(d+"T23:59:59") < new Date();
const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff/60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins+"m ago";
  const hrs = Math.floor(mins/60);
  if (hrs < 24) return hrs+"h ago";
  const days = Math.floor(hrs/24);
  return days < 7 ? days+"d ago" : new Date(d).toLocaleDateString("en-IE",{month:"short",day:"numeric"});
};
const countSubs = (subs) => { if(!subs?.length) return {total:0,done:0}; let t=0,d=0; for(const s of subs){t++;if(s.completed)d++;if(s.subtasks){const c=countSubs(s.subtasks);t+=c.total;d+=c.done;}} return{total:t,done:d}; };

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════════════ */
const Checkbox = ({checked, onChange, priority="none", size=18}) => (
  <div onClick={e=>{e.stopPropagation();onChange(!checked);}} style={{width:size,height:size,borderRadius:size>16?6:5,
    border:`2px solid ${checked?PRIORITY[priority].color:(priority!=="none"?PRIORITY[priority].color:"#cbd5e1")}`,
    background:checked?PRIORITY[priority].color:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
    transition:"all 0.2s",flexShrink:0}}>
    {checked&&<svg width={size-6} height={size-6} viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="2.5 6 5 8.5 9.5 3.5"/></svg>}
  </div>
);
const Overlay = ({onClose,children,wide}) => (
  <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn 0.15s ease"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:16,width:wide?"90%":"100%",maxWidth:wide?720:520,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 48px rgba(0,0,0,0.2)",animation:"slideUp 0.2s ease"}}>{children}</div>
  </div>
);
const Btn = ({children,variant="primary",disabled,small,...p}) => (
  <button {...p} disabled={disabled} style={{padding:small?"6px 14px":"10px 20px",borderRadius:small?8:10,border:variant==="primary"?"none":"1px solid #e7e5e4",background:variant==="primary"?"#d97706":variant==="danger"?"#ef4444":"white",color:variant==="primary"||variant==="danger"?"white":"#44403c",fontSize:small?12:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,fontFamily:"inherit",transition:"all 0.15s",...(p.style||{})}}>{children}</button>
);
const Badge = ({children,color="#78716c",bg="#f5f5f4"}) => (
  <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6,color,background:bg,whiteSpace:"nowrap",lineHeight:"18px"}}>{children}</span>
);
const Avatar = ({name,size=28}) => {
  const initial = (name||"?")[0].toUpperCase();
  const colors = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];
  const idx = name ? name.charCodeAt(0) % colors.length : 0;
  return <div style={{width:size,height:size,borderRadius:"50%",background:colors[idx],color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.42,fontWeight:700,flexShrink:0}} title={name}>{initial}</div>;
};
const EmptyState = ({icon,title,desc,action}) => (
  <div style={{textAlign:"center",padding:"48px 20px",color:"#78716c"}}>
    <div style={{fontSize:40,marginBottom:12,opacity:0.8}}>{icon}</div>
    <div style={{fontSize:16,fontWeight:600,color:"#1c1917",marginBottom:6}}>{title}</div>
    <div style={{fontSize:14,marginBottom:action?16:0,maxWidth:320,margin:"0 auto",lineHeight:1.6}}>{desc}</div>
    {action && <div style={{marginTop:16}}>{action}</div>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   TASK DETAIL PANEL (rich editor like personal app)
   ═══════════════════════════════════════════════════════════════════ */
function TaskDetail({ task, members, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "none");
  const [assignedTo, setAssignedTo] = useState(task?.assigned_to || "");
  const [category, setCategory] = useState(task?.category || "General");
  const [dueDate, setDueDate] = useState(task?.due_date || "");
  const isNew = !task?.id;

  useEffect(() => {
    if (task) { setTitle(task.title||""); setDescription(task.description||""); setStatus(task.status||"todo"); setPriority(task.priority||"none"); setAssignedTo(task.assigned_to||""); setCategory(task.category||"General"); setDueDate(task.due_date||""); }
  }, [task]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title:title.trim(), description, status, priority, assigned_to:assignedTo||null, category:category.trim()||"General", due_date:dueDate||null,
      ...(status==="done"&&!task?.completed_at?{completed_at:new Date().toISOString()}:{}),
      ...(status!=="done"?{completed_at:null}:{})
    });
  };

  const F = ({label,children}) => (<div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:"#78716c",marginBottom:6,display:"block",textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</label>{children}</div>);
  const inp = {width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #e7e5e4",fontSize:14,color:"#1c1917",background:"white",fontFamily:"inherit",boxSizing:"border-box",outline:"none"};

  return (
    <Overlay onClose={onClose} wide>
      <div style={{padding:"24px 28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontSize:18,fontWeight:700,color:"#1c1917"}}>{isNew?"New Task":"Edit Task"}</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#a8a29e",padding:4,lineHeight:1}}>×</button>
        </div>
        <F label="Title"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What needs to be done?" style={{...inp,fontSize:16,fontWeight:500}} autoFocus onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey)handleSave()}} /></F>
        <F label="Description"><textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add details, context, links..." rows={3} style={{...inp,resize:"vertical",minHeight:60,lineHeight:1.6}} /></F>

        <F label="Status">
          <div style={{display:"flex",gap:8}}>
            {STATUS_KEYS.map(k => { const s=STATUS_META[k]; return (
              <button key={k} onClick={()=>setStatus(k)} style={{flex:1,padding:"10px 8px",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.15s",border:status===k?`2px solid ${s.color}`:"1px solid #e7e5e4",background:status===k?s.bg:"white",color:status===k?s.color:"#78716c",fontFamily:"inherit"}}>{s.icon} {s.label}</button>
            );})}
          </div>
        </F>
        <F label="Priority">
          <div style={{display:"flex",gap:8}}>
            {Object.entries(PRIORITY).map(([k,{color,label,bg}]) => (
              <button key={k} onClick={()=>setPriority(k)} style={{flex:1,padding:"10px 4px",borderRadius:10,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",border:priority===k?`2px solid ${color}`:"1px solid #e7e5e4",background:priority===k?bg:"white",color:priority===k?color:"#78716c",fontFamily:"inherit"}}>{label}</button>
            ))}
          </div>
        </F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <F label="Assigned To"><select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Unassigned</option>{members.filter(m=>m.role!=="viewer").map(m=><option key={m.user_id} value={m.user_id}>{m.display_name||m.email}</option>)}</select></F>
          <F label="Due Date"><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={inp} /></F>
        </div>
        <F label="Category"><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g. Design, Engineering..." style={inp} /></F>
        {task?.created_at&&!isNew&&<div style={{fontSize:12,color:"#a8a29e",marginBottom:16}}>Created {new Date(task.created_at).toLocaleDateString("en-IE",{month:"short",day:"numeric",year:"numeric"})}{task.completed_at&&<> · Completed {new Date(task.completed_at).toLocaleDateString("en-IE",{month:"short",day:"numeric"})}</>}</div>}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #f5f5f4"}}>
          <div>{!isNew&&<Btn variant="danger" onClick={()=>{if(confirm("Delete this task permanently?"))onDelete(task.id)}}>Delete</Btn>}</div>
          <div style={{display:"flex",gap:8}}><Btn variant="secondary" onClick={onClose}>Cancel</Btn><Btn onClick={handleSave} disabled={!title.trim()}>{isNew?"Create Task":"Save Changes"}</Btn></div>
        </div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REQUEST REVIEW MODAL
   ═══════════════════════════════════════════════════════════════════ */
function RequestModal({ request, members, onAccept, onDecline, onClose }) {
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState(request?.priority || "medium");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("General");
  const inp = {width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #e7e5e4",fontSize:14,color:"#1c1917",background:"white",fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
  return (
    <Overlay onClose={onClose}>
      <div style={{padding:"24px 24px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h3 style={{fontSize:18,fontWeight:700}}>Review Request</h3>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"#a8a29e",padding:4}}>×</button>
        </div>
        <div style={{fontSize:12,color:"#a8a29e",marginBottom:16}}>From {request.requester_name}{request.requester_email?` (${request.requester_email})`:""} · {timeAgo(request.created_at)}</div>
        <div style={{background:"#fafaf9",borderRadius:12,padding:16,marginBottom:20,borderLeft:"3px solid #d97706"}}>
          <div style={{fontSize:15,fontWeight:600,marginBottom:4,color:"#1c1917"}}>{request.title}</div>
          {request.description&&<div style={{fontSize:14,color:"#78716c",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{request.description}</div>}
          <div style={{marginTop:8}}><Badge color={PRIORITY[request.priority]?.color} bg={PRIORITY[request.priority]?.bg}>{request.priority} priority</Badge></div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:"#1c1917",marginBottom:12}}>Accept as task:</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:4}}>Assign To</label><select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} style={{...inp,cursor:"pointer"}}><option value="">Unassigned</option>{members.filter(m=>m.role!=="viewer").map(m=><option key={m.user_id} value={m.user_id}>{m.display_name||m.email}</option>)}</select></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:4}}>Priority</label><select value={priority} onChange={e=>setPriority(e.target.value)} style={{...inp,cursor:"pointer"}}>{Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:4}}>Due Date</label><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} style={inp} /></div>
          <div><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:4}}>Category</label><input value={category} onChange={e=>setCategory(e.target.value)} style={inp} placeholder="General" /></div>
        </div>
        <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:4}}>Response Note</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="Optional note..." style={inp} /></div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn variant="danger" onClick={()=>onDecline(request.id,note)} style={{background:"#fef2f2",color:"#ef4444",border:"1px solid #fecaca"}}>Decline</Btn>
          <Btn onClick={()=>onAccept(request.id,{assigned_to:assignedTo||null,priority,due_date:dueDate||null,category:category||"General",response_note:note})}>Accept → Create Task</Btn>
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
    if (!email.trim()) return; setLoading(true); setError("");
    try { await onAdd(email.trim().toLowerCase(), role); onClose(); }
    catch (e) { setError(e.message); } finally { setLoading(false); }
  };
  const inp = {width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #e7e5e4",fontSize:14,color:"#1c1917",background:"white",fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
  return (
    <Overlay onClose={onClose}>
      <div style={{padding:"24px"}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Add Team Member</h3>
        <div style={{marginBottom:12}}><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:6}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="colleague@company.com" style={inp} autoFocus onKeyDown={e=>{if(e.key==="Enter")handleAdd()}} /></div>
        <div style={{marginBottom:16}}><label style={{fontSize:12,fontWeight:600,color:"#78716c",display:"block",marginBottom:6}}>Role</label><select value={role} onChange={e=>setRole(e.target.value)} style={{...inp,cursor:"pointer"}}><option value="member">Member — create & edit tasks</option><option value="viewer">Viewer — read-only</option><option value="admin">Admin — manage members</option></select></div>
        <div style={{fontSize:13,color:"#78716c",marginBottom:16,lineHeight:1.5,background:"#fafaf9",padding:"10px 14px",borderRadius:10}}>They must have an Inkwell account first. Ask them to sign up at the main page.</div>
        {error&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#dc2626",marginBottom:12}}>{error}</div>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}><Btn variant="secondary" onClick={onClose}>Cancel</Btn><Btn onClick={handleAdd} disabled={!email.trim()||loading}>{loading?"Adding...":"Add Member"}</Btn></div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   KANBAN CARD (matches personal app's KanbanCard richness)
   ═══════════════════════════════════════════════════════════════════ */
function KanbanCard({ task, members, onClick, onToggle, isViewer }) {
  const assigned = members.find(m => m.user_id === task.assigned_to);
  const pc = PRIORITY[task.priority || "none"];
  const subs = task.subtasks || [];
  const hasSubs = subs.length > 0;
  const {total, done} = hasSubs ? countSubs(subs) : {total:0,done:0};
  const overdue = isOverdue(task.due_date) && task.status !== "done";
  const isDone = task.status === "done";

  return (
    <div draggable={!isViewer}
      onDragStart={e=>{e.dataTransfer.setData("text/plain",task.id);e.dataTransfer.effectAllowed="move";}}
      onClick={()=>onClick(task)}
      style={{background:"white",borderRadius:12,borderLeft:`3px solid ${pc.color}`,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",transition:"box-shadow 0.15s,transform 0.15s",marginBottom:8,cursor:"pointer",overflow:"hidden",opacity:isDone?0.55:1}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.05)";e.currentTarget.style.transform="none";}}>
      <div style={{padding:"11px 13px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
          {!isViewer&&<div style={{paddingTop:1}}><Checkbox checked={isDone} priority={task.priority||"none"} size={16} onChange={()=>onToggle(task)}/></div>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:isDone?400:600,color:isDone?"#a8a29e":"#1c1917",lineHeight:1.4,wordWrap:"break-word",textDecoration:isDone?"line-through":"none"}}>{task.title}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginTop:5}}>
              {task.priority!=="none"&&<span style={{fontSize:10,fontWeight:700,color:pc.color}}>⚑ {pc.label}</span>}
              {task.category&&task.category!=="General"&&<span style={{fontSize:10,color:"#78716c",background:"#f5f5f4",padding:"1px 6px",borderRadius:4}}>{task.category}</span>}
              {task.description&&<span style={{color:"#cbd5e1",fontSize:11}}>📝</span>}
              {hasSubs&&<span style={{fontSize:10,color:done===total?"#22c55e":"#78716c",fontWeight:500}}>☐ {done}/{total}</span>}
              {task.due_date&&<span style={{fontSize:10,color:overdue?"#ef4444":"#a8a29e",fontWeight:overdue?600:400}}>{formatDate(task.due_date)}</span>}
            </div>
          </div>
          {assigned&&<Avatar name={assigned.display_name||assigned.email} size={22}/>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LIST ROW (matches personal app's TaskRow)
   ═══════════════════════════════════════════════════════════════════ */
function ListRow({ task, members, onClick, onToggle, isViewer }) {
  const assigned = members.find(m => m.user_id === task.assigned_to);
  const pc = PRIORITY[task.priority || "none"];
  const sc = STATUS_META[task.status || "todo"];
  const subs = task.subtasks || [];
  const {total, done} = subs.length > 0 ? countSubs(subs) : {total:0,done:0};
  const overdue = isOverdue(task.due_date) && task.status !== "done";
  const isDone = task.status === "done";

  return (
    <div onClick={()=>onClick(task)} draggable={!isViewer}
      onDragStart={e=>{e.dataTransfer.setData("text/plain",task.id);e.dataTransfer.effectAllowed="move";}}
      style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,cursor:"pointer",transition:"background 0.1s",
        opacity:isDone?0.5:1,marginBottom:2}}
      onMouseEnter={e=>e.currentTarget.style.background="#f5f5f4"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      {!isViewer&&<Checkbox checked={isDone} priority={task.priority||"none"} onChange={()=>onToggle(task)}/>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:isDone?400:500,color:isDone?"#a8a29e":"#1c1917",textDecoration:isDone?"line-through":"none",lineHeight:1.4}}>{task.title}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginTop:3}}>
          <span style={{fontSize:11,color:sc.color,fontWeight:600}}>{sc.icon} {sc.label}</span>
          {task.priority!=="none"&&<span style={{fontSize:11,fontWeight:600,color:pc.color}}>⚑ {pc.label}</span>}
          {task.due_date&&<span style={{fontSize:11,color:overdue?"#ef4444":"#a8a29e"}}>{formatDate(task.due_date)}</span>}
          {task.category&&task.category!=="General"&&<Badge>{task.category}</Badge>}
          {total>0&&<span style={{fontSize:11,color:done===total?"#22c55e":"#a8a29e"}}>☐ {done}/{total}</span>}
          {task.description&&<span style={{color:"#d6d3d1",fontSize:11}}>📝</span>}
        </div>
      </div>
      {assigned&&<Avatar name={assigned.display_name||assigned.email} size={26}/>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   INLINE QUICK-ADD (matches personal app's inline creation)
   ═══════════════════════════════════════════════════════════════════ */
function QuickAdd({ onAdd, placeholder="+ Add task...", defaults={} }) {
  const [title, setTitle] = useState("");
  const ref = useRef(null);
  const handleAdd = () => { if(!title.trim()) return; onAdd({title:title.trim(),...defaults}); setTitle(""); ref.current?.focus(); };
  return (
    <div style={{display:"flex",gap:6,alignItems:"center",padding:"6px 0"}}>
      <input ref={ref} value={title} onChange={e=>setTitle(e.target.value)} placeholder={placeholder}
        onKeyDown={e=>{if(e.key==="Enter")handleAdd();}}
        style={{flex:1,padding:"9px 12px",borderRadius:10,border:"1px dashed #d6d3d1",fontSize:13,color:"#1c1917",background:"transparent",fontFamily:"inherit",outline:"none",transition:"border-color 0.15s"}}
        onFocus={e=>e.currentTarget.style.borderColor="#d97706"} onBlur={e=>e.currentTarget.style.borderColor="#d6d3d1"} />
      {title.trim()&&<button onClick={handleAdd} style={{padding:"8px 14px",borderRadius:8,background:"#d97706",color:"white",border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Add</button>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TEAM CREATION
   ═══════════════════════════════════════════════════════════════════ */
function CreateTeamView({ user, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCreate = async () => {
    if (!name.trim()) return; setLoading(true);
    try { const team = await api.createTeam(name.trim(), user.id, user.email); onCreated(team); }
    catch (e) { alert("Error creating team: " + e.message); } finally { setLoading(false); }
  };
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:20,background:"#fafaf9"}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"white",margin:"0 auto 20px"}}>I</div>
        <h2 style={{fontSize:24,fontWeight:800,marginBottom:6,color:"#1c1917"}}>Create Your Team</h2>
        <p style={{fontSize:15,color:"#78716c",marginBottom:28,lineHeight:1.6}}>Set up a shared workspace where your team can collaborate on tasks together.</p>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. CS Ops, Design Team..."
          onKeyDown={e=>{if(e.key==="Enter")handleCreate();}}
          style={{width:"100%",padding:"14px 18px",borderRadius:12,border:"2px solid #e7e5e4",fontSize:16,textAlign:"center",fontFamily:"inherit",outline:"none",boxSizing:"border-box",marginBottom:16,transition:"border-color 0.15s"}}
          onFocus={e=>e.currentTarget.style.borderColor="#d97706"} onBlur={e=>e.currentTarget.style.borderColor="#e7e5e4"} autoFocus />
        <Btn onClick={handleCreate} disabled={!name.trim()||loading} style={{width:"100%",padding:14,fontSize:15}}>{loading?"Creating...":"Create Team →"}</Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN TEAM PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function TeamPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({data:{session}}) => { setUser(session?.user??null); setAuthLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_ev,session) => setUser(session?.user??null));
    return () => subscription.unsubscribe();
  }, []);

  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [myRole, setMyRole] = useState("member");
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board");
  const [toast, setToast] = useState(null);
  const flash = (msg) => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const [showTaskDetail, setShowTaskDetail] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [boardMode, setBoardMode] = useState("kanban");
  const [groupBy, setGroupBy] = useState("status");

  useEffect(() => { const m=window.innerWidth<768; setIsMobile(m); if(m)setSidebar(false);
    const fn=()=>{const mob=window.innerWidth<768;setIsMobile(mob);if(mob)setSidebar(false);};
    window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn);
  }, []);

  const loadTeams = useCallback(async () => {
    if (!user) return;
    try { const t = await api.getMyTeams(); setTeams(t);
      if (t.length>0&&!activeTeam) { setActiveTeam(t[0]); setMyRole(t[0].myRole); }
    } catch (e) { console.warn("Load teams:",e); }
  }, [user, activeTeam]);
  useEffect(() => { if(user) loadTeams(); }, [user]);

  const loadTeamData = useCallback(async () => {
    if (!activeTeam) { setLoading(false); return; } setLoading(true);
    try {
      const [m,t,r] = await Promise.all([api.getTeamMembers(activeTeam.id), api.getTeamTasks(activeTeam.id), myRole!=="viewer"?api.getTeamRequests(activeTeam.id):Promise.resolve([])]);
      setMembers(m); setTasks(t); setRequests(r);
    } catch (e) { console.warn("Load data:",e); } finally { setLoading(false); }
  }, [activeTeam, myRole]);
  useEffect(() => { if(activeTeam) loadTeamData(); }, [activeTeam]);
  useEffect(() => { if(!activeTeam) return; const i=setInterval(loadTeamData,30000); return()=>clearInterval(i); }, [activeTeam,loadTeamData]);

  /* Task CRUD */
  const handleSaveTask = async (data) => {
    try {
      if (showTaskDetail?.id) { await api.updateTeamTask(showTaskDetail.id,data); flash("Task updated ✓"); }
      else { await api.createTeamTask(activeTeam.id,data,user.id); flash("Task created ✓"); }
      setShowTaskDetail(null); loadTeamData();
    } catch (e) { alert("Error: "+e.message); }
  };
  const handleDeleteTask = async (id) => { try { await api.deleteTeamTask(id); flash("Deleted"); setShowTaskDetail(null); loadTeamData(); } catch(e) { alert(e.message); } };
  const handleToggleTask = async (task) => {
    const ns = task.status==="done"?"todo":"done";
    try { await api.updateTeamTask(task.id,{status:ns,completed_at:ns==="done"?new Date().toISOString():null}); loadTeamData(); } catch(e) { console.warn(e); }
  };
  const handleQuickAdd = async (data) => {
    try { await api.createTeamTask(activeTeam.id,{...data,status:data.status||"todo",priority:data.priority||"none",category:data.category||"General"},user.id); loadTeamData(); flash("Added ✓"); }
    catch (e) { alert(e.message); }
  };
  const handleStatusChange = async (taskId,newStatus) => {
    try { await api.updateTeamTask(taskId,{status:newStatus,completed_at:newStatus==="done"?new Date().toISOString():null}); loadTeamData(); } catch(e) { console.warn(e); }
  };

  /* Requests */
  const handleAcceptRequest = async (reqId,overrides) => { try { await api.acceptRequest(reqId,user.id,activeTeam.id,overrides); flash("Request → task ✓"); setShowRequestModal(null); loadTeamData(); } catch(e) { alert(e.message); } };
  const handleDeclineRequest = async (reqId,note) => { try { await api.declineRequest(reqId,user.id,note); flash("Declined"); setShowRequestModal(null); loadTeamData(); } catch(e) { alert(e.message); } };
  const handleAddMember = async (email,role) => { await api.inviteMember(activeTeam.id,email,role,user.id); flash("Added ✓"); loadTeamData(); };

  /* Derived */
  const isViewer = myRole==="viewer";
  const pendingRequests = requests.filter(r=>r.status==="pending");

  const filteredTasks = useMemo(() => {
    let f = [...tasks];
    if (search) { const s=search.toLowerCase(); f=f.filter(t=>t.title.toLowerCase().includes(s)||(t.description||"").toLowerCase().includes(s)||(t.category||"").toLowerCase().includes(s)); }
    if (filterPriority!=="all") f=f.filter(t=>t.priority===filterPriority);
    if (sortBy==="priority") f.sort((a,b)=>(PRIO_ORDER[a.priority||"none"]||3)-(PRIO_ORDER[b.priority||"none"]||3));
    else if (sortBy==="alpha") f.sort((a,b)=>(a.title||"").localeCompare(b.title||""));
    else if (sortBy==="date") f.sort((a,b)=>(a.due_date||"9999").localeCompare(b.due_date||"9999"));
    else if (sortBy==="created") f.sort((a,b)=>(b.created_at||"").localeCompare(a.created_at||""));
    return f;
  }, [tasks, search, filterPriority, sortBy]);

  const myTasks = filteredTasks.filter(t=>t.assigned_to===user?.id&&t.status!=="done");
  const memberName = (uid) => { const m=members.find(m=>m.user_id===uid); return m?.display_name||m?.email?.split("@")[0]||"Unassigned"; };
  const requestLink = typeof window!=="undefined"?`${window.location.origin}/submit/${activeTeam?.id}`:"";
  const viewerLink = typeof window!=="undefined"?`${window.location.origin}/dashboard/${activeTeam?.id}`:"";

  /* Group tasks for kanban columns */
  const grouped = useMemo(() => {
    const g = {};
    const src = filteredTasks;
    if (groupBy==="status") { STATUS_KEYS.forEach(k=>g[k]=src.filter(t=>t.status===k)); }
    else if (groupBy==="assignee") {
      const ids=[...new Set(src.map(t=>t.assigned_to||"__none"))];
      if (!ids.includes("__none")) ids.push("__none");
      ids.forEach(a=>g[a]=src.filter(t=>(t.assigned_to||"__none")===a));
    }
    else if (groupBy==="priority") { ["high","medium","low","none"].forEach(k=>g[k]=src.filter(t=>(t.priority||"none")===k)); }
    else if (groupBy==="category") { const cats=[...new Set(src.map(t=>t.category||"General"))].sort(); cats.forEach(c=>g[c]=src.filter(t=>(t.category||"General")===c)); }
    return g;
  }, [filteredTasks, groupBy]);

  const groupMeta = (key) => {
    if (groupBy==="status") return {label:STATUS_META[key]?.label||key, color:STATUS_META[key]?.color||"#a8a29e", icon:STATUS_META[key]?.icon||"○"};
    if (groupBy==="assignee") return {label:key==="__none"?"Unassigned":memberName(key), color:"#3b82f6", icon:"◉"};
    if (groupBy==="priority") return {label:PRIORITY[key]?.label||key, color:PRIORITY[key]?.color||"#a8a29e", icon:"⚑"};
    return {label:key, color:"#78716c", icon:"▪"};
  };

  /* ── Auth gate ── */
  if (authLoading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#78716c",fontFamily:"-apple-system,sans-serif"}}>Loading...</div>;
  if (!supabase||!user) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",padding:20,background:"#fafaf9",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{textAlign:"center",maxWidth:400}}>
        <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"white",margin:"0 auto 16px"}}>I</div>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>Inkwell Team</h2>
        <p style={{fontSize:14,color:"#78716c",marginBottom:20}}>Sign in on the <a href="/" style={{color:"#d97706"}}>main page</a> first, then come back.</p>
        <a href="/" style={{display:"inline-block",padding:"12px 24px",borderRadius:10,background:"#d97706",color:"white",fontSize:14,fontWeight:600,textDecoration:"none"}}>Go to Inkwell →</a>
      </div>
    </div>
  );
  if (!loading&&teams.length===0&&!activeTeam) return <CreateTeamView user={user} onCreated={t=>{setActiveTeam({...t,myRole:"admin"});setMyRole("admin");setTeams([{...t,myRole:"admin"}]);}} />;

  return (
    <div style={{display:"flex",height:"100dvh",overflow:"hidden",background:"#fafaf9",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",color:"#1c1917"}}>

      {/* ═══ SIDEBAR ═══ */}
      <nav style={{width:sidebar?260:0,background:"#f5f5f4",borderRight:"1px solid #e7e5e4",display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden",flexShrink:0,...(isMobile?{position:"fixed",zIndex:100,height:"100dvh"}:{})}}>
        <div style={{padding:"20px 16px 8px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:"white"}}>I</div>
            <span style={{fontSize:18,fontWeight:700,whiteSpace:"nowrap"}}>Inkwell Team</span>
          </div>
          {teams.length>1?(
            <select value={activeTeam?.id||""} onChange={e=>{const t=teams.find(t=>t.id===e.target.value);if(t){setActiveTeam(t);setMyRole(t.myRole);}}} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:13,marginBottom:8,fontFamily:"inherit",cursor:"pointer",background:"white"}}>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
          ):activeTeam&&<div style={{fontSize:14,fontWeight:600,marginBottom:8,padding:"0 4px"}}>{activeTeam.name}</div>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"0 8px"}}>
          {[
            {id:"board",icon:"▦",label:"Team Board",count:filteredTasks.filter(t=>t.status!=="done").length},
            {id:"my-tasks",icon:"◉",label:"My Tasks",count:myTasks.length},
            ...(!isViewer?[{id:"requests",icon:"↓",label:"Requests",count:pendingRequests.length,accent:pendingRequests.length>0}]:[]),
            {id:"members",icon:"♦",label:"Members",count:members.length},
          ].map(n=>(
            <button key={n.id} onClick={()=>{setView(n.id);if(isMobile)setSidebar(false);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:view===n.id?"white":"transparent",boxShadow:view===n.id?"0 1px 3px rgba(0,0,0,0.06)":"none",cursor:"pointer",fontSize:14,fontWeight:view===n.id?600:500,color:view===n.id?"#1c1917":"#44403c",marginBottom:2,fontFamily:"inherit",textAlign:"left",transition:"all 0.15s"}}>
              <span style={{fontSize:15,width:20,textAlign:"center",flexShrink:0}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {n.count>0&&<span style={{fontSize:12,fontWeight:600,color:n.accent?"#d97706":"#a8a29e",background:n.accent?"#fffbeb":"#f5f5f4",padding:"2px 8px",borderRadius:10,minWidth:18,textAlign:"center"}}>{n.count}</span>}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid #e7e5e4",flexShrink:0}}>
          <a href="/" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:"#78716c",textDecoration:"none",padding:"6px 0",fontWeight:500,transition:"color 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.color="#d97706"} onMouseLeave={e=>e.currentTarget.style.color="#78716c"}>← Personal Tasks</a>
          <div style={{fontSize:11,color:"#a8a29e",marginTop:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>☁️ {user.email}</div>
        </div>
      </nav>
      {isMobile&&sidebar&&<div onClick={()=>setSidebar(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:99}}/>}

      {/* ═══ MAIN ═══ */}
      <main style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Toolbar */}
        <header style={{padding:"12px 20px",borderBottom:"1px solid #e7e5e4",display:"flex",alignItems:"center",gap:10,flexShrink:0,background:"white",flexWrap:"wrap"}}>
          {isMobile&&<button onClick={()=>setSidebar(true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,padding:4,color:"#78716c"}}>☰</button>}
          <h1 style={{fontSize:17,fontWeight:700,marginRight:8,whiteSpace:"nowrap"}}>{view==="board"?"Team Board":view==="my-tasks"?"My Tasks":view==="requests"?"Requests":"Members"}</h1>

          {(view==="board"||view==="my-tasks")&&<>
            {showSearch?(
              <div style={{display:"flex",alignItems:"center",gap:6,flex:1,maxWidth:300}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..." autoFocus
                  style={{flex:1,padding:"7px 12px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:13,fontFamily:"inherit",outline:"none"}}
                  onKeyDown={e=>{if(e.key==="Escape"){setSearch("");setShowSearch(false);}}} />
                <button onClick={()=>{setSearch("");setShowSearch(false);}} style={{background:"none",border:"none",cursor:"pointer",color:"#a8a29e",fontSize:16,padding:4}}>×</button>
              </div>
            ):<button onClick={()=>setShowSearch(true)} title="Search" style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:6,color:"#a8a29e"}}>🔍</button>}

            {/* Sort/filter dropdown */}
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowSortMenu(!showSortMenu)} title="Sort & Filter"
                style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:6,color:(sortBy!=="default"||filterPriority!=="all")?"#d97706":"#a8a29e"}}>⇅</button>
              {showSortMenu&&<>
                <div style={{position:"fixed",inset:0,zIndex:998}} onClick={()=>setShowSortMenu(false)}/>
                <div style={{position:"absolute",right:0,top:"100%",marginTop:4,background:"white",borderRadius:12,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",border:"1px solid #e7e5e4",padding:8,zIndex:999,minWidth:200}}>
                  <div style={{padding:"6px 10px",fontSize:11,fontWeight:700,color:"#a8a29e",textTransform:"uppercase",letterSpacing:"0.5px"}}>Sort by</div>
                  {[["default","Default"],["priority","Priority"],["alpha","Alphabetical"],["date","Due Date"],["created","Newest First"]].map(([k,l])=>(
                    <button key={k} onClick={()=>setSortBy(k)} style={{width:"100%",padding:"8px 10px",border:"none",background:sortBy===k?"#fffbeb":"none",cursor:"pointer",fontSize:13,color:sortBy===k?"#d97706":"#44403c",textAlign:"left",borderRadius:6,fontFamily:"inherit",fontWeight:sortBy===k?600:400}}>{l}</button>
                  ))}
                  <div style={{borderTop:"1px solid #f5f5f4",margin:"6px 0"}}/>
                  <div style={{padding:"6px 10px",fontSize:11,fontWeight:700,color:"#a8a29e",textTransform:"uppercase",letterSpacing:"0.5px"}}>Filter priority</div>
                  {[["all","All"],["high","High"],["medium","Medium"],["low","Low"]].map(([k,l])=>(
                    <button key={k} onClick={()=>setFilterPriority(k)} style={{width:"100%",padding:"8px 10px",border:"none",background:filterPriority===k?"#fffbeb":"none",cursor:"pointer",fontSize:13,color:filterPriority===k?"#d97706":"#44403c",textAlign:"left",borderRadius:6,fontFamily:"inherit",fontWeight:filterPriority===k?600:400}}>{l}</button>
                  ))}
                  {(sortBy!=="default"||filterPriority!=="all")&&<>
                    <div style={{borderTop:"1px solid #f5f5f4",margin:"6px 0"}}/>
                    <button onClick={()=>{setSortBy("default");setFilterPriority("all");}} style={{width:"100%",padding:"8px 10px",border:"none",cursor:"pointer",fontSize:12,color:"#ef4444",textAlign:"center",borderRadius:6,fontFamily:"inherit",background:"#fef2f2",fontWeight:600}}>Clear filters</button>
                  </>}
                </div>
              </>}
            </div>
          </>}

          <div style={{flex:1}}/>

          {view==="board"&&<>
            <div style={{display:"flex",border:"1px solid #e7e5e4",borderRadius:8,overflow:"hidden"}}>
              {[["kanban","▦","Board"],["list","≡","List"]].map(([k,ico,tip])=>(
                <button key={k} onClick={()=>setBoardMode(k)} title={tip} style={{padding:"6px 12px",border:"none",background:boardMode===k?"#1c1917":"white",color:boardMode===k?"white":"#78716c",cursor:"pointer",fontSize:14,fontFamily:"inherit",transition:"all 0.15s"}}>{ico}</button>
              ))}
            </div>
            {boardMode==="kanban"&&(
              <select value={groupBy} onChange={e=>setGroupBy(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,cursor:"pointer",fontFamily:"inherit",background:"white",color:"#44403c"}}>
                <option value="status">By Status</option>
                <option value="assignee">By Assignee</option>
                <option value="priority">By Priority</option>
                <option value="category">By Category</option>
              </select>
            )}
            {!isViewer&&<Btn onClick={()=>setShowTaskDetail({})} small>+ New Task</Btn>}
          </>}
          <button onClick={loadTeamData} title="Refresh" style={{background:"none",border:"1px solid #e7e5e4",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:13,color:"#a8a29e",fontFamily:"inherit"}}>↻</button>
        </header>

        {/* Content */}
        {loading&&!tasks.length?(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1,color:"#a8a29e"}}>Loading...</div>
        ):(
          <div style={{flex:1,overflow:boardMode==="kanban"&&view==="board"?"hidden":"auto",display:"flex",flexDirection:"column"}}>

            {/* KANBAN */}
            {view==="board"&&boardMode==="kanban"&&(
              <div style={{display:"flex",gap:0,flex:1,overflow:"hidden"}}>
                {Object.entries(grouped).map(([key,colTasks])=>{
                  const meta=groupMeta(key);
                  return (
                    <div key={key}
                      onDragOver={e=>{e.preventDefault();e.currentTarget.style.background="rgba(217,119,6,0.03)";}}
                      onDragLeave={e=>{e.currentTarget.style.background="";}}
                      onDrop={e=>{e.currentTarget.style.background=""; const tid=e.dataTransfer.getData("text/plain"); if(!tid) return;
                        if(groupBy==="status") handleStatusChange(tid,key);
                        else if(groupBy==="assignee") api.updateTeamTask(tid,{assigned_to:key==="__none"?null:key}).then(loadTeamData);
                        else if(groupBy==="priority") api.updateTeamTask(tid,{priority:key}).then(loadTeamData);
                        else if(groupBy==="category") api.updateTeamTask(tid,{category:key}).then(loadTeamData);
                      }}
                      style={{flex:1,display:"flex",flexDirection:"column",borderRight:"1px solid #e7e5e4",minWidth:220,maxWidth:500}}>
                      <div style={{padding:"14px 16px 10px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                        <span style={{color:meta.color,fontSize:14}}>{meta.icon}</span>
                        <span style={{fontSize:14,fontWeight:700}}>{meta.label}</span>
                        <span style={{fontSize:12,color:"#a8a29e",fontWeight:600}}>{colTasks.length}</span>
                      </div>
                      <div style={{flex:1,overflowY:"auto",padding:"0 12px 12px"}}>
                        {colTasks.map(task=>(
                          <KanbanCard key={task.id} task={task} members={members} isViewer={isViewer}
                            onClick={t=>!isViewer?setShowTaskDetail(t):null} onToggle={handleToggleTask}/>
                        ))}
                        {colTasks.length===0&&<div style={{textAlign:"center",padding:"20px 8px",color:"#a8a29e",fontSize:12,fontStyle:"italic"}}>Drag tasks here</div>}
                        {!isViewer&&<QuickAdd onAdd={data=>handleQuickAdd({...data,
                          ...(groupBy==="status"?{status:key}:{}),
                          ...(groupBy==="assignee"&&key!=="__none"?{assigned_to:key}:{}),
                          ...(groupBy==="priority"?{priority:key}:{}),
                          ...(groupBy==="category"?{category:key}:{}),
                        })}/>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* LIST */}
            {view==="board"&&boardMode==="list"&&(
              <div style={{padding:"16px 24px",maxWidth:800}}>
                {filteredTasks.filter(t=>t.status!=="done").length===0&&!search?(
                  <EmptyState icon="✨" title="No tasks yet" desc="Create your first team task to get started." action={!isViewer&&<Btn onClick={()=>setShowTaskDetail({})}>+ New Task</Btn>}/>
                ):(
                  <>
                    {filteredTasks.filter(t=>t.status!=="done").map(task=>(
                      <ListRow key={task.id} task={task} members={members} isViewer={isViewer} onClick={t=>!isViewer?setShowTaskDetail(t):null} onToggle={handleToggleTask}/>
                    ))}
                    {!isViewer&&<div style={{marginTop:4}}><QuickAdd onAdd={handleQuickAdd}/></div>}
                    {filteredTasks.filter(t=>t.status==="done").length>0&&(
                      <details style={{marginTop:16}}>
                        <summary style={{fontSize:13,fontWeight:600,color:"#a8a29e",cursor:"pointer",padding:"8px 0"}}>Completed ({filteredTasks.filter(t=>t.status==="done").length})</summary>
                        {filteredTasks.filter(t=>t.status==="done").map(task=>(
                          <ListRow key={task.id} task={task} members={members} isViewer={isViewer} onClick={t=>!isViewer?setShowTaskDetail(t):null} onToggle={handleToggleTask}/>
                        ))}
                      </details>
                    )}
                  </>
                )}
              </div>
            )}

            {/* MY TASKS */}
            {view==="my-tasks"&&(
              <div style={{padding:"16px 24px",maxWidth:700}}>
                {myTasks.length===0?<EmptyState icon="🎯" title="All caught up!" desc="No tasks assigned to you right now."/>
                :myTasks.map(task=><ListRow key={task.id} task={task} members={members} isViewer={isViewer} onClick={t=>!isViewer?setShowTaskDetail(t):null} onToggle={handleToggleTask}/>)}
              </div>
            )}

            {/* REQUESTS */}
            {view==="requests"&&(
              <div style={{padding:"16px 24px",maxWidth:720}}>
                <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:600,color:"#92400e",flexShrink:0}}>📬 Share this link to receive requests:</span>
                  <code style={{fontSize:12,background:"white",padding:"6px 10px",borderRadius:6,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",minWidth:0,border:"1px solid #fde68a"}}>{requestLink}</code>
                  <button onClick={()=>{navigator.clipboard.writeText(requestLink);flash("Copied!");}} style={{background:"#d97706",color:"white",border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>Copy</button>
                </div>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>Pending <Badge color="#d97706" bg="#fffbeb">{pendingRequests.length}</Badge></h3>
                {pendingRequests.length===0?<div style={{padding:"20px",textAlign:"center",color:"#a8a29e",fontSize:14,fontStyle:"italic",marginBottom:24}}>No pending requests — share the link above.</div>
                :pendingRequests.map(req=>(
                  <div key={req.id} onClick={()=>setShowRequestModal(req)}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"white",borderRadius:12,marginBottom:8,cursor:"pointer",border:"1px solid #e7e5e4",borderLeft:`3px solid ${PRIORITY[req.priority||"medium"].color}`,transition:"box-shadow 0.15s"}}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.06)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600}}>{req.title}</div><div style={{fontSize:12,color:"#a8a29e",marginTop:2}}>From {req.requester_name} · {timeAgo(req.created_at)}</div></div>
                    <Badge color={PRIORITY[req.priority||"medium"].color} bg={PRIORITY[req.priority||"medium"].bg}>{req.priority}</Badge>
                  </div>
                ))}
                {requests.filter(r=>r.status!=="pending").length>0&&(
                  <details style={{marginTop:20}}>
                    <summary style={{fontSize:14,fontWeight:600,color:"#a8a29e",cursor:"pointer",padding:"8px 0"}}>History ({requests.filter(r=>r.status!=="pending").length})</summary>
                    {requests.filter(r=>r.status!=="pending").map(req=>(
                      <div key={req.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",background:"#fafaf9",borderRadius:10,marginBottom:4,opacity:0.7}}>
                        <span>{req.status==="accepted"?"✅":"❌"}</span>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{req.title}</div><div style={{fontSize:12,color:"#a8a29e"}}>From {req.requester_name} · {req.status} {req.reviewed_at?timeAgo(req.reviewed_at):""}</div></div>
                      </div>
                    ))}
                  </details>
                )}
              </div>
            )}

            {/* MEMBERS */}
            {view==="members"&&(
              <div style={{padding:"16px 24px",maxWidth:600}}>
                {myRole==="admin"&&<Btn onClick={()=>setShowAddMember(true)} style={{marginBottom:16}}>+ Add Member</Btn>}
                <div style={{background:"#f5f5f4",borderRadius:12,padding:"16px 18px",marginBottom:20}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>📎 Shareable Links</div>
                  {[["Request form",requestLink],["Viewer dashboard",viewerLink]].map(([label,link])=>(
                    <div key={label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:12,color:"#78716c",flexShrink:0,minWidth:115}}>{label}:</span>
                      <code style={{fontSize:11,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#44403c"}}>{link}</code>
                      <button onClick={()=>{navigator.clipboard.writeText(link);flash("Copied!");}} style={{background:"#d97706",color:"white",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>Copy</button>
                    </div>
                  ))}
                </div>
                {members.map(m=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"white",borderRadius:12,marginBottom:8,border:"1px solid #e7e5e4"}}>
                    <Avatar name={m.display_name||m.email} size={36}/>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600}}>{m.display_name||m.email.split("@")[0]}</div><div style={{fontSize:12,color:"#a8a29e"}}>{m.email}</div></div>
                    <Badge color={m.role==="admin"?"#d97706":m.role==="viewer"?"#a8a29e":"#3b82f6"} bg={m.role==="admin"?"#fffbeb":m.role==="viewer"?"#f5f5f4":"#eff6ff"}>{m.role}</Badge>
                    {myRole==="admin"&&m.user_id!==user.id&&(
                      <select value={m.role} onChange={async e=>{try{await api.updateMemberRole(m.id,e.target.value);flash("Updated");loadTeamData();}catch(err){alert(err.message);}}}
                        style={{fontSize:12,border:"1px solid #e7e5e4",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontFamily:"inherit",background:"white"}}>
                        <option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option>
                      </select>
                    )}
                    {myRole==="admin"&&m.user_id!==user.id&&(
                      <button onClick={async()=>{if(confirm(`Remove ${m.display_name||m.email}?`)){try{await api.removeMember(m.id);flash("Removed");loadTeamData();}catch(err){alert(err.message);}}}}
                        style={{background:"none",border:"none",cursor:"pointer",color:"#ef4444",fontSize:18,padding:"2px 6px"}} title="Remove">×</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {showTaskDetail&&<TaskDetail task={showTaskDetail.id?showTaskDetail:null} members={members} onSave={handleSaveTask} onDelete={handleDeleteTask} onClose={()=>setShowTaskDetail(null)}/>}
      {showRequestModal&&<RequestModal request={showRequestModal} members={members} onAccept={handleAcceptRequest} onDecline={handleDeclineRequest} onClose={()=>setShowRequestModal(null)}/>}
      {showAddMember&&<AddMemberModal onAdd={handleAddMember} onClose={()=>setShowAddMember(false)}/>}

      {/* Toast */}
      {toast&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1c1917",color:"white",padding:"10px 24px",borderRadius:12,fontSize:14,fontWeight:600,boxShadow:"0 8px 24px rgba(0,0,0,0.2)",zIndex:9999,animation:"slideUp 0.2s ease",whiteSpace:"nowrap"}}>{toast}</div>}

      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #a8a29e; }
      `}</style>
    </div>
  );
}
