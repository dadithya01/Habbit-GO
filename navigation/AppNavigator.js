import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

import { AuthProvider, useAuth } from "../contexts/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import CalendarScreen from "../screens/CalendarScreen";
import AddEditHabitScreen from "../screens/AddEditHabitScreen";
import SignInScreen from "../screens/SignInScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1B4B43",
        tabBarInactiveTintColor: "#7C8B85",
        tabBarStyle: {
          borderTopColor: "#E5E7E0",
          height: 58,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter_500Medium" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size - 2} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" color={color} size={size - 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen
        name="AddEditHabit"
        component={AddEditHabitScreen}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function AuthFlow() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function RootSwitch() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View className="flex-1 bg-paper items-center justify-center">
        <ActivityIndicator color="#1B4B43" />
      </View>
    );
  }

  return user ? <MainStack /> : <AuthFlow />;
}

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootSwitch />
      </NavigationContainer>
    </AuthProvider>
  );
}
