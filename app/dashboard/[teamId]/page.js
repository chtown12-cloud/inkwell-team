"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

const PRIORITY = {
  none:   { color: "#a8a29e", label: "None", bg: "#f5f5f4" },
  low:    { color: "#60a5fa", label: "Low", bg: "#eff6ff" },
  medium: { color: "#fbbf24", label: "Medium", bg: "#fffbeb" },
  high:   { color: "#f87171", label: "High", bg: "#fef2f2" },
};
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

export default function DashboardPage() {
  const params = useParams();
  const teamId = params.teamId;
  const [teamName, setTeamName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupBy, setGroupBy] = useState("list");
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = async () => {
    if (!supabase || !teamId) { setLoading(false); return; }
    try {
      const [teamRes, wsRes, memRes] = await Promise.all([
        supabase.from("teams").select("name").eq("id", teamId).single(),
        supabase.from("workspace_data").select("tasks, lists").eq("team_id", teamId).single(),
        supabase.from("team_members").select("user_id, display_name, email").eq("team_id", teamId)
      ]);
      if (teamRes.data) setTeamName(teamRes.data.name);
      else setError("Team not found");
      setTasks(wsRes.data?.tasks || []);
      setLists(wsRes.data?.lists || []);
      setMembers(memRes.data || []);
      setLastRefresh(new Date());
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [teamId]);
  useEffect(() => { const i = setInterval(loadData, 60000); return () => clearInterval(i); }, [teamId]);

  const memberName = (uid) => { const m = members.find(m => m.user_id === uid); return m?.display_name || m?.email?.split("@")[0] || "Unassigned"; };

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#78716c",fontFamily:"-apple-system, sans-serif"}}>Loading...</div>;
  if (error) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#ef4444",fontFamily:"-apple-system, sans-serif"}}>{error}</div>;

  const activeTasks = tasks.filter(t => !t.completed);
  const doneTasks = tasks.filter(t => t.completed);

  const grouped = {};
  activeTasks.forEach(t => {
    const key = groupBy === "list" ? (t.list || "Inbox") : groupBy === "priority" ? (t.priority || "none") : (t.assignedTo || "__none");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });
  const groupOrder = groupBy === "list" ? lists.filter(l => grouped[l]).concat(Object.keys(grouped).filter(k => !lists.includes(k))) :
                     groupBy === "priority" ? ["high","medium","low","none"].filter(k => grouped[k]) :
                     Object.keys(grouped).sort();
  const groupLabel = (key) => groupBy === "list" ? key : groupBy === "priority" ? (PRIORITY[key]?.label || key) : (key === "__none" ? "Unassigned" : memberName(key));
  const groupColor = (key) => groupBy === "priority" ? (PRIORITY[key]?.color || "#78716c") : groupBy === "list" ? "#d97706" : "#3b82f6";

  return (
    <div style={{minHeight:"100vh",background:"#fafaf9",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <header style={{background:"white",borderBottom:"1px solid #e7e5e4",padding:"16px 24px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white"}}>I</div>
        <div style={{flex:1}}>
          <h1 style={{fontSize:18,fontWeight:700,color:"#1c1917",margin:0}}>{teamName}</h1>
          <div style={{fontSize:12,color:"#a8a29e"}}>Team Dashboard · {activeTasks.length} active · {doneTasks.length} done</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={groupBy} onChange={e=>setGroupBy(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,cursor:"pointer",fontFamily:"inherit",background:"white"}}>
            <option value="list">Group by List</option>
            <option value="priority">Group by Priority</option>
            <option value="assignee">Group by Assignee</option>
          </select>
          <button onClick={loadData} style={{background:"none",border:"1px solid #e7e5e4",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,color:"#78716c",fontFamily:"inherit"}}>↻ Refresh</button>
        </div>
      </header>
      <main style={{maxWidth:900,margin:"0 auto",padding:"24px 20px"}}>
        <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
          {[{label:"Active",count:activeTasks.length,color:"#3b82f6"},{label:"Done",count:doneTasks.length,color:"#22c55e"},{label:"High Priority",count:activeTasks.filter(t=>t.priority==="high").length,color:"#f87171"},{label:"Overdue",count:activeTasks.filter(t=>isOverdue(t.dueDate)).length,color:"#ef4444"}].map(s=>(
            <div key={s.label} style={{background:"white",borderRadius:10,border:"1px solid #e7e5e4",padding:"12px 18px",flex:"1 1 120px",minWidth:120}}>
              <div style={{fontSize:24,fontWeight:800,color:s.color}}>{s.count}</div>
              <div style={{fontSize:12,color:"#78716c",fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
        {groupOrder.map(key=>{const grp=grouped[key]||[];if(!grp.length)return null;return(
          <div key={key} style={{marginBottom:24}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:groupColor(key)}}/>
              <h3 style={{fontSize:15,fontWeight:700,color:"#1c1917",margin:0}}>{groupLabel(key)}</h3>
              <span style={{fontSize:12,color:"#a8a29e",fontWeight:600}}>{grp.length}</span>
            </div>
            {grp.map(task=>(
              <div key={task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"white",borderRadius:10,marginBottom:6,border:"1px solid #e7e5e4",borderLeft:`3px solid ${PRIORITY[task.priority||"none"].color}`}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#1c1917"}}>{task.title}</div>
                  {task.notes&&<div style={{fontSize:13,color:"#78716c",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.notes}</div>}
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {task.priority&&task.priority!=="none"&&<span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6,color:PRIORITY[task.priority].color,background:PRIORITY[task.priority].bg}}>{PRIORITY[task.priority].label}</span>}
                  {task.list&&task.list!=="Inbox"&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"#f5f5f4",color:"#78716c"}}>{task.list}</span>}
                  {task.dueDate&&<span style={{fontSize:11,color:isOverdue(task.dueDate)?"#ef4444":"#78716c"}}>{formatDate(task.dueDate)}</span>}
                  {task.assignedTo&&<span style={{fontSize:11,color:"#3b82f6",fontWeight:500}}>{memberName(task.assignedTo)}</span>}
                </div>
              </div>
            ))}
          </div>
        );})}
        {activeTasks.length===0&&(<div style={{textAlign:"center",padding:"48px 20px",color:"#78716c"}}><div style={{fontSize:40,marginBottom:12}}>✨</div><div style={{fontSize:16,fontWeight:600,color:"#1c1917"}}>All clear!</div><div style={{fontSize:14}}>No active tasks at the moment.</div></div>)}
        {lastRefresh&&<div style={{textAlign:"center",fontSize:11,color:"#a8a29e",marginTop:24}}>Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 60s</div>}
      </main>
    </div>
  );
}
