"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function SubmitRequestPage() {
  const params = useParams();
  const teamId = params.teamId;
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!supabase || !teamId) { setLoading(false); return; }
    supabase.from("teams").select("name").eq("id", teamId).single()
      .then(({ data, error }) => {
        if (data) setTeamName(data.name);
        else setError("Team not found");
        setLoading(false);
      });
  }, [teamId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !name.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const { error: insertErr } = await supabase
        .from("team_requests")
        .insert({
          team_id: teamId,
          title: title.trim(),
          description: description.trim(),
          priority,
          requester_name: name.trim(),
          requester_email: email.trim()
        });
      if (insertErr) throw insertErr;
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const input = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e7e5e4", fontSize: 15, color: "#1c1917", background: "white", fontFamily: "inherit", boxSizing: "border-box", outline: "none" };
  const label = { fontSize: 13, fontWeight: 600, color: "#78716c", marginBottom: 6, display: "block" };

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",color:"#78716c"}}>Loading...</div>;

  if (submitted) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#fafaf9",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
        <div style={{textAlign:"center",maxWidth:400}}>
          <div style={{fontSize:48,marginBottom:16}}>✅</div>
          <h2 style={{fontSize:22,fontWeight:700,marginBottom:8,color:"#1c1917"}}>Request Submitted!</h2>
          <p style={{fontSize:15,color:"#78716c",lineHeight:1.6,marginBottom:24}}>
            Your request has been sent to <strong>{teamName}</strong>. They&apos;ll review it and you may hear back at the email you provided.
          </p>
          <button onClick={()=>{setSubmitted(false);setTitle("");setDescription("");setPriority("medium");}}
            style={{padding:"12px 24px",borderRadius:10,background:"#d97706",color:"white",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:"#fafaf9",fontFamily:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#d97706,#ea580c)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"white",marginBottom:12}}>I</div>
          <h1 style={{fontSize:22,fontWeight:700,color:"#1c1917",marginBottom:4}}>Submit a Request</h1>
          <p style={{fontSize:15,color:"#78716c"}}>{teamName ? `to ${teamName}` : ""}</p>
        </div>

        {error && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",fontSize:14,color:"#dc2626",marginBottom:16}}>{error}</div>}

        <form onSubmit={handleSubmit} style={{background:"white",borderRadius:16,border:"1px solid #e7e5e4",padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
          <div style={{marginBottom:16}}>
            <label style={label}>Your Name *</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" style={input} required />
          </div>

          <div style={{marginBottom:16}}>
            <label style={label}>Email (optional)</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@company.com" style={input} />
          </div>

          <div style={{marginBottom:16}}>
            <label style={label}>Request Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What do you need?" style={input} required />
          </div>

          <div style={{marginBottom:16}}>
            <label style={label}>Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add context, links, deadlines..." rows={4} style={{...input,resize:"vertical",minHeight:80}} />
          </div>

          <div style={{marginBottom:20}}>
            <label style={label}>Priority</label>
            <div style={{display:"flex",gap:8}}>
              {[["low","Low","#60a5fa"],["medium","Medium","#fbbf24"],["high","High","#f87171"]].map(([val,lbl,color]) => (
                <button key={val} type="button" onClick={()=>setPriority(val)}
                  style={{flex:1,padding:"10px 8px",borderRadius:8,border:priority===val?`2px solid ${color}`:"1px solid #e7e5e4",background:priority===val?`${color}15`:"white",color:priority===val?color:"#78716c",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting||!title.trim()||!name.trim()}
            style={{width:"100%",padding:14,borderRadius:10,background:"#d97706",color:"white",border:"none",fontSize:15,fontWeight:600,cursor:submitting?"not-allowed":"pointer",opacity:submitting?0.6:1,fontFamily:"inherit",transition:"all 0.15s"}}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:"#a8a29e"}}>
          Powered by <a href="/" style={{color:"#d97706",textDecoration:"none",fontWeight:600}}>Inkwell</a>
        </div>
      </div>
    </div>
  );
}
