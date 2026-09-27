-- Traveler AI conversation persistence for the customer-facing Virtual Agent.
-- The application uses Supabase RLS so each traveler can access only their own AI history.

create table if not exists public.traveler_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  mode text not null default 'assistant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.traveler_ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.traveler_ai_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  body text not null,
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.traveler_ai_conversations enable row level security;
alter table public.traveler_ai_messages enable row level security;

drop policy if exists "traveler_ai_conversations_owner_select" on public.traveler_ai_conversations;
drop policy if exists "traveler_ai_conversations_owner_insert" on public.traveler_ai_conversations;
drop policy if exists "traveler_ai_conversations_owner_update" on public.traveler_ai_conversations;
drop policy if exists "traveler_ai_messages_owner_select" on public.traveler_ai_messages;
drop policy if exists "traveler_ai_messages_owner_insert" on public.traveler_ai_messages;

create policy "traveler_ai_conversations_owner_select" on public.traveler_ai_conversations
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "traveler_ai_conversations_owner_insert" on public.traveler_ai_conversations
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "traveler_ai_conversations_owner_update" on public.traveler_ai_conversations
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "traveler_ai_messages_owner_select" on public.traveler_ai_messages
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "traveler_ai_messages_owner_insert" on public.traveler_ai_messages
  for insert to authenticated with check ((select auth.uid()) = user_id);

create index if not exists traveler_ai_conversations_user_updated_idx
  on public.traveler_ai_conversations(user_id, updated_at desc);
create index if not exists traveler_ai_messages_conversation_created_idx
  on public.traveler_ai_messages(conversation_id, created_at);
