import { describe, it, expect, beforeEach } from 'vitest';
import { HomeCinemaSystem } from './HomeCinemaSystem';
import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';

describe('HomeCinemaSystem', () => {
  let cinema: HomeCinemaSystem;
  let sim: Sim;
  let household: Household;

  beforeEach(() => {
    cinema = new HomeCinemaSystem();
    sim = new Sim();
    household = new Household();
    household.addSim(sim);
  });

  it('should pop fresh popcorn', () => {
    const prev = cinema.popcornStock;
    expect(cinema.popFreshPopcorn()).toBe(prev + 3);
  });

  it('should play a movie and boost household needs', () => {
    const res = cinema.playMovie('comedy', household, sim);

    expect(res.movie.title).toBe('Die Lachnummer');
    expect(res.popcornUsed).toBe(true);
    expect(cinema.totalMoviesWatched).toBe(1);
  });
});
