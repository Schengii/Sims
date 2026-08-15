import { describe, it, expect, beforeEach } from 'vitest';
import { SchoolSystem } from './SchoolSystem';
import { Sim } from '../entity/Sim';

describe('SchoolSystem & Homework', () => {
  let school: SchoolSystem;
  let sim: Sim;

  beforeEach(() => {
    school = new SchoolSystem();
    sim = new Sim({ name: 'Student Sim' });
  });

  it('should complete homework, improve grade and trigger focused moodlet', () => {
    school.reportCard.homeworkCompleted = false;
    const res = school.doHomework(sim);

    expect(res.success).toBe(true);
    expect(school.reportCard.homeworkCompleted).toBe(true);
    expect(sim.moodletManager.getActiveMoodlets().some(m => m.id === 'homework_done')).toBe(true);
  });

  it('should attend school and grant scholarship reward on top grade', () => {
    sim.simoleons = 0;
    school.reportCard.performanceScore = 95;
    school.reportCard.grade = '1.0 (Sehr Gut)';
    school.reportCard.homeworkCompleted = true;

    const res = school.attendSchool(sim);
    expect(res.success).toBe(true);
    expect(res.reward).toBe(250);
    expect(sim.simoleons).toBe(250);
  });
});
