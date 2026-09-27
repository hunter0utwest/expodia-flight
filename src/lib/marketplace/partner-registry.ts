export type PartnerCategory = 'STAYS' | 'ACTIVITIES' | 'CAR_RENTAL' | 'INSURANCE' | 'TRANSFERS' | 'OTHER';

export interface PartnerOffer {
  id: string;
  partner: string;
  category: PartnerCategory;
  destination?: string;
  title: string;
  targetUrl: string;
  trackingUrl?: string;
  commissionModel?: 'AFFILIATE' | 'REFERRAL' | 'LEAD' | 'NONE';
  termsUrl?: string;
  verifiedAt: string;
  status: 'ACTIVE' | 'PAUSED' | 'REQUIRES_REVIEW';
}

const partners: PartnerOffer[] = [];

export function getActivePartnerOffers(): PartnerOffer[] {
  return partners.filter((offer) => offer.status === 'ACTIVE');
}
