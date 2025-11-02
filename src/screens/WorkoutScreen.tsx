import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, TextInput, Button, List } from 'react-native-paper';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

type Workout = { id: string; type: string; durationMin: number; createdAt?: any };

export default function WorkoutScreen() {
  const { user } = useAuth();
  const [type, setType] = useState('Walk');
  const [duration, setDuration] = useState('30');
  const [items, setItems] = useState<Workout[]>([]);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'workouts');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Workout[]);
    });
    return unsub;
  }, [user]);

  const add = async () => {
    if (!user) return;
    const durationMin = parseInt(duration, 10) || 0;
    await addDoc(collection(db, 'users', user.uid, 'workouts'), { type, durationMin, createdAt: serverTimestamp() });
    setDuration('');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Log workout</Text>
          <TextInput mode="outlined" label="Type" value={type} onChangeText={setType} style={{ marginTop: 8 }} />
          <TextInput mode="outlined" label="Duration (min)" keyboardType="number-pad" value={duration} onChangeText={setDuration} style={{ marginTop: 8 }} />
          <Button mode="contained" style={{ marginTop: 8 }} onPress={add} disabled={!user}>
            Add
          </Button>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { marginTop: 12 }] }>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>History</Text>
          {items.map((w) => (
            <List.Item
              key={w.id}
              title={`${w.type} · ${w.durationMin} min`}
              left={(p) => <List.Icon {...p} icon="dumbbell" />}
            />
          ))}
          {items.length === 0 ? <Text style={{ opacity: 0.6 }}>No workouts yet.</Text> : null}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 }
});
