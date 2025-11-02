import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput, Switch } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import Screen from '../components/Screen';
import { useSteps } from '../context/StepContext';
import { useAuth } from '../context/AuthContext';
import RotatingAvatar from '../components/RotatingAvatar';

export default function SettingsScreen() {
  const { goal, setGoal, fakeMode, setFakeMode } = useSteps();
  const [localGoal, setLocalGoal] = useState(String(goal));
  const [dark, setDark] = useState(false);
  const { logout } = useAuth();

  const save = () => {
    const parsed = parseInt(localGoal, 10);
    if (!isNaN(parsed) && parsed > 0) setGoal(parsed);
  };

  return (
    <Screen>
    <LinearGradient colors={["#ffffff", "#F6F9FC"]} style={styles.container}>
      <Card style={[styles.card, { overflow: 'hidden' }]}> 
        <LinearGradient colors={["#E8F7FF", "#FFFFFF"]} style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <RotatingAvatar />
            <View>
              <Text variant="titleLarge">Welcome back</Text>
              <Text style={{ opacity: 0.7 }}>Stay consistent today</Text>
            </View>
          </View>
        </LinearGradient>
      </Card>

      <Animated.View entering={FadeIn.duration(300)}>
        <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Daily Goal</Text>
          <TextInput
            keyboardType="number-pad"
            value={localGoal}
            onChangeText={setLocalGoal}
            mode="outlined"
            style={{ marginTop: 8 }}
          />
          <Button style={{ marginTop: 8 }} mode="contained" onPress={save}>Save Goal</Button>
        </Card.Content>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(100)}>
        <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Simulator</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text>Enable Fake Steps</Text>
            <Switch value={fakeMode} onValueChange={setFakeMode} />
          </View>
        </Card.Content>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(150)}>
        <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Appearance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text>Dark Mode</Text>
            <Switch value={dark} onValueChange={setDark} />
          </View>
          <Text style={{ opacity: 0.6, marginTop: 6 }}>Theme toggle is visual for now.</Text>
        </Card.Content>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(200)}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge">Account</Text>
            <Button
              mode="contained"
              onPress={logout}
              style={{ marginTop: 8 }}
            >
              Log out
            </Button>
          </Card.Content>
        </Card>
      </Animated.View>
    </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: { borderRadius: 20 }
});
