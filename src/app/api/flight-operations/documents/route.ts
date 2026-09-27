import { NextResponse } from 'next/server';
import { getCanonicalDocumentSpecifications } from '@/lib/flight-operations/document-registry';

export async function GET() {
  const records = getCanonicalDocumentSpecifications();

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    records,
    count: records.length,
  }, {
    headers: { 'cache-control': 'no-store' },
  });
}
