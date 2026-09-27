import { describe, expect, it } from 'vitest';
import { buildScanLookupKeys, buildControlledResolutionPath } from './scan-payload';

describe('scan identity resolution', () => {
  it('connects serial, provider and Expodia identifiers to one lookup set', () => {
    const keys = buildScanLookupKeys({
      version: 1, kind: 'TICKET', productKind: 'FLIGHT', issuer: 'Airline',
      reference: 'PROVIDER-REF', ticketNumber: 'TICKET-123', bookingReference: 'BOOK-456',
      documentNumber: 'DOC-789', serialNumber: 'SER-001', expodiaReference: 'EXP-ABC',
      trackingReference: 'TRK-XYZ', signature: 'signed',
    });
    expect(keys).toEqual(['EXP-ABC','TRK-XYZ','PROVIDER-REF','BOOK-456','TICKET-123','DOC-789','SER-001']);
  });

  it('creates a controlled verification path without exposing the raw provider reference', () => {
    expect(buildControlledResolutionPath('EXP/ABC')).toBe('/verify/EXP%2FABC');
  });
});
