import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EmptyState({ onAdd }) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="w-16 h-16 rounded-2xl bg-primary-soft items-center justify-center mb-4">
        <Feather name="target" size={26} color="#1B4B43" />
      </View>
      <Text className="font-display text-lg text-ink text-center">
        No habits yet
      </Text>
      <Text className="font-body text-sm text-muted text-center mt-1.5 leading-5">
        Add the first thing you want to show up for, one day at a time.
      </Text>
      <Pressable
        onPress={onAdd}
        className="mt-5 bg-primary rounded-full px-5 py-2.5 flex-row items-center"
      >
        <Feather name="plus" size={16} color="#FFFFFF" />
        <Text className="font-body-semibold text-white text-sm ml-1.5">
          Add a habit
        </Text>
      </Pressable>
    </View>
  );
}
