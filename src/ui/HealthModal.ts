/**
 * Health & Wellness Modal UI
 * Allows diagnosing sicknesses, drinking herbal tea, and calling doctor house visits.
 */

import { HealthSystem, ILLNESS_CATALOG } from '../systems/HealthSystem';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class HealthModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(healthSystem: HealthSystem, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const info = ILLNESS_CATALOG[healthSystem.currentIllness];
    const isSick = healthSystem.currentIllness !== 'none';

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'health-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 600px; width: 90%;">
        <div class="modal-header">
          <h2>🩺 Gesundheit & Medizin-Zentrum</h2>
          <button class="close-btn" id="close-health-modal">&times;</button>
        </div>

        <!-- Health Status Card -->
        <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; margin-bottom: 16px; border: 2px solid ${isSick ? '#e74c3c' : '#2ecc71'}; display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 40px; background: rgba(0,0,0,0.3); padding: 8px 16px; border-radius: 12px;">${info.icon}</span>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; color: #ffffff; font-size: 18px;">${info.name}</h3>
              <span style="font-size: 11px; padding: 3px 8px; border-radius: 6px; background: ${isSick ? 'rgba(231,76,60,0.3)' : 'rgba(46,204,113,0.3)'}; color: ${isSick ? '#e74c3c' : '#2ecc71'}; font-weight: bold;">
                ${isSick ? `Akut (${Math.ceil(healthSystem.remainingMinutes)} Min)` : 'Gesund'}
              </span>
            </div>
            <p style="margin: 4px 0 0 0; color: #bdc3c7; font-size: 13px;">${info.description}</p>
            <div style="margin-top: 6px; font-size: 12px; color: #f1c40f;">💡 <em>${info.remedyHint}</em></div>
          </div>
        </div>

        <!-- Treatment Options Grid -->
        <h4 style="margin-bottom: 10px; color: #ecf0f1;">💊 Verfügbare Heilmittel & Behandlungen</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="glass-panel" style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 24px; margin-bottom: 6px;">🍵</div>
              <h5 style="margin: 0 0 4px 0; color: #ffffff;">Bio-Kräutertee brauen</h5>
              <p style="font-size: 11px; color: #bdc3c7; margin: 0;">Lindert Erkältungen & Allergien sanft.</p>
            </div>
            <button class="hud-btn" id="btn-drink-tea" style="margin-top: 10px; width: 100%; justify-content: center; background: #27ae60;">
              🍵 Tee kochen (§ 0)
            </button>
          </div>

          <div class="glass-panel" style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 24px; margin-bottom: 6px;">🚑</div>
              <h5 style="margin: 0 0 4px 0; color: #ffffff;">Arzt-Hausbesuch rufen</h5>
              <p style="font-size: 11px; color: #bdc3c7; margin: 0;">Sofortige Diagnose & 100% Heilung.</p>
            </div>
            <button class="hud-btn" id="btn-call-doctor" style="margin-top: 10px; width: 100%; justify-content: center; background: #e74c3c;">
              🚑 Arzt rufen (§ 250)
            </button>
          </div>
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-health-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-health-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-health-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-drink-tea')?.addEventListener('click', () => {
      const res = healthSystem.drinkHerbalTea(sim);
      this.soundManager.playUIClick();
      toastManager?.showToast('Bio-Kräutertee', res.message, '🍵', 'success');
      this.close();
    });

    modal.querySelector('#btn-call-doctor')?.addEventListener('click', () => {
      const res = healthSystem.callDoctorHomeVisit(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🚑 Arzt-Hausbesuch', res.message, '💉', 'levelUp');
        this.close();
      } else {
        toastManager?.showToast('⚠️ Simoleons fehlen', res.message, '🪙', 'warning');
      }
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
