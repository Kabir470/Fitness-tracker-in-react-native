import React, { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolate, useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function FlipCard({
  front,
  back,
  onFlip,
  height = 120,
}: PropsWithChildren<{ front: React.ReactNode; back: React.ReactNode; onFlip?: (flipped: boolean) => void; height?: number }>) {
  const flipped = useSharedValue(0);
  const toggle = () => {
    const next = flipped.value === 1 ? 0 : 1;
    flipped.value = withTiming(next, { duration: 500 });
    onFlip?.(!!next);
  };

  const frontS = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(flipped.value, [0, 1], [0, 180])}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height,
  }));
  const backS = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(flipped.value, [0, 1], [180, 360])}deg` }],
    backfaceVisibility: 'hidden',
    width: '100%',
    height,
  }));

  return (
    <Pressable onPress={toggle} style={{ width: '100%', height }}>
      <View style={{ width: '100%', height }}>
        <Animated.View style={frontS}>{front}</Animated.View>
        <Animated.View style={backS}>{back}</Animated.View>
      </View>
    </Pressable>
  );
}
