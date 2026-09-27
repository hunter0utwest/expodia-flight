import Link from 'next/link';

const topics = [
  ['New airlines', 'Airline launches and operating developments from published sources.'],
  ['New routes', 'Route additions and network changes with source and publication context.'],
  ['Aircraft', 'Aircraft, fleet and aviation technology developments.'],
  ['Airports', 'Airport developments, operations and passenger information.'],
  ['World aviation', 'Aviation developments organized by region and subject.'],
  ['Aviation archive', 'Real historical events, records and published aviation material.'],
];

export default function AviationPublicPage() {
  return (
    <main className="publicPage">
      <header className="publicHeader"><Link href="/" className="publicBrand">Expodia Flights</Link><nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/track">Track</Link><Link href="/traveler">My journeys</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav></header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">AVIATION INTELLIGENCE</div><h1>What is changing in aviation?</h1>
        <p>Explore published aviation developments, real historical material and source-linked information around airlines, routes, aircraft and airports.</p>
        <div className="journeyCards">{topics.map(([title, text]) => <article className="discoveryCard" key={title}><span>AVIATION</span><strong>{title}</strong><small>{text}</small></article>)}</div>
      </section>
    </main>
  );
}
