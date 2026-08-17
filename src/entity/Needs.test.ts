/**
 * Unit Tests for Needs.ts - Trait Multiplier Application (Bug #1 Fix)
 */
import { describe, it, expect } from 'vitest';
import { Needs } from '../entity/Needs';

describe('Needs - Trait Decay Multipliers (Bug #1 Fix)', () => {
  it('should decay faster with multiplier > 1', () => {
    const needs1 = new Needs({ fun: 100 });
    const needs2 = new Needs({ fun: 100 });

    needs1.update(10); // no multiplier
    needs2.update(10, { fun: 2.0 }); // double decay

    const val1 = needs1.getValues().fun;
    const val2 = needs2.getValues().fun;

    expect(val2).toBeLessThan(val1);
  });

  it('should decay slower with multiplier < 1', () => {
    const needs1 = new Needs({ energy: 100 });
    const needs2 = new Needs({ energy: 100 });

    needs1.update(10); // no multiplier
    needs2.update(10, { energy: 0.5 }); // half decay (Active trait)

    expect(needs2.getValues().energy).toBeGreaterThan(needs1.getValues().energy);
  });

  it('should not decay below 0 even with large multiplier', () => {
    const needs = new Needs({ hunger: 5 });
    needs.update(100, { hunger: 10 });
    expect(needs.getValues().hunger).toBe(0);
  });

  it('should track criticalMinutes when hunger and energy are both < 10', () => {
    const needs = new Needs({ hunger: 5, energy: 5, hygiene: 80, bladder: 80, fun: 80, social: 80 });
    needs.update(3); // 3 game minutes with very low hunger & energy
    expect(needs.criticalMinutes).toBeGreaterThan(0);
  });

  it('criticalMinutes should reset when needs improve', () => {
    const needs = new Needs({ hunger: 5, energy: 5 });
    needs.update(3);
    expect(needs.criticalMinutes).toBeGreaterThan(0);
    needs.modify('hunger', 80);
    needs.modify('energy', 80);
    needs.update(1);
    expect(needs.criticalMinutes).toBe(0);
  });

  it('hasCriticalNeed should return true when any need < 10', () => {
    const needs = new Needs({ hunger: 5 });
    expect(needs.hasCriticalNeed()).toBe(true);
  });

  it('hasCriticalNeed should return false when all needs are safe', () => {
    const needs = new Needs({ hunger: 80, energy: 80, hygiene: 80, bladder: 80, fun: 80, social: 80 });
    expect(needs.hasCriticalNeed()).toBe(false);
  });
});
