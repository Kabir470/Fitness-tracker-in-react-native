import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ProgressRing from '../components/ProgressRing';
import Screen from '../components/Screen';
import { useSteps } from '../context/StepContext';
import FlipCard from '../components/FlipCard';
import FABPlus from '../components/FABPlus';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const STEPS_TO_KM = 0.00078; // ~0.78m per step
const CAL_PER_STEP = 0.04; // rough estimate

export default function DashboardScreen() {
  const { stepsToday, goal, resetToday, isPedometerAvailable, fakeMode, setFakeMode } = useSteps();
  const theme = useTheme();
  const progress = Math.min(1, stepsToday / goal);
  const km = stepsToday * STEPS_TO_KM;
  const calories = Math.round(stepsToday * CAL_PER_STEP);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    glow.value = withTiming(progress >= 1 ? 1 : 0, { duration: 600 });
  }, [progress]);

  const glowS = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <Screen>
    <LinearGradient colors={[theme.colors.background, theme.colors.surface]} style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Today</Text>

      <Card style={[styles.card, styles.shadow]}>
        <LinearGradient colors={[theme.colors.secondary + '55', theme.colors.primary + '55']} style={styles.headerGradient} />
        <Card.Content style={styles.ringRow}>
          <View style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={[{ position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: theme.colors.primary + '22', shadowColor: theme.colors.primary, shadowOpacity: 0.6, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } }, glowS]} />
            <ProgressRing size={160} progress={progress} tintColor={theme.colors.primary} />
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text variant="displaySmall" style={{ fontWeight: '700' }}>{stepsToday.toLocaleString()}</Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>steps</Text>
            <Text variant="labelLarge" style={{ marginTop: 8 }}>Goal {goal.toLocaleString()}</Text>
            <Text variant="labelLarge">{(progress * 100).toFixed(0)}%</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={resetToday}>Reset</Button>
          <Button mode={fakeMode ? 'contained' : 'outlined'} onPress={() => setFakeMode(!fakeMode)}>
            {fakeMode ? 'Simulating' : 'Simulate'}
          </Button>
        </Card.Actions>
      </Card>

      <FlipCard
        height={120}
        front={
          <Card style={[styles.banner, styles.shadow]}> 
            <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text variant="titleMedium">Heart Rate</Text>
                <Text variant="displaySmall" style={{ fontWeight: '700' }}>-- bpm</Text>
              </View>
              <View>
                <Text variant="titleMedium">Calories</Text>
                <Text variant="displaySmall" style={{ fontWeight: '700' }}>{calories}</Text>
              </View>
            </Card.Content>
          </Card>
        }
        back={
          <Card style={[styles.banner, styles.shadow]}> 
            <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text variant="titleMedium">Water</Text>
                <Text variant="displaySmall" style={{ fontWeight: '700' }}>-- L</Text>
              </View>
              <View>
                <Text variant="titleMedium">Distance</Text>
                <Text variant="displaySmall" style={{ fontWeight: '700' }}>{km.toFixed(2)} km</Text>
              </View>
            </Card.Content>
          </Card>
        }
      />

      <View style={styles.row}>
        <Card style={[styles.smallCard, styles.shadow]}>
          <BlurView intensity={30} style={{ borderRadius: 20, overflow: 'hidden' }}>
            <Card.Content>
              <Text variant="titleLarge">{km.toFixed(2)} km</Text>
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>distance</Text>
            </Card.Content>
          </BlurView>
        </Card>
        <Card style={[styles.smallCard, styles.shadow]}>
          <BlurView intensity={30} style={{ borderRadius: 20, overflow: 'hidden' }}>
            <Card.Content>
              <Text variant="titleLarge">{calories} kcal</Text>
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>burned</Text>
            </Card.Content>
          </BlurView>
        </Card>
      </View>

      <Card style={[styles.banner, styles.shadow]}>
        <Card.Content>
          <Text variant="bodyMedium" style={{ opacity: 0.85 }}>
            "Small steps every day add up. You've got this!"
          </Text>
        </Card.Content>
      </Card>

      <Text variant="bodySmall" style={{ opacity: 0.6, marginTop: 8, textAlign: 'center' }}>
        Pedometer: {isPedometerAvailable === null ? 'checking…' : isPedometerAvailable ? 'available' : 'not available'}
      </Text>

      <FABPlus onPress={() => { /* Quick actions placeholder: could navigate or open action sheet */ }} />
    </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { marginBottom: 4 },
  card: { borderRadius: 20, overflow: 'hidden' },
  headerGradient: { ...StyleSheet.absoluteFillObject },
  ringRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  smallCard: { flex: 1, borderRadius: 20, overflow: 'hidden' },
  banner: { marginTop: 12, borderRadius: 20 },
  shadow: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 }
});
