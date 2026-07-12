import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type FirestoreError,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { todayKey } from "../utils/dateUtils";
import type { Habit, HabitInput } from "../types/habit";

const habitsCol = collection(db, "habits");

/** Live-subscribes to all habits owned by userId, sorted by creation date (client-side,
 *  so this doesn't depend on a Firestore composite index existing). */
export function subscribeToHabits(
    userId: string,
    onChange: (habits: Habit[]) => void,
    onError?: (err: FirestoreError) => void
): () => void {
  const q = query(habitsCol, where("userId", "==", userId));
  return onSnapshot(
      q,
      (snapshot) => {
        const habits = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Habit));
        habits.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() ?? 0;
          const bTime = b.createdAt?.toMillis?.() ?? 0;
          return aTime - bTime;
        });
        onChange(habits);
      },
      (err) => {
        console.error("subscribeToHabits failed:", err.code, err.message);
        onError?.(err);
      }
  );
}

/** Live-subscribes to every check-in date for a single habit (for streaks + calendar). */
export function subscribeToCheckIns(
    habitId: string,
    onChange: (dates: string[]) => void,
    onError?: (err: FirestoreError) => void
): () => void {
  const checkInsCol = collection(db, "habits", habitId, "checkIns");
  return onSnapshot(
      checkInsCol,
      (snapshot) => {
        const dates = snapshot.docs.map((d) => d.id);
        onChange(dates);
      },
      (err) => {
        console.error(
            `subscribeToCheckIns failed for habitId="${habitId}":`,
            err.code,
            err.message
        );
        onError?.(err);
      }
  );
}

export async function createHabit(
    userId: string,
    { name, description, icon, color, frequency }: HabitInput
): Promise<DocumentReference> {
  return addDoc(habitsCol, {
    userId,
    name: name.trim(),
    description: description?.trim() || "",
    icon: icon || "check-circle",
    color: color || "#00876B",
    frequency: frequency || "daily",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateHabit(habitId: string, updates: Partial<HabitInput>): Promise<void> {
  const ref = doc(db, "habits", habitId);
  return updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteHabit(habitId: string): Promise<void> {
  // Clean up the checkIns subcollection first (Firestore doesn't cascade-delete).
  const checkInsCol = collection(db, "habits", habitId, "checkIns");
  const snapshot = await getDocs(checkInsCol);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, "habits", habitId));
}

/** Toggles today's (or a given) check-in on/off for a habit. Returns the new state. */
export async function toggleCheckIn(habitId: string, dateKey: string = todayKey()): Promise<boolean> {
  const ref = doc(db, "habits", habitId, "checkIns", dateKey);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  }
  await setDoc(ref, { completedAt: serverTimestamp() });
  return true;
}
