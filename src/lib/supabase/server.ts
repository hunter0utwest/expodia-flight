import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseConfig } from './config';

type CookieToSet = { name: string; value: string; options: Record<string, unknown> };

function setServerCookies(cookieStore: Awaited<ReturnType<typeof cookies>>, cookiesToSet: CookieToSet[]) {
  try {
    for (const cookie of cookiesToSet) {
      cookieStore.set(cookie.name, cookie.value, cookie.options);
    }
  } catch (error) {
    void error;
  }
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseConfig();

  const cookieAdapter = {
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet: CookieToSet[]) => setServerCookies(cookieStore, cookiesToSet),
  };

  return createServerClient(url, anonKey, { cookies: cookieAdapter });
}
