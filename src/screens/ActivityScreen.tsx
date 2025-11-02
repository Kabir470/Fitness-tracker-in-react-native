import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import ProgressRing from '../components/ProgressRing';
import Animated, { FadeIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import { useSteps } from '../context/StepContext';

export default function ActivityScreen() {
  const { stepsToday, goal, resetToday } = useSteps();
  const progress = Math.min(1, stepsToday / goal);
  return (
    <Screen>
    <LinearGradient colors={["#ffffff", "#F6F9FC"]} style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text variant="titleLarge">Live Activity</Text>
            <View style={{ marginTop: 12 }}>
              <ProgressRing size={180} progress={progress} />
              <Text variant="displaySmall" style={{ position: 'absolute', alignSelf: 'center', top: 72, fontWeight: '700' }}>
                {stepsToday.toLocaleString()}
              </Text>
            </View>
            <Text style={{ opacity: 0.7, marginTop: 8 }}>steps</Text>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={resetToday}>Start New Session</Button>
          </Card.Actions>
        </Card>
      </Animated.View>
    </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 20 }
});
