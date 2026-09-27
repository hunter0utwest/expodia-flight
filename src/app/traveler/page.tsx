import Link from 'next/link';

const features = [
  ['Saved flights', 'Keep upcoming flights and routes you want to follow.'],
  ['Flight history', 'Import your past flight history instead of entering every journey manually.'],
  ['Journey alerts', 'Receive notifications about supported flight and journey events.'],
];

export default function TravelerPage() {
  return (
    <main className="publicPage">
      <header className="publicHeader">
        <Link href="/" className="publicBrand">Expodia Flights</Link>
        <nav className="publicNav"><Link href="/explore">Explore</Link><Link href="/tracking">Track</Link><Link href="/aviation">Aviation</Link><Link href="/login" className="agentAccess">Agent Access</Link></nav>
      </header>
      <section className="publicSection publicPageIntro">
        <div className="publicEyebrow">MY JOURNEYS</div>
        <h1>Your flights, in one place.</h1>
        <p>This is intentionally lightweight. It is not the agent booking workspace: it is a personal place to save flights, import flight history and receive journey notifications.</p>
        <div className="journeyCards">
          {features.map(([title, text]) => <article className="discoveryCard" key={title}><span>JOURNEY</span><strong>{title}</strong><small>{text}</small></article>)}
        </div>
        <div className="journeyAction">
          <div><strong>Optional account</strong><span>Sign in only when you want your journeys saved across devices.</span></div>
          <Link className="publicSecondary" href="/login">Sign in / create traveler space</Link>
        </div>
      </section>
    </main>
  );
}
