import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function StreakBadge({ count, size = "md" }) {
  const isMd = size === "md";
  const lit = count > 0;

  return (
    <View
      className={`flex-row items-center rounded-full px-2.5 py-1 ${
        lit ? "bg-ember-soft" : "bg-line/60"
      }`}
    >
      <Feather
        name="zap"
        size={isMd ? 13 : 11}
        color={lit ? "#E8630A" : "#7C8B85"}
      />
      <Text
        className={`ml-1 font-body-semibold ${
          isMd ? "text-xs" : "text-[11px]"
        } ${lit ? "text-ember" : "text-muted"}`}
      >
        {count}
      </Text>
    </View>
  );
}
