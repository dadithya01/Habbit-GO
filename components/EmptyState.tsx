import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

interface EmptyStateProps {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="w-16 h-16 rounded-m3-lg bg-primary-container items-center justify-center mb-4">
        <Feather name="target" size={28} color="#00201A" />
      </View>
      <Text className="font-display text-headline-md text-onSurface text-center">
        No habits yet
      </Text>
      <Text className="font-body text-body-md text-onSurfaceVariant text-center mt-2 leading-5">
        Add the first thing you want to show up for, one day at a time.
      </Text>
      <Pressable
        onPress={onAdd}
        className="mt-6 bg-primary rounded-full px-6 py-3 flex-row items-center"
      >
        <Feather name="plus" size={18} color="#FFFFFF" />
        <Text className="font-body-semibold text-onPrimary text-label-lg ml-2">
          Add a habit
        </Text>
      </Pressable>
    </View>
  );
}
