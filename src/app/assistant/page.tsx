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
    const {data:agents}=await supabase.from('agent_presence').select('user_id,display_name').eq('status','ONLINE').gte('last_seen_at',new Date(Date.now()-120000).toISOString()).order('last_seen_at',{ascending:false}).limit(1);
    const selected=agents?.[0];
    const {data:conversation,error}=await supabase.from('support_conversations').insert({
      subject:(request.trim() || 'Traveler support request').slice(0,200),
      status:selected?'OPEN':'PENDING',
      created_by:user.id,
      assigned_agent_id:selected?.user_id ?? null,
      category:'GENERAL',
      priority:'NORMAL'
    }).select('id').single();
    if(error || !conversation){
      setReply('I could not open the support handoff right now. Please try again.');
      setLoading(false);
      return;
    }
    await supabase.from('support_conversation_participants').insert([
      {conversation_id:conversation.id,user_id:user.id,participant_type:'TRAVELER'},
      ...(selected?[{conversation_id:conversation.id,user_id:selected.user_id,participant_type:'AGENT'}]:[])
    ]);
    if(selected){
      setReply(`I found an available Expodia travel professional. ${selected.display_name || 'They'} can now take over this conversation.`);
    }else{
      setReply('No travel professional is available right now. Your request is in the support queue. You can keep planning while Expodia waits for an available professional.');
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