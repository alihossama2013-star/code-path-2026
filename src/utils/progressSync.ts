import { EarnedAchievementRecord } from '../data/milestones';
import { EarnedTokenRecord } from '../data/tokens';

export type ResumableView = 'landing' | 'roadmap' | 'lesson' | 'playground' | 'stack3d' | 'dashboard';
export type LessonTab = 'learn' | 'practice' | 'assessment';

export interface WorkspaceProgressPayload {
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

export interface WorkspaceSnapshot {
  progress: WorkspaceProgressPayload;
  tokens: Record<string, EarnedTokenRecord>;
  achievements: Record<string, EarnedAchievementRecord>;
}

const WORKSPACE_STORAGE_KEY = 'codepath_workspace_v1';

export function loadWorkspaceSnapshot(): WorkspaceSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkspaceSnapshot;
    if (!parsed || typeof parsed !== 'object' || !parsed.progress) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkspaceSnapshot(snapshot: WorkspaceSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearWorkspaceSnapshot(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
