import { useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useHabits } from "../hooks/useHabits";
import { useCheckIns } from "../hooks/useCheckIns";
import { todayKey } from "../utils/dateUtils";

function HabitPill({ habit, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3.5 py-2 rounded-full mr-2 border ${
        active ? "border-transparent" : "border-line bg-surface"
      }`}
      style={active ? { backgroundColor: habit.color } : undefined}
    >
      <Text
        className={`font-body-semibold text-xs ${active ? "text-white" : "text-ink"}`}
      >
        {habit.name}
      </Text>
    </Pressable>
  );
}

function CalendarForHabit({ habit }) {
  const { dates, current, best } = useCheckIns(habit.id);

  const markedDates = useMemo(() => {
    const marks = {};
    dates.forEach((key) => {
      marks[key] = {
        selected: true,
        selectedColor: habit.color,
      };
    });
    marks[todayKey()] = {
      ...(marks[todayKey()] || {}),
      marked: !marks[todayKey()],
      dotColor: habit.color,
      today: true,
    };
    return marks;
  }, [dates, habit.color]);

  return (
    <View>
      <View className="flex-row mb-4">
        <View className="flex-1 bg-surface border border-line rounded-xl py-3 items-center mr-2">
          <Text className="font-display-bold text-xl text-ink">{current}</Text>
          <Text className="font-body text-[11px] text-muted mt-0.5">Current streak</Text>
        </View>
        <View className="flex-1 bg-surface border border-line rounded-xl py-3 items-center ml-2">
          <Text className="font-display-bold text-xl text-ink">{best}</Text>
          <Text className="font-body text-[11px] text-muted mt-0.5">Best streak</Text>
        </View>
      </View>

      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent",
          textSectionTitleColor: "#7C8B85",
          selectedDayBackgroundColor: habit.color,
          todayTextColor: habit.color,
          dayTextColor: "#14231F",
          textDisabledColor: "#D6DAD3",
          monthTextColor: "#14231F",
          textMonthFontFamily: "SpaceGrotesk_600SemiBold",
          textDayFontFamily: "Inter_400Regular",
          textDayHeaderFontFamily: "Inter_500Medium",
          arrowColor: habit.color,
        }}
        style={{ borderRadius: 16, borderWidth: 1, borderColor: "#E5E7E0" }}
      />
    </View>
  );
}

export default function CalendarScreen() {
  const { habits, loading } = useHabits();
  const [selectedId, setSelectedId] = useState(null);

  const selected = habits.find((h) => h.id === selectedId) || habits[0];

  if (loading) return null;

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-5 pt-2 pb-3">
        <Text className="font-display-bold text-2xl text-ink">History</Text>
      </View>

      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="font-body text-sm text-muted text-center">
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
              <HabitPill
                key={h.id}
                habit={h}
                active={h.id === selected?.id}
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
