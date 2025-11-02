import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import AnimatedGradient from '../components/AnimatedGradient';
import Animated, { FadeIn, SlideInUp, FadeOut } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();

  const submit = async () => {
    try {
      setLoading(true);
      setError('');
      if (mode === 'login') await login(email, password);
      else await signup(email, password);
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (e: any) {
      setError(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top','bottom']}>
      <AnimatedGradient colors={["#F6F9FC", "#FFFFFF"]} style={StyleSheet.absoluteFillObject} />
      <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}> 
      <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: 'center', marginBottom: 16 }}>
        <Text variant="headlineMedium" style={{ fontWeight: '700' }}>FitTrack AI</Text>
        <Animated.Text
          entering={FadeIn.delay(150).duration(500)}
          style={{ opacity: 0.7, marginTop: 6 }}
        >
          Move better. Feel better.
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={SlideInUp.duration(600)} exiting={FadeOut.duration(200)}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginTop: 8 }} />
            {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
            <Button mode="contained" style={{ marginTop: 12, height: 48, borderRadius: 24 }} onPress={submit} loading={loading}>
              {mode === 'login' ? 'Login' : 'Sign up'}
            </Button>
            <Button style={{ marginTop: 8 }} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
            </Button>
            <Button mode="outlined" style={{ marginTop: 8, height: 48, borderRadius: 24 }} onPress={google} icon={() => (
              <MaterialCommunityIcons name="google" color="#DB4437" size={18} />
            )}>
              Continue with Google
            </Button>
          </Card.Content>
        </Card>
      </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { borderRadius: 20 }
});
