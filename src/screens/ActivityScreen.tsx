import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSteps } from '@/context/StepContext';

export default function ActivityScreen() {
  const { stepsToday, resetToday } = useSteps();
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Live Activity</Text>
          <Text variant="displaySmall" style={{ marginTop: 8 }}>{stepsToday.toLocaleString()} steps</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={resetToday}>Start New Session</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 }
});
