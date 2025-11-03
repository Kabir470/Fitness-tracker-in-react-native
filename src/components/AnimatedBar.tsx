import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function AnimatedBar({ progress, height = 8, color = '#6366F1' }: { progress: number; height?: number; color?: string }) {
  const p = useSharedValue(0);
  React.useEffect(() => {
    p.value = withTiming(Math.max(0, Math.min(1, progress)), { duration: 800 });
  }, [progress]);
  const s = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <View style={{ width: '100%', height, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: height / 2, overflow: 'hidden' }}>
      <Animated.View style={[{ height: '100%', backgroundColor: color }, s]} />
    </View>
  );
}
