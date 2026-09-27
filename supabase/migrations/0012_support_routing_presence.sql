create table if not exists public.agent_presence (
  user_id uuid primary key references public.agents(id) on delete cascade,
  status text not null default 'OFFLINE' check (status in ('OFFLINE','ONLINE','BUSY','AWAY','ON_BREAK')),
  specialty text,
  max_conversations integer not null default 5 check (max_conversations between 1 and 50),
  active_conversations integer not null default 0 check (active_conversations >= 0),
  last_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.agent_presence enable row level security;
revoke all on table public.agent_presence from anon, authenticated;

create index if not exists agent_presence_route_idx
  on public.agent_presence(status, specialty, last_seen_at);

alter table public.support_conversations
  add column if not exists assigned_agent_id uuid references public.agents(id),
  add column if not exists priority text not null default 'NORMAL' check (priority in ('LOW','NORMAL','HIGH','URGENT')),
  add column if not exists category text not null default 'GENERAL',
  add column if not exists resolved_at timestamptz,
  add column if not exists closed_at timestamptz;

create index if not exists support_conversations_assigned_idx
  on public.support_conversations(assigned_agent_id, status, priority);

create or replace function public.find_available_support_agent(p_category text default 'GENERAL')
returns table(agent_id uuid, display_name text)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if auth.uid() is null then raise exception 'authentication required'; end if;

  return query
  select p.user_id, a.display_name
  from public.agent_presence p
  join public.agents a on a.id = p.user_id
  where p.status = 'ONLINE'
    and coalesce(p.last_seen_at, to_timestamp(0)) > now() - interval '2 minutes'
    and p.active_conversations < p.max_conversations
    and (p.specialty is null or upper(p.specialty) = upper(coalesce(p_category, 'GENERAL')))
  order by p.active_conversations asc, p.last_seen_at desc
  limit 1;
end;
$$;

revoke all on function public.find_available_support_agent(text) from public;
grant execute on function public.find_available_support_agent(text) to authenticated;

create or replace function public.request_human_support(
  p_subject text,
  p_category text default 'GENERAL',
  p_booking_id uuid default null
)
returns table(conversation_id uuid, assigned_agent_id uuid, assigned_agent_name text, queued boolean)
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_user uuid := auth.uid();
  v_conversation uuid;
  v_agent uuid;
  v_agent_name text;
begin
  if v_user is null then raise exception 'authentication required'; end if;

  select p.user_id, a.display_name
  into v_agent, v_agent_name
  from public.agent_presence p
  join public.agents a on a.id = p.user_id
  where p.status = 'ONLINE'
    and coalesce(p.last_seen_at, to_timestamp(0)) > now() - interval '2 minutes'
    and p.active_conversations < p.max_conversations
    and (p.specialty is null or upper(p.specialty) = upper(coalesce(p_category, 'GENERAL')))
  order by p.active_conversations asc, p.last_seen_at desc
  limit 1;

  insert into public.support_conversations(
    booking_id, subject, status, created_by, assigned_agent_id, category, priority
  )
  values (
    p_booking_id, left(coalesce(p_subject, 'Expodia support'), 200),
    case when v_agent is null then 'PENDING' else 'OPEN' end,
    v_user, v_agent, upper(coalesce(p_category, 'GENERAL')),
    'NORMAL'
  )
  returning id into v_conversation;

  insert into public.support_conversation_participants(conversation_id, user_id, participant_type)
  values (v_conversation, v_user, 'TRAVELER');

  if v_agent is not null then
    insert into public.support_conversation_participants(conversation_id, user_id, participant_type)
    values (v_conversation, v_agent, 'AGENT')
    on conflict do nothing;
    update public.agent_presence
      set active_conversations = active_conversations + 1, updated_at = now()
      where user_id = v_agent;
  end if;

  return query select v_conversation, v_agent, v_agent_name, (v_agent is null);
end;
$$;

revoke all on function public.request_human_support(text,text,uuid) from public;
grant execute on function public.request_human_support(text,text,uuid) to authenticated;

create or replace function public.set_agent_presence(
  p_status text,
  p_specialty text default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  if not exists (select 1 from public.agents where id = auth.uid()) then
    raise exception 'agent access required';
  end if;
  insert into public.agent_presence(user_id,status,specialty,last_seen_at)
  values (auth.uid(), upper(p_status), nullif(trim(p_specialty), ''), now())
  on conflict (user_id) do update set
    status = excluded.status,
    specialty = excluded.specialty,
    last_seen_at = now(),
    updated_at = now();
  return true;
end;
$$;

revoke all on function public.set_agent_presence(text,text) from public;
grant execute on function public.set_agent_presence(text,text) to authenticated;
