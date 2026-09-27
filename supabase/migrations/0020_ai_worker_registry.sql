create table if not exists public.ai_worker_registry (
  id uuid primary key default gen_random_uuid(),
  worker_key text not null unique,
  capability text not null,
  status text not null default 'READY' check (status in ('READY','ACTIVE','PAUSED','ERROR')),
  runtime text not null,
  visibility text not null default 'INTERNAL' check (visibility='INTERNAL'),
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ai_worker_registry enable row level security;
drop policy if exists "ai_worker_registry_no_public_access" on public.ai_worker_registry;
create policy "ai_worker_registry_no_public_access" on public.ai_worker_registry
for all to anon, authenticated using (false) with check (false);

insert into public.ai_worker_registry(worker_key,capability,status,runtime,description) values
('travel_research','Current travel research','READY','Cloudflare Agents + web research','Find and verify current travel information from primary sources.'),
('browser_operator','Rendered browser research and provider workflows','READY','Cloudflare Browser Run','Navigate dynamic sites and extract information; sensitive actions require human approval.'),
('inventory_verifier','Travel inventory verification','READY','Provider APIs + Cloudflare Agents','Normalize and verify provider-supplied inventory without fabricating availability.'),
('flight_intelligence','Flight status and route intelligence','READY','Aviation provider + Cloudflare Agents','Process verified flight and airport data.'),
('document_intelligence','Travel document extraction and preparation','READY','Supabase Storage + document services','Extract, validate and prepare document workflows.'),
('support_triage','Virtual Agent support routing','READY','Cloudflare Agents + Supabase Realtime','Classify traveler requests and route eligible conversations to human professionals.'),
('source_verifier','Source and claim verification','READY','OpenAI + web research','Check important travel claims and attach provenance.'),
('trip_coordinator','Trip workspace coordination','READY','Cloudflare Agents + Supabase','Coordinate journey data, tasks and group travel context.')
on conflict(worker_key) do update set capability=excluded.capability,runtime=excluded.runtime,description=excluded.description,updated_at=now();
