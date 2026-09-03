/**
 * Ice Skating & Winter Resort Modal UI
 * Allows Sims to train figure skating, play hockey matches, order hot punch, and perform in winter contests.
 */

import { IceSkatingSystem } from '../systems/IceSkatingSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class IceSkatingModal {
  private container: HTMLElement;
  private skatingSystem: IceSkatingSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    skatingSystem: IceSkatingSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.skatingSystem = skatingSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-ice-skating';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(15, 30, 50, 0.96); border: 1px solid rgba(56, 189, 248, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">⛸️</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Winter-Resort & Schlittschuhbahn</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #bae6fd;">
                Eislauf-Stufe: <b>${this.skatingSystem.skatingSkillLevel}/5</b> (XP: ${this.skatingSystem.skatingXP}/${this.skatingSystem.skatingSkillLevel * 100})
                | Heißer Punsch serviert: ${this.skatingSystem.totalPunchServed}x
              </p>
            </div>
          </div>
          <button id="close-skating-modal" style="background: transparent; border: none; font-size: 26px; color: #bae6fd; cursor: pointer;">&times;</button>
        </div>

        <!-- Ice Activities Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">❄️ Winter-Aktivität auf dem Eis wählen:</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
          
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">⛸️</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">Pirouetten & Eislauf-Training</div>
                <div style="font-size: 11px; color: #38bdf8;">+35 Eislauf-XP, +30 Fitness</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #cbd5e1;">Perfektioniere Sprünge und Drehungen auf der Eisfläche.</p>
            <button id="practice-skating-btn" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: none; color: white; padding: 8px; border-radius: 6px; font-weight: bold; cursor: pointer;">⛸️ Trainieren</button>
          </div>

          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">🏒</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">Eishockey-Match</div>
                <div style="font-size: 11px; color: #38bdf8;">+45 Spaß, +30 Sozial, +40 Fitness</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #cbd5e1;">Puck über das Eis jagen im rasanten Team-Duell.</p>
            <button id="play-hockey-btn" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: none; color: white; padding: 8px; border-radius: 6px; font-weight: bold; cursor: pointer;">🏒 Puck spielen</button>
          </div>

          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">☕</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">Heißer Gewürzpunsch</div>
                <div style="font-size: 11px; color: #fbbf24;">+30 Energie, +20 Hunger, Wärme-Moodlet</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #cbd5e1;">Frisch aufgebrühter Zimt-Nelken-Punsch an der Hütte.</p>
            <button id="drink-punch-btn" style="background: linear-gradient(135deg, #d97706, #b45309); border: none; color: white; padding: 8px; border-radius: 6px; font-weight: bold; cursor: pointer;">☕ Punsch trinken</button>
          </div>

          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span style="font-size: 26px;">🏆</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">Eiskunstlauf-Kür vor Jury</div>
                <div style="font-size: 11px; color: #eab308;">Preise bis § 1.800 & Medaillen</div>
              </div>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 11px; color: #cbd5e1;">Präsentiere deine beste Kür und gewinne Gold!</p>
            <button id="perform-contest-btn" style="background: linear-gradient(135deg, #eab308, #ca8a04); border: none; color: white; padding: 8px; border-radius: 6px; font-weight: bold; cursor: pointer;">🥇 Kür laufen</button>
          </div>

        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-skating-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#practice-skating-btn')?.addEventListener('click', () => {
      const res = this.skatingSystem.practiceSkating(this.sim);
      this.soundManager.playBuySound();
      this.toastManager.showToast('⛸️ Eiskunstlauf', res.message, '✨', 'success');
      this.open();
    });

    backdrop.querySelector('#play-hockey-btn')?.addEventListener('click', () => {
      const res = this.skatingSystem.playIceHockey(this.sim);
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🏒 Eishockey', res.message, '🏆', 'success');
      this.open();
    });

    backdrop.querySelector('#drink-punch-btn')?.addEventListener('click', () => {
      const res = this.skatingSystem.drinkHotPunch(this.sim);
      this.soundManager.playBuySound();
      this.toastManager.showToast('☕ Heißer Punsch', res.message, '❄️', 'info');
      this.open();
    });

    backdrop.querySelector('#perform-contest-btn')?.addEventListener('click', () => {
      const res = this.skatingSystem.performFigureContest(this.sim);
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🏆 Kür-Ergebnis', res.message, '🌟', 'levelUp');
      this.open();
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-ice-skating');
    if (existing) existing.remove();
  }
}
