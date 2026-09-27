'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Conversation={id:string;subject:string|null;status:string;priority:string;category:string;assigned_agent_id:string|null;created_at:string};

export default function SupportPage(){
  const [status,setStatus]=useState('OFFLINE');
  const [specialty,setSpecialty]=useState('GENERAL');
  const [conversations,setConversations]=useState<Conversation[]>([]);
  const [message,setMessage]=useState('');
  const supabase=createSupabaseBrowserClient();

  async function load(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return;
    const {data:agent}=await supabase.from('agents').select('display_name').eq('id',user.id).maybeSingle();
    const {data:presence}=await supabase.from('agent_presence').select('status,specialty').eq('user_id',user.id).maybeSingle();
    if(presence){setStatus(presence.status);setSpecialty(presence.specialty||'GENERAL');}
    if(agent && !presence) await supabase.from('agent_presence').insert({user_id:user.id,display_name:agent.display_name,status:'OFFLINE',specialty:'GENERAL'});
    const {data}=await supabase.from('support_conversations').select('id,subject,status,priority,category,assigned_agent_id,created_at').order('updated_at',{ascending:false}).limit(50);
    setConversations(data||[]);
  }

  async function setPresence(next:string){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return;
    const {data:agent}=await supabase.from('agents').select('display_name').eq('id',user.id).single();
    const {error}=await supabase.from('agent_presence').upsert({user_id:user.id,display_name:agent?.display_name||'Expodia professional',status:next,specialty,last_seen_at:new Date().toISOString(),updated_at:new Date().toISOString()});
    setMessage(error?'Presence could not be updated.':'Presence updated.');
    setStatus(next);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{load();const timer=setInterval(()=>{if(status==='ONLINE')setPresence('ONLINE')},60000);return()=>clearInterval(timer)},[status]);

  return <main className="publicPage">
    <section className="content" style={{maxWidth:1100}}>
      <div className="pageIntro"><div><div className="eyebrow">EXPODIA SUPPORT</div><h1>Professional support desk</h1><p className="subtitle">Set your live availability and handle traveler conversations routed by the Virtual Agent.</p></div><button className="primary" onClick={()=>setPresence(status==='ONLINE'?'OFFLINE':'ONLINE')}>{status==='ONLINE'?'Go offline':'Go online'}</button></div>
      <div className="grid">
        <div className="card"><div className="metricLabel">Presence</div><div className="metricValue">{status}</div></div>
        <div className="card"><div className="metricLabel">Specialty</div><div className="metricValue">{specialty}</div></div>
        <div className="card"><div className="metricLabel">Queue</div><div className="metricValue">{conversations.filter(c=>c.status==='PENDING').length}</div></div>
        <div className="card"><div className="metricLabel">Assigned</div><div className="metricValue">{conversations.filter(c=>c.assigned_agent_id).length}</div></div>
      </div>
      {message&&<div className="notice">{message}</div>}
      <section className="panel"><div className="panelHeader"><h2 className="panelTitle">Traveler conversations</h2><button className="secondary" onClick={load}>Refresh</button></div>
        <div className="flightResults">{conversations.map(c=><article className="card" key={c.id}><div className="flightCardTop"><div><div className="eyebrow">{c.category} · {c.priority}</div><h2 className="cartItem h2">{c.subject||'Traveler support'}</h2><p className="subtitle">{c.status} · {new Date(c.created_at).toLocaleString()}</p></div>{c.assigned_agent_id&&<span className="resultBadge">Assigned</span>}</div></article>)}{!conversations.length&&<div className="empty">No support conversations are currently visible to this professional account.</div>}</div>
      </section>
    </section>
  </main>;
}
