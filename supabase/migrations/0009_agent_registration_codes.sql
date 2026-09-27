create table if not exists public.agent_registration_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  label text,
  expires_at timestamptz,
  revoked_at timestamptz,
  max_redemptions integer not null default 1 check (max_redemptions > 0),
  redemption_count integer not null default 0 check (redemption_count >= 0),
  created_at timestamptz not null default now()
);

alter table public.agent_registration_codes enable row level security;
revoke all on table public.agent_registration_codes from anon, authenticated;

create or replace function public.verify_agent_registration_code(p_code text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_id uuid;
begin
  if p_code is null or p_code !~ '^[0-9]{6}$' then
    return false;
  end if;

  select id into matched_id
  from public.agent_registration_codes
  where code_hash = encode(digest(p_code, 'sha256'), 'hex')
    and revoked_at is null
    and (expires_at is null or expires_at > now())
    and redemption_count < max_redemptions
  for update skip locked
  limit 1;

  if matched_id is null then
    return false;
  end if;

  update public.agent_registration_codes
  set redemption_count = redemption_count + 1
  where id = matched_id;

  return true;
end;
$$;

revoke execute on function public.verify_agent_registration_code(text) from public, anon;
grant execute on function public.verify_agent_registration_code(text) to anon, authenticated;
