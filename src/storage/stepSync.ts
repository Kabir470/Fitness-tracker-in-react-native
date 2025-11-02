import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function syncSteps(userId: string, date: string, steps: number, distanceKm: number, calories: number) {
  const ref = doc(db, 'users', userId, 'steps', date);
  await setDoc(
    ref,
    {
      date,
      steps,
      distanceKm,
      calories,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
