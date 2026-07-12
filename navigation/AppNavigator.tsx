import type { ComponentProps } from "react";
import { View, Text, ActivityIndicator } from "react-native";
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
import type { AuthStackParamList, MainStackParamList, TabParamList } from "../types/navigation";

type FeatherIconName = ComponentProps<typeof Feather>["name"];

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

/** M3 NavigationBar item: pill-shaped indicator behind the icon when active. */
function NavIcon({ name, focused }: { name: FeatherIconName; focused: boolean }) {
    return (
        <View
            className={`w-16 h-8 rounded-full items-center justify-center ${
                focused ? "bg-secondary-container" : ""
            }`}
        >
            <Feather name={name} size={22} color={focused ? "#05201A" : "#3F4944"} />
        </View>
    );
}

function NavLabel({ label, focused }: { label: string; focused: boolean }) {
    return (
        <Text
            className="font-body-medium text-label-sm mt-1"
            style={{ color: focused ? "#191C1A" : "#3F4944" }}
        >
            {label}
        </Text>
    );
}

function Tabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: "#EBEEEB",
                    borderTopWidth: 0,
                    height: 74,
                    paddingTop: 10,
                },
                tabBarItemStyle: { paddingTop: 2 },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => <NavIcon name="home" focused={focused} />,
                    tabBarLabel: ({ focused }) => <NavLabel label="Home" focused={focused} />,
                }}
            />
            <Tab.Screen
                name="History"
                component={CalendarScreen}
                options={{
                    tabBarIcon: ({ focused }) => <NavIcon name="calendar" focused={focused} />,
                    tabBarLabel: ({ focused }) => <NavLabel label="History" focused={focused} />,
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
            <View className="flex-1 bg-surface items-center justify-center">
                <ActivityIndicator color="#00876B" />
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
