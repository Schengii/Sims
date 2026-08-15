import { FestivalManager } from '../systems/FestivalManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class FestivalModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(sim: Sim, day: number, toastManager?: ToastManager): void {
    this.close();

    const fest = FestivalManager.getFestivalForDay(day);
    const season = fest.season;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'festival-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 620px; width: 90%;">
        <div class="modal-header">
          <h2>${fest.icon} ${fest.name}</h2>
          <button class="close-btn" id="close-fest-modal">&times;</button>
        </div>

        <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; margin-bottom: 16px; border-left: 4px solid ${fest.themeColor};">
          <p style="margin: 0; color: #ecf0f1; font-size: 14px;">${fest.description}</p>
        </div>

        <h4 style="margin-bottom: 12px; color: #ffffff;">🎡 Festival-Aktivitäten & Marktstände</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${fest.activities.map(act => `
            <div class="glass-panel" style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 28px; margin-bottom: 6px;">${act.icon}</div>
                <h4 style="margin: 0 0 4px 0; color: #ffffff; font-size: 15px;">${act.label}</h4>
                <p style="font-size: 11px; color: #bdc3c7; margin: 0;">${act.rewardDesc}</p>
              </div>
              <button class="hud-btn btn-fest-act" data-id="${act.id}" style="margin-top: 10px; width: 100%; justify-content: center; background: ${fest.themeColor}; color: #000; font-weight: bold;">
                ${act.icon} Mitmachen (+${act.funGain} Spaß)
              </button>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-fest-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-fest-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-fest-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-fest-act').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = FestivalManager.executeActivity(id, sim, season);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast(fest.name, res.message, res.icon, 'success');
            this.close();
          }
        }
      });
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
