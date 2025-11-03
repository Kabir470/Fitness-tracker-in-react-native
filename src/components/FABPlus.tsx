import React from 'react';
import { Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

export default function FABPlus({ onPress }: { onPress?: () => void }) {
  const scale = useSharedValue(1);
  const as = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[{ position: 'absolute', right: 20, bottom: 30, borderRadius: 32 }, as]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.95))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={{ borderRadius: 32, overflow: 'hidden' }}
      >
  <LinearGradient colors={["#6366F1", "#22D3EE"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="plus" size={28} color="#fff" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
