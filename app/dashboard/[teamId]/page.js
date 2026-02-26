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
const STATUS = {
  todo:        { icon: "○", label: "To Do", color: "#a8a29e" },
  in_progress: { icon: "◐", label: "In Progress", color: "#3b82f6" },
  done:        { icon: "●", label: "Done", color: "#22c55e" },
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

export default function DashboardPage() {
  const params = useParams();
  const teamId = params.teamId;
  const [teamName, setTeamName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groupBy, setGroupBy] = useState("status"); /* status | priority | category */
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadData = async () => {
    if (!supabase || !teamId) { setLoading(false); return; }
    try {
      const [teamRes, tasksRes] = await Promise.all([
        supabase.from("teams").select("name").eq("id", teamId).single(),
        supabase.from("team_tasks").select("*").eq("team_id", teamId).order("created_at", { ascending: false })
      ]);
      if (teamRes.data) setTeamName(teamRes.data.name);
      else setError("Team not found");
      setTasks(tasksRes.data || []);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [teamId]);
  /* Auto-refresh every 60s */
  useEffect(() => {
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [teamId]);

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#78716c",fontFamily:"-apple-system, sans-serif"}}>Loading...</div>;
  if (error) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#ef4444",fontFamily:"-apple-system, sans-serif"}}>{error}</div>;

  const activeTasks = tasks.filter(t => t.status !== "done");
  const doneTasks = tasks.filter(t => t.status === "done");

  /* Grouping */
  const grouped = {};
  activeTasks.forEach(t => {
    const key = groupBy === "status" ? t.status : groupBy === "priority" ? t.priority : (t.category || "General");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  const groupOrder = groupBy === "status" ? ["todo","in_progress"] :
                     groupBy === "priority" ? ["high","medium","low","none"] :
                     Object.keys(grouped).sort();

  return (
    <div style={{minHeight:"100vh",background:"#fafaf9",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      {/* Header */}
      <header style={{background:"white",borderBottom:"1px solid #e7e5e4",padding:"16px 24px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"white"}}>I</div>
        <div style={{flex:1}}>
          <h1 style={{fontSize:18,fontWeight:700,color:"#1c1917",margin:0}}>{teamName}</h1>
          <div style={{fontSize:12,color:"#a8a29e"}}>Team Dashboard · {activeTasks.length} active tasks</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={groupBy} onChange={e=>setGroupBy(e.target.value)}
            style={{padding:"6px 10px",borderRadius:8,border:"1px solid #e7e5e4",fontSize:12,cursor:"pointer",fontFamily:"inherit",background:"white"}}>
            <option value="status">Group by Status</option>
            <option value="priority">Group by Priority</option>
            <option value="category">Group by Category</option>
          </select>
          <button onClick={loadData} style={{background:"none",border:"1px solid #e7e5e4",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,color:"#78716c",fontFamily:"inherit"}}>↻ Refresh</button>
        </div>
      </header>

      <main style={{maxWidth:900,margin:"0 auto",padding:"24px 20px"}}>
        {/* Stats bar */}
        <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
          {[
            {label:"To Do",count:tasks.filter(t=>t.status==="todo").length,color:"#a8a29e"},
            {label:"In Progress",count:tasks.filter(t=>t.status==="in_progress").length,color:"#3b82f6"},
            {label:"Done",count:doneTasks.length,color:"#22c55e"},
            {label:"High Priority",count:tasks.filter(t=>t.priority==="high"&&t.status!=="done").length,color:"#f87171"},
          ].map(s => (
            <div key={s.label} style={{background:"white",borderRadius:10,border:"1px solid #e7e5e4",padding:"12px 18px",flex:"1 1 120px",minWidth:120}}>
              <div style={{fontSize:24,fontWeight:800,color:s.color}}>{s.count}</div>
              <div style={{fontSize:12,color:"#78716c",fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grouped tasks */}
        {groupOrder.filter(k => grouped[k]?.length > 0).map(key => {
          const groupLabel = groupBy === "status" ? STATUS[key]?.label : groupBy === "priority" ? PRIORITY[key]?.label : key;
          const groupColor = groupBy === "status" ? STATUS[key]?.color : groupBy === "priority" ? PRIORITY[key]?.color : "#78716c";
          return (
            <div key={key} style={{marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:groupColor}}/>
                <h3 style={{fontSize:15,fontWeight:700,color:"#1c1917",margin:0}}>{groupLabel}</h3>
                <span style={{fontSize:12,color:"#a8a29e",fontWeight:600}}>{grouped[key].length}</span>
              </div>
              {grouped[key].map(task => (
                <div key={task.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"white",borderRadius:10,marginBottom:6,border:"1px solid #e7e5e4",borderLeft:`3px solid ${PRIORITY[task.priority||"none"].color}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#1c1917"}}>{task.title}</div>
                    {task.description && <div style={{fontSize:13,color:"#78716c",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{task.description}</div>}
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {task.priority !== "none" && <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:6,color:PRIORITY[task.priority].color,background:PRIORITY[task.priority].bg}}>{PRIORITY[task.priority].label}</span>}
                    {task.category && task.category !== "General" && <span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:"#f5f5f4",color:"#78716c"}}>{task.category}</span>}
                    {task.due_date && <span style={{fontSize:11,color:new Date(task.due_date+"T23:59:59")<new Date()?"#ef4444":"#78716c"}}>{formatDate(task.due_date)}</span>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {activeTasks.length === 0 && (
          <div style={{textAlign:"center",padding:"48px 20px",color:"#78716c"}}>
            <div style={{fontSize:40,marginBottom:12}}>✨</div>
            <div style={{fontSize:16,fontWeight:600,color:"#1c1917"}}>All clear!</div>
            <div style={{fontSize:14}}>No active tasks at the moment.</div>
          </div>
        )}

        {lastRefresh && (
          <div style={{textAlign:"center",fontSize:11,color:"#a8a29e",marginTop:24}}>
            Last updated: {lastRefresh.toLocaleTimeString()} · Auto-refreshes every 60s
          </div>
        )}
      </main>
    </div>
  );
}
