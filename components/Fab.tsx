import type { ComponentProps } from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import PressableScale from "./PressableScale";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

interface FabProps {
  onPress: () => void;
  icon?: FeatherIconName;
  label?: string;
  extended?: boolean;
}

/** M3 Expressive FAB: extended by default (icon + label reads bolder/more
 *  confident than an icon-only circle), rounded-square shape, springy press. */
export default function Fab({ onPress, icon = "plus", label, extended = true }: FabProps) {
  return (
    <PressableScale
      onPress={onPress}
      className={`absolute bottom-6 right-5 bg-primary rounded-m3-lg items-center justify-center shadow-lg ${
        extended ? "flex-row px-6 h-16" : "w-16 h-16"
      }`}
      style={{
        shadowColor: "#00201A",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
      }}
    >
      <Feather name={icon} size={24} color="#FFFFFF" />
      {extended && label && (
        <Text className="font-body-semibold text-onPrimary text-title-md ml-2">{label}</Text>
      )}
    </PressableScale>
  );
}
