import Link from 'next/link';

export default function ExplorePage() {
  return (
    <main className="publicPage">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav"><Link href="/">Home</Link><Link href="/tracking">Track</Link><Link href="/aviation">Aviation</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav>
      </header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">FLIGHT DISCOVERY</div>
        <h1>Explore flights and routes.</h1>
        <p>Search becomes live when an approved production flight provider is connected. Until then, Expodia keeps the interface honest and does not manufacture availability or fares.</p>
        <div className="searchShell">
          <div><span>From</span><strong>IATA</strong></div>
          <div><span>To</span><strong>IATA</strong></div>
          <div><span>Departure</span><strong>Select date</strong></div>
          <button className="publicPrimary" type="button" disabled>Search when provider is connected</button>
        </div>
      </section>
      <section className="publicSection compactGrid">
        <Link href="/tracking" className="discoveryCard"><span>TRACK</span><strong>Follow a flight</strong><small>Flight status and movement when live data is available →</small></Link>
        <Link href="/aviation" className="discoveryCard"><span>AVIATION</span><strong>See what is changing</strong><small>Airlines, routes, airports, aircraft and verified developments →</small></Link>
        <Link href="/traveler" className="discoveryCard"><span>JOURNEYS</span><strong>Keep your flights</strong><small>Save or import flight history and follow important journeys →</small></Link>
      </section>
    </main>
  );
}
