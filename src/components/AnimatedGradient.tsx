import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient as any);

export default function AnimatedGradient({
  style,
  colors = ['#F6F9FC', '#FFFFFF'],
  duration = 6000,
}: { style?: StyleProp<ViewStyle>; colors?: string[]; duration?: number }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(withTiming(1, { duration }), -1, true);
    y.value = withRepeat(withTiming(1, { duration: duration * 1.2 }), -1, true);
  }, []);

  const animatedProps = useAnimatedStyle(() => ({
    start: { x: 0 + x.value * 0.2, y: 0 + y.value * 0.2 },
    end: { x: 1 - x.value * 0.2, y: 1 - y.value * 0.2 },
  }) as any);

  return (
    <AnimatedLG
      colors={colors}
      style={style}
      // @ts-ignore Reanimated injects start/end via animated style
      {...animatedProps}
    />
  );
}
