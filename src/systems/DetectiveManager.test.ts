import { describe, it, expect, beforeEach } from 'vitest';
import { DetectiveManager } from './DetectiveManager';
import { Sim } from '../entity/Sim';

describe('DetectiveManager & Crime Investigation', () => {
  let det: DetectiveManager;
  let sim: Sim;

  beforeEach(() => {
    det = new DetectiveManager();
    sim = new Sim({ name: 'Detective Sim' });
  });

  it('should search for clues, collect evidence and arrest suspect for bounty', () => {
    sim.simoleons = 0;
    for (let i = 0; i < 3; i++) {
      det.searchForClues(sim);
    }
    expect(det.activeCase.cluesCollected).toBe(3);

    const arrestRes = det.arrestSuspect(sim);
    expect(arrestRes.success).toBe(true);
    expect(det.casesSolved).toBe(1);
    expect(sim.simoleons).toBe(1200);
  });
});
