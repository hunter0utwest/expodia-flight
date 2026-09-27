import Link from 'next/link';

export default function ExplorePage() {
  return (
    <main className="publicPage">
      <header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><nav className="publicNav"><Link href="/">Home</Link><Link href="/track">Track</Link><Link href="/aviation-public">Aviation</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav></header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">FLIGHT DISCOVERY</div><h1>Explore flights and routes.</h1>
        <p>Search flights, compare available itineraries and continue into a booking flow when a production flight source is available.</p>
        <div className="searchShell"><div><span>From</span><strong>IATA</strong></div><div><span>To</span><strong>IATA</strong></div><div><span>Departure</span><strong>Select date</strong></div><button className="publicPrimary" type="button" disabled>Search flights</button></div>
      </section>
      <section className="publicSection compactGrid">
        <Link href="/track" className="discoveryCard"><span>TRACK</span><strong>Follow a flight</strong><small>Flight status and movement from a connected live source.</small></Link>
        <Link href="/aviation-public" className="discoveryCard"><span>AVIATION</span><strong>See what is changing</strong><small>Airlines, routes, airports, aircraft and aviation history.</small></Link>
        <Link href="/traveler" className="discoveryCard"><span>JOURNEYS</span><strong>Keep your flights</strong><small>Save or import flight history and follow important journeys.</small></Link>
      </section>
    </main>
  );
}
