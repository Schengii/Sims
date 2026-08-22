/**
 * Unit Tests for QuestSystem - Daily Reset & Rotating Pool (Bug #3 Fix)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { QuestManager } from '../systems/QuestSystem';

describe('QuestSystem - Daily Reset & Pool (Bug #3 Fix)', () => {
  let qm: QuestManager;

  beforeEach(() => {
    qm = new QuestManager();
  });

  it('should generate exactly 5 quests on construction', () => {
    expect(qm.getQuests().length).toBe(5);
  });

  it('should reset quests on a new game day', () => {
    const day0Ids = qm.getQuests().map(q => q.id).join(',');
    qm.checkDailyReset(1); // new day
    const day1Ids = qm.getQuests().map(q => q.id).join(',');
    expect(day0Ids.length).toBeGreaterThan(0);
    expect(day1Ids.length).toBeGreaterThan(0);
    expect(qm.getQuests().length).toBe(5);
    // Day 2 should reset again
    const didReset = qm.checkDailyReset(2);
    expect(didReset).toBe(true);
  });

  it('should NOT reset quests on same day', () => {
    qm.checkDailyReset(1);
    const didReset = qm.checkDailyReset(1); // same day
    expect(didReset).toBe(false);
  });

  it('should mark quest as completed when progress reaches target', () => {
    const quest = qm.getQuests()[0];
    const result = qm.triggerQuestProgress(quest.id, quest.targetProgress);
    expect(result).not.toBeNull();
    expect(result!.completed).toBe(true);
  });

  it('should not complete already completed quests', () => {
    const quest = qm.getQuests()[0];
    qm.triggerQuestProgress(quest.id, quest.targetProgress);
    const result = qm.triggerQuestProgress(quest.id, 1); // should be null now
    expect(result).toBeNull();
  });

  it('should export and import state correctly', () => {
    const qm2 = new QuestManager();
    qm.getQuests()[0] && qm.triggerQuestProgress(qm.getQuests()[0].id);
    const data = qm.exportData();
    qm2.importData(data);
    expect(qm2.getQuests().length).toBe(qm.getQuests().length);
  });

  it('all quests should have valid reward values', () => {
    qm.getQuests().forEach(q => {
      expect(q.rewardSimoleons).toBeGreaterThan(0);
      expect(q.rewardAspirationPoints).toBeGreaterThan(0);
    });
  });
});
