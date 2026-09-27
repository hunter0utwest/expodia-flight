create table if not exists public.management_settings (
 key text primary key,
 value text,
 updated_at timestamptz not null default now(),
 updated_by uuid references auth.users(id)
);
alter table public.management_settings enable row level security;
drop policy if exists "admins manage management settings" on public.management_settings;
create policy "admins manage management settings" on public.management_settings for all to authenticated
using (exists(select 1 from public.company_admins a where a.user_id=(select auth.uid())))
with check (exists(select 1 from public.company_admins a where a.user_id=(select auth.uid())));
insert into public.management_settings(key,value) values('partner_account_email',null) on conflict(key) do nothing;
