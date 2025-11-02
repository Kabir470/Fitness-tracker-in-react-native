import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBarIcon from './src/components/TabBarIcon';
import { LinearGradient } from 'expo-linear-gradient';
import DashboardScreen from './src/screens/DashboardScreen';
import ActivityScreen from './src/screens/ActivityScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import SleepScreen from './src/screens/SleepScreen';
import AIScreen from './src/screens/AIScreen';
import { StepProvider } from './src/context/StepContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import theme, { appColors } from './src/theme';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function usePaperTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const fontConfig = {
    displayLarge: { fontFamily: 'Poppins_700Bold' },
    displayMedium: { fontFamily: 'Poppins_700Bold' },
    displaySmall: { fontFamily: 'Poppins_600SemiBold' },
    headlineLarge: { fontFamily: 'Poppins_700Bold' },
    headlineMedium: { fontFamily: 'Poppins_600SemiBold' },
    headlineSmall: { fontFamily: 'Poppins_600SemiBold' },
    titleLarge: { fontFamily: 'Poppins_600SemiBold' },
    titleMedium: { fontFamily: 'Poppins_600SemiBold' },
    titleSmall: { fontFamily: 'Poppins_600SemiBold' },
    labelLarge: { fontFamily: 'Poppins_600SemiBold' },
    labelMedium: { fontFamily: 'Poppins_600SemiBold' },
    labelSmall: { fontFamily: 'Poppins_600SemiBold' },
    bodyLarge: { fontFamily: 'Poppins_400Regular' },
    bodyMedium: { fontFamily: 'Poppins_400Regular' },
    bodySmall: { fontFamily: 'Poppins_400Regular' }
  } as const;

  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const colors = isDark ? appColors.dark : appColors.light;
  const paperTheme = {
    ...base,
    colors: { ...base.colors, ...colors },
    fonts: configureFonts({ config: fontConfig })
  } as typeof base;

  const navTheme = isDark
    ? { ...NavDarkTheme, colors: { ...NavDarkTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } }
    : { ...NavDefaultTheme, colors: { ...NavDefaultTheme.colors, background: paperTheme.colors.background, card: paperTheme.colors.surface } };

  return { paperTheme, navTheme };
}

function MainTabs() {
  const { paperTheme, navTheme } = usePaperTheme();

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
                tabBarIcon: ({ color, size, focused }) => {
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
                  return (
                    <TabBarIcon focused={!!focused}>
                      <MaterialCommunityIcons name={name as any} size={size} color={color} />
                    </TabBarIcon>
                  );
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
  const { paperTheme, navTheme } = usePaperTheme();

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
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold });
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
