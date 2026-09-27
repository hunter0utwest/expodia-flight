create extension if not exists pgcrypto;

-- Invitation codes remain private. The referral code must match the invited email
-- when an intended email was supplied by an Expodia administrator.
create or replace function public.verify_agent_registration_code(p_code text, p_email text default null)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  matched_id uuid;
begin
  if p_code is null or p_code !~ '^[0-9]{6}$' then return false; end if;

  select id into matched_id
  from public.agent_registration_codes
  where code_hash = encode(digest(p_code, 'sha256'), 'hex')
    and revoked_at is null
    and (expires_at is null or expires_at > now())
    and redemption_count < max_redemptions
    and (intended_email is null or lower(intended_email) = lower(coalesce(p_email, '')))
  for update skip locked
  limit 1;

  if matched_id is null then return false; end if;

  update public.agent_registration_codes
  set redemption_count = redemption_count + 1
  where id = matched_id;

  return true;
end;
$$;

revoke execute on function public.verify_agent_registration_code(text) from public, anon;
grant execute on function public.verify_agent_registration_code(text, text) to anon, authenticated;

create table if not exists public.agent_security_profiles (
  user_id uuid primary key references public.agents(id) on delete cascade,
  pin_salt text not null,
  pin_hash text not null,
  session_duration_minutes integer not null default 43200
    check (session_duration_minutes in (1440, 10080, 43200, 129600)),
  session_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.agent_security_profiles enable row level security;

drop policy if exists "agents read own security profile" on public.agent_security_profiles;
create policy "agents read own security profile"
on public.agent_security_profiles
for select to authenticated
using (user_id = (select auth.uid()));

revoke insert, update, delete on public.agent_security_profiles from anon, authenticated;

create or replace function public.set_agent_security(p_pin text, p_session_duration_minutes integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  salt text;
begin
  if uid is null or not exists (select 1 from public.agents where id = uid) then return false; end if;
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then return false; end if;
  if p_session_duration_minutes not in (1440, 10080, 43200, 129600) then return false; end if;

  salt := encode(gen_random_bytes(16), 'hex');

  insert into public.agent_security_profiles
    (user_id, pin_salt, pin_hash, session_duration_minutes, session_expires_at)
  values
    (uid, salt, encode(digest(salt || ':' || p_pin, 'sha256'), 'hex'),
     p_session_duration_minutes, now() + make_interval(mins => p_session_duration_minutes))
  on conflict (user_id) do update
    set pin_salt = excluded.pin_salt,
        pin_hash = excluded.pin_hash,
        session_duration_minutes = excluded.session_duration_minutes,
        session_expires_at = excluded.session_expires_at,
        updated_at = now();

  return true;
end;
$$;

revoke execute on function public.set_agent_security(text, integer) from public, anon;
grant execute on function public.set_agent_security(text, integer) to authenticated;

create or replace function public.verify_agent_security(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  row public.agent_security_profiles%rowtype;
begin
  if uid is null or p_pin is null or p_pin !~ '^[0-9]{4}$' then return false; end if;

  select * into row
  from public.agent_security_profiles
  where user_id = uid;

  if not found then return false; end if;
  if row.pin_hash <> encode(digest(row.pin_salt || ':' || p_pin, 'sha256'), 'hex') then return false; end if;

  update public.agent_security_profiles
  set session_expires_at = now() + make_interval(mins => session_duration_minutes),
      updated_at = now()
  where user_id = uid;

  return true;
end;
$$;

revoke execute on function public.verify_agent_security(text) from public, anon;
grant execute on function public.verify_agent_security(text) to authenticated;
