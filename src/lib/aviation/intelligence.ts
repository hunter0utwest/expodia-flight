import type { AviationIntelligenceSnapshot } from './contracts';
import { getAviationSources } from './registry';

export function getAviationIntelligenceSnapshot(): AviationIntelligenceSnapshot {
  const sources = getAviationSources();

  return {
    generatedAt: new Date().toISOString(),
    sources,
    facts: [],
    liveDataAvailable: sources.some((source) => source.kind === 'FLIGHT_TRACKING' && source.configured),
    bookingProviderAvailable: Boolean(
      process.env.FLIGHT_PROVIDER_NAME &&
      process.env.FLIGHT_PROVIDER_API_BASE_URL &&
      process.env.FLIGHT_PROVIDER_API_KEY,
    ),
  };
}
