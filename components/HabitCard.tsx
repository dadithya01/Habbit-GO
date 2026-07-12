import type { ComponentProps } from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import StreakBadge from "./StreakBadge";
import PressableScale from "./PressableScale";
import { useCheckIns } from "../hooks/useCheckIns";
import { todayKey } from "../utils/dateUtils";
import type { Habit } from "../types/habit";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onPress: (habit: Habit) => void;
}

export default function HabitCard({ habit, onToggle, onPress }: HabitCardProps) {
  const { dates, current } = useCheckIns(habit.id);
  const doneToday = dates.includes(todayKey());

  return (
    <PressableScale
      onPress={() => onPress(habit)}
      className="flex-row items-center bg-surface-low rounded-m3-hero px-4 py-4 mb-3"
    >
      {/* Deliberate shape contrast: sharp-cornered icon square inside a very
          round card, per M3 Expressive's "mix shapes for tension" guidance */}
      <View
        className="w-12 h-12 rounded-m3-sm items-center justify-center mr-3"
        style={{ backgroundColor: `${habit.color}29` }}
      >
        <Feather
          name={(habit.icon || "check-circle") as FeatherIconName}
          size={20}
          color={habit.color}
        />
      </View>

      <View className="flex-1">
        <Text className="font-body-semibold text-title-lg text-onSurface" numberOfLines={1}>
          {habit.name}
        </Text>
        {!!habit.description && (
          <Text className="font-body text-body-sm text-onSurfaceVariant mt-0.5" numberOfLines={1}>
            {habit.description}
          </Text>
        )}
        <View className="mt-2 flex-row">
          <StreakBadge count={current} size="sm" />
        </View>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onToggle(habit.id)}
        className={`w-11 h-11 rounded-full items-center justify-center ml-2 ${
          doneToday ? "bg-primary" : "bg-surface-highest"
        }`}
      >
        {doneToday ? (
          <Feather name="check" size={20} color="#FFFFFF" />
        ) : (
          <View className="w-4 h-4 rounded-full border-2 border-outline" />
        )}
      </Pressable>
    </PressableScale>
  );
}
