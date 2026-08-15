import { describe, it, expect, beforeEach } from 'vitest';
import { HealthSystem } from './HealthSystem';
import { Sim } from '../entity/Sim';

describe('HealthSystem & Medical Care', () => {
  let healthSystem: HealthSystem;
  let sim: Sim;

  beforeEach(() => {
    healthSystem = new HealthSystem();
    sim = new Sim({ name: 'Alexander Test' });
  });

  it('should contract cold and trigger uncomfortable moodlet', () => {
    expect(healthSystem.currentIllness).toBe('none');

    healthSystem.contractIllness('cold', sim);
    expect(healthSystem.currentIllness).toBe('cold');
    expect(healthSystem.remainingMinutes).toBeGreaterThan(0);
    expect(sim.activeEmote?.symbol).toBe('🤧');
  });

  it('should cure cold with herbal tea', () => {
    healthSystem.contractIllness('cold', sim);
    const res = healthSystem.drinkHerbalTea(sim);

    expect(res.success).toBe(true);
    expect(healthSystem.currentIllness).toBe('none');
    expect(sim.activeEmote?.symbol).toBe('💚');
  });

  it('should cure severe flu with doctor home visit if affordable', () => {
    sim.simoleons = 500;
    healthSystem.contractIllness('flu', sim);
    const res = healthSystem.callDoctorHomeVisit(sim);

    expect(res.success).toBe(true);
    expect(healthSystem.currentIllness).toBe('none');
    expect(sim.simoleons).toBe(250);
  });
});
