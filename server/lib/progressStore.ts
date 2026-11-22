import fs from 'node:fs/promises';
import path from 'node:path';

export type ResumableView = 'landing' | 'roadmap' | 'lesson' | 'playground' | 'stack3d' | 'dashboard';
export type LessonTab = 'learn' | 'practice' | 'assessment';

export interface StoredProgressPayload {
  completedLessons: string[];
  readLessons: string[];
  passedExercises: string[];
  quizScores: Record<string, number>;
  completionDates: string[];
  activeLessonId?: string;
  selectedLanguageId?: string | null;
  lastView?: ResumableView;
  activeLessonTab?: LessonTab;
  updatedAt?: string;
}

export interface StoredTokenRecord {
  uid: string;
  lessonId: string;
  tokenCode: string;
  languageId: string;
  order: number;
  earnedAt: string | null;
}

export interface StoredAchievementRecord {
  uid: string;
  achievementId: string;
  category: 'chapter' | 'track' | 'series' | 'streak';
  tier: 'bronze' | 'silver' | 'gold' | 'apex';
  earnedAt: string | null;
}

export interface AccountSnapshot {
  progress: StoredProgressPayload;
  tokens: Record<string, StoredTokenRecord>;
  achievements: Record<string, StoredAchievementRecord>;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;
const VALID_UID_REGEX = /^[a-zA-Z0-9_-]{1,128}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RESUMABLE_VIEWS = new Set<ResumableView>([
  'landing',
  'roadmap',
  'lesson',
  'playground',
  'stack3d',
  'dashboard',
]);
const LESSON_TABS = new Set<LessonTab>(['learn', 'practice', 'assessment']);

function sanitizeIdList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (
      typeof item === 'string' &&
      item.length >= 1 &&
      item.length <= 64 &&
      VALID_ID_REGEX.test(item) &&
      !seen.has(item)
    ) {
      seen.add(item);
      unique.push(item);
      if (unique.length >= 100) break;
    }
  }
  return unique;
}

function sanitizeDateList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item === 'string' && DATE_REGEX.test(item) && !seen.has(item)) {
      seen.add(item);
      unique.push(item);
      if (unique.length >= 366) break;
    }
  }
  return unique;
}

function sanitizeScoreMap(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, number> = {};
  let count = 0;
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (
      typeof k === 'string' &&
      k.length >= 1 &&
      k.length <= 64 &&
      VALID_ID_REGEX.test(k) &&
      typeof v === 'number' &&
      Number.isFinite(v)
    ) {
      result[k] = Math.max(0, Math.min(100, Math.round(v)));
      count += 1;
      if (count >= 100) break;
    }
  }
  return result;
}

function sanitizeSingleId(raw: unknown, maxLen: number): string | undefined {
  if (typeof raw !== 'string') return undefined;
  if (raw.length < 1 || raw.length > maxLen) return undefined;
  return VALID_ID_REGEX.test(raw) ? raw : undefined;
}

export function sanitizeAccountSnapshot(uid: string, raw: unknown): AccountSnapshot {
  const input = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const rawProgress =
    input.progress && typeof input.progress === 'object'
      ? (input.progress as Record<string, unknown>)
      : {};

  const progress: StoredProgressPayload = {
    completedLessons: sanitizeIdList(rawProgress.completedLessons),
    readLessons: sanitizeIdList(rawProgress.readLessons),
    passedExercises: sanitizeIdList(rawProgress.passedExercises),
    quizScores: sanitizeScoreMap(rawProgress.quizScores),
    completionDates: sanitizeDateList(rawProgress.completionDates),
    activeLessonId: sanitizeSingleId(rawProgress.activeLessonId, 64) ?? 'html-1-intro',
    selectedLanguageId:
      rawProgress.selectedLanguageId === null
        ? null
        : sanitizeSingleId(rawProgress.selectedLanguageId, 32) ?? null,
    lastView: RESUMABLE_VIEWS.has(rawProgress.lastView as ResumableView)
      ? (rawProgress.lastView as ResumableView)
      : 'roadmap',
    activeLessonTab: LESSON_TABS.has(rawProgress.activeLessonTab as LessonTab)
      ? (rawProgress.activeLessonTab as LessonTab)
      : 'learn',
    updatedAt: new Date().toISOString(),
  };

  const tokens: Record<string, StoredTokenRecord> = {};
  if (input.tokens && typeof input.tokens === 'object' && !Array.isArray(input.tokens)) {
    let count = 0;
    for (const [key, val] of Object.entries(input.tokens as Record<string, unknown>)) {
      if (count >= 100) break;
      if (!VALID_ID_REGEX.test(key) || !val || typeof val !== 'object') continue;
      const rec = val as Record<string, unknown>;
      tokens[key] = {
        uid,
        lessonId: sanitizeSingleId(rec.lessonId, 64) ?? key,
        tokenCode:
          typeof rec.tokenCode === 'string' && /^CP-\d{2,3}$/.test(rec.tokenCode)
            ? rec.tokenCode
            : 'CP-01',
        languageId: sanitizeSingleId(rec.languageId, 32) ?? 'html',
        order: typeof rec.order === 'number' && Number.isFinite(rec.order) ? rec.order : 1,
        earnedAt: typeof rec.earnedAt === 'string' ? rec.earnedAt.slice(0, 40) : null,
      };
      count += 1;
    }
  }

  const achievements: Record<string, StoredAchievementRecord> = {};
  if (
    input.achievements &&
    typeof input.achievements === 'object' &&
    !Array.isArray(input.achievements)
  ) {
    let count = 0;
    for (const [key, val] of Object.entries(input.achievements as Record<string, unknown>)) {
      if (count >= 100) break;
      if (!VALID_ID_REGEX.test(key) || !val || typeof val !== 'object') continue;
      const rec = val as Record<string, unknown>;
      const cat =
        rec.category === 'chapter' ||
        rec.category === 'track' ||
        rec.category === 'series' ||
        rec.category === 'streak'
          ? rec.category
          : 'series';
      const tier =
        rec.tier === 'bronze' ||
        rec.tier === 'silver' ||
        rec.tier === 'gold' ||
        rec.tier === 'apex'
          ? rec.tier
          : 'bronze';
      achievements[key] = {
        uid,
        achievementId: sanitizeSingleId(rec.achievementId, 64) ?? key,
        category: cat,
        tier,
        earnedAt: typeof rec.earnedAt === 'string' ? rec.earnedAt.slice(0, 40) : null,
      };
      count += 1;
    }
  }

  return { progress, tokens, achievements };
}

function getKvConfig(): { url: string; token: string } | null {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL)?.trim();
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN)?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

function getLocalFilePath(uid: string): string | null {
  if (!VALID_UID_REGEX.test(uid)) return null;
  const baseDir = path.resolve(process.cwd(), '.data', 'progress');
  const resolved = path.resolve(baseDir, `${uid}.json`);
  if (!resolved.startsWith(baseDir + path.sep)) return null;
  return resolved;
}

export async function readRemoteAccountSnapshot(
  uid: string
): Promise<{ enabled: boolean; snapshot: AccountSnapshot | null }> {
  if (!VALID_UID_REGEX.test(uid)) {
    return { enabled: false, snapshot: null };
  }

  const kv = getKvConfig();
  if (kv) {
    const key = `codepath:user:${uid}`;
    const res = await fetch(`${kv.url}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
    });
    if (!res.ok) return { enabled: true, snapshot: null };
    const data = (await res.json()) as { result?: unknown };
    if (!data.result) return { enabled: true, snapshot: null };
    try {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      return { enabled: true, snapshot: sanitizeAccountSnapshot(uid, parsed) };
    } catch {
      return { enabled: true, snapshot: null };
    }
  }

  // On Vercel without KV/Redis configured, local filesystem is ephemeral; defer cleanly to client per-uid store
  if (process.env.VERCEL) {
    return { enabled: false, snapshot: null };
  }

  const filePath = getLocalFilePath(uid);
  if (!filePath) return { enabled: false, snapshot: null };

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return { enabled: true, snapshot: sanitizeAccountSnapshot(uid, JSON.parse(raw)) };
  } catch {
    return { enabled: true, snapshot: null };
  }
}

export async function writeRemoteAccountSnapshot(
  uid: string,
  snapshot: AccountSnapshot
): Promise<{ enabled: boolean }> {
  if (!VALID_UID_REGEX.test(uid)) {
    return { enabled: false };
  }

  const sanitized = sanitizeAccountSnapshot(uid, snapshot);

  const kv = getKvConfig();
  if (kv) {
    const key = `codepath:user:${uid}`;
    const kvRes = await fetch(`${kv.url}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sanitized),
    });
    if (!kvRes.ok) {
      throw new Error(`KV_WRITE_FAILED_${kvRes.status}`);
    }
    return { enabled: true };
  }

  if (process.env.VERCEL) {
    return { enabled: false };
  }

  const filePath = getLocalFilePath(uid);
  if (!filePath) return { enabled: false };

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(sanitized, null, 2), 'utf8');
  return { enabled: true };
}

export async function deleteRemoteAccountSnapshot(uid: string): Promise<{ enabled: boolean }> {
  if (!VALID_UID_REGEX.test(uid)) {
    return { enabled: false };
  }

  const kv = getKvConfig();
  if (kv) {
    const key = `codepath:user:${uid}`;
    await fetch(`${kv.url}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${kv.token}` },
    });
    return { enabled: true };
  }

  if (process.env.VERCEL) {
    return { enabled: false };
  }

  const filePath = getLocalFilePath(uid);
  if (!filePath) return { enabled: false };

  try {
    await fs.unlink(filePath);
  } catch {
    // File may not exist yet
  }
  return { enabled: true };
}
