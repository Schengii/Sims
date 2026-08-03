/**
 * Furniture Interaction Selection Modal
 * Displays available interaction choices when clicking on an object in the house.
 */

import { SoundManager } from '../audio/SoundManager';
import type { FurnitureDefinition } from '../world/Furniture';

export class FurnitureModal {
  private container: HTMLElement;
  private soundManager: SoundManager;
  private modalEl: HTMLElement | null = null;
  public onSelectInteraction: ((interactionId: string) => void) | null = null;

  constructor(parentContainer: HTMLElement, soundManager: SoundManager) {
    this.container = parentContainer;
    this.soundManager = soundManager;
  }

  public open(furnitureDef: FurnitureDefinition, _instanceId?: string): void {
    this.close();

    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop';
    this.modalEl.innerHTML = `
      <div class="modal-card glass-panel" style="max-width: 420px; animation: popIn 0.3s ease-out;">
        <div class="modal-header">
          <h2 style="margin: 0; font-size: 1.25rem;">${furnitureDef.icon} ${furnitureDef.name}</h2>
          <button class="btn-icon" id="close-furniture-modal">✕</button>
        </div>
        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 1.25rem;">
          ${furnitureDef.description}
        </p>

        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${furnitureDef.interactions.map(act => `
            <button class="btn-primary interaction-option-btn" data-id="${act.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.2rem; text-align: left;">
              <span style="font-size: 1.1rem; font-weight: 600;">${act.icon} ${act.label}</span>
              <span style="font-size: 0.8rem; opacity: 0.8; background: rgba(0,0,0,0.3); padding: 0.2rem 0.5rem; borderRadius: 4px;">${act.duration} Min</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    this.container.appendChild(this.modalEl);

    this.modalEl.querySelector('#close-furniture-modal')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      this.close();
    });

    const optionBtns = this.modalEl.querySelectorAll('.interaction-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const actId = target.getAttribute('data-id');
        this.soundManager.playUIClick();
        if (actId && this.onSelectInteraction) {
          this.onSelectInteraction(actId);
        }
        this.close();
      });
    });
  }

  public close(): void {
    if (this.modalEl && this.modalEl.parentNode === this.container) {
      this.container.removeChild(this.modalEl);
      this.modalEl = null;
    }
  }
}
