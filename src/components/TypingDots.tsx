import React from 'react';
import { View } from 'react-native';
import Animated, { withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue, Easing, type SharedValue } from 'react-native-reanimated';

export default function TypingDots({ color = '#444' }: { color?: string }) {
  const a1 = useSharedValue(0.3);
  const a2 = useSharedValue(0.3);
  const a3 = useSharedValue(0.3);

  React.useEffect(() => {
    const seq = () => withRepeat(withSequence(withTiming(1, { duration: 400, easing: Easing.inOut(Easing.quad) }), withTiming(0.3, { duration: 400 })), -1, false);
    a1.value = seq();
    setTimeout(() => (a2.value = seq()), 150);
    setTimeout(() => (a3.value = seq()), 300);
  }, []);

  const dot = (v: SharedValue<number>) => useAnimatedStyle(() => ({ opacity: v.value }));

  return (
    <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 6 }}>
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, dot(a1)]} />
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, dot(a2)]} />
      <Animated.View style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }, dot(a3)]} />
    </View>
  );
}
