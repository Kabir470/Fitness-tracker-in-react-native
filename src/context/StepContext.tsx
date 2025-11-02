import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import { loadCurrent, saveCurrent, loadHistory, saveHistory, toEntry, todayStr } from '../storage/history';
import { useAuth } from '../context/AuthContext';
import { syncSteps } from '../storage/stepSync';

type StepContextValue = {
  isPedometerAvailable: boolean | null;
  stepsToday: number;
  goal: number;
  setGoal: (g: number) => void;
  resetToday: () => void;
  fakeMode: boolean;
  setFakeMode: (v: boolean) => void;
};

const StepContext = createContext<StepContextValue | undefined>(undefined);

type ProviderProps = { children: React.ReactNode };
export const StepProvider: React.FC<ProviderProps> = (props: ProviderProps) => {
  const { user } = useAuth();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<boolean | null>(null);
  const [stepsToday, setStepsToday] = useState<number>(0);
  const [goal, setGoal] = useState<number>(10000);
  const [fakeMode, setFakeMode] = useState<boolean>(false);
  const fakeTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pedometerSub = useRef<ReturnType<typeof Pedometer.watchStepCount> | null>(null);
  const offsetRef = useRef<number>(0);
  const currentDateRef = useRef<string>(todayStr());

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Load persisted state and handle rollover
      const current = await loadCurrent();
      const today = todayStr();
      currentDateRef.current = today;
      if (current) {
        if (current.date !== today) {
          // Move previous day into history and reset current
          const history = await loadHistory();
          history.unshift(toEntry(current.date, current.steps));
          await saveHistory(history.slice(0, 60)); // keep last 60 days
          await saveCurrent({ date: today, steps: 0 });
        } else {
          setStepsToday(current.steps);
        }
      } else {
        await saveCurrent({ date: today, steps: 0 });
      }
      try {
        const available = await Pedometer.isAvailableAsync();
        if (isMounted) setIsPedometerAvailable(available);
        if (available) {
          pedometerSub.current = Pedometer.watchStepCount(async (event: { steps: number }) => {
            // event.steps is steps since subscription start
            // Adjust with offset so we continue from persisted steps if any
            const adjusted = event.steps + offsetRef.current;
            setStepsToday((prev) => {
              const next = Math.max(prev, adjusted);
              // Persist current day snapshot
              saveCurrent({ date: currentDateRef.current, steps: next }).catch(() => {});
              return next;
            });
            if (offsetRef.current === 0) {
              // Initialize offset based on persisted value so we don't jump backwards
              const persisted = await loadCurrent();
              if (persisted && persisted.date === currentDateRef.current && persisted.steps > adjusted) {
                offsetRef.current = persisted.steps - event.steps;
                setStepsToday(persisted.steps);
              }
            }
          });
        } else {
          // Enable fake mode by default on devices without a pedometer (e.g., emulators)
          if (isMounted) setFakeMode(true);
        }
      } catch (e) {
        if (isMounted) setIsPedometerAvailable(false);
        if (isMounted) setFakeMode(true);
      }
    })();

    return () => {
      isMounted = false;
      if (pedometerSub.current) pedometerSub.current.remove();
    };
  }, []);

  useEffect(() => {
    if (fakeMode) {
      if (!fakeTimer.current) {
        fakeTimer.current = setInterval(() => {
          setStepsToday((s: number) => {
            const next = s + Math.floor(Math.random() * 3);
            saveCurrent({ date: currentDateRef.current, steps: next }).catch(() => {});
            return next;
          });
        }, 1500);
      }
    } else if (fakeTimer.current) {
      clearInterval(fakeTimer.current);
      fakeTimer.current = null;
    }
    return () => {
      if (fakeTimer.current) {
        clearInterval(fakeTimer.current);
        fakeTimer.current = null;
      }
    };
  }, [fakeMode]);

  // Check daily rollover every minute
  useEffect(() => {
    const timer = setInterval(async () => {
      const today = todayStr();
      if (today !== currentDateRef.current) {
        // Save previous day to history
        const prevDate = currentDateRef.current;
        const history = await loadHistory();
        history.unshift(toEntry(prevDate, stepsToday));
        await saveHistory(history.slice(0, 60));
        // Reset for new day
        currentDateRef.current = today;
        setStepsToday(0);
        offsetRef.current = 0;
        await saveCurrent({ date: today, steps: 0 });
      }
    }, 60_000);
    return () => clearInterval(timer);
  }, [stepsToday]);

  // Sync to Firestore when user is logged in
  useEffect(() => {
    if (!user) return;
    const date = currentDateRef.current;
    const entry = toEntry(date, stepsToday);
    syncSteps(user.uid, date, entry.steps, entry.distanceKm, entry.calories).catch(() => {});
  }, [user, stepsToday]);

  const resetToday = () => setStepsToday(0);

  const value: StepContextValue = {
    isPedometerAvailable,
    stepsToday,
    goal,
    setGoal,
    resetToday,
    fakeMode,
    setFakeMode,
  };

  return <StepContext.Provider value={value}>{props.children}</StepContext.Provider>;
};

export const useSteps = () => {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error('useSteps must be used within StepProvider');
  return ctx;
};
