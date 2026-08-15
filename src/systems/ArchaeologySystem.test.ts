import { describe, it, expect, beforeEach } from 'vitest';
import { ArchaeologySystem } from './ArchaeologySystem';
import { Sim } from '../entity/Sim';

describe('ArchaeologySystem & Dig Sites', () => {
  let arch: ArchaeologySystem;
  let sim: Sim;

  beforeEach(() => {
    arch = new ArchaeologySystem();
    sim = new Sim({ name: 'Archaeologist Sim' });
  });

  it('should excavate ancient relic and store it in inventory and collection', () => {
    const res = arch.digForRelics(sim);

    expect(res.success).toBe(true);
    expect(res.relic).toBeDefined();
    expect(arch.excavatedRelics.length).toBe(1);
    expect(sim.inventory.items.some(i => i.name === res.relic?.name)).toBe(true);
  });
});
