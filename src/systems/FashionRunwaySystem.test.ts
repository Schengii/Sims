import { describe, it, expect, beforeEach } from 'vitest';
import { FashionRunwaySystem } from './FashionRunwaySystem';
import { Sim } from '../entity/Sim';

describe('FashionRunwaySystem', () => {
  let runway: FashionRunwaySystem;
  let sim: Sim;

  beforeEach(() => {
    runway = new FashionRunwaySystem();
    sim = new Sim();
    sim.simoleons = 0;
  });

  it('should walk runway and earn rewards', () => {
    const res = runway.walkRunway('streetwear', sim);

    expect(res.success).toBe(true);
    expect(runway.showsWalked).toBe(1);
    expect(sim.simoleons).toBe(800);
    expect(runway.modelRating).toBe(2);
  });
});
