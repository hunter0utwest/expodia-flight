-- Production sync for management access and marketplace partner registry.
create table if not exists public.company_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.company_admins enable row level security;
drop policy if exists "admins read own admin profile" on public.company_admins;
create policy "admins read own admin profile" on public.company_admins for select to authenticated using (user_id=(select auth.uid()));

create or replace function public.create_agent_referral_code(
 p_intended_email text default null,p_expires_at timestamptz default null,p_max_redemptions integer default 1
) returns table(referral_code text,expires_at timestamptz,max_redemptions integer)
language plpgsql security definer set search_path=public,pg_catalog as $$
declare uid uuid:=auth.uid(); raw_code text; exp timestamptz:=p_expires_at;
begin
 if uid is null or not exists(select 1 from public.company_admins where user_id=uid) then raise exception 'Not authorized'; end if;
 if p_max_redemptions<1 or p_max_redemptions>100 then raise exception 'Invalid redemption limit'; end if;
 if exp is not null and exp<=now() then raise exception 'Expiry must be in the future'; end if;
 loop
  raw_code:=lpad((100000+(get_byte(gen_random_bytes(4),0)*16777216+get_byte(gen_random_bytes(4),1)*65536+get_byte(gen_random_bytes(4),2)*256+get_byte(gen_random_bytes(4),3))%900000)::int::text,6,'0');
  exit when not exists(select 1 from public.agent_registration_codes where code_hash=encode(digest(raw_code,'sha256'),'hex'));
 end loop;
 insert into public.agent_registration_codes(code_hash,intended_email,expires_at,max_redemptions,label)
 values(encode(digest(raw_code,'sha256'),'hex'),nullif(lower(trim(p_intended_email)),''),exp,p_max_redemptions,'Management-issued referral');
 return query select raw_code,exp,p_max_redemptions;
end; $$;
revoke execute on function public.create_agent_referral_code(text,timestamptz,integer) from public,anon;
grant execute on function public.create_agent_referral_code(text,timestamptz,integer) to authenticated;

insert into public.marketplace_providers(name,category,website_url,api_status,account_status,referral_enabled)
values
('Airbnb','VACATION_RENTAL','https://www.airbnb.com/','APPLICATION_REQUIRED','NOT_STARTED',false),
('Vrbo','VACATION_RENTAL','https://www.vrbo.com/','APPLICATION_REQUIRED','NOT_STARTED',false),
('Expedia','STAY','https://www.expedia.com/','APPLICATION_REQUIRED','NOT_STARTED',false),
('Booking.com','STAY','https://www.booking.com/','APPLICATION_REQUIRED','NOT_STARTED',false)
on conflict(name) do nothing;
