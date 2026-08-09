/**
 * Supernatural & Occult Engine
 * Manages Vampire, Werewolf, and Alien life forms, dark form transformations, and occult powers.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export type OccultType = 'human' | 'vampire' | 'werewolf' | 'alien';

export class OccultSystem {
  public occultType: OccultType = 'human';
  public isDarkForm: boolean = false;
  public occultPowerPoints: number = 100;

  public setOccultForm(type: OccultType, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    this.occultType = type;
    this.isDarkForm = false;

    soundManager.playLevelUp();
    toastManager.showToast('🔮 OKKULTE VERWANDLUNG!', `${sim.customization.name} wurde in ein(en) ${type.toUpperCase()} verwandelt!`, '✨', 'levelUp');
  }

  public toggleDarkForm(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): boolean {
    if (this.occultType === 'human') {
      toastManager.showToast('Okkult', 'Menschliche Sims besitzen keine Dunkle Form.', '❌', 'warning');
      return false;
    }

    this.isDarkForm = !this.isDarkForm;
    soundManager.playSimlish(0.8, 'angry');
    
    if (this.isDarkForm) {
      sim.moodletManager.addMoodlet({
        id: 'dark_form',
        name: 'Dunkle Form',
        emotion: 'energized',
        weight: 3,
        durationSec: 300,
        icon: '🦇',
        description: 'Volle okkulte Kräfte sind aktiv!'
      });
      toastManager.showToast('🦇 DUNKLE FORM!', 'Dunkle Gestalt angenommen! (+3 Energetisch)', '🦇', 'success');
    } else {
      toastManager.showToast('✨ Menschliche Gestalt', 'Zurück in normale Form verwandelt.', '✨', 'info');
    }

    return this.isDarkForm;
  }
}
