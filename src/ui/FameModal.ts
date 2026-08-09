/**
 * Celebrity Fame & Paparazzi Modal
 * Displays fame rank, perks tree, and autograph options.
 */

import { FameSystem } from '../systems/FameSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class FameModal {
  private container: HTMLDivElement | null = null;

  public open(fameSystem: FameSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(fameSystem, sim, toastManager, soundManager);
      this.container.style.display = 'flex';
    }
  }

  public close(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.className = 'glass-modal-overlay';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.id = 'fame-modal-content';
    content.style.cssText = `
      width: 460px;
      padding: 24px;
      border-radius: 20px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(fameSystem: FameSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#fame-modal-content');
    if (!content) return;

    const stars = '⭐️'.repeat(fameSystem.fameRank);

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #facc15;">🌟 Promi-Status & Ruhm</h3>
        <button id="fame-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(250, 204, 21, 0.1); border: 1px solid #facc15; padding: 14px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-weight: bold; font-size: 16px;">${sim.customization.name}</div>
          <div style="font-size: 14px; color: #facc15; margin-top: 2px;">Promi-Rang: ${stars} (${fameSystem.fameRank}/5)</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Fame XP: ${fameSystem.fameXP} / ${fameSystem.fameRank * 200}</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-give-autograph" style="padding: 12px; background: linear-gradient(135deg, #facc15, #eab308); color: black; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          ✍️ Fans Autogramm geben (+Trinkgeld §)
        </button>

        <button id="btn-fame-party" style="padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          📸 Paparazzi-Fotoshooting (+60 Fame XP)
        </button>
      </div>
    `;

    content.querySelector('#fame-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-give-autograph')?.addEventListener('click', () => {
      fameSystem.giveAutograph(sim, toastManager, soundManager);
      this.renderContent(fameSystem, sim, toastManager, soundManager);
    });

    content.querySelector('#btn-fame-party')?.addEventListener('click', () => {
      fameSystem.addFameXP(60, sim, toastManager, soundManager);
      toastManager.showToast('📸 Fotoshooting', 'Fotoshooting absolviert! (+60 Fame XP)', '🌟', 'info');
      this.renderContent(fameSystem, sim, toastManager, soundManager);
    });
  }
}
