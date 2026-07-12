import { View, Text, TextInput, type TextInputProps } from "react-native";

interface M3TextFieldProps extends TextInputProps {
  label?: string;
}

export default function M3TextField({ label, ...inputProps }: M3TextFieldProps) {
  return (
    <View className="mt-4">
      {!!label && (
        <Text className="font-body-medium text-label-lg text-onSurfaceVariant mb-1.5">
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor="#6F7975"
        className="bg-surface-highest rounded-m3-sm border-b-2 border-outline px-4 py-3.5 font-body text-body-lg text-onSurface"
        {...inputProps}
      />
    </View>
  );
}
