import Link from 'next/link';

export default function PublicTrackingPage() {
  return (
    <main className="publicPage">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/aviation">Aviation</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav>
      </header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">FLIGHT TRACKING</div>
        <h1>Follow a flight.</h1>
        <p>Enter a flight identifier to retrieve operational information from an authorized tracking source. Expodia will never turn missing live data into a guessed status.</p>
        <form className="trackForm">
          <input aria-label="Flight number" placeholder="Flight number, e.g. BA75" />
          <button className="publicPrimary" type="button" disabled>Track when live source is connected</button>
        </form>
        <div className="truthNote">Live tracking is currently unavailable until an approved tracking provider is configured.</div>
      </section>
    </main>
  );
}
