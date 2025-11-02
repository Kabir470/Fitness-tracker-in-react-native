import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, TextInput, Button } from 'react-native-paper';
import Constants from 'expo-constants';

export default function AIScreen() {
  const [question, setQuestion] = useState('Give me a daily fitness tip');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const apiKey = (Constants.expoConfig?.extra as any)?.openaiApiKey as string | undefined;

  const ask = async () => {
    if (!apiKey) {
      setAnswer('Missing OpenAI API key in app.json extra.openaiApiKey');
      return;
    }
    try {
      setLoading(true);
      setAnswer('');
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a concise fitness coach. Give practical tips tailored to general users.' },
            { role: 'user', content: question }
          ]
        })
      });
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content ?? 'No response';
      setAnswer(content);
    } catch (e: any) {
      setAnswer(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <Button mode="contained" style={{ marginTop: 8 }} onPress={ask} loading={loading} disabled={loading}>
            Ask
          </Button>
          {answer ? (
            <Text variant="bodyMedium" style={{ marginTop: 12 }}>{answer}</Text>
          ) : null}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 16 }
});
