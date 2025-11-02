import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Screen from '../components/Screen';
import Constants from 'expo-constants';
import TypingDots from '../components/TypingDots';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AIScreen() {
  const [question, setQuestion] = useState('Give me a daily fitness tip');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Prefer gemini key; fall back to openai key check for backwards compatibility
  const extra: any = (Constants as any).expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};
  const geminiKey: string | undefined = extra?.geminiApiKey;
  const geminiModel: string = (extra?.geminiModel as string) || 'gemini-1.5-flash-latest';
  // Normalize model id: accept either "gemini-..." or "models/gemini-..."
  const normalizedModel = geminiModel.replace(/^models\//, '');

  const ask = async () => {
    if (!geminiKey) {
      setAnswer('Missing Gemini API key in app.json extra.geminiApiKey');
      return;
    }
    try {
      setLoading(true);
      setAnswer('');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        normalizedModel
      )}:generateContent?key=${geminiKey}`;

      // Add a 20s timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text:
                    'You are a concise fitness coach. Give practical, safe tips tailored to general users.\nQuestion: ' +
                    question
                }
              ]
            }
          ]
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const raw = await res.text();
      let json: any = null;
      try {
        json = raw ? JSON.parse(raw) : null;
      } catch (_) {
        json = null;
      }

      if (!res.ok) {
        const errMsg = (json && (json.error?.message || json.error?.status)) || `HTTP ${res.status}`;
        // If the model is missing or unsupported, try to help the user by listing available models
        if (String(errMsg).toLowerCase().includes('not found') || String(errMsg).toLowerCase().includes('not supported')) {
          try {
            const listRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`
            );
            const listJson = await listRes.json();
            const available: string[] = (listJson?.models || [])
              .filter((m: any) => (m?.supportedGenerationMethods || []).includes('generateContent'))
              .map((m: any) => (m?.name || '').replace(/^models\//, ''))
              .filter(Boolean)
              .slice(0, 6);
            if (available.length) {
              setAnswer(
                `Gemini error: ${errMsg}\nTry one of these models (set extra.geminiModel to the ID below, without \'models/\'):\n- ${available.join('\n- ')}`
              );
              return;
            }
          } catch {
            // ignore listing failure; show base error
          }
        }
        setAnswer(`Gemini error: ${errMsg}`);
        return;
      }

      // Handle safety blocks and empty candidates
      const blocked = json?.promptFeedback?.blockReason;
      if (blocked) {
        setAnswer(`Your request was blocked by safety filters (${blocked}). Please rephrase.`);
        return;
      }

      const parts: string[] = json?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean) || [];
      const content = parts.join('').trim();
      setAnswer(content || 'No response');
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        setAnswer('Request timed out. Please try again.');
      } else {
        setAnswer(`Network error: ${String(e?.message || e)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <Screen>
  <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">AI Assistant</Text>
          <TextInput
            mode="outlined"
            placeholder="Ask something…"
            value={question}
            onChangeText={setQuestion}
            style={{ marginTop: 8 }}
            multiline
          />
          <LinearGradient colors={["#4DC6FF", "#2EE58F"]} start={{x:0,y:0}} end={{x:1,y:1}} style={{ borderRadius: 24, marginTop: 8 }}>
            <Button contentStyle={{ height: 48 }} textColor="#fff" style={{ backgroundColor: 'transparent' }} onPress={ask} loading={loading} disabled={loading}>
              Ask
            </Button>
          </LinearGradient>
          <View style={styles.bubbles}>
            {question && ( 
              <Animated.View entering={FadeIn.duration(200)} style={[styles.bubble, styles.bubbleUser]}>
                <Text style={styles.bubbleText}>{question}</Text>
              </Animated.View>
            )}
            {loading ? (
              <View style={[styles.bubble, styles.bubbleAI]}>
                <TypingDots />
              </View>
            ) : null}
            {answer ? (
              <Animated.View entering={FadeIn.duration(200)} style={[styles.bubble, styles.bubbleAI]}>
                <Text style={styles.bubbleText}>{answer}</Text>
              </Animated.View>
            ) : null}
          </View>
        </Card.Content>
      </Card>
    </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 20 },
  bubbles: { marginTop: 12, gap: 8 },
  bubble: { padding: 12, borderRadius: 16, maxWidth: '90%' },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: 'rgba(77,198,255,0.15)' },
  bubbleAI: { alignSelf: 'flex-start', backgroundColor: 'rgba(46,229,143,0.15)' },
  bubbleText: { fontSize: 14 }
});
