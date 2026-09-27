import Link from 'next/link';

const discoveries = [
  { label: 'Aviation intelligence', text: 'Follow verified airline, airport, aircraft and route developments.', href: '/aviation' },
  { label: 'Flight tracking', text: 'Check a flight and follow its operational journey when live data is available.', href: '/tracking' },
  { label: 'Your journey', text: 'Save flights, import past journeys and receive journey notifications.', href: '/traveler' },
];

export default function HomePage() {
  return (
    <main className="publicHome">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav" aria-label="Main navigation">
          <Link href="/explore">Explore</Link>
          <Link href="/tracking">Track</Link>
          <Link href="/aviation">Aviation</Link>
          <Link href="/traveler">My journeys</Link>
          <Link href="/login" className="agentAccess">Agent Access</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="publicEyebrow">FLIGHTS · AVIATION · JOURNEYS</div>
          <h1>Know the flight.<br />Follow the journey.</h1>
          <p>Discover flights, follow aircraft movements, explore aviation developments and keep the journeys that matter to you in one place.</p>
          <div className="heroActions">
            <Link className="publicPrimary" href="/explore">Explore flights</Link>
            <Link className="publicSecondary" href="/tracking">Track a flight</Link>
          </div>
        </div>
        <div className="heroMap" aria-label="Global aviation map preview">
          <div className="mapGrid" />
          <div className="mapOrbit mapOrbitOne"><span /></div>
          <div className="mapOrbit mapOrbitTwo"><span /></div>
          <div className="mapLabel mapLabelOne">GLOBAL</div>
          <div className="mapLabel mapLabelTwo">LIVE DATA WHEN AVAILABLE</div>
        </div>
      </section>

      <section className="publicSection">
        <div className="sectionHeading">
          <div>
            <div className="publicEyebrow">WHAT'S HAPPENING</div>
            <h2>See the aviation world beyond the booking.</h2>
          </div>
          <Link href="/aviation">Open aviation intelligence →</Link>
        </div>
        <div className="discoveryGrid">
          {discoveries.map((item) => (
            <Link className="discoveryCard" href={item.href} key={item.href}>
              <span>{item.label}</span>
              <strong>{item.text}</strong>
              <small>Explore →</small>
            </Link>
          ))}
        </div>
        <div className="truthNote">
          Expodia only publishes connected, source-backed aviation information. If a live provider is unavailable, the interface says so rather than inventing flight status, fares or events.
        </div>
      </section>

      <section className="journeyStrip">
        <div>
          <div className="publicEyebrow">OPTIONAL TRAVELER SPACE</div>
          <h2>Keep your journeys. Not another booking dashboard.</h2>
          <p>Create a lightweight traveler space for saved flights, imported flight history and journey notifications. It is optional and separate from Agent Access.</p>
        </div>
        <Link className="publicSecondary" href="/traveler">Open My journeys</Link>
      </section>

      <footer className="publicFooter">
        <span>Expodia Flights</span>
        <span>Public discovery · Flight tracking · Journey intelligence</span>
        <Link href="/login">Agent Access</Link>
      </footer>

      <Link className="virtualAgentLauncher" href="/assistant" aria-label="Open Expodia Virtual Agent">
        <span className="agentPulse" />
        <span>Virtual Agent</span>
      </Link>
    </main>
  );
}
