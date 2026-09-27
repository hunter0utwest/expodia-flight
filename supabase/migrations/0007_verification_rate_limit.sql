create schema if not exists private;

create table if not exists private.verification_rate_limits (
  bucket_key text primary key,
  window_started_at timestamptz not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.consume_verification_rate_limit(
  p_bucket_key text,
  p_limit integer default 30,
  p_window_seconds integer default 60
) returns boolean
language plpgsql
security definer
set search_path = private, pg_catalog
as $$
declare
  current_window timestamptz := now();
  allowed boolean;
begin
  insert into verification_rate_limits(bucket_key, window_started_at, request_count, updated_at)
  values (p_bucket_key, current_window, 1, current_window)
  on conflict (bucket_key) do update
    set
      window_started_at = case
        when verification_rate_limits.window_started_at <= current_window - make_interval(secs => p_window_seconds)
        then current_window
        else verification_rate_limits.window_started_at
      end,
      request_count = case
        when verification_rate_limits.window_started_at <= current_window - make_interval(secs => p_window_seconds)
        then 1
        else verification_rate_limits.request_count + 1
      end,
      updated_at = current_window;

  select request_count <= p_limit into allowed
  from verification_rate_limits where bucket_key = p_bucket_key;
  return allowed;
end;
$$;

revoke all on function public.consume_verification_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_verification_rate_limit(text, integer, integer) to service_role;
revoke all on schema private from public, anon, authenticated;
revoke all on private.verification_rate_limits from public, anon, authenticated;
