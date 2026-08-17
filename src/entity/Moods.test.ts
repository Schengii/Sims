/**
 * Unit Tests for Moods.ts - angry & bored mood types (Bug #5 Fix)
 */
import { describe, it, expect } from 'vitest';
import { Moods } from '../entity/Moods';

describe('Moods - angry & bored mood types (Bug #5 Fix)', () => {
  it('should return exhausted when energy < 15', () => {
    const mood = Moods.getMood(30, 10, 'energy');
    expect(mood.type).toBe('exhausted');
  });

  it('should return sad when social need is critically low and energy not lowest', () => {
    const mood = Moods.getMood(30, 12, 'social');
    expect(mood.type).toBe('sad');
  });

  it('should return bored when fun is lowest and < 20', () => {
    const mood = Moods.getMood(30, 18, 'fun');
    expect(mood.type).toBe('bored');
  });

  it('should return angry when social < 25 AND overall satisfaction < 40', () => {
    const mood = Moods.getMood(35, 22, 'social');
    expect(mood.type).toBe('angry');
  });

  it('should return happy for overall satisfaction >= 50', () => {
    const mood = Moods.getMood(55, 60, 'fun');
    expect(mood.type).toBe('happy');
  });

  it('should return energized for satisfaction >= 80', () => {
    const mood = Moods.getMood(85, 80, 'fun');
    expect(mood.type).toBe('energized');
  });

  it('getMoodInfo(angry) should have red plumbob color', () => {
    const info = Moods.getMoodInfo('angry');
    expect(info.plumbobColor).toBe('#e74c3c');
    expect(info.label).toBe('Wütend');
  });

  it('getMoodInfo(bored) should have grey plumbob color', () => {
    const info = Moods.getMoodInfo('bored');
    expect(info.plumbobColor).toBe('#bdc3c7');
    expect(info.label).toBe('Gelangweilt');
  });
});
