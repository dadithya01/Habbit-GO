import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useHabits } from "../hooks/useHabits";

const ICONS = ["check-circle", "sun", "book-open", "activity", "droplet", "moon", "feather", "heart"];
const COLORS = ["#1B4B43", "#E8630A", "#2F9E44", "#3B6FB6", "#8A4FBE", "#C1443B"];
const FREQUENCIES = [
  { key: "daily", label: "Every day" },
  { key: "weekdays", label: "Weekdays" },
  { key: "weekly", label: "Once a week" },
];

export default function AddEditHabitScreen({ navigation, route }) {
  const existing = route.params?.habit;
  const isEditing = !!existing;
  const { addHabit, editHabit, removeHabit } = useHabits();

  const [name, setName] = useState(existing?.name || "");
  const [description, setDescription] = useState(existing?.description || "");
  const [icon, setIcon] = useState(existing?.icon || ICONS[0]);
  const [color, setColor] = useState(existing?.color || COLORS[0]);
  const [frequency, setFrequency] = useState(existing?.frequency || "daily");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Give it a name", "Habits need a short name so you can spot them fast.");
      return;
    }
    setSaving(true);
    try {
      const payload = { name, description, icon, color, frequency };
      if (isEditing) {
        await editHabit(existing.id, payload);
      } else {
        await addHabit(payload);
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert("Couldn't save", err.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleDelete() {
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
      className="flex-1 bg-paper"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
          <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
            <Feather name="x" size={22} color="#14231F" />
          </Pressable>
          <Text className="font-display text-base text-ink">
            {isEditing ? "Edit habit" : "New habit"}
          </Text>
          <Pressable onPress={handleSave} disabled={saving} hitSlop={10}>
            <Text className="font-body-semibold text-primary text-[15px]">
              {saving ? "Saving…" : "Save"}
            </Text>
          </Pressable>
        </View>

        <ScrollView className="px-5" contentContainerStyle={{ paddingBottom: 32 }}>
          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-3">NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Read for 20 minutes"
            placeholderTextColor="#7C8B85"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-5">
            DESCRIPTION (OPTIONAL)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Any notes to future you"
            placeholderTextColor="#7C8B85"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-5">ICON</Text>
          <View className="flex-row flex-wrap gap-2.5">
            {ICONS.map((i) => (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                className={`w-11 h-11 rounded-xl items-center justify-center border ${
                  icon === i ? "border-primary bg-primary-soft" : "border-line bg-surface"
                }`}
              >
                <Feather name={i} size={18} color={icon === i ? "#1B4B43" : "#7C8B85"} />
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-5">COLOR</Text>
          <View className="flex-row gap-3">
            {COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                className="w-9 h-9 rounded-full items-center justify-center"
                style={{ backgroundColor: c }}
              >
                {color === c && <Feather name="check" size={15} color="#FFFFFF" />}
              </Pressable>
            ))}
          </View>

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-5">FREQUENCY</Text>
          <View className="gap-2">
            {FREQUENCIES.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => setFrequency(f.key)}
                className={`flex-row items-center justify-between border rounded-xl px-4 py-3 ${
                  frequency === f.key ? "border-primary bg-primary-soft" : "border-line bg-surface"
                }`}
              >
                <Text className="font-body text-ink text-sm">{f.label}</Text>
                {frequency === f.key && <Feather name="check" size={16} color="#1B4B43" />}
              </Pressable>
            ))}
          </View>

          {isEditing && (
            <Pressable
              onPress={handleDelete}
              className="mt-8 flex-row items-center justify-center border border-danger/30 rounded-xl py-3"
            >
              <Feather name="trash-2" size={16} color="#C1443B" />
              <Text className="font-body-semibold text-danger text-sm ml-2">
                Delete habit
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
