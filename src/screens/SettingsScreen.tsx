import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput, Switch } from 'react-native-paper';
import { useSteps } from '@/context/StepContext';

export default function SettingsScreen() {
  const { goal, setGoal, fakeMode, setFakeMode } = useSteps();
  const [localGoal, setLocalGoal] = useState(String(goal));

  const save = () => {
    const parsed = parseInt(localGoal, 10);
    if (!isNaN(parsed) && parsed > 0) setGoal(parsed);
  };

  return (
    <View style={styles.container}>
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

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Simulator</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <Text>Enable Fake Steps</Text>
            <Switch value={fakeMode} onValueChange={setFakeMode} />
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: { borderRadius: 16 }
});
