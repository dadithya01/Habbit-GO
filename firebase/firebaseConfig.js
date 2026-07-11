import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Avoid re-initializing on fast refresh
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // initializeAuth throws if it's already been called on this app instance
  // (e.g. during Fast Refresh) — fall back to the existing instance.
  auth = getAuth(app);
}

const db = getFirestore(app);

/** Creates an account and sets the display name in one step. */
async function registerWithEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name?.trim()) {
    await updateProfile(cred.user, { displayName: name.trim() });
  }
  return cred.user;
}

function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password).then((cred) => cred.user);
}

function logout() {
  return signOut(auth);
}

function resetPassword(email) {
  return sendPasswordResetEmail(auth, email.trim());
}

export { app, auth, db, registerWithEmail, loginWithEmail, logout, resetPassword };

