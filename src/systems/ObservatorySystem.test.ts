import { describe, it, expect, beforeEach } from 'vitest';
import { ObservatorySystem } from './ObservatorySystem';
import { Sim } from '../entity/Sim';

describe('ObservatorySystem', () => {
  let observatory: ObservatorySystem;
  let sim: Sim;

  beforeEach(() => {
    observatory = new ObservatorySystem();
    sim = new Sim();
  });

  it('should scan the sky and record a celestial discovery with simoleon reward', () => {
    const res = observatory.scanTheSky(sim);

    expect(res.discovery).toBeDefined();
    expect(observatory.discoveries.length).toBe(1);
    expect(sim.simoleons).toBeGreaterThan(0);
  });

  it('should collect meteorite from meteor shower', () => {
    const res = observatory.collectMeteoriteShower(sim);

    expect(res.meteoriteValue).toBeGreaterThanOrEqual(600);
    expect(observatory.meteoritesCollected).toBe(1);
  });
});
