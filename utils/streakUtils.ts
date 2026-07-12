import { addDays, toKey, todayKey } from "./dateUtils";
import type { StreakCounts } from "../types/habit";

/**
 * completedKeys: an iterable of "YYYY-MM-DD" dates the habit was checked off.
 * Returns { current, best } streak counts, counted in days.
 * A streak counts backwards from today (or yesterday, if today isn't done yet
 * so a still-open day doesn't break the streak).
 */
export function computeStreaks(completedKeys: Iterable<string>): StreakCounts {
  const done = new Set(completedKeys);
  if (done.size === 0) return { current: 0, best: 0 };

  const today = new Date();
  let current = 0;
  let cursor = today;

  // If today isn't checked off yet, start counting from yesterday so the
  // streak doesn't reset to 0 the moment the clock passes midnight.
  if (!done.has(toKey(today))) {
    cursor = addDays(today, -1);
  }

  while (done.has(toKey(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  // Best streak: walk all recorded dates sorted ascending, find longest run.
  const sortedKeys = Array.from(done).sort();
  let best = 0;
  let run = 0;
  let prevDate: Date | null = null;

  for (const key of sortedKeys) {
    const date = new Date(key);
    if (prevDate) {
      const dayDiff = Math.round((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      run = dayDiff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prevDate = date;
  }

  return { current, best: Math.max(best, current) };
}

export function isCompletedToday(completedKeys: Iterable<string>): boolean {
  return new Set(completedKeys).has(todayKey());
}
