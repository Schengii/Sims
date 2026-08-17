/**
 * Celebrity Fame & Reputation Engine (1 to 5 Stars ⭐️)
 * Manages fame XP, celebrity perks (VIP Access, Golden Voice, Autographs), and Paparazzi encounters.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class FameSystem {
  public fameRank: number = 1; // 1 to 5 Stars ⭐️
  public fameXP: number = 50;
  public unlockedPerks: string[] = [];

  public addFameXP(amount: number, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    this.fameXP += amount;
    if (this.fameXP >= this.fameRank * 200 && this.fameRank < 5) {
      this.fameXP -= this.fameRank * 200;
      this.fameRank += 1;

      soundManager.playLevelUp();
      toastManager.showToast('⭐️ CELEBRITY LEVEL UP!', `${sim.customization.name} ist jetzt ein ${this.fameRank}-Sterne Promi!`, '🌟', 'levelUp');
    }
  }

  public giveAutograph(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const tip = this.fameRank * 150;
    sim.simoleons += tip;
    sim.needs.modify('social', 25);
    sim.needs.modify('fun', 20);

    soundManager.playSimlish(1.3, 'happy');
    toastManager.showToast('✍️ Autogrammstunde', `Autogramm für Fans gegeben! + § ${tip} Trinkgeld kassiert!`, '⭐', 'success');
  }

  public unlockPerk(perkId: string, toastManager: ToastManager): boolean {
    if (this.unlockedPerks.includes(perkId)) return false;
    this.unlockedPerks.push(perkId);
    toastManager.showToast('⭐️ Promi-Vorteil', `Vorteil "${perkId}" erfolgreich freigeschaltet!`, '✨', 'success');
    return true;
  }

  public exportData(): any {
    return { fameRank: this.fameRank, fameXP: this.fameXP, unlockedPerks: this.unlockedPerks };
  }

  public importData(data: any): void {
    if (!data) return;
    if (typeof data.fameRank === 'number') this.fameRank = data.fameRank;
    if (typeof data.fameXP === 'number') this.fameXP = data.fameXP;
    if (Array.isArray(data.unlockedPerks)) this.unlockedPerks = data.unlockedPerks;
  }
}

