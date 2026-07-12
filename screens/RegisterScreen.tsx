import { useState } from "react";
import {
  View,
  Text,
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
import M3TextField from "../components/M3TextField";
import PressableScale from "../components/PressableScale";
import type { AuthScreenProps } from "../types/navigation";

interface AuthErrorLike {
  code?: string;
  message?: string;
}

function friendlyError(code?: string): string {
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

export default function RegisterScreen({ navigation }: AuthScreenProps<"Register">) {
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
    } catch (err) {
      Alert.alert("Couldn't create account", friendlyError((err as AuthErrorLike).code));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface"
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          className="px-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-m3-lg bg-primary items-center justify-center mb-4">
              <Feather name="target" size={26} color="#FFFFFF" />
            </View>
            <Text className="font-display-bold text-headline-lg text-onSurface">
              Create your account
            </Text>
            <Text className="font-body text-body-md text-onSurfaceVariant mt-1">
              Start building habits that stick
            </Text>
          </View>

          <M3TextField
            label="NAME"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoComplete="name"
          />
          <M3TextField
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <M3TextField
            label="PASSWORD"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoComplete="password-new"
          />
          <M3TextField
            label="CONFIRM PASSWORD"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            secureTextEntry
            autoComplete="password-new"
          />

          <PressableScale
            onPress={handleRegister}
            disabled={submitting}
            className="bg-primary rounded-full py-4 items-center mt-6"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-body-semibold text-onPrimary text-title-md">
                Create account
              </Text>
            )}
          </PressableScale>

          <View className="flex-row justify-center mt-6 mb-4">
            <Text className="font-body text-body-md text-onSurfaceVariant">
              Already have an account?{" "}
            </Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              <Text className="font-body-semibold text-body-md text-primary">Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
