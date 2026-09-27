export type AviationDataKind =
  | 'LIVE'
  | 'HISTORICAL'
  | 'STATISTICS'
  | 'NEWS'
  | 'ANALYSIS'
  | 'REFERENCE';

export type AviationSourceKind =
  | 'AIRPORT_REFERENCE'
  | 'AIRLINE_REFERENCE'
  | 'AIRCRAFT_REFERENCE'
  | 'FLIGHT_TRACKING'
  | 'AVIATION_NEWS'
  | 'AVIATION_STATISTICS';

export interface AviationSource {
  id: string;
  name: string;
  kind: AviationSourceKind;
  baseUrl: string;
  configured: boolean;
  authoritativeFor: readonly string[];
}

export interface AviationFact {
  id: string;
  kind: AviationDataKind;
  title: string;
  summary: string;
  sourceId: string;
  sourceUrl: string;
  observedAt?: string;
  publishedAt?: string;
  periodStart?: string;
  periodEnd?: string;
  metric?: string;
  value?: number;
  unit?: string;
  geography?: string;
}

export interface AviationIntelligenceSnapshot {
  generatedAt: string;
  sources: AviationSource[];
  facts: AviationFact[];
  liveDataAvailable: boolean;
  bookingProviderAvailable: boolean;
}
