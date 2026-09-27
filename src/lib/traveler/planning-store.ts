export type PlanningItemType = 'FLIGHT' | 'STAY' | 'EVENT' | 'ACTIVITY' | 'TRANSPORT' | 'INSURANCE' | 'REQUIREMENT' | 'DOCUMENT' | 'OTHER';

export interface PlanningItem {
  id: string;
  type: PlanningItemType;
  title: string;
  description?: string;
  sourceUrl?: string;
  actionLabel?: string;
  createdAt: string;
}

const STORAGE_KEY = 'expodia:planning-store';

export function readLocalPlanningItems(): PlanningItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as PlanningItem[] : [];
  } catch {
    return [];
  }
}

export function writeLocalPlanningItems(items: PlanningItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addLocalPlanningItem(item: Omit<PlanningItem, 'id' | 'createdAt'>): PlanningItem {
  const next = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  writeLocalPlanningItems([next, ...readLocalPlanningItems()]);
  return next;
}

export function removeLocalPlanningItem(id: string): void {
  writeLocalPlanningItems(readLocalPlanningItems().filter((item) => item.id !== id));
}
