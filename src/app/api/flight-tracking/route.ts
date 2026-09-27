import { NextResponse } from 'next/server';
import { getAviationSources } from '@/lib/aviation/registry';

export async function GET(request: Request) {
  const flight = new URL(request.url).searchParams.get('flight')?.trim().toUpperCase();

  if (!flight) {
    return NextResponse.json(
      { status: 'unavailable', message: 'Enter a flight number.' },
      { status: 400, headers: { 'cache-control': 'no-store' } },
    );
  }

  const trackingSource = getAviationSources().find((source) => source.kind === 'FLIGHT_TRACKING');

  if (!trackingSource?.configured) {
    return NextResponse.json(
      { status: 'unavailable', message: 'Flight tracking is currently unavailable.' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }

  return NextResponse.json(
    {
      status: 'unavailable',
      message: 'The configured tracking source requires its provider-specific adapter before live flight data can be returned.',
    },
    { status: 503, headers: { 'cache-control': 'no-store' } },
  );
}
