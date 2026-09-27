create table if not exists public.traveler_security_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pin_hash text not null,
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  locked_until timestamptz,
  last_unlock_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.traveler_security_profiles enable row level security;

drop policy if exists "traveler security own row" on public.traveler_security_profiles;
create policy "traveler security own row"
on public.traveler_security_profiles
for select using (user_id = auth.uid());

create or replace function public.set_traveler_security(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then raise exception 'Authentication required'; end if;
  if p_pin !~ '^[0-9]{4}$' then raise exception 'PIN must be exactly four digits'; end if;
  insert into public.traveler_security_profiles(user_id,pin_hash,failed_attempts,locked_until,updated_at)
  values(uid, extensions.crypt(p_pin, extensions.gen_salt('bf', 12)), 0, null, now())
  on conflict (user_id) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        updated_at = now();
  return true;
end;
$$;

create or replace function public.verify_traveler_security(p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
  uid uuid := auth.uid();
  row public.traveler_security_profiles%rowtype;
  valid boolean;
begin
  if uid is null then return false; end if;
  select * into row from public.traveler_security_profiles where user_id=uid for update;
  if not found then return false; end if;
  if row.locked_until is not null and row.locked_until > now() then return false; end if;

  valid := extensions.crypt(p_pin, row.pin_hash) = row.pin_hash;
  if valid then
    update public.traveler_security_profiles
      set failed_attempts=0, locked_until=null, last_unlock_at=now(), updated_at=now()
      where user_id=uid;
    return true;
  end if;

  update public.traveler_security_profiles
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else locked_until end,
        updated_at=now()
    where user_id=uid;
  return false;
end;
$$;

create or replace function public.find_traveler_by_username(p_username text)
returns table(user_id uuid, username text)
language sql
security definer
set search_path = public, pg_catalog
as $$
  select p.user_id, p.username
  from public.traveler_profiles p
  where auth.uid() is not null
    and lower(p.username) = lower(trim(p_username))
  limit 1
$$;

drop policy if exists "traveler_profiles_read" on public.traveler_profiles;
create policy "traveler_profiles_read"
on public.traveler_profiles
for select using (user_id = auth.uid());

grant execute on function public.set_traveler_security(text) to authenticated;
grant execute on function public.verify_traveler_security(text) to authenticated;
grant execute on function public.find_traveler_by_username(text) to authenticated;
