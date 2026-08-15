/**
 * Detective Career & Crime Scene Investigation System
 * Inspect crime scenes 🔍, dust for fingerprints, interrogate suspects, and arrest perpetrators for justice rewards.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface CriminalCase {
  id: string;
  title: string;
  suspectName: string;
  cluesRequired: number;
  cluesCollected: number;
  bountySimoleons: number;
  solved: boolean;
}

export class DetectiveManager {
  public detectiveRank: number = 1; // 1: Streifenpolizist, 2: Ermittler, 3: Chefermittler, 4: Meisterdetektiv 🕵️
  public casesSolved: number = 0;
  public activeCase: CriminalCase = {
    id: 'case_diamond_heist',
    title: '💎 Der geheimnisvolle Diamanten-Diebstahl',
    suspectName: 'Schlauer Fuchs Felix',
    cluesRequired: 3,
    cluesCollected: 0,
    bountySimoleons: 1200,
    solved: false
  };

  public searchForClues(sim: Sim): { success: boolean; message: string } {
    if (this.activeCase.solved) {
      return { success: false, message: 'Der aktuelle Fall ist bereits vollständig gelöst! Schließe ihn ab.' };
    }

    if (sim.needs.getValues().energy < 15) {
      return { success: false, message: 'Zu müde für scharfsinnige Ermittlungen!' };
    }

    sim.needs.modify('energy', -15);
    sim.needs.modify('fun', 10);
    this.activeCase.cluesCollected = Math.min(this.activeCase.cluesRequired, this.activeCase.cluesCollected + 1);

    sim.triggerEmote('🔍', 3500);
    sim.moodletManager.addMoodlet({
      id: 'clue_found',
      name: 'Spur gesichert',
      emotion: 'focused',
      weight: 2,
      durationSec: 180,
      icon: '🔍',
      description: 'Fingerabdruck & Faserspuren am Tatort gesichert.'
    });

    const isReady = this.activeCase.cluesCollected >= this.activeCase.cluesRequired;
    return {
      success: true,
      message: `Wichtiger Hinweis gesichert! (${this.activeCase.cluesCollected} / ${this.activeCase.cluesRequired} Hinweise)${isReady ? ' - Haftbefehl ausstellbar!' : ''}`
    };
  }

  public arrestSuspect(sim: Sim): { success: boolean; reward: number; message: string } {
    if (this.activeCase.cluesCollected < this.activeCase.cluesRequired) {
      return { success: false, reward: 0, message: `Nicht genügend Beweise für eine Verhaftung (${this.activeCase.cluesCollected}/${this.activeCase.cluesRequired})!` };
    }

    const reward = this.activeCase.bountySimoleons;
    sim.simoleons += reward;
    this.casesSolved++;
    this.detectiveRank = Math.min(4, this.detectiveRank + 1);

    // Prepare next case
    this.activeCase = {
      id: `case_${Date.now()}`,
      title: '🖼️ Das verschwundene Meisterwerk der Kunstgalerie',
      suspectName: 'Phantom-Gräfin Valéria',
      cluesRequired: 3,
      cluesCollected: 0,
      bountySimoleons: 1600,
      solved: false
    };

    sim.triggerEmote('👮', 4000);
    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🚨 TÄTER VERHAFTET!',
      message: `Fall erfolgreich aufgeklärt! Fangprämie: +§ ${reward}`,
      icon: '⚖️',
      type: 'levelUp'
    });

    return { success: true, reward, message: `Verdächtiger überführt und verhaftet! Belohnung: § ${reward}` };
  }
}
