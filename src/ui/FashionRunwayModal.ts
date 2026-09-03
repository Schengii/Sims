/**
 * Fashion Runway Catwalk Modal UI
 * Allows Sims to present collections on the illuminated runway, pose in spotlight flashlights, and earn modeling fees.
 */

import { FashionRunwaySystem, RUNWAY_SHOWS } from '../systems/FashionRunwaySystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class FashionRunwayModal {
  private container: HTMLElement;
  private runwaySystem: FashionRunwaySystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    runwaySystem: FashionRunwaySystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.runwaySystem = runwaySystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-fashion-runway';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(35, 15, 30, 0.96); border: 1px solid rgba(236, 72, 153, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">💃</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #f472b6;">Modenschau-Catwalk & Modelagentur</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fbcfe8;">
                Model-Rating: <b>${'⭐'.repeat(this.runwaySystem.modelRating)} (${this.runwaySystem.modelRating}/5)</b>
                | Absolvierte Shows: ${this.runwaySystem.showsWalked}
              </p>
            </div>
          </div>
          <button id="close-runway-modal" style="background: transparent; border: none; font-size: 26px; color: #fbcfe8; cursor: pointer;">&times;</button>
        </div>

        <!-- Fashion Shows Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">👠 Modenschau-Auftritt wählen:</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${RUNWAY_SHOWS.map(show => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(236, 72, 153, 0.2);
              border-radius: 10px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 30px;">${show.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${show.title}</div>
                  <div style="font-size: 11px; color: #94a3b8;">${show.description}</div>
                  <div style="font-size: 11px; color: #f472b6; margin-top: 2px;">Gage: <b>§ ${show.reward.toLocaleString()}</b> | Ruhm: +${show.fameGain}</div>
                </div>
              </div>

              <button class="walk-runway-btn" data-id="${show.id}" style="
                background: linear-gradient(135deg, #ec4899, #db2777); border: none; color: white;
                border-radius: 6px; padding: 10px 18px; font-weight: bold; font-size: 12px; cursor: pointer;
              ">💃 Catwalk betreten</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-runway-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.walk-runway-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') as any;
        const res = this.runwaySystem.walkRunway(id, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('💃 Catwalk-Erfolg', res.message, '✨', 'levelUp');
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-fashion-runway');
    if (existing) existing.remove();
  }
}
