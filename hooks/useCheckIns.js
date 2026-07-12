import { useEffect, useState } from "react";
import { subscribeToCheckIns } from "../services/habitService";
import { computeStreaks } from "../utils/streakUtils";

export function useCheckIns(habitId) {
  const [dates, setDates] = useState([]);
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
