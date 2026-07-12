import { useEffect, useState, useCallback } from "react";
import type { FirestoreError } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCheckIn,
} from "../services/habitService";
import type { Habit, HabitInput } from "../types/habit";

export function useHabits() {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToHabits(
      userId,
      (data) => {
        console.log(
          "Loaded habits:",
          data.map((h) => ({ id: h.id, name: h.name, userId: h.userId }))
        );
        setHabits(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addHabit = useCallback(
    (habitData: HabitInput) => {
      if (!userId) return Promise.reject(new Error("Not signed in"));
      return createHabit(userId, habitData);
    },
    [userId]
  );

  const editHabit = useCallback(
    (habitId: string, updates: Partial<HabitInput>) => updateHabit(habitId, updates),
    []
  );
  const removeHabit = useCallback((habitId: string) => deleteHabit(habitId), []);
  const checkIn = useCallback(
    (habitId: string, dateKey?: string) => toggleCheckIn(habitId, dateKey),
    []
  );

  return { userId, habits, loading, error, addHabit, editHabit, removeHabit, checkIn };
}
