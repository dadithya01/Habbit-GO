import { useState, type ComponentProps } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useHabits } from "../hooks/useHabits";
import M3TextField from "../components/M3TextField";
import Chip from "../components/Chip";
import PressableScale from "../components/PressableScale";
import type { Frequency } from "../types/habit";
import type { MainStackScreenProps } from "../types/navigation";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

const ICONS: FeatherIconName[] = [
  "check-circle",
  "sun",
  "book-open",
  "activity",
  "droplet",
  "moon",
  "feather",
  "heart",
];
const COLORS = ["#00876B", "#FF7A1A", "#2F9E44", "#3B6FB6", "#8A4FBE", "#BA1A1A"];
const FREQUENCIES: { key: Frequency; label: string }[] = [
  { key: "daily", label: "Every day" },
  { key: "weekdays", label: "Weekdays" },
  { key: "weekly", label: "Once a week" },
];

export default function AddEditHabitScreen({
  navigation,
  route,
}: MainStackScreenProps<"AddEditHabit">) {
  const existing = route.params?.habit;
  const isEditing = !!existing;
  const { addHabit, editHabit, removeHabit } = useHabits();

  const [name, setName] = useState(existing?.name || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [icon, setIcon] = useState<FeatherIconName>(
    (existing?.icon as FeatherIconName) || ICONS[0]
  );
  const [color, setColor] = useState(existing?.color || COLORS[0]);
  const [frequency, setFrequency] = useState<Frequency>(existing?.frequency || "daily");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Give it a name", "Habits need a short name so you can spot them fast.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name, description, icon, color, frequency };
      if (isEditing && existing) {
        await editHabit(existing.id, payload);
      } else {
        await addHabit(payload);
      }
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      Alert.alert("Couldn't save", message);
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
    if (!existing) return;
    Alert.alert(
      "Delete habit",
      `"${existing.name}" and its history will be removed for good.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await removeHabit(existing.id);
            navigation.goBack();
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Feather name="x" size={22} color="#191C1A" />
          </Pressable>
          <Text className="font-body-semibold text-title-lg text-onSurface">
            {isEditing ? "Edit habit" : "New habit"}
          </Text>
          <PressableScale
            onPress={handleSave}
            disabled={saving}
            className="bg-primary rounded-full px-4 py-1.5"
          >
            <Text className="font-body-semibold text-onPrimary text-label-lg">
              {saving ? "Saving…" : "Save"}
            </Text>
          </PressableScale>
        </View>

        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 32 }}>
          <M3TextField
            label="NAME"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Read for 20 minutes"
          />

          <M3TextField
            label="DESCRIPTION (OPTIONAL)"
            value={description}
            onChangeText={setDescription}
            placeholder="Any notes to future you"
          />

          <Text className="font-body-medium text-label-lg text-onSurfaceVariant mb-2 mt-5">
            ICON
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {ICONS.map((i) => (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                className={`w-11 h-11 rounded-m3-md items-center justify-center ${
                  icon === i ? "bg-primary-container" : "bg-surface-high"
                }`}
              >
                <Feather name={i} size={18} color={icon === i ? "#00201A" : "#3F4944"} />
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-label-lg text-onSurfaceVariant mb-2 mt-5">
            COLOR
          </Text>
          <View className="flex-row gap-3">
            {COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: c }}
              >
                {color === c && <Feather name="check" size={16} color="#FFFFFF" />}
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-label-lg text-onSurfaceVariant mb-2 mt-5">
            FREQUENCY
          </Text>
          <View className="flex-row flex-wrap">
            {FREQUENCIES.map((f) => (
              <Chip
                key={f.key}
                label={f.label}
                selected={frequency === f.key}
                onPress={() => setFrequency(f.key)}
              />
            ))}
          </View>

          {isEditing && (
            <Pressable
              onPress={handleDelete}
              className="mt-8 flex-row items-center justify-center border border-error rounded-full py-3"
            >
              <Feather name="trash-2" size={16} color="#BA1A1A" />
              <Text className="font-body-semibold text-error text-label-lg ml-2">
                Delete habit
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
