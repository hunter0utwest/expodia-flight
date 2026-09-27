-- Security hardening for traveler RPCs and management marketplace tables.

revoke execute on function public.create_traveler_support_conversation(text, uuid) from public;
grant execute on function public.create_traveler_support_conversation(text, uuid) to authenticated;
revoke execute on function public.set_traveler_security(text) from public;
grant execute on function public.set_traveler_security(text) to authenticated;
revoke execute on function public.verify_traveler_security(text) from public;
grant execute on function public.verify_traveler_security(text) to authenticated;
revoke execute on function public.find_traveler_by_username(text) from public;
grant execute on function public.find_traveler_by_username(text) to authenticated;

drop policy if exists "company_admin_marketplace_providers_select" on public.marketplace_providers;
drop policy if exists "company_admin_marketplace_providers_insert" on public.marketplace_providers;
drop policy if exists "company_admin_marketplace_providers_update" on public.marketplace_providers;
drop policy if exists "company_admin_partner_tasks_select" on public.partner_onboarding_tasks;
drop policy if exists "company_admin_partner_tasks_insert" on public.partner_onboarding_tasks;
drop policy if exists "company_admin_partner_tasks_update" on public.partner_onboarding_tasks;

create policy "company_admin_marketplace_providers_select" on public.marketplace_providers
for select to authenticated using (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));
create policy "company_admin_marketplace_providers_insert" on public.marketplace_providers
for insert to authenticated with check (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));
create policy "company_admin_marketplace_providers_update" on public.marketplace_providers
for update to authenticated using (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())))
with check (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));

create policy "company_admin_partner_tasks_select" on public.partner_onboarding_tasks
for select to authenticated using (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));
create policy "company_admin_partner_tasks_insert" on public.partner_onboarding_tasks
for insert to authenticated with check (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));
create policy "company_admin_partner_tasks_update" on public.partner_onboarding_tasks
for update to authenticated using (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())))
with check (exists (select 1 from public.company_admins a where a.user_id=(select auth.uid())));
