import { NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim() || '';
  const category = url.searchParams.get('category')?.trim() || '';
  const supabase = createSupabaseBrowserClient();
  let query = supabase.from('marketplace_listings')
    .select('id,provider_id,category,title,description,location_name,country_code,hero_image_url,gallery_image_urls,details,source_url,booking_url,price_amount,price_currency,price_period,availability_status,last_verified_at')
    .eq('active', true).order('updated_at', { ascending: false }).limit(48);
  if (q) query = query.or('title.ilike.%' + q + '%,location_name.ilike.%' + q + '%,description.ilike.%' + q + '%');
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Marketplace search unavailable' }, { status: 503 });
  return NextResponse.json(data || [], { headers: { 'cache-control': 'public, max-age=60, stale-while-revalidate=300' } });
}