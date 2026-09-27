'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const suggestions=['I want to book a flight','I need help with an existing trip','I need a place to stay','I am planning a trip with family'];

export default function AssistantPage(){
  const [request,setRequest]=useState('');
  const [reply,setReply]=useState('Tell me what you are here to do. I can help you find the right part of Expodia and, when needed, connect you with an available travel professional.');
  const [loading,setLoading]=useState(false);

  async function connectHuman(){
    setLoading(true);
    const supabase=createSupabaseBrowserClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){
      setReply('A travel professional can join the conversation when you are signed in. Sign in as a traveler first, then ask me to connect you.');
      setLoading(false);
      return;
    }
    const subject=request.trim() || 'Traveler support request';
    const {data,error}=await supabase.rpc('request_human_support',{p_subject:subject,p_category:'GENERAL'});
    if(error || !data?.[0]){
      setReply('I could not open the support handoff right now. Please try again.');
      setLoading(false);
      return;
    }
    const handoff=data[0];
    if(handoff.queued){
      setReply('No travel professional is available right now. Your request is in the support queue. You can keep planning while Expodia waits for an available professional.');
    }else{
      setReply(`I found an available Expodia travel professional. ${handoff.assigned_agent_name || 'They'} can now take over this conversation.`);
    }
    setLoading(false);
  }

  function submit(event:FormEvent){
    event.preventDefault();
    const value=request.trim();
    if(!value)return;
    setReply(`I understand that you are planning: “${value}”. I can help organise the relevant flight, stay, event, transport and travel-requirement pieces. If this needs a travel professional, I can route you to one when an eligible professional is online.`);
  }

  return <main className="publicPage">
    <header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/track">Track</Link><Link href="/traveler">Plan</Link><Link href="/access" className="agentAccess">Sign in</Link></nav></header>
    <section className="assistantPage">
      <div className="assistantBadge"><span/> EXPODIA VIRTUAL AGENT</div>
      <h1>What are you here to do?</h1>
      <p>Tell Expodia in ordinary language. I can guide you through planning, tracking and support. I will not invent availability, prices, bookings or ticket status.</p>
      <form className="assistantComposer" onSubmit={submit}><input value={request} onChange={event=>setRequest(event.target.value)} placeholder="I am planning…"/><button className="publicPrimary" type="submit">Continue</button></form>
      <div className="assistantSuggestions">{suggestions.map(item=><button key={item} onClick={()=>{setRequest(item);setReply(`I can help you organise “${item}”. If a travel professional is needed, I can route the conversation to an eligible professional who is online.`);}}>{item}</button>)}</div>
      <div className="assistantReply">{reply}</div>
      <div className="assistantHandoff"><div><strong>Need a travel professional?</strong><span>Expodia can check for an eligible professional who is currently online and route the conversation without asking you for an agent ID.</span></div><button className="publicSecondary" type="button" onClick={connectHuman} disabled={loading}>{loading?'Checking…':'Connect me'}</button></div>
      <Link className="publicSecondary assistantPlanLink" href="/traveler">Open My Plan</Link>
    </section>
  </main>;
}