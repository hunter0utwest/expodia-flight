-- Expodia security/performance hardening.
-- Restrict agent-owned operational records to authenticated agents and add covering indexes.

drop policy if exists "agents read own profile" on public.agents;
create policy "agents read own profile" on public.agents
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "agents read own audit" on public.audit_events;
create policy "agents read own audit" on public.audit_events
  for select to authenticated
  using (agent_id = (select auth.uid()));

drop policy if exists "agents manage own booking passengers" on public.booking_passengers;
create policy "agents manage own booking passengers" on public.booking_passengers
  for insert to authenticated
  with check (exists (select 1 from public.bookings b where b.id = booking_passengers.booking_id and b.agent_id = (select auth.uid())));

drop policy if exists "agents read own booking passengers" on public.booking_passengers;
create policy "agents read own booking passengers" on public.booking_passengers
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_passengers.booking_id and b.agent_id = (select auth.uid())));

drop policy if exists "agents create own bookings" on public.bookings;
create policy "agents create own bookings" on public.bookings
  for insert to authenticated
  with check (agent_id = (select auth.uid()));

drop policy if exists "agents read own bookings" on public.bookings;
create policy "agents read own bookings" on public.bookings
  for select to authenticated
  using (agent_id = (select auth.uid()));

drop policy if exists "agents update own bookings" on public.bookings;
create policy "agents update own bookings" on public.bookings
  for update to authenticated
  using (agent_id = (select auth.uid()))
  with check (agent_id = (select auth.uid()));

drop policy if exists "agents manage own customers" on public.customers;
create policy "agents manage own customers" on public.customers
  for all to authenticated
  using (agent_id = (select auth.uid()))
  with check (agent_id = (select auth.uid()));

drop policy if exists "agents read own segments" on public.flight_segments;
create policy "agents read own segments" on public.flight_segments
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = flight_segments.booking_id and b.agent_id = (select auth.uid())));

drop policy if exists "agents read own notifications" on public.notifications;
create policy "agents read own notifications" on public.notifications
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = notifications.booking_id and b.agent_id = (select auth.uid())));

drop policy if exists "agents manage own passengers" on public.passengers;
create policy "agents manage own passengers" on public.passengers
  for insert to authenticated
  with check (exists (select 1 from public.customers c where c.id = passengers.customer_id and c.agent_id = (select auth.uid())));

drop policy if exists "agents read own passengers" on public.passengers;
create policy "agents read own passengers" on public.passengers
  for select to authenticated
  using (exists (select 1 from public.customers c where c.id = passengers.customer_id and c.agent_id = (select auth.uid())));

drop policy if exists "agents read own tickets" on public.tickets;
create policy "agents read own tickets" on public.tickets
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = tickets.booking_id and b.agent_id = (select auth.uid())));

drop policy if exists "public verification read active record" on public.verification_records;

create index if not exists agent_runs_agent_id_idx on public.agent_runs(agent_id);
create index if not exists agent_runs_search_id_idx on public.agent_runs(search_id);
create index if not exists audit_events_agent_id_idx on public.audit_events(agent_id);
create index if not exists booking_events_agent_id_idx on public.booking_events(agent_id);
create index if not exists booking_passengers_passenger_id_idx on public.booking_passengers(passenger_id);
create index if not exists bookings_customer_id_idx on public.bookings(customer_id);
create index if not exists cart_items_offer_id_idx on public.cart_items(offer_id);
create index if not exists customers_agent_id_idx on public.customers(agent_id);
create index if not exists documents_agent_id_idx on public.documents(agent_id);
create index if not exists external_references_agent_id_idx on public.external_references(agent_id);
create index if not exists flight_segments_booking_id_idx on public.flight_segments(booking_id);
create index if not exists notifications_booking_id_idx on public.notifications(booking_id);
create index if not exists notifications_passenger_id_idx on public.notifications(passenger_id);
create index if not exists payment_transactions_agent_id_idx on public.payment_transactions(agent_id);
create index if not exists tickets_booking_id_idx on public.tickets(booking_id);
create index if not exists tickets_booking_id_passenger_id_idx on public.tickets(booking_id, passenger_id);
create index if not exists tickets_passenger_id_idx on public.tickets(passenger_id);
create index if not exists verification_records_active_reference_idx on public.verification_records(verification_reference) where active = true;
