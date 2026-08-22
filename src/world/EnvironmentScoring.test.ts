import { describe, it, expect } from 'vitest';
import { EnvironmentScoring } from './EnvironmentScoring';
import { House } from './House';

describe('EnvironmentScoring', () => {
  it('evaluates neutral room score for default grass lot', () => {
    const house = new House();
    const result = EnvironmentScoring.evaluateArea(house, 5, 5);
    expect(result.score).toBeDefined();
    expect(typeof result.score).toBe('number');
    expect(['neutral', 'nice', 'luxurious', 'filthy', 'poor']).toContain(result.tier);
  });

  it('increases score when marble flooring and luxury furniture are placed', () => {
    const house = new House();
    house.setFloorStyle(5, 5, 'marble', '#ffffff');
    house.setFloorStyle(6, 5, 'marble', '#ffffff');
    house.setFloorStyle(5, 6, 'marble', '#ffffff');
    house.addFurniture('sofa_luxury', 5, 5);

    const result = EnvironmentScoring.evaluateArea(house, 5, 5);
    expect(result.score).toBeGreaterThan(10);
    expect(result.moodletTitle).toBeDefined();
  });
});
