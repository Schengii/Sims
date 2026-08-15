/**
 * Space Exploration UI Modal
 * Displays Rocket construction progress, launch button, and space missions.
 */

import { SpaceManager, MISSIONS_CATALOG } from '../systems/SpaceManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class SpaceModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(spaceManager: SpaceManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'space-modal';

    const isReady = spaceManager.rocketBuildProgress >= 100;

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>🚀 Weltraum-Labor & Raketenstartrampe</h2>
          <button class="close-btn" id="close-space-modal">&times;</button>
        </div>

        <!-- Rocket Construction Progress -->
        <div style="background: rgba(142, 68, 173, 0.15); border: 1px solid #8e44ad; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #9b59b6; font-size: 15px;">🚀 Raketenbau: ${spaceManager.rocketBuildProgress}% fertig</span>
            <span style="color: #00e5ff; font-weight: bold;">⭐ Missionen: ${spaceManager.completedMissions}</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 12px;">
            <div style="background: linear-gradient(90deg, #8e44ad, #00e5ff); width: ${spaceManager.rocketBuildProgress}%; height: 100%;"></div>
          </div>

          <button class="hud-btn" id="btn-build-rocket" ${isReady ? 'disabled' : ''} style="background: ${isReady ? '#7f8c8d' : '#8e44ad'}; color: #fff; font-weight: bold; width: 100%; justify-content: center;">
            ${isReady ? '✅ Rakete ist vollständig montiert & startbereit!' : '🛠️ Raketenstufe montieren (-20 Energie)'}
          </button>
        </div>

        <h4 style="margin: 0 0 10px 0; color: #00e5ff;">🌌 Verfügbare Weltraum-Missionen:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 240px; overflow-y: auto;">
          ${MISSIONS_CATALOG.map(mission => {
            const canFuel = isReady && sim.simoleons >= mission.fuelCost;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.06); padding: 12px; border-radius: 10px; border-left: 4px solid #00e5ff;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 28px;">${mission.icon}</span>
                  <div>
                    <h4 style="margin: 0; color: #ffffff;">${mission.name}</h4>
                    <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">${mission.description}</div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                  <span style="color: #f1c40f; font-size: 11px;">Treibstoff: § ${mission.fuelCost} | Gewinn: § ${mission.rewardSimoleons}</span>
                  <button class="hud-btn btn-launch-mission" data-id="${mission.id}" ${canFuel ? '' : 'disabled'} style="padding: 6px 12px; font-size: 11px; background: ${canFuel ? '#00e5ff' : '#7f8c8d'}; color: #000; font-weight: bold;">
                    🚀 Starten
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-space-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-space-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-space-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-build-rocket')?.addEventListener('click', () => {
      const res = spaceManager.buildRocket(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('🛠️ Raketenbau', res.message, '🚀', 'levelUp');
        this.open(spaceManager, sim, toastManager);
      } else {
        toastManager?.showToast('Raketenbau', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelectorAll('.btn-launch-mission').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = spaceManager.launchMission(id, sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🌌 Weltraum-Mission', res.message, '🪐', 'levelUp');
            this.open(spaceManager, sim, toastManager);
          } else {
            toastManager?.showToast('Missions-Start', res.message, '⚠️', 'warning');
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
