import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useHabits } from "../hooks/useHabits";
import { useAuth } from "../contexts/AuthContext";
import HabitCard from "../components/HabitCard";
import EmptyState from "../components/EmptyState";

export default function HomeScreen({ navigation }) {
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
      <SafeAreaView className="flex-1 bg-paper items-center justify-center">
        <ActivityIndicator color="#1B4B43" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-paper items-center justify-center px-8">
        <Feather name="alert-triangle" size={22} color="#C1443B" />
        <Text className="font-body-semibold text-ink text-center mt-3">
          Couldn't load your habits
        </Text>
        <Text className="font-body text-xs text-muted text-center mt-1.5">
          {error.code || error.message || "Unknown error"}
        </Text>
        <Text className="font-body text-xs text-muted text-center mt-3">
          Check the terminal running "expo start" for the full error — it's
          usually either a missing Firestore index or a security rules
          mismatch.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-paper">
      <View className="px-5 pt-2 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="font-body text-sm text-muted">{today}</Text>
          <Text className="font-display-bold text-2xl text-ink mt-0.5">
            Your habits
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("AddEditHabit")}
          className="w-11 h-11 rounded-full bg-primary items-center justify-center"
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="px-5 -mt-2 mb-2 flex-row justify-end">
        <Pressable onPress={handleSignOut} hitSlop={8} className="flex-row items-center">
          <Feather name="log-out" size={13} color="#7C8B85" />
          <Text className="font-body text-xs text-muted ml-1">Sign out</Text>
        </Pressable>
      </View>

      {habits.length === 0 ? (
        <EmptyState onAdd={() => navigation.navigate("AddEditHabit")} />
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              onToggle={checkIn}
              onPress={(habit) =>
                navigation.navigate("AddEditHabit", { habit })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
