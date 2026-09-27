create or replace function public.create_traveler_support_conversation(p_subject text, p_agent_user_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  uid uuid := auth.uid();
  cid uuid;
  selected_agent uuid := null;
begin
  if uid is null then raise exception 'Authentication required'; end if;

  if p_agent_user_id is not null
     and exists (
       select 1 from public.agent_presence p
       where p.user_id = p_agent_user_id
         and p.status = 'ONLINE'
         and coalesce(p.last_seen_at, to_timestamp(0)) > now() - interval '2 minutes'
     )
  then
    selected_agent := p_agent_user_id;
  end if;

  insert into public.support_conversations(created_by,subject,status,assigned_agent_id,category,priority)
  values(uid,nullif(trim(p_subject),''),case when selected_agent is null then 'PENDING' else 'OPEN' end,selected_agent,'GENERAL','NORMAL')
  returning id into cid;

  insert into public.support_conversation_participants(conversation_id,user_id,participant_type)
  values(cid,uid,'TRAVELER');

  if selected_agent is not null then
    insert into public.support_conversation_participants(conversation_id,user_id,participant_type)
    values(cid,selected_agent,'AGENT');
  end if;

  return cid;
end;
$$;

grant execute on function public.create_traveler_support_conversation(text,uuid) to authenticated;
