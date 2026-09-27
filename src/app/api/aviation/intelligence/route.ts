import { NextResponse } from 'next/server';
import { getAviationIntelligenceSnapshot } from '@/lib/aviation/intelligence';

export async function GET() {
  const snapshot = getAviationIntelligenceSnapshot();
  return NextResponse.json(snapshot, {
    headers: { 'cache-control': 'no-store' },
  });
}
