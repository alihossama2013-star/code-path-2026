import { EarnedAchievementRecord } from '../data/milestones';
import { EarnedTokenRecord } from '../data/tokens';
import { getAuthHeaders } from './authApi';

export type ResumableView = 'landing' | 'roadmap' | 'lesson' | 'playground' | 'stack3d' | 'dashboard';
export type LessonTab = 'learn' | 'practice' | 'assessment';

export interface RemoteProgressPayload {
  completedLessons: string[];
  readLessons: string[];
  passedExercises: string[];
  quizScores: Record<string, number>;
  completionDates: string[];
  activeLessonId?: string;
  selectedLanguageId?: string | null;
  lastView?: ResumableView;
  activeLessonTab?: LessonTab;
}

export interface AccountWorkspaceSnapshot {
  progress: RemoteProgressPayload;
  tokens: Record<string, EarnedTokenRecord>;
  achievements: Record<string, EarnedAchievementRecord>;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function getAccountStorageKey(uid: string): string {
  return `codepath_account_v1_${uid}`;
}

function readLocalAccountSnapshot(uid: string): AccountWorkspaceSnapshot | null {
  if (!uid || !VALID_ID_REGEX.test(uid) || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getAccountStorageKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AccountWorkspaceSnapshot;
    if (!parsed || typeof parsed !== 'object' || !parsed.progress) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalAccountSnapshot(uid: string, snapshot: AccountWorkspaceSnapshot): void {
  if (!uid || !VALID_ID_REGEX.test(uid) || typeof window === 'undefined') return;
  try {
    localStorage.setItem(getAccountStorageKey(uid), JSON.stringify(snapshot));
  } catch {
    // Ignore storage quota errors
  }
}

export async function loadAccountSnapshot(uid: string): Promise<AccountWorkspaceSnapshot | null> {
  const local = readLocalAccountSnapshot(uid);

  try {
    const res = await fetch('/api/progress', {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        remoteEnabled?: boolean;
        snapshot?: AccountWorkspaceSnapshot | null;
      };
      if (data.remoteEnabled && data.snapshot) {
        writeLocalAccountSnapshot(uid, data.snapshot);
        return data.snapshot;
      }
      if (data.remoteEnabled && !data.snapshot && local) {
        void saveAccountSnapshot(uid, local);
      }
    }
  } catch {
    // Fall back cleanly to per-uid local persistence
  }

  return local;
}

export async function saveAccountSnapshot(
  uid: string,
  snapshot: AccountWorkspaceSnapshot
): Promise<void> {
  writeLocalAccountSnapshot(uid, snapshot);

  try {
    await fetch('/api/progress', {
      method: 'PUT',
      credentials: 'include',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(snapshot),
    });
  } catch {
    // Local per-uid storage already persisted; remote sync is best-effort
  }
}

export async function clearAccountSnapshot(uid: string): Promise<void> {
  if (uid && VALID_ID_REGEX.test(uid) && typeof window !== 'undefined') {
    try {
      localStorage.removeItem(getAccountStorageKey(uid));
    } catch {
      // Ignore storage errors
    }
  }

  try {
    await fetch('/api/progress', {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network errors on reset
  }
}
