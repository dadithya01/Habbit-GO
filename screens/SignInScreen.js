import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

function friendlyError(code) {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a bit.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignInScreen({ navigation }) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password) {
      Alert.alert("Missing info", "Enter your email and password to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      // Navigation happens automatically once AuthContext's user updates.
    } catch (err) {
      Alert.alert("Couldn't sign in", friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert("Enter your email first", "Type your email above, then tap this again.");
      return;
    }
    resetPassword(email)
      .then(() =>
        Alert.alert("Check your inbox", `We sent a password reset link to ${email.trim()}.`)
      )
      .catch((err) => Alert.alert("Couldn't send reset email", friendlyError(err.code)));
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-paper"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-8">
            <View className="w-14 h-14 rounded-2xl bg-primary items-center justify-center mb-3">
              <Feather name="zap" size={24} color="#FFFFFF" />
            </View>
            <Text className="font-display-bold text-2xl text-ink">Welcome back</Text>
            <Text className="font-body text-sm text-muted mt-1">
              Sign in to keep your streaks going
            </Text>
          </View>

          <Text className="font-body-medium text-xs text-muted mb-1.5">EMAIL</Text>
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
            placeholder="••••••••"
            placeholderTextColor="#7C8B85"
            secureTextEntry
            autoComplete="password"
            className="bg-surface border border-line rounded-xl px-4 py-3 font-body text-ink"
          />

          <Pressable onPress={handleForgotPassword} className="self-end mt-2">
            <Text className="font-body-medium text-xs text-primary">Forgot password?</Text>
          </Pressable>

          <Pressable
            onPress={handleSignIn}
            disabled={submitting}
            className="bg-primary rounded-xl py-3.5 items-center mt-6"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-body-semibold text-white text-[15px]">Sign in</Text>
            )}
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="font-body text-sm text-muted">New here? </Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text className="font-body-semibold text-sm text-primary">Create an account</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
