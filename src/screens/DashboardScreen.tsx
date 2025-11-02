import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, Card, Button, useTheme } from 'react-native-paper';
import { useSteps } from '@/context/StepContext';

const STEPS_TO_KM = 0.00078; // ~0.78m per step
const CAL_PER_STEP = 0.04; // rough estimate

export default function DashboardScreen() {
  const { stepsToday, goal, resetToday, isPedometerAvailable, fakeMode, setFakeMode } = useSteps();
  const theme = useTheme();
  const progress = Math.min(1, stepsToday / goal);
  const km = stepsToday * STEPS_TO_KM;
  const calories = Math.round(stepsToday * CAL_PER_STEP);

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>Today</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="displayMedium" style={{ fontWeight: '700' }}>{stepsToday.toLocaleString()}</Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7 }}>steps</Text>
          <ProgressBar progress={progress} style={styles.progress} color={theme.colors.primary} />
          <Text variant="labelLarge">Goal: {goal.toLocaleString()} steps • {(progress * 100).toFixed(0)}%</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={resetToday}>Reset</Button>
          <Button
            mode={fakeMode ? 'contained-tonal' : 'outlined'}
            onPress={() => setFakeMode(!fakeMode)}
          >
            {fakeMode ? 'Simulating' : 'Simulate'}
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.row}>
        <Card style={styles.smallCard}>
          <Card.Content>
            <Text variant="titleLarge">{km.toFixed(2)} km</Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>distance</Text>
          </Card.Content>
        </Card>
        <Card style={styles.smallCard}>
          <Card.Content>
            <Text variant="titleLarge">{calories} kcal</Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>burned</Text>
          </Card.Content>
        </Card>
      </View>

      <Text variant="bodySmall" style={{ opacity: 0.6, marginTop: 8 }}>
        Pedometer: {isPedometerAvailable === null ? 'checking…' : isPedometerAvailable ? 'available' : 'not available'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { marginBottom: 4 },
  card: { borderRadius: 16 },
  progress: { marginTop: 12, height: 10, borderRadius: 8 },
  row: { flexDirection: 'row', gap: 12, marginTop: 8 },
  smallCard: { flex: 1, borderRadius: 16 }
});
