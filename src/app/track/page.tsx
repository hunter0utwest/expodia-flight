'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

type TrackingResponse = { status: 'ready' | 'processing' | 'unavailable'; message: string; flight?: { flightNumber: string; status: string; origin: string; destination: string; departure?: string; arrival?: string } };

export default function PublicTrackingPage() {
  const [flightNumber, setFlightNumber] = useState('');
  const [result, setResult] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = flightNumber.trim().toUpperCase();
    if (!value) return;
    setLoading(true); setResult(null);
    try {
      const response = await fetch(`/api/flight-tracking?flight=${encodeURIComponent(value)}`, { cache: 'no-store' });
      setResult(await response.json() as TrackingResponse);
    } catch {
      setResult({ status: 'unavailable', message: 'Flight tracking is currently unavailable.' });
    } finally { setLoading(false); }
  }

  const trackedFlight = result?.status === 'ready' ? result.flight : undefined;

  return (
    <main className="publicPage">
      <header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/aviation-public">Aviation</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav></header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">FLIGHT TRACKING</div><h1>Follow a flight.</h1><p>Enter a flight number to retrieve its current operational information.</p>
        <form className="trackForm" onSubmit={track}><input aria-label="Flight number" placeholder="Flight number, e.g. BA75" value={flightNumber} onChange={(event) => setFlightNumber(event.target.value)} autoCapitalize="characters" /><button className="publicPrimary" type="submit" disabled={loading || !flightNumber.trim()}>{loading ? 'Processing…' : 'Track flight'}</button></form>
        {trackedFlight && <article className="trackingResult"><div className="publicEyebrow">FLIGHT</div><h2>{trackedFlight.flightNumber}</h2><strong>{trackedFlight.status}</strong><p>{trackedFlight.origin} → {trackedFlight.destination}</p>{trackedFlight.departure && <small>Departure: {trackedFlight.departure}</small>}{trackedFlight.arrival && <small>Arrival: {trackedFlight.arrival}</small>}</article>}
        {result && result.status !== 'ready' && <div className="truthNote" role="status">{result.message}</div>}
        {trackedFlight && <div className="trackingActions"><button className="publicSecondary" type="button" onClick={() => { const blob = new Blob([JSON.stringify(trackedFlight, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${trackedFlight.flightNumber}-tracking.json`; a.click(); URL.revokeObjectURL(url); }}>Download result</button><button className="publicSecondary" type="button" onClick={() => window.print()}>Print / Save PDF</button></div>}
      </section>
    </main>
  );
}
