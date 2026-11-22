export interface StreakDayCell {
  dateKey: string;
  completed: boolean;
  isToday: boolean;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  atRiskToday: boolean;
  totalActiveDays: number;
  lastSevenDays: StreakDayCell[];
}

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_STORED_DATES = 366;

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  if (!DATE_KEY_REGEX.test(dateKey)) return getLocalDateKey();
  const [y, m, d] = dateKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(y, m - 1, d + deltaDays));
  const year = shifted.getUTCFullYear();
  const month = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const day = String(shifted.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateKeyToLocalDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
}

export function sanitizeDateList(items: unknown): string[] {
  if (!Array.isArray(items)) return [];
  const unique = new Set<string>();
  for (const item of items) {
    if (typeof item === 'string' && DATE_KEY_REGEX.test(item)) {
      unique.add(item);
    }
  }
  return Array.from(unique)
    .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
    .slice(0, MAX_STORED_DATES);
}

export function calculateStreakStats(
  completionDates: string[],
  now: Date = new Date()
): StreakStats {
  const sanitized = sanitizeDateList(completionDates);
  const dateSet = new Set<string>(sanitized);
  const todayKey = getLocalDateKey(now);
  const yesterdayKey = shiftDateKey(todayKey, -1);

  const completedToday = dateSet.has(todayKey);
  const completedYesterday = dateSet.has(yesterdayKey);

  let currentStreak = 0;
  if (completedToday || completedYesterday) {
    let cursor = completedToday ? todayKey : yesterdayKey;
    while (dateSet.has(cursor)) {
      currentStreak += 1;
      cursor = shiftDateKey(cursor, -1);
    }
  }

  let longestStreak = 0;
  if (sanitized.length > 0) {
    const ascending = [...sanitized].reverse();
    let run = 0;
    let prev: string | null = null;
    for (const key of ascending) {
      if (prev && shiftDateKey(prev, 1) === key) {
        run += 1;
      } else {
        run = 1;
      }
      if (run > longestStreak) {
        longestStreak = run;
      }
      prev = key;
    }
  }

  const lastSevenDays: StreakDayCell[] = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const dateKey = shiftDateKey(todayKey, offset);
    lastSevenDays.push({
      dateKey,
      completed: dateSet.has(dateKey),
      isToday: offset === 0,
    });
  }

  return {
    currentStreak,
    longestStreak,
    completedToday,
    atRiskToday: !completedToday && completedYesterday && currentStreak > 0,
    totalActiveDays: dateSet.size,
    lastSevenDays,
  };
}
