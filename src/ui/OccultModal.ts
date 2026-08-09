/**
 * Occult & Supernatural Powers Modal
 */

import { OccultSystem } from '../systems/OccultSystem';
import type { OccultType } from '../systems/OccultSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class OccultModal {
  private container: HTMLDivElement | null = null;

  public open(occultSystem: OccultSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(occultSystem, sim, toastManager, soundManager);
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
    content.id = 'occult-modal-content';
    content.style.cssText = `
      width: 440px;
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

  private renderContent(occultSystem: OccultSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#occult-modal-content');
    if (!content) return;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #a855f7;">🔮 Okkulte Verwandlungen</h3>
        <button id="occult-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: bold; font-size: 15px;">Form: ${occultSystem.occultType.toUpperCase()}</div>
          <div style="font-size: 12px; color: #94a3b8;">Dunkle Form: ${occultSystem.isDarkForm ? 'Aktiv 🦇' : 'Inaktiv'}</div>
        </div>

        <button id="btn-toggle-dark" style="padding: 8px 14px; background: #7e22ce; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
          🦇 Verwandeln
        </button>
      </div>

      <div style="font-weight: bold; font-size: 13px; color: #cbd5e1;">Lebensform wählen:</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button class="btn-set-occult" data-type="vampire" style="padding: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: bold; cursor: pointer;">
          🦇 Vampir
        </button>
        <button class="btn-set-occult" data-type="werewolf" style="padding: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: bold; cursor: pointer;">
          🐺 Werwolf
        </button>
        <button class="btn-set-occult" data-type="alien" style="padding: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: bold; cursor: pointer;">
          👽 Alien
        </button>
        <button class="btn-set-occult" data-type="human" style="padding: 10px; background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: bold; cursor: pointer;">
          🧑 Mensch
        </button>
      </div>
    `;

    content.querySelector('#occult-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-toggle-dark')?.addEventListener('click', () => {
      occultSystem.toggleDarkForm(sim, toastManager, soundManager);
      this.renderContent(occultSystem, sim, toastManager, soundManager);
    });

    content.querySelectorAll('.btn-set-occult').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).getAttribute('data-type') as OccultType;
        if (type) {
          occultSystem.setOccultForm(type, sim, toastManager, soundManager);
          this.renderContent(occultSystem, sim, toastManager, soundManager);
        }
      });
    });
  }
}
