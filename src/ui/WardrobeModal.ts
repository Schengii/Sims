/**
 * Sim Wardrobe & Outfits Modal UI
 */

import { Sim } from '../entity/Sim';
import { WardrobeManager, type OutfitCategory } from '../systems/WardrobeSystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class WardrobeModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-wardrobe-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 500px;">
          <div class="modal-header">
            <h2>👗 Kleiderschrank & Outfits</h2>
            <button class="btn-close" id="wardrobe-btn-close">&times;</button>
          </div>
          <div id="wardrobe-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('wardrobe-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, wardrobeManager: WardrobeManager): void {
    const backdrop = document.getElementById('modal-wardrobe-backdrop');
    const content = document.getElementById('wardrobe-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    let html = `
      <h3 style="color: #3498db; margin-bottom: 10px;">👕 Outfit wählen für ${sim.customization.name}:</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
    `;

    Object.values(wardrobeManager.outfits).forEach(outfit => {
      const isActive = wardrobeManager.activeCategory === outfit.category;
      html += `
        <div style="background: ${isActive ? 'rgba(52, 152, 219, 0.25)' : 'rgba(255,255,255,0.05)'}; padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; border: ${isActive ? '1px solid #3498db' : 'none'};">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.4rem;">${outfit.icon}</span>
            <div>
              <strong>${outfit.name}</strong>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span style="font-size: 0.8rem; color: #bdc3c7;">Farbe:</span>
                <span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${outfit.color}; border: 1px solid #fff;"></span>
              </div>
            </div>
          </div>
          <button class="btn-hud btn-wear-outfit" data-cat="${outfit.category}" style="background: ${isActive ? '#27ae60' : '#34495e'}">
            ${isActive ? '✓ Anbezogen' : 'Anziehen'}
          </button>
        </div>
      `;
    });

    html += `</div>`;
    content.innerHTML = html;

    document.querySelectorAll('.btn-wear-outfit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.soundManager.playUIClick();
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') as OutfitCategory;
        const outfit = wardrobeManager.switchCategory(cat);
        sim.customization.outfitColor = outfit.color;
        ToastManager.showToast('👗 Outfit gewechselt', `Umgezogen in: ${outfit.name}!`, '👗', 'success');
        this.open(sim, wardrobeManager);
      });
    });
  }

  public close(): void {
    document.getElementById('modal-wardrobe-backdrop')?.classList.remove('active');
  }
}
