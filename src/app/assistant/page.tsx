'use client';

import Link from 'next/link';
import { useState } from 'react';

const replies: Record<string, string> = {
  track: 'I can take you to Flight Tracking. Live status is shown only when an authorized tracking source is available.',
  explore: 'I can take you to Flight Discovery, where you can explore the flight-search experience and route information.',
  aviation: 'I can take you to Aviation Intelligence for verified airline, airport, aircraft and route developments.',
  journey: 'I can take you to My Journeys for saved flights, imported history and supported journey notifications.',
};

export default function AssistantPage() {
  const [reply, setReply] = useState('I can help you find your way around Expodia Flights. Choose what you need.');
  return (
    <main className="publicPage">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/tracking">Track</Link><Link href="/aviation">Aviation</Link><Link href="/traveler">My journeys</Link></nav>
      </header>
      <section className="assistantPage">
        <div className="assistantBadge"><span /> EXPODIA VIRTUAL AGENT</div>
        <h1>How can I help you?</h1>
        <p>Navigation and travel support for the Expodia website. It does not invent live flight information or execute bookings.</p>
        <div className="assistantOptions">
          {Object.entries({track:'Track a flight',explore:'Explore flights',aviation:'Aviation intelligence',journey:'My journeys'}).map(([key,label]) => <button key={key} onClick={() => setReply(replies[key])}>{label}</button>)}
        </div>
        <div className="assistantReply">{reply}</div>
      </section>
    </main>
  );
}
