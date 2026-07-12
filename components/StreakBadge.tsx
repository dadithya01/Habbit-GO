import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md";
}

/** M3 assist-chip-style streak badge — bold flame color when lit. */
export default function StreakBadge({ count, size = "md" }: StreakBadgeProps) {
  const isMd = size === "md";
  const lit = count > 0;

  return (
    <View
      className={`flex-row items-center rounded-m3-sm px-2.5 ${isMd ? "py-1" : "py-0.5"} ${
        lit ? "bg-tertiary-container" : "bg-surface-high"
      }`}
    >
      <Feather name="zap" size={isMd ? 13 : 11} color={lit ? "#FF7A1A" : "#6F7975"} />
      <Text
        className={`ml-1 font-body-semibold ${isMd ? "text-label-lg" : "text-label-sm"}`}
        style={{ color: lit ? "#8A4200" : "#6F7975" }}
      >
        {count}
      </Text>
    </View>
  );
}
