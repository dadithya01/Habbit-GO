import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with that email already exists.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Missing info", "Fill in your name, email, and password.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password too short", "Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Passwords don't match", "Double-check both password fields.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      // Navigation happens automatically once AuthContext's user updates.
    } catch (err) {
      Alert.alert("Couldn't create account", friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-paper"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-3">
              <Feather name="target" size={24} color="#FFFFFF" />
            </View>
            <Text className="font-display-bold text-2xl text-ink">Create your account</Text>
            <Text className="font-body text-sm text-muted mt-1">
              Start building habits that stick
            </Text>
          </View>

          <Text className="font-body-medium text-xs text-muted mb-1.5">NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#7C8B85"
            autoComplete="name"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-4">EMAIL</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#7C8B85"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-4">PASSWORD</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#7C8B85"
            secureTextEntry
            autoComplete="password-new"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Text className="font-body-medium text-xs text-muted mb-1.5 mt-4">
            CONFIRM PASSWORD
          </Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            placeholderTextColor="#7C8B85"
            secureTextEntry
            autoComplete="password-new"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Pressable
            onPress={handleRegister}
            disabled={submitting}
            className="bg-primary rounded-xl py-3.5 items-center mt-6"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-body-semibold text-white text-[15px]">Create account</Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6 mb-4">
            <Text className="font-body text-sm text-muted">Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text className="font-body-semibold text-sm text-primary">Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
