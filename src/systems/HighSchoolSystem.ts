/**
 * High School Years & Prom Engine
 * Manages high school grades, exams, and Prom King/Queen dance celebrations.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class HighSchoolSystem {
  public gpa: number = 1.7; // 1.0 = Outstanding
  public hasPromCrown: boolean = false;

  public takeExam(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const success = Math.random() < 0.7;
    if (success) {
      this.gpa = Math.max(1.0, this.gpa - 0.3);
      sim.aspirationPoints += 50;
      soundManager.playLevelUp();
      toastManager.showToast('🎓 Highschool Prüfung', `Prüfung bestanden! Neuer Notendurchschnitt: ${this.gpa.toFixed(1)} (+50 AP)`, '⭐', 'levelUp');
    } else {
      toastManager.showToast('🎓 Highschool Prüfung', 'Prüfung nicht bestanden. Lerne mehr in der Bibliothek!', '📚', 'warning');
    }
  }

  public celebrateProm(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    this.hasPromCrown = true;
    sim.simoleons += 300;
    sim.moodletManager.addMoodlet({
      id: 'prom_royalty',
      name: 'Prom König(in)',
      emotion: 'happy',
      weight: 3,
      durationSec: 300,
      icon: '👑',
      description: 'Zum Prom-König/Königin gewählt!'
    });

    soundManager.playLevelUp();
    toastManager.showToast('👑 PROM NACHT!', `${sim.customization.name} wurde zum Prom-König / Prom-Königin gekrönt!`, '👑', 'levelUp');
  }
}
