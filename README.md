# Streak — Habit Tracker

React Native (Expo) habit tracker with NativeWind (Tailwind CSS) styling and
Firebase/Firestore persistence. Built for an AMD (Advanced Mobile Development) module.

## Features
- Email/password sign up, sign in, sign out, and forgot-password flow
- Add / edit / delete habits (name, description, icon, color, frequency)
- One-tap daily check-off with a live streak counter
- Per-habit calendar/history view showing every completed day, plus current & best streak
- Data synced live to Firestore, scoped per-account

## Project structure
```
App.js                     entry point, loads fonts
navigation/                auth stack + bottom tabs + modal stack, switches on sign-in state
contexts/AuthContext.js    app-wide auth state (user, register, login, logout, resetPassword)
screens/                   SignInScreen, RegisterScreen, HomeScreen, AddEditHabitScreen, CalendarScreen
components/                HabitCard, StreakBadge, EmptyState
hooks/                     useHabits, useCheckIns (data hooks screens call)
services/habitService.js   all Firestore reads/writes (data layer)
firebase/firebaseConfig.js Firebase init + auth functions
utils/                     date + streak calculation helpers
firestore.rules            security rules to paste into Firebase console
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Firebase project
1. Go to https://console.firebase.google.com → **Add project**.
2. Inside the project, click the **</>** (web) icon to register a web app —
   this works for Expo too, no separate iOS/Android app needed for Firestore.
3. Copy the config values shown into a new `.env` file (copy `.env.example` first):
   ```bash
   cp .env.example .env
   ```
4. In the Firebase console, go to **Build → Firestore Database → Create database**
   (start in production mode).
5. Go to **Build → Authentication → Sign-in method** and enable **Email/Password**.
6. In Firestore → **Rules**, paste the contents of `firestore.rules` and publish.

### 3. Run the app
```bash
npx expo start
```
Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `i` / `a`
for a simulator/emulator. First launch will show the sign-in screen — tap
"Create an account" to register.

## Data model (Firestore)
```
habits/{habitId}
  userId, name, description, icon, color, frequency, createdAt, updatedAt

habits/{habitId}/checkIns/{YYYY-MM-DD}
  completedAt
```
Streaks are computed on-device from the set of `checkIns` doc IDs (see
`utils/streakUtils.js`) rather than stored as a field, so they're always
correct even if a past day gets un-checked.

## Notes for grading / write-up
- **Auth:** email/password via Firebase Auth, with app-wide state in
  `contexts/AuthContext.js`. Navigation (`navigation/AppNavigator.js`) shows
  the auth stack (Sign in / Register) or the main app based on whether
  `user` is set, with a loading spinner while Firebase checks for an
  existing session on launch.
- **Why a `services/` data layer instead of calling Firestore in screens:**
  keeps UI components storage-agnostic, so the module could point at a REST
  API instead of Firestore by only editing `habitService.js`.
- **Note if migrating from an earlier anonymous-auth version:** any habits
  created under the old anonymous account won't be visible once you're
  signed in with a real account — they belonged to a different `uid`. That's
  expected; it isn't a bug.
