import { useEffect, useState } from "react";
import { subscribeToCheckIns } from "../services/habitService";
import { computeStreaks } from "../utils/streakUtils";
import type { StreakCounts } from "../types/habit";

interface UseCheckInsResult extends StreakCounts {
  dates: string[];
  loading: boolean;
}

export function useCheckIns(habitId: string | undefined): UseCheckInsResult {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!habitId) return;
    const unsubscribe = subscribeToCheckIns(
      habitId,
      (data) => {
        setDates(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsubscribe();
  }, [habitId]);

  const streaks = computeStreaks(dates);

  return { dates, loading, ...streaks };
}
