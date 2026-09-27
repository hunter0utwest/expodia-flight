create table if not exists public.agent_presence (
  user_id uuid primary key references public.agents(id) on delete cascade,
  display_name text,
  status text not null default 'OFFLINE' check (status in ('OFFLINE','ONLINE','BUSY','AWAY','ON_BREAK')),
  specialty text,
  max_conversations integer not null default 5 check (max_conversations between 1 and 50),
  active_conversations integer not null default 0 check (active_conversations >= 0),
  last_seen_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.agent_presence enable row level security;
create index if not exists agent_presence_route_idx on public.agent_presence(status,specialty,last_seen_at);
alter table public.support_conversations
  add column if not exists assigned_agent_id uuid references public.agents(id),
  add column if not exists priority text not null default 'NORMAL' check (priority in ('LOW','NORMAL','HIGH','URGENT')),
  add column if not exists category text not null default 'GENERAL',
  add column if not exists resolved_at timestamptz,
  add column if not exists closed_at timestamptz;
create index if not exists support_conversations_assigned_idx on public.support_conversations(assigned_agent_id,status,priority);

create policy "authenticated can view online agent presence"
on public.agent_presence for select to authenticated
using (status='ONLINE' and coalesce(last_seen_at,to_timestamp(0)) > now()-interval '2 minutes');

create policy "agents can manage own presence"
on public.agent_presence for insert to authenticated
with check ((select auth.uid())=user_id);

create policy "agents can update own presence"
on public.agent_presence for update to authenticated
using ((select auth.uid())=user_id)
with check ((select auth.uid())=user_id);

create policy "travelers can create support conversations"
on public.support_conversations for insert to authenticated
with check ((select auth.uid())=created_by);

create policy "conversation creator can add participants"
on public.support_conversation_participants for insert to authenticated
with check (
  exists (
    select 1 from public.support_conversations c
    where c.id=conversation_id and c.created_by=(select auth.uid())
  )
  and (
    (participant_type='TRAVELER' and user_id=(select auth.uid()))
    or (
      participant_type='AGENT'
      and exists (
        select 1 from public.agent_presence p
        where p.user_id=user_id and p.status='ONLINE'
          and coalesce(p.last_seen_at,to_timestamp(0)) > now()-interval '2 minutes'
      )
    )
  )
);
