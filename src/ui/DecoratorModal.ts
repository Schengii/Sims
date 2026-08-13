/**
 * Interior Decorator Career & Gigs Modal
 * View client contracts, submit design makeovers, and check reputation.
 */

import { InteriorDecoratorSystem } from '../systems/InteriorDecoratorSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class DecoratorModal {
  private container: HTMLDivElement | null = null;

  public open(decoratorSystem: InteriorDecoratorSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(decoratorSystem, sim, toastManager, soundManager);
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
    content.id = 'decorator-modal-content';
    content.style.cssText = `
      width: 520px;
      max-height: 85vh;
      overflow-y: auto;
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

  private renderContent(decoratorSystem: InteriorDecoratorSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#decorator-modal-content');
    if (!content) return;

    const activeGig = decoratorSystem.getActiveGig();
    const gigs = decoratorSystem.getGigs();
    const rank = decoratorSystem.getReputationRank();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🎨 Raumausstatter & Innenarchitekt
        </h2>
        <button id="decorator-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <span>Designer-Rang: <strong style="color: #f59e0b;">⭐ Rang ${rank} / 5</strong></span>
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
      </div>

      ${activeGig ? `
        <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 12px; padding: 14px;">
          <div style="font-weight: bold; color: #34d399; font-size: 1rem; margin-bottom: 4px;">Aktiver Auftrag: ${activeGig.roomType} für ${activeGig.clientName}</div>
          <div style="font-size: 0.85rem; color: #cbd5e1;">Stil: <strong>${activeGig.preferredStyle}</strong> | Farbe: <strong>${activeGig.preferredColor}</strong> | Budget: <strong>§${activeGig.budget}</strong></div>
          <div style="margin-top: 10px;">
            <button id="submit-gig-btn" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">
              ✨ Umgestaltung Präsentieren & Abschließen
            </button>
          </div>
        </div>
      ` : ''}

      <div style="font-weight: bold; font-size: 0.95rem; margin-top: 6px;">Verfügbare Aufträge:</div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${gigs.map(g => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.95rem;">${g.roomType} - ${g.clientName}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Stil: ${g.preferredStyle} | Farbe: ${g.preferredColor} | Budget: §${g.budget.toLocaleString()}
              </div>
            </div>
            <div>
              <button class="accept-gig-btn" data-id="${g.id}" ${activeGig ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="background:#2563eb; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;"'}>
                Annehmen (§${g.reward})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#decorator-close-btn')?.addEventListener('click', () => this.close());

    content.querySelector('#submit-gig-btn')?.addEventListener('click', () => {
      const res = decoratorSystem.submitActiveGig(4);
      if (res.success) {
        sim.simoleons += res.reward;
        soundManager.playLevelUp();
        toastManager.showToast(res.message, 'success');
        this.renderContent(decoratorSystem, sim, toastManager, soundManager);
      }
    });

    content.querySelectorAll('.accept-gig-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = decoratorSystem.acceptGig(id);
          if (res.success) {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'success');
            this.renderContent(decoratorSystem, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
