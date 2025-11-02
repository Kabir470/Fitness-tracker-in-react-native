import AsyncStorage from '@react-native-async-storage/async-storage';

export type DayEntry = {
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number;
  calories: number;
};

const HISTORY_KEY = 'stepfit.history.v1';
const CURRENT_KEY = 'stepfit.current.v1';

export async function loadHistory(): Promise<DayEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as DayEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveHistory(entries: DayEntry[]): Promise<void> {
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export async function loadCurrent(): Promise<{ date: string; steps: number } | null> {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as { date: string; steps: number }) : null;
  } catch {
    return null;
  }
}

export async function saveCurrent(current: { date: string; steps: number }): Promise<void> {
  await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(current));
}

export function todayStr(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function toEntry(date: string, steps: number): DayEntry {
  const distanceKm = parseFloat((steps * 0.00078).toFixed(2));
  const calories = Math.round(steps * 0.04);
  return { date, steps, distanceKm, calories };
}

