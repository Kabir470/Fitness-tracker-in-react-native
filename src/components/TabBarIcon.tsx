import React from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function TabBarIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const s = useAnimatedStyle(() => ({ transform: [{ scale: withTiming(focused ? 1.15 : 1, { duration: 200 }) }] }));
  return <Animated.View style={s}>{children}</Animated.View>;
}
