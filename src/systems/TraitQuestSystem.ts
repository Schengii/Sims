/**
 * Trait-Specific Quests System
 * Generates unique quests based on character traits with milestone rewards.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export interface TraitQuest {
  id: string;
  traitName: string;
  title: string;
  description: string;
  rewardSimoleons: number;
  rewardAP: number;
  isCompleted: boolean;
}

export class TraitQuestSystem {
  private quests: TraitQuest[] = [
    {
      id: 'quest_genial',
      traitName: 'Genial',
      title: '💻 Hackathon Champ',
      description: 'Programmiere 2 Stunden oder bestehe den Code-Sprint.',
      rewardSimoleons: 600,
      rewardAP: 150,
      isCompleted: false
    },
    {
      id: 'quest_gourmet',
      traitName: 'Gourmet',
      title: '🍳 Kulinarisches Meisterwerk',
      description: 'Zubereitung einer Gourmet-Mahlzeit oder LlamaEats-Tasting.',
      rewardSimoleons: 500,
      rewardAP: 120,
      isCompleted: false
    },
    {
      id: 'quest_aktiv',
      traitName: 'Aktiv',
      title: '🏋️ Fitness-Marathon',
      description: 'Absolviere das Laufband-Sprint Mini-Spiel im Gym.',
      rewardSimoleons: 450,
      rewardAP: 100,
      isCompleted: false
    }
  ];

  public getQuestsForSim(sim: Sim): TraitQuest[] {
    return this.quests.filter(q => q.traitName === sim.customization.trait || q.traitName === 'Genial' || q.traitName === 'Gourmet');
  }

  public completeQuest(questId: string, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const quest = this.quests.find(q => q.id === questId);
    if (!quest || quest.isCompleted) return;

    quest.isCompleted = true;
    sim.simoleons += quest.rewardSimoleons;
    sim.aspirationPoints += quest.rewardAP;

    soundManager.playLevelUp();
    toastManager.showToast('🌟 MERKMAL-QUEST ERFÜLLT!', `${quest.title} abgeschlossen (+§ ${quest.rewardSimoleons} & +${quest.rewardAP} AP)!`, '⭐', 'levelUp');
  }
}
