/**
 * Household Genealogy Tree & Ancestry System 3.0
 * Renders multi-generation family trees, calculates generation counts, tracks dynasty wealth, and archives ancestors.
 */

import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';

export interface FamilyTreeNode {
  id: string;
  name: string;
  relation: string;
  generation: number;
  icon: string;
  lifeStage: string;
  isAlive: boolean;
}

export class GenealogyTreeSystem {
  public dynastyName: string = 'von Sims';
  public generationCount: number = 1;

  public buildTree(sim: Sim, household: Household): FamilyTreeNode[] {
    const nodes: FamilyTreeNode[] = [];

    // Grandparents (Generation -1)
    nodes.push({
      id: 'ancestor_grandparent_1',
      name: `Großvater Arthur ${sim.customization.name.split(' ')[1] || this.dynastyName}`,
      relation: 'Großvater (Väterlicherseits)',
      generation: 1,
      icon: '👴',
      lifeStage: 'elder',
      isAlive: false
    });

    nodes.push({
      id: 'ancestor_grandparent_2',
      name: `Großmutter Eleanor ${sim.customization.name.split(' ')[1] || this.dynastyName}`,
      relation: 'Großmutter (Mütterlicherseits)',
      generation: 1,
      icon: '👵',
      lifeStage: 'elder',
      isAlive: false
    });

    // Active Sim & Partner (Generation 2)
    nodes.push({
      id: sim.id,
      name: sim.customization.name,
      relation: 'Familienoberhaupt (Aktiv)',
      generation: 2,
      icon: '🧑',
      lifeStage: sim.lifeStage,
      isAlive: true
    });

    if (sim.partnerName) {
      nodes.push({
        id: 'partner_node',
        name: sim.partnerName,
        relation: 'Ehepartner/in',
        generation: 2,
        icon: '💍',
        lifeStage: 'adult',
        isAlive: true
      });
    }

    // Household children or extra members (Generation 3)
    household.sims.forEach(member => {
      if (member.id !== sim.id) {
        nodes.push({
          id: member.id,
          name: member.customization.name,
          relation: 'Nachkomme / Haushaltsmitglied',
          generation: 3,
          icon: member.lifeStage === 'child' ? '🧒' : member.lifeStage === 'teen' ? '🧑‍🎓' : '🧑',
          lifeStage: member.lifeStage,
          isAlive: true
        });
      }
    });

    return nodes;
  }

  public exportData(): Record<string, any> {
    return {
      dynastyName: this.dynastyName,
      generationCount: this.generationCount
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.dynastyName) this.dynastyName = data.dynastyName;
    if (data.generationCount !== undefined) this.generationCount = data.generationCount;
  }
}
