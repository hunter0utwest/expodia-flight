'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type Conversation={id:string;subject:string|null;status:string;created_at:string};
type Message={id:string;body:string;sender_user_id:string;created_at:string};

export default function TravelerInboxPage(){
  const supabase=createSupabaseBrowserClient();
  const params=useSearchParams();
  const [userId,setUserId]=useState<string|null>(null);
  const [conversations,setConversations]=useState<Conversation[]>([]);
  const [active,setActive]=useState<Conversation|null>(null);
  const [messages,setMessages]=useState<Message[]>([]);
  const [draft,setDraft]=useState('');
  const [error,setError]=useState('');

  async function load(){
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){setError('Sign in to open your Expodia inbox.');return;}
    setUserId(user.id);
    const {data}=await supabase.from('support_conversations').select('id,subject,status,created_at').order('updated_at',{ascending:false}).limit(50);
    setConversations(data??[]);
    const requested=params.get('id');
    const selected=(data??[]).find(c=>c.id===requested)??(data??[])[0]??null;
    setActive(selected);
    if(selected) await loadMessages(selected.id);
  }

  async function loadMessages(conversationId:string){
    const {data}=await supabase.from('support_messages').select('id,body,sender_user_id,created_at').eq('conversation_id',conversationId).order('created_at',{ascending:true});
    setMessages(data??[]);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect\n  useEffect(()=>{void load();},[params]);

  useEffect(()=>{
    if(!active?.id)return;
    const channel=supabase.channel('traveler-support-'+active.id)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'support_messages',filter:'conversation_id=eq.'+active.id},payload=>{
        const message=payload.new as Message;
        setMessages(current=>current.some(item=>item.id===message.id)?current:[...current,message]);
      }).subscribe();
    return()=>{void supabase.removeChannel(channel);};
  },[active?.id,supabase]);

  async function send(){
    if(!active||!userId||!draft.trim())return;
    const body=draft.trim();
    const {data,error:sendError}=await supabase.from('support_messages').insert({conversation_id:active.id,sender_user_id:userId,body}).select('id,body,sender_user_id,created_at').single();
    if(sendError||!data){setError('Your message could not be sent.');return;}
    setMessages(current=>[...current,data]);setDraft('');
  }

  return <main className="travelerApp">
    <header className="travelerAppHeader"><Link href="/traveler" className="travelerAppBrand">Expodia</Link><nav className="travelerAppNav"><Link href="/traveler">Home</Link><Link href="/traveler/profile">Profile</Link></nav></header>
    <section className="travelerWorkspace travelerInboxPage">
      <div className="publicEyebrow">INBOX</div><h1>Your Expodia conversations</h1><p>Virtual Agent handoffs and professional support stay inside your traveler account.</p>
      <div className="travelerInboxLayout">
        <aside className="travelerConversationList">{conversations.map(c=><button key={c.id} className={active?.id===c.id?'active':''} onClick={()=>{setActive(c);void loadMessages(c.id)}}><strong>{c.subject||'Traveler support'}</strong><span>{c.status}</span></button>)}{!conversations.length&&<div className="planningEmpty">No conversations yet.</div>}</aside>
        <section className="travelerConversationPanel">
          {!active?<div className="planningEmpty">Ask the Virtual Agent to connect you with Expodia support when you need help.</div>:<><div className="travelerConversationHeader"><div><div className="publicEyebrow">SUPPORT</div><h2>{active.subject||'Traveler support'}</h2></div><span>{active.status}</span></div><div className="travelerConversationMessages">{messages.map(m=><div key={m.id} className={m.sender_user_id===userId?'travelerConversationMessage own':'travelerConversationMessage'}>{m.body}<small>{new Date(m.created_at).toLocaleString()}</small></div>)}</div><div className="groupComposer"><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')void send()}} placeholder="Message Expodia support…"/><button className="publicPrimary" onClick={()=>void send()}>Send</button></div></>}
        </section>
      </div>
      {error&&<div className="notice" role="alert">{error}</div>}
    </section>
  </main>;
}
