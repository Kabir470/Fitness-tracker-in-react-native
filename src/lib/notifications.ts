import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }
  return true;
}

export async function scheduleDailyReminder(hour = 8, minute = 0) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Time to move! 🏃',
      body: 'Hit your step goal today — a quick walk adds up.'
    },
    trigger: { hour, minute, repeats: true } as Notifications.CalendarTriggerInput
  });
}
