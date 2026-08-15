/**
 * City Politics & Town Hall UI Modal
 * Displays political ranks, voter support, speech delivery, and ordinances.
 */

import { PoliticsManager } from '../systems/PoliticsManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class PoliticsModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(politicsManager: PoliticsManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'politics-modal';

    const rankTitles = ['Bürger', 'Kampagnenleiter', 'Stadtrat', 'Vize-Bürgermeister', 'Oberbürgermeister 👑'];
    const currentTitle = rankTitles[politicsManager.politicalRank - 1] || 'Bürgermeister';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>🏛️ Rathaus & Bürgermeister-Wahl</h2>
          <button class="close-btn" id="close-politics-modal">&times;</button>
        </div>

        <!-- Political Rank & Voter Support Bar -->
        <div style="background: rgba(41, 128, 185, 0.15); border: 1px solid #2980b9; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #3498db; font-size: 15px;">🏛️ Rang: ${currentTitle} (Stufe ${politicsManager.politicalRank}/5)</span>
            <span style="color: #2ecc71; font-weight: bold;">📊 Wähler-Zustimmung: ${politicsManager.voterSupport}%</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div style="background: linear-gradient(90deg, #2980b9, #2ecc71); width: ${politicsManager.voterSupport}%; height: 100%;"></div>
          </div>

          <div style="margin-top: 10px; text-align: right;">
            <button class="hud-btn" id="btn-campaign-speech" style="background: #27ae60; color: #fff; font-weight: bold; font-size: 12px;">
              📢 Wahlkampfrede halten (-20 Energie)
            </button>
          </div>
        </div>

        <h4 style="margin: 0 0 10px 0; color: #f1c40f;">📜 Nachbarschafts-Verordnungen:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 240px; overflow-y: auto;">
          ${politicsManager.ordinances.map(ord => {
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; border-left: 4px solid ${ord.active ? '#2ecc71' : '#7f8c8d'};">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 26px;">${ord.icon}</span>
                  <div>
                    <div style="font-weight: bold; color: ${ord.active ? '#2ecc71' : '#ffffff'}; font-size: 14px;">
                      ${ord.name} ${ord.active ? '(AKTIV)' : ''}
                    </div>
                    <div style="font-size: 11px; color: #bdc3c7;">${ord.description}</div>
                  </div>
                </div>

                <button class="hud-btn btn-enact-ord" data-id="${ord.id}" style="padding: 6px 12px; font-size: 11px; background: ${ord.active ? '#e74c3c' : '#2980b9'}; font-weight: bold;">
                  ${ord.active ? 'Aufheben' : `Erlassen (§ ${ord.costToEnact})`}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-politics-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-politics-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-politics-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-campaign-speech')?.addEventListener('click', () => {
      const res = politicsManager.deliverCampaignSpeech(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('📢 Wahlkampfrede', res.message, '🏛️', 'levelUp');
        this.open(politicsManager, sim, toastManager);
      } else {
        toastManager?.showToast('Wahlkampf', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelectorAll('.btn-enact-ord').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = politicsManager.enactOrdinance(id, sim);
          if (res.success) {
            this.soundManager.playUIClick();
            toastManager?.showToast('🏛️ Rathaus-Beschluss', res.message, '📜', 'success');
            this.open(politicsManager, sim, toastManager);
          } else {
            toastManager?.showToast('Rathaus', res.message, '⚠️', 'warning');
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
