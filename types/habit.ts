import type { Timestamp } from "firebase/firestore";

export type Frequency = "daily" | "weekdays" | "weekly";

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: Frequency;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/** Fields the user actually fills in when creating/editing a habit. */
export interface HabitInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency?: Frequency;
}

export interface StreakCounts {
  current: number;
  best: number;
}
