create or replace function public.handle_new_traveler_profile()
returns trigger
language plpgsql
security definer
set search_path=public,pg_catalog
as $$
begin
  if coalesce(new.raw_user_meta_data->>'access_type','traveler')='traveler' then
    insert into public.traveler_profiles(user_id,username)
    values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'username'),''),'traveler_'||substr(replace(new.id::text,'-',''),1,10)))
    on conflict(user_id) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_traveler on auth.users;
create trigger on_auth_user_created_traveler
after insert on auth.users
for each row execute function public.handle_new_traveler_profile();
