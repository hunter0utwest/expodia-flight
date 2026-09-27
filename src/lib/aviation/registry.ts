import type { AviationSource } from './contracts';

export function getAviationSources(): AviationSource[] {
  return [
    {
      id: 'flight-tracking',
      name: process.env.FLIGHT_TRACKING_PROVIDER_NAME || 'Flight tracking provider',
      kind: 'FLIGHT_TRACKING',
      baseUrl: process.env.FLIGHT_TRACKING_PROVIDER_API_BASE_URL || '',
      configured: Boolean(
        process.env.FLIGHT_TRACKING_PROVIDER_NAME &&
        process.env.FLIGHT_TRACKING_PROVIDER_API_BASE_URL &&
        process.env.FLIGHT_TRACKING_PROVIDER_API_KEY,
      ),
      authoritativeFor: ['live aircraft position', 'operational flight status'],
    },
    {
      id: 'airport-reference',
      name: process.env.AIRPORT_DATA_PROVIDER_NAME || 'Airport reference provider',
      kind: 'AIRPORT_REFERENCE',
      baseUrl: process.env.AIRPORT_DATA_PROVIDER_API_BASE_URL || '',
      configured: Boolean(
        process.env.AIRPORT_DATA_PROVIDER_NAME &&
        process.env.AIRPORT_DATA_PROVIDER_API_BASE_URL &&
        process.env.AIRPORT_DATA_PROVIDER_API_KEY,
      ),
      authoritativeFor: ['airport identity', 'IATA', 'ICAO', 'coordinates'],
    },
    {
      id: 'airline-reference',
      name: process.env.AIRLINE_DATA_PROVIDER_NAME || 'Airline reference provider',
      kind: 'AIRLINE_REFERENCE',
      baseUrl: process.env.AIRLINE_DATA_PROVIDER_API_BASE_URL || '',
      configured: Boolean(
        process.env.AIRLINE_DATA_PROVIDER_NAME &&
        process.env.AIRLINE_DATA_PROVIDER_API_BASE_URL &&
        process.env.AIRLINE_DATA_PROVIDER_API_KEY,
      ),
      authoritativeFor: ['airline identity', 'airline codes', 'fleet reference'],
    },
    {
      id: 'aviation-news',
      name: process.env.AVIATION_NEWS_PROVIDER_NAME || 'Aviation news provider',
      kind: 'AVIATION_NEWS',
      baseUrl: process.env.AVIATION_NEWS_PROVIDER_API_BASE_URL || '',
      configured: Boolean(
        process.env.AVIATION_NEWS_PROVIDER_NAME &&
        process.env.AVIATION_NEWS_PROVIDER_API_BASE_URL &&
        process.env.AVIATION_NEWS_PROVIDER_API_KEY,
      ),
      authoritativeFor: ['reported aviation news and announcements'],
    },
    {
      id: 'aviation-statistics',
      name: process.env.AVIATION_STATISTICS_PROVIDER_NAME || 'Aviation statistics provider',
      kind: 'AVIATION_STATISTICS',
      baseUrl: process.env.AVIATION_STATISTICS_PROVIDER_API_BASE_URL || '',
      configured: Boolean(
        process.env.AVIATION_STATISTICS_PROVIDER_NAME &&
        process.env.AVIATION_STATISTICS_PROVIDER_API_BASE_URL &&
        process.env.AVIATION_STATISTICS_PROVIDER_API_KEY,
      ),
      authoritativeFor: ['provider-defined aviation statistics'],
    },
  ];
}
