import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import StreakBadge from "./StreakBadge";
import { useCheckIns } from "../hooks/useCheckIns";
import { todayKey } from "../utils/dateUtils";

export default function HabitCard({ habit, onToggle, onPress }) {
  const { dates, current } = useCheckIns(habit.id);
  const doneToday = dates.includes(todayKey());

  return (
    <Pressable
      onPress={() => onPress(habit)}
      className="flex-row items-center bg-surface border border-line rounded-2xl px-4 py-3.5 mb-3"
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: `${habit.color}1A` }}
      >
        <Feather name={habit.icon || "check-circle"} size={18} color={habit.color} />
      </View>

      <View className="flex-1">
        <Text className="font-body-semibold text-[15px] text-ink" numberOfLines={1}>
          {habit.name}
        </Text>
        {!!habit.description && (
          <Text className="font-body text-xs text-muted mt-0.5" numberOfLines={1}>
            {habit.description}
          </Text>
        )}
        <View className="mt-1.5 flex-row">
          <StreakBadge count={current} size="sm" />
        </View>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => onToggle(habit.id)}
        className={`w-9 h-9 rounded-full items-center justify-center ml-2 ${
          doneToday ? "bg-success" : "bg-paper border border-line"
        }`}
      >
        {doneToday ? (
          <Feather name="check" size={18} color="#FFFFFF" />
        ) : (
          <View className="w-3.5 h-3.5 rounded-full border-2 border-line" />
        )}
      </Pressable>
    </Pressable>
  );
}
