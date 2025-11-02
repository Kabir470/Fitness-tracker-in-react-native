import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';

export default function AuthScreen() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>FitTrack AI</Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7, marginBottom: 8 }}>
            {mode === 'login' ? 'Log in to continue' : 'Create your account'}
          </Text>
          <TextInput mode="outlined" label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput mode="outlined" label="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ marginTop: 8 }} />
          {error ? <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text> : null}
          <Button mode="contained" style={{ marginTop: 12 }} onPress={submit} loading={loading}>
            {mode === 'login' ? 'Login' : 'Sign up'}
          </Button>
          <Button style={{ marginTop: 8 }} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
          </Button>
          <Button mode="outlined" style={{ marginTop: 8 }} onPress={google}>
            Continue with Google
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { borderRadius: 16 }
});
