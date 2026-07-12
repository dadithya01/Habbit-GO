import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  subscribeToHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleCheckIn,
} from "../services/habitService";

export function useHabits() {
  const { user } = useAuth();
  const userId = user?.uid || null;

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    (habitData) => {
      if (!userId) return Promise.reject(new Error("Not signed in"));
      return createHabit(userId, habitData);
    },
    [userId]
  );

  const editHabit = useCallback((habitId, updates) => updateHabit(habitId, updates), []);
  const removeHabit = useCallback((habitId) => deleteHabit(habitId), []);
  const checkIn = useCallback((habitId, dateKey) => toggleCheckIn(habitId, dateKey), []);

  return { userId, habits, loading, error, addHabit, editHabit, removeHabit, checkIn };
}
