drop policy if exists "verification records deny direct public access" on public.verification_records;
create policy "verification records deny direct public access" on public.verification_records
  for all to anon, authenticated
  using (false)
  with check (false);
