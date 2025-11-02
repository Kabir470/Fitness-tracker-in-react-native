import { toEntry } from '../src/storage/history';

describe('toEntry', () => {
  it('calculates distance and calories from steps', () => {
    const e = toEntry('2025-11-02', 1234);
    expect(e.date).toBe('2025-11-02');
    expect(e.steps).toBe(1234);
    expect(e.distanceKm).toBeCloseTo(0.96, 2); // 1234 * 0.00078 ≈ 0.9625
    expect(e.calories).toBe(49); // 1234 * 0.04 ≈ 49.36
  });
});
