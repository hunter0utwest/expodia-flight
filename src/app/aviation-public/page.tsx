import Link from 'next/link';

export default function AviationPublicPage() {
  const topics = [
    ['New airlines', 'Verified announcements about new airline operations and launches.'],
    ['New routes', 'Route additions and network changes from authoritative sources.'],
    ['Aircraft', 'New aircraft, fleet developments and aviation technology.'],
    ['Airports', 'Major airport developments and useful airport intelligence.'],
    ['World aviation', 'Important developments organized by region.'],
    ['Did you know?', 'Verified aviation facts with their source attached.'],
  ];
  return (
    <main className="publicPage">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/track">Track</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav>
      </header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">AVIATION INTELLIGENCE</div>
        <h1>What is changing in aviation?</h1>
        <p>Expodia brings together source-backed developments that help travelers understand the aviation world around their flights. “Trending” is used only when a connected source actually provides a trend signal.</p>
        <div className="journeyCards">{topics.map(([title, text]) => <article className="discoveryCard" key={title}><span>AVIATION</span><strong>{title}</strong><small>{text}</small></article>)}</div>
        <div className="truthNote">No connected aviation source is currently publishing data here. Nothing is fabricated to fill the page.</div>
      </section>
    </main>
  );
}
