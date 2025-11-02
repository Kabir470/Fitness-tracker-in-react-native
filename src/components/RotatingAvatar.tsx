import React from 'react';
import { Image, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RotatingAvatar({ size = 88, uri }: { size?: number; uri?: string }) {
  const rotation = useSharedValue(0);
  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 8000 }), -1);
  }, []);
  const ring = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  const ringSize = size + 14;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[{ width: ringSize, height: ringSize, borderRadius: ringSize / 2, position: 'absolute' }, ring]}>
        <LinearGradient colors={["#4DC6FF", "#2EE58F"]} style={{ flex: 1, borderRadius: ringSize / 2 }} />
      </Animated.View>
      <View style={{ width: size + 6, height: size + 6, borderRadius: (size + 6) / 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          <MaterialCommunityIcons name="account" size={size * 0.6} color="#101418" />
        )}
      </View>
    </View>
  );
}
