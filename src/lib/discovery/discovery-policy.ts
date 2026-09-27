export type DiscoveryPriority = 'MUST_HAVE' | 'SHOULD_HAVE' | 'FUTURE';

export interface DiscoveryItem {
  id: string;
  title: string;
  sourceUrl: string;
  publisher: string;
  publishedAt?: string;
  retrievedAt: string;
  category: string;
  priority: DiscoveryPriority;
  status: 'ACTIVE' | 'EXPIRED' | 'REVIEW';
}

export const discoveryPolicy = {
  refreshCadenceMinutes: 1,
  mustHave: [
    'source-backed aviation and flight information',
    'source provenance',
    'publication/retrieval timestamps',
    'deduplication',
    'stale-content handling',
    'source failure handling',
    'safe public rendering',
  ],
  shouldHave: [
    'historical aviation archive',
    'recordings/video references',
    'route and airline developments',
    'airport developments',
    'marketplace/referral opportunities',
  ],
  future: [
    'automated commercial optimization',
    'additional affiliate partners',
    'personalized discovery ranking',
  ],
} as const;

export function isDisplayable(item: DiscoveryItem, now = Date.now()): boolean {
  if (item.status !== 'ACTIVE' || !item.sourceUrl || !item.publisher) return false;
  const retrieved = Date.parse(item.retrievedAt);
  if (Number.isNaN(retrieved)) return false;
  return now - retrieved < 1000 * 60 * 60 * 24 * 30;
}
