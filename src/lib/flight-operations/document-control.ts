export type VerificationState =
  | 'DISCOVERED'
  | 'IDENTIFIED'
  | 'SOURCE_VERIFIED'
  | 'AUTHENTICITY_VERIFIED'
  | 'CURRENT_USE_VERIFIED'
  | 'SPECIFICATION_EXTRACTED'
  | 'INDEPENDENTLY_VALIDATED'
  | 'CANONICAL'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'REQUIRES_REVIEW';

export type DocumentLifecycle =
  | 'RESEARCH_REQUIRED'
  | 'CHECKING_EXISTING_RECORD'
  | 'UPDATE_CHECK'
  | 'AUTHENTICATING'
  | 'AWAITING_VERIFICATION'
  | 'DOCUMENT_GENERATION'
  | 'VALIDATING'
  | 'READY_FOR_DOWNLOAD'
  | 'FAILED_VALIDATION'
  | 'REQUIRES_HUMAN_REVIEW';

export interface EvidenceRecord {
  id: string;
  sourceUrl: string;
  publisher: string;
  sourceType: 'ISSUER' | 'GOVERNMENT' | 'AIRLINE' | 'AIRPORT' | 'AVIATION_AUTHORITY' | 'INDUSTRY_STANDARD' | 'NEWS' | 'OTHER';
  title: string;
  publishedAt?: string;
  retrievedAt: string;
  notes?: string;
}

export interface DocumentSpecification {
  id: string;
  documentType: string;
  jurisdiction: string;
  issuingParty: string;
  version: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'PROPOSED' | 'UNKNOWN';
  effectiveFrom?: string;
  effectiveUntil?: string;
  verificationState: VerificationState;
  verifiedAt?: string;
  dimensionsMm?: { width: number; height: number };
  orientation?: 'PORTRAIT' | 'LANDSCAPE';
  requiredFields: readonly string[];
  machineReadableElements: readonly string[];
  evidence: readonly EvidenceRecord[];
  supersedesId?: string;
}

export interface PassengerReadinessItem {
  key: string;
  label: string;
  status: 'READY' | 'PENDING' | 'NOT_APPLICABLE' | 'REQUIRES_REVIEW';
  source?: string;
  lastVerifiedAt?: string;
}

export interface PassengerReadiness {
  booking: PassengerReadinessItem;
  ticket: PassengerReadinessItem;
  checkIn: PassengerReadinessItem;
  boardingPass: PassengerReadinessItem;
  passport: PassengerReadinessItem;
  visa: PassengerReadinessItem;
  transit: PassengerReadinessItem;
  baggage: PassengerReadinessItem;
  seat: PassengerReadinessItem;
  airport: PassengerReadinessItem;
  destinationEntry: PassengerReadinessItem;
  documentPackage: PassengerReadinessItem;
}

export interface SeatChangeRequest {
  bookingId: string;
  passengerId: string;
  requestedSeat: string;
  previousOccupantPassengerId: string;
  status: 'PENDING_AIRLINE_ACTION' | 'CONFIRMED' | 'DECLINED' | 'REQUIRES_REVIEW';
  createdAt: string;
  staffNote?: string;
}

export function canRenderFromSpecification(specification: DocumentSpecification): boolean {
  return specification.status === 'ACTIVE'
    && specification.verificationState === 'ACTIVE'
    && specification.evidence.length > 0;
}
