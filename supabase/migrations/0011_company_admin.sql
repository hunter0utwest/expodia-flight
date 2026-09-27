create table if not exists public.company_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.company_admins enable row level security;

drop policy if exists "admins read own admin profile" on public.company_admins;
create policy "admins read own admin profile" on public.company_admins
for select to authenticated
using (user_id = (select auth.uid()));

create table if not exists public.admin_agent_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  short_message text not null,
  status text not null default 'PENDING' check (status in ('PENDING','REVIEWED','DECLINED')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.company_admins(user_id)
);

alter table public.admin_agent_applications enable row level security;

drop policy if exists "admins manage applications" on public.admin_agent_applications;
create policy "admins manage applications" on public.admin_agent_applications
for all to authenticated
using (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())));

create or replace function public.create_agent_referral_code(
  p_intended_email text default null,
  p_expires_at timestamptz default null,
  p_max_redemptions integer default 1
)
returns table (referral_code text, expires_at timestamptz, max_redemptions integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  raw_code text;
  exp timestamptz := p_expires_at;
begin
  if uid is null or not exists (select 1 from public.company_admins where user_id = uid) then
    raise exception 'Not authorized';
  end if;
  if p_max_redemptions < 1 or p_max_redemptions > 100 then raise exception 'Invalid redemption limit'; end if;
  if exp is not null and exp <= now() then raise exception 'Expiry must be in the future'; end if;

  raw_code := lpad((100000 + floor(random() * 900000))::int::text, 6, '0');

  insert into public.agent_registration_codes(code_hash, intended_email, expires_at, max_redemptions, label)
  values (encode(digest(raw_code, 'sha256'), 'hex'), nullif(lower(trim(p_intended_email)), ''), exp, p_max_redemptions, 'Management-issued referral');

  return query select raw_code, exp, p_max_redemptions;
end;
$$;

revoke execute on function public.create_agent_referral_code(text,timestamptz,integer) from public, anon;
grant execute on function public.create_agent_referral_code(text,timestamptz,integer) to authenticated;


grant select on public.agent_applications to authenticated;
drop policy if exists "admins read agent applications" on public.agent_applications;
create policy "admins read agent applications"
on public.agent_applications for select to authenticated
using (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())));

grant select on public.agent_registration_codes to authenticated;
drop policy if exists "admins read referral codes" on public.agent_registration_codes;
create policy "admins read referral codes"
on public.agent_registration_codes for select to authenticated
using (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())));

drop policy if exists "admins update referral codes" on public.agent_registration_codes;
create policy "admins update referral codes"
on public.agent_registration_codes for update to authenticated
using (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())))
with check (exists (select 1 from public.company_admins a where a.user_id = (select auth.uid())));
