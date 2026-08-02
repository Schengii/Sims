/**
 * Build & Buy Mode Catalog UI
 * Allows purchasing furniture, placing items on the isometric grid, and deducting Simoleons (§).
 */

import { Sim } from '../entity/Sim';
import { House } from '../world/House';
import { FURNITURE_CATALOG } from '../world/Furniture';
import { SoundManager } from '../audio/SoundManager';

export class BuildBuyCatalog {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onFurnitureSelected?: (furnitureId: string) => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-build-backdrop" role="dialog" aria-modal="true" aria-labelledby="build-title">
        <div class="modal-dialog glass-panel" style="max-width: 750px;">
          <div class="modal-header">
            <h2 id="build-title">🛋️ Bauen & Kaufen Katalog</h2>
            <button class="btn-close" id="build-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; max-height: 60vh; overflow-y: auto; padding-right: 6px;" id="build-items-grid">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    `;
  }

  public open(sim: Sim, house: House): void {
    const backdrop = document.getElementById('modal-build-backdrop');
    const itemsGrid = document.getElementById('build-items-grid');
    if (!backdrop || !itemsGrid) return;

    itemsGrid.innerHTML = Object.values(FURNITURE_CATALOG).map(item => {
      const canAfford = sim.simoleons >= item.price;
      return `
        <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between; border-color: ${canAfford ? 'var(--panel-border)' : 'rgba(231,76,60,0.3)'};">
          <div>
            <div style="font-size: 2rem; text-align: center; margin-bottom: 8px;">${item.icon}</div>
            <h4 style="font-family: var(--font-heading); font-size: 1rem;">${item.name}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">${item.description}</p>
          </div>
          <div>
            <div style="font-family: var(--font-heading); font-weight: 700; color: ${canAfford ? 'var(--simoleon-green)' : 'var(--warning-red)'}; margin-bottom: 8px;">
              § ${item.price.toLocaleString()}
            </div>
            <button class="btn-hud buy-item-btn" data-id="${item.id}" ${canAfford ? '' : 'disabled'} style="width: 100%; justify-content: center; font-size: 0.85rem;">
              ${canAfford ? '🛒 Kaufen & Platzieren' : 'Zu teuer'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    backdrop.classList.add('active');

    // Attach buy click listeners
    const buyBtns = itemsGrid.querySelectorAll('.buy-item-btn');
    buyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (!id) return;
        const itemDef = FURNITURE_CATALOG[id];

        if (sim.simoleons >= itemDef.price) {
          sim.simoleons -= itemDef.price;
          this.soundManager.playBuySound();
          
          // Place item at default open tile in house
          house.addFurniture(id, 6, 6);
          this.close();
        }
      });
    });

    document.getElementById('build-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-build-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
