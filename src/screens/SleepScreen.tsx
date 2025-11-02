import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

type Sleep = { id: string; start: any; end?: any; durationMin?: number };

export default function SleepScreen() {
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const startRef = useRef<number | null>(null);
  const [items, setItems] = useState<Sleep[]>([]);

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, 'users', user.uid, 'sleep');
    const q = query(ref, orderBy('start', 'desc'));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as any));
    return unsub;
  }, [user]);

  const start = () => {
    startRef.current = Date.now();
    setRunning(true);
  };
  const stop = async () => {
    if (!user || !startRef.current) return;
    const durationMin = Math.max(1, Math.round((Date.now() - startRef.current) / 60000));
    await addDoc(collection(db, 'users', user.uid, 'sleep'), {
      start: serverTimestamp(),
      end: serverTimestamp(),
      durationMin,
    });
    startRef.current = null;
    setRunning(false);
  };

  return (
    <Screen>
    <LinearGradient colors={["#2a1b5a", "#0d1b2a"]} style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Sleep tracker</Text>
          <View style={styles.glowWrap}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.glowBtn}>
              <Button textColor="#fff" style={{ backgroundColor: 'transparent' }} onPress={running ? stop : start}>
                {running ? 'Stop Sleep' : 'Start Sleep'}
              </Button>
            </LinearGradient>
          </View>
        </Card.Content>
      </Card>
      <Card style={[styles.card, { marginTop: 12 }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>Recent</Text>
          {items.map((s) => (
            <Text key={s.id} style={{ marginBottom: 4 }}>{s.durationMin ?? '?'} min</Text>
          ))}
          {items.length === 0 ? <Text style={{ opacity: 0.6 }}>No sleep logs yet.</Text> : null}
        </Card.Content>
      </Card>
    </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 20 },
  glowWrap: { alignItems: 'center', marginTop: 12 },
  glowBtn: { borderRadius: 28, width: 220, shadowColor: '#6a11cb', shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 }
});
