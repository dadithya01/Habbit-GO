import { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useHabits } from "../hooks/useHabits";
import { useAuth } from "../contexts/AuthContext";
import HabitCard from "../components/HabitCard";
import EmptyState from "../components/EmptyState";
import Fab from "../components/Fab";
import { useCheckIns } from "../hooks/useCheckIns";
import { todayKey } from "../utils/dateUtils";
import type { Habit } from "../types/habit";
import type { TabScreenProps } from "../types/navigation";

interface HabitStatusTrackerProps {
  habit: Habit;
  onStatus: (habitId: string, done: boolean) => void;
}

/** Renders nothing — just reports whether this one habit is done today, so
 *  TodayHero can aggregate without calling hooks in a loop. */
function HabitStatusTracker({ habit, onStatus }: HabitStatusTrackerProps) {
  const { dates } = useCheckIns(habit.id);
  const done = dates.includes(todayKey());

  useEffect(() => {
    onStatus(habit.id, done);
  }, [habit.id, done, onStatus]);

  return null;
}

function TodayHero({ habits }: { habits: Habit[] }) {
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  const handleStatus = useCallback((id: string, done: boolean) => {
    setStatusMap((prev) => (prev[id] === done ? prev : { ...prev, [id]: done }));
  }, []);

  const doneCount = habits.filter((h) => statusMap[h.id]).length;
  const total = habits.length;
  const allDone = total > 0 && doneCount === total;

  return (
    <>
      {habits.map((h) => (
        <HabitStatusTracker key={h.id} habit={h} onStatus={handleStatus} />
      ))}
      <View className="mx-5 mb-5 bg-primary rounded-m3-hero px-6 py-6 flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-body-medium text-label-lg text-onPrimary opacity-80">
            {allDone ? "Perfect day" : "Today's progress"}
          </Text>
          <Text className="font-display-bold text-hero text-onPrimary mt-1">
            {doneCount}/{total}
          </Text>
        </View>
        <View className="w-16 h-16 rounded-m3-sm bg-white/15 items-center justify-center">
          <Feather name={allDone ? "check-circle" : "zap"} size={30} color="#FFFFFF" />
        </View>
      </View>
    </>
  );
}

export default function HomeScreen({ navigation }: TabScreenProps<"Home">) {
  const { habits, loading, error, checkIn } = useHabits();
  const { logout } = useAuth();

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function handleSignOut() {
    Alert.alert("Sign out", "You can sign back in anytime.", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign out", style: "destructive", onPress: logout },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator color="#00876B" />
      </SafeAreaView>
    );
  }

  if (error) {
    const message = "code" in error ? error.code : error.message;
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center px-8">
        <View className="w-14 h-14 rounded-m3-lg bg-error-container items-center justify-center mb-3">
          <Feather name="alert-triangle" size={22} color="#410002" />
        </View>
        <Text className="font-body-semibold text-title-md text-onSurface text-center">
          Couldn't load your habits
        </Text>
        <Text className="font-body text-body-sm text-onSurfaceVariant text-center mt-1.5">
          {message || "Unknown error"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-3 pb-4 flex-row items-start justify-between">
        <View>
          <Text className="font-body-medium text-label-lg text-onSurfaceVariant">{today}</Text>
          <Text className="font-display-bold text-headline-lg text-onSurface mt-0.5">
            Your habits
          </Text>
        </View>
        <Pressable onPress={handleSignOut} hitSlop={10} className="mt-2">
          <Feather name="log-out" size={19} color="#3F4944" />
        </Pressable>
      </View>

      {habits.length === 0 ? (
        <EmptyState onAdd={() => navigation.navigate("AddEditHabit")} />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<TodayHero habits={habits} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={checkIn}
              onPress={(habit) => navigation.navigate("AddEditHabit", { habit })}
            />
          )}
        />
      )}

      <Fab onPress={() => navigation.navigate("AddEditHabit")} icon="plus" label="New habit" />
    </SafeAreaView>
  );
}
