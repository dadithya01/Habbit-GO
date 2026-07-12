import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  auth,
  registerWithEmail,
  loginWithEmail,
  logout as firebaseLogout,
  resetPassword,
} from "../firebase/firebaseConfig";

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  register: typeof registerWithEmail;
  login: typeof loginWithEmail;
  logout: typeof firebaseLogout;
  resetPassword: typeof resetPassword;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    initializing,
    register: registerWithEmail,
    login: loginWithEmail,
    logout: firebaseLogout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
