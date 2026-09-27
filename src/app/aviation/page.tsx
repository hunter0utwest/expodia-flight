import { AppShell } from '@/components/app-shell/AppShell';
import { getAviationIntelligenceSnapshot } from '@/lib/aviation/intelligence';

const sections = [
  ['NOW', 'Current aviation developments and operational information.'],
  ['TRENDING', 'Topics receiving significant attention from connected sources.'],
  ['NEW', 'New airlines, routes, aircraft and airport developments.'],
  ['AIRLINES', 'Airline announcements, route and fleet changes.'],
  ['AIRPORTS', 'Airport reference and operational intelligence.'],
  ['AIRCRAFT', 'Aircraft and fleet information from connected sources.'],
  ['WORLD', 'Aviation developments organized geographically.'],
  ['DID YOU KNOW?', 'Verified aviation facts with source attribution.'],
] as const;

export default function AviationPage() {
  const snapshot = getAviationIntelligenceSnapshot();
  const configured = snapshot.sources.filter((source) => source.configured).length;

  return (
    <AppShell currentPath="/aviation">
      <section className="content">
        <div className="pageIntro">
          <div>
            <h1>Aviation intelligence</h1>
            <p className="subtitle">
              Verified aviation information, kept separate from booking inventory and clearly attributed to its source.
            </p>
          </div>
        </div>

        <div className="grid" aria-label="Aviation data availability">
          <div className="card">
            <div className="metricLabel">Connected sources</div>
            <div className="metricValue">{configured}</div>
          </div>
          <div className="card">
            <div className="metricLabel">Live aviation data</div>
            <div className="metricValue">{snapshot.liveDataAvailable ? 'Available' : 'Unavailable'}</div>
          </div>
          <div className="card">
            <div className="metricLabel">Booking provider</div>
            <div className="metricValue">{snapshot.bookingProviderAvailable ? 'Connected' : 'Not configured'}</div>
          </div>
          <div className="card">
            <div className="metricLabel">Verified facts loaded</div>
            <div className="metricValue">{snapshot.facts.length}</div>
          </div>
        </div>

        {!configured && (
          <div className="notice" role="status">
            No aviation intelligence source is configured. Expodia will not fabricate news, statistics, airport records, airline activity or live aircraft movements. Connect an authorized source before publishing aviation data.
          </div>
        )}

        <div className="grid" aria-label="Aviation intelligence sections">
          {sections.map(([title, description]) => (
            <article className="card" key={title}>
              <div className="metricLabel">{title}</div>
              <p>{description}</p>
              <div className="empty">No verified source data is currently available for this section.</div>
            </article>
          ))}
        </div>

        <div className="panel card">
          <div className="panelHeader"><h2 className="panelTitle">Source boundaries</h2></div>
          <div className="empty">
            Each source is responsible only for the aviation information it is authoritative for. Booking inventory, live tracking, airport reference data, airline data, statistics and external news are not interchangeable datasets.
          </div>
        </div>
      </section>
    </AppShell>
  );
}
