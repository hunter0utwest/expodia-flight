export type SystemRole = 'PUBLIC' | 'TRAVELER' | 'AGENT' | 'COMPANY_ADMIN';

export type ResourceAction =
  | 'VIEW_PUBLIC'
  | 'VIEW_OWN'
  | 'CREATE_OWN'
  | 'EDIT_OWN'
  | 'PROCESS_BOOKING'
  | 'PROCESS_DOCUMENT'
  | 'REQUEST_SEAT_CHANGE'
  | 'VIEW_COMPANY'
  | 'MANAGE_STAFF'
  | 'MANAGE_DOCUMENT_STANDARDS'
  | 'MANAGE_SYSTEM';

const priority: Record<SystemRole, number> = {
  PUBLIC: 10,
  TRAVELER: 20,
  AGENT: 30,
  COMPANY_ADMIN: 40,
};

const grants: Record<SystemRole, readonly ResourceAction[]> = {
  PUBLIC: ['VIEW_PUBLIC'],
  TRAVELER: ['VIEW_PUBLIC', 'VIEW_OWN', 'CREATE_OWN', 'EDIT_OWN'],
  AGENT: ['VIEW_PUBLIC', 'VIEW_OWN', 'CREATE_OWN', 'EDIT_OWN', 'PROCESS_BOOKING', 'PROCESS_DOCUMENT', 'REQUEST_SEAT_CHANGE', 'VIEW_COMPANY'],
  COMPANY_ADMIN: [
    'VIEW_PUBLIC', 'VIEW_OWN', 'CREATE_OWN', 'EDIT_OWN',
    'PROCESS_BOOKING', 'PROCESS_DOCUMENT', 'REQUEST_SEAT_CHANGE',
    'VIEW_COMPANY', 'MANAGE_STAFF', 'MANAGE_DOCUMENT_STANDARDS', 'MANAGE_SYSTEM',
  ],
};

export function permissionPriority(role: SystemRole): number {
  return priority[role];
}

export function can(role: SystemRole, action: ResourceAction): boolean {
  return grants[role].includes(action);
}

/**
 * Admin has system authority, but destructive or regulated operations must
 * still be audited. "Free to do anything" means authorization is not blocked
 * by normal staff restrictions; it does not mean audit trails disappear.
 */
export function isAdmin(role: SystemRole): boolean {
  return role === 'COMPANY_ADMIN';
}
