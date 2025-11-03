import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Text, Card, TextInput, Button, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, useSharedValue, withRepeat, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import AnimatedBar from '../components/AnimatedBar';

type Workout = { id: string; type: string; durationMin: number; createdAt?: any };

export default function WorkoutScreen() {
  const { user } = useAuth();
  const [type, setType] = useState('Walk');
  const [duration, setDuration] = useState('30');
  const [items, setItems] = useState<Workout[]>([]);
  const [showStats, setShowStats] = useState(false);
  const pulse = useSharedValue(1);
  React.useEffect(() => {
    pulse.value = withRepeat(withSpring(1.15, { damping: 10, stiffness: 100 }), -1, true);
  }, []);
  const pulseS = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

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

  const renderItem = ({ item }: { item: Workout }) => (
    <Card style={[styles.gridCard, styles.shadow]}>
      <Card.Content style={{ alignItems: 'center' }}>
  <MaterialCommunityIcons name="dumbbell" size={28} color="#6366F1" />
        <Text variant="titleMedium" style={{ marginTop: 6 }}>{item.type}</Text>
        <Text style={{ opacity: 0.7 }}>{item.durationMin} min</Text>
      </Card.Content>
    </Card>
  );

  return (
    <Screen>
    <View style={styles.container}>
      <LinearGradient colors={["#E8F7FF", "#FFFFFF"]} style={styles.hero}>
        <Animated.View entering={FadeInUp.duration(500)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text variant="titleLarge">Lower Body Blast</Text>
            <Text style={{ opacity: 0.7 }}>Quick start session</Text>
          </View>
          <Animated.View style={pulseS}>
            <MaterialCommunityIcons name="heart" size={28} color="#FF5A8F" />
          </Animated.View>
        </Animated.View>
        <View style={{ marginTop: 12 }}>
          <AnimatedBar progress={0.35} />
        </View>
      </LinearGradient>
      <Card style={[styles.card, styles.shadow]}>
        <Card.Content>
          <Text variant="titleLarge">Log workout</Text>
          <TextInput mode="outlined" label="Type" value={type} onChangeText={setType} style={{ marginTop: 8 }} />
          <TextInput mode="outlined" label="Duration (min)" keyboardType="number-pad" value={duration} onChangeText={setDuration} style={{ marginTop: 8 }} />
          <Button mode="contained" style={{ marginTop: 8 }} onPress={add} disabled={!user}>Add</Button>
          <Button mode="outlined" style={{ marginTop: 8 }} onPress={() => setShowStats((s) => !s)}>
            {showStats ? 'Hide session stats' : 'Show session stats'}
          </Button>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={{ marginTop: 12, marginBottom: 8 }}>History</Text>
      {items.length === 0 ? (
        <Text style={{ opacity: 0.6 }}>No workouts yet.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={renderItem}
        />
      )}

      {showStats ? (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.bottomSheet}>
          <Card style={{ borderRadius: 20 }}>
            <Card.Content>
              <Text variant="titleLarge">Session</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <View>
                  <Text>Calories</Text>
                  <Text variant="titleMedium">120 kcal</Text>
                </View>
                <View>
                  <Text>Time</Text>
                  <Text variant="titleMedium">00:35</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text>Heart</Text>
                  <Animated.View style={pulseS}>
                    <MaterialCommunityIcons name="heart-pulse" size={24} color="#FF5A8F" />
                  </Animated.View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      ) : null}
    </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hero: { borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  card: { borderRadius: 20 },
  gridCard: { flex: 1, borderRadius: 20 },
  shadow: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  bottomSheet: { position: 'absolute', left: 16, right: 16, bottom: 16 }
});
