import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useHabits } from "../hooks/useHabits";
import { useCheckIns } from "../hooks/useCheckIns";
import { todayKey } from "../utils/dateUtils";
import Chip from "../components/Chip";
import type { Habit } from "../types/habit";

type MarkedDatesMap = Record<
  string,
  { selected?: boolean; selectedColor?: string; marked?: boolean; dotColor?: string; today?: boolean }
>;

function CalendarForHabit({ habit }: { habit: Habit }) {
  const { dates, current, best } = useCheckIns(habit.id);

  const markedDates: MarkedDatesMap = useMemo(() => {
    const marks: MarkedDatesMap = {};
    dates.forEach((key) => {
      marks[key] = {
        selected: true,
        selectedColor: habit.color,
      };
    });
    const today = todayKey();
    marks[today] = {
      ...(marks[today] || {}),
      marked: !marks[today],
      dotColor: habit.color,
      today: true,
    };
    return marks;
  }, [dates, habit.color]);

  return (
    <View>
      <View className="flex-row mb-4">
        <View className="flex-1 bg-surface-low rounded-m3-lg py-4 items-center mr-2">
          <Text className="font-display-bold text-headline-md text-onSurface">{current}</Text>
          <Text className="font-body text-body-sm text-onSurfaceVariant mt-0.5">
            Current streak
          </Text>
        </View>
        <View className="flex-1 bg-surface-low rounded-m3-lg py-4 items-center ml-2">
          <Text className="font-display-bold text-headline-md text-onSurface">{best}</Text>
          <Text className="font-body text-body-sm text-onSurfaceVariant mt-0.5">
            Best streak
          </Text>
        </View>
      </View>

      <View className="bg-surface-low rounded-m3-lg overflow-hidden">
        <Calendar
          markedDates={markedDates}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#3F4944",
            selectedDayBackgroundColor: habit.color,
            todayTextColor: habit.color,
            dayTextColor: "#191C1A",
            textDisabledColor: "#BFC9C3",
            monthTextColor: "#191C1A",
            textMonthFontFamily: "SpaceGrotesk_600SemiBold",
            textDayFontFamily: "Inter_400Regular",
            textDayHeaderFontFamily: "Inter_500Medium",
            arrowColor: habit.color,
          }}
        />
      </View>
    </View>
  );
}

export default function CalendarScreen() {
  const { habits, loading } = useHabits();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = habits.find((h) => h.id === selectedId) || habits[0];

  if (loading) return null;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View className="px-5 pt-3 pb-5">
        <Text className="font-display-bold text-headline-lg text-onSurface">History</Text>
      </View>

      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="font-body text-body-md text-onSurfaceVariant text-center">
            Add a habit first — its calendar and streaks will show up here.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-5 mb-4"
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {habits.map((h) => (
              <Chip
                key={h.id}
                label={h.name}
                selected={h.id === selected?.id}
                color={h.color}
                onPress={() => setSelectedId(h.id)}
              />
            ))}
          </ScrollView>

          <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 24 }}>
            {selected && <CalendarForHabit habit={selected} />}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
