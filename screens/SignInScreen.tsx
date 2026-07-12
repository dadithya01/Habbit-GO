import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

export default function SignInScreen({ navigation }: AuthScreenProps<"SignIn">) {
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
    } catch (err) {
      Alert.alert("Couldn't sign in", friendlyError((err as AuthErrorLike).code));
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
      .catch((err: AuthErrorLike) =>
        Alert.alert("Couldn't send reset email", friendlyError(err.code))
      );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-surface"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-center px-6">
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-m3-lg bg-primary items-center justify-center mb-4">
              <Feather name="zap" size={26} color="#FFFFFF" />
            </View>
            <Text className="font-display-bold text-headline-lg text-onSurface">
              Welcome back
            </Text>
            <Text className="font-body text-body-md text-onSurfaceVariant mt-1">
              Sign in to keep your streaks going
            </Text>
          </View>

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
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />

          <Pressable onPress={handleForgotPassword} className="self-end mt-3">
            <Text className="font-body-medium text-label-lg text-primary">Forgot password?</Text>
          </Pressable>

          <PressableScale
            onPress={handleSignIn}
            disabled={submitting}
            className="bg-primary rounded-full py-4 items-center mt-6"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-body-semibold text-onPrimary text-title-md">Sign in</Text>
            )}
          </PressableScale>

          <View className="flex-row justify-center mt-6">
            <Text className="font-body text-body-md text-onSurfaceVariant">New here? </Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text className="font-body-semibold text-body-md text-primary">
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
