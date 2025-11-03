import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Svg, Rect, Circle } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps, withDelay } from 'react-native-reanimated';
import Screen from '../components/Screen';
import { loadHistory, DayEntry } from '../storage/history';

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
  const total = data.reduce((acc, d) => acc + d.steps, 0);
  const avg = data.length ? Math.round(total / data.length) : 0;

  const ringP = useSharedValue(0);
  React.useEffect(() => {
    ringP.value = withTiming(Math.min(1, avg / 10000), { duration: 800 });
  }, [avg]);

  const size = 140;
  const strokeWidth = 14;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: c - c * ringP.value }));

  const AnimatedRect = Animated.createAnimatedComponent(Rect as any) as any;

  return (
    <Screen>
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Last 14 days</Text>
          <View style={{ alignSelf: 'center', marginTop: 12 }}>
            <Svg width={size} height={size}>
              <Circle cx={size/2} cy={size/2} r={r} stroke={'rgba(0,0,0,0.08)'} strokeWidth={strokeWidth} fill="none" />
              <AnimatedCircle cx={size/2} cy={size/2} r={r} stroke={'#6366F1'} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" strokeDasharray={`${c} ${c}`} animatedProps={animatedProps} rotation={-90} originX={size/2} originY={size/2} />
            </Svg>
            <Text variant="titleLarge" style={{ position: 'absolute', alignSelf: 'center', top: size/2 - 12 }}>{avg.toLocaleString()} avg</Text>
          </View>
          <Svg width={width} height={height} style={{ marginTop: 12 }}>
            {data.map((d, i) => {
              const targetH = Math.max(4, (d.steps / maxSteps) * (height - 20));
              const x = i * (barWidth + gap);
              const p = useSharedValue(0);
              React.useEffect(() => {
                p.value = withDelay(i * 30, withTiming(1, { duration: 500 }));
              }, [maxSteps]);
              const ap = useAnimatedProps(() => {
                const h = targetH * p.value;
                return { y: height - h, height: h } as any;
              });
              return <AnimatedRect key={d.date} x={x} animatedProps={ap} width={barWidth} fill="#6366F1" rx={4} />;
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 }
});
