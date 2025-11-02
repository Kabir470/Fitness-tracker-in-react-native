import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '@/screens/DashboardScreen';
import ActivityScreen from '@/screens/ActivityScreen';
import HistoryScreen from '@/screens/HistoryScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import WorkoutScreen from '@/screens/WorkoutScreen';
import SleepScreen from '@/screens/SleepScreen';
import AIScreen from '@/screens/AIScreen';
import { StepProvider } from '@/context/StepContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthScreen from '@/screens/AuthScreen';
import theme from '@/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const paperTheme = isDark ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...theme.colors.dark } } : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...theme.colors.light } };
  const navTheme = isDark ? { ...NavDarkTheme, colors: { ...NavDarkTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } } : { ...NavDefaultTheme, colors: { ...NavDefaultTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } };

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
        <StepProvider>
          <NavigationContainer theme={navTheme}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: paperTheme.colors.primary,
                tabBarStyle: { backgroundColor: paperTheme.colors.elevation.level2 },
                tabBarIcon: ({ color, size }) => {
                  const map = {
                    Dashboard: 'walk',
                    Activity: 'run-fast',
                    Workouts: 'dumbbell',
                    Sleep: 'power-sleep',
                    History: 'chart-line',
                    AI: 'robot-happy',
                    Settings: 'cog'
                  } as const;
                  const name = map[route.name as keyof typeof map] ?? 'circle-outline';
                  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
                }
              })}
            >
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
              <Tab.Screen name="Activity" component={ActivityScreen} />
              <Tab.Screen name="Workouts" component={WorkoutScreen} />
              <Tab.Screen name="Sleep" component={SleepScreen} />
              <Tab.Screen name="History" component={HistoryScreen} />
              <Tab.Screen name="AI" component={AIScreen} />
              <Tab.Screen name="Settings" component={SettingsScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </StepProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

function Root() {
  const { user, loading } = useAuth();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const paperTheme = isDark ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...theme.colors.dark } } : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...theme.colors.light } };
  const navTheme = isDark ? { ...NavDarkTheme, colors: { ...NavDarkTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } } : { ...NavDefaultTheme, colors: { ...NavDefaultTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } };

  if (loading) {
    return (
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <></>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  if (!user) {
    return (
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={AuthScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  return <MainTabs />;
}

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const paperTheme = isDark ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...theme.colors.dark } } : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...theme.colors.light } };
  const navTheme = isDark ? { ...NavDarkTheme, colors: { ...NavDarkTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } } : { ...NavDefaultTheme, colors: { ...NavDefaultTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } };

  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
