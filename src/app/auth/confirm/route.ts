import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;
  const next = url.searchParams.get('next') || '/traveler';

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL('/auth/callback?error=missing_confirmation', url.origin));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

  if (error) {
    return NextResponse.redirect(new URL('/auth/callback?error=invalid_confirmation', url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
