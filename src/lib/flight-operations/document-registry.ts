import type { DocumentSpecification } from './document-control';

const canonicalSpecifications: DocumentSpecification[] = [];

export function getCanonicalDocumentSpecifications(): DocumentSpecification[] {
  return canonicalSpecifications.map((record) => ({
    ...record,
    evidence: [...record.evidence],
    requiredFields: [...record.requiredFields],
    machineReadableElements: [...record.machineReadableElements],
  }));
}

export function findCanonicalDocumentSpecification(input: {
  documentType: string;
  jurisdiction: string;
  issuingParty: string;
}): DocumentSpecification | null {
  return canonicalSpecifications.find(
    (record) =>
      record.documentType === input.documentType &&
      record.jurisdiction === input.jurisdiction &&
      record.issuingParty === input.issuingParty &&
      record.status === 'ACTIVE' &&
      record.verificationState === 'ACTIVE',
  ) ?? null;
}
