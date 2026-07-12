import type { ComponentProps } from "react";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import PressableScale from "./PressableScale";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: FeatherIconName;
  color?: string;
}

/**
 * M3-style chip. `selected` gives it a filled tonal look with a check glyph;
 * unselected chips are outlined. Pass `color` to tint a selected chip
 * (e.g. a habit's own color) instead of the default primary container.
 */
export default function Chip({ label, selected, onPress, icon, color }: ChipProps) {
  const bg = selected ? (color ? `${color}26` : "#7DF8D4") : "transparent";
  const textColor = selected ? color || "#00201A" : "#3F4944";
  const borderColor = selected ? "transparent" : "#6F7975";

  return (
    <PressableScale
      onPress={onPress}
      className="flex-row items-center rounded-m3-sm px-3.5 py-2 mr-2 border"
      style={{ backgroundColor: bg, borderColor }}
    >
      {selected && !icon && (
        <Feather name="check" size={14} color={textColor} style={{ marginRight: 5 }} />
      )}
      {icon && <Feather name={icon} size={14} color={textColor} style={{ marginRight: 5 }} />}
      <Text className="font-body-medium text-label-lg" style={{ color: textColor }}>
        {label}
      </Text>
    </PressableScale>
  );
}
