import { describe, it, expect, beforeEach } from 'vitest';
import { GenealogyTreeSystem } from './GenealogyTreeSystem';
import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';

describe('GenealogyTreeSystem', () => {
  let tree: GenealogyTreeSystem;
  let sim: Sim;
  let household: Household;

  beforeEach(() => {
    tree = new GenealogyTreeSystem();
    sim = new Sim();
    household = new Household();
    household.addSim(sim);
  });

  it('should build multi-generation tree hierarchy', () => {
    const nodes = tree.buildTree(sim, household);

    expect(nodes.length).toBeGreaterThanOrEqual(3);
    const activeNode = nodes.find(n => n.id === sim.id);
    expect(activeNode).toBeDefined();
    expect(activeNode!.relation).toBe('Familienoberhaupt (Aktiv)');
  });
});
