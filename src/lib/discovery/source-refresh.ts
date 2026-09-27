import { discoveryPolicy } from './discovery-policy';

export interface SourceRefreshJob {
  sourceId: string;
  scheduledFor: string;
  cadenceMinutes: number;
}

export function buildRefreshSchedule(sourceIds: string[]): SourceRefreshJob[] {
  const scheduledFor = new Date().toISOString();
  return sourceIds.map((sourceId) => ({
    sourceId,
    scheduledFor,
    cadenceMinutes: discoveryPolicy.refreshCadenceMinutes,
  }));
}

/**
 * This defines the desired live cadence. The scheduler must be backed by a
 * production job runner/cron; a browser timer must never be treated as the
 * 24/7 source of truth.
 */
