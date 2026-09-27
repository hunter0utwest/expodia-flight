export type ScanPayloadKind = 'TICKET' | 'BOOKING' | 'DOCUMENT' | 'TRACKING_REFERENCE';

export interface ScanPayload {
  version: 1;
  kind: ScanPayloadKind;
  issuer: string;
  reference: string;
  ticketNumber?: string;
  bookingReference?: string;
  expodiaReference?: string;
  issuedAt?: string;
  expiresAt?: string;
  signature: string;
}

export interface ScanResolution {
  kind: ScanPayloadKind;
  verified: boolean;
  displayMode: 'LOCAL_PAYLOAD' | 'APP_RESOLUTION' | 'CONTROLLED_WEB_RESOLUTION';
  data: Record<string, unknown>;
}

export function resolveScanPayload(payload: ScanPayload): ScanResolution {
  return {
    kind: payload.kind,
    verified: Boolean(payload.signature && payload.reference),
    displayMode: 'LOCAL_PAYLOAD',
    data: {
      issuer: payload.issuer,
      reference: payload.reference,
      ticketNumber: payload.ticketNumber,
      bookingReference: payload.bookingReference,
      expodiaReference: payload.expodiaReference,
      issuedAt: payload.issuedAt,
      expiresAt: payload.expiresAt,
    },
  };
}
