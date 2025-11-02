import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Svg, Rect } from 'react-native-svg';
import { loadHistory, DayEntry } from '@/storage/history';

export default function HistoryScreen() {
  const [items, setItems] = useState<DayEntry[]>([]);
  useEffect(() => {
    (async () => setItems(await loadHistory()))();
  }, []);
  const data = items.slice(0, 14).reverse();

  const width = Dimensions.get('window').width - 32; // padding
  const height = 180;
  const barCount = Math.max(1, data.length);
  const gap = 6;
  const barWidth = Math.max(4, (width - gap * (barCount - 1)) / barCount);
  const maxSteps = Math.max(1, ...data.map((d) => d.steps));

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Last 14 days</Text>
          <Svg width={width} height={height} style={{ marginTop: 12 }}>
            {data.map((d, i) => {
              const h = Math.max(4, (d.steps / maxSteps) * (height - 20));
              const x = i * (barWidth + gap);
              const y = height - h;
              return <Rect key={d.date} x={x} y={y} width={barWidth} height={h} fill="#00E676" rx={4} />;
            })}
          </Svg>
          {data.length === 0 ? (
            <Text variant="bodyMedium" style={{ marginTop: 8, opacity: 0.7 }}>
              Walk today to start building your history.
            </Text>
          ) : null}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 }
});
