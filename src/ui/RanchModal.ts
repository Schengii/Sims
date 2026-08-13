/**
 * Farm & Ranch Life Modal
 * Manage farm livestock, harvest crop fields, and collect market proceeds.
 */

import { FarmSystem } from '../systems/FarmSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class RanchModal {
  private container: HTMLDivElement | null = null;

  public open(farmSystem: FarmSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(farmSystem, sim, toastManager, soundManager);
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
    content.id = 'ranch-modal-content';
    content.style.cssText = `
      width: 560px;
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

  private renderContent(farmSystem: FarmSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#ranch-modal-content');
    if (!content) return;

    const animals = farmSystem.getAnimals();
    const crops = farmSystem.getCropFields();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🌾 Bauernhof & Ranch-Imperium
        </h2>
        <button id="ranch-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
        <span>Bio-Zertifikat: <strong style="color: #facc15;">⭐ Aktiv</strong></span>
      </div>

      <div style="font-weight: bold; font-size: 0.95rem; margin-top: 4px;">Nutztiere & Erträge:</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${animals.map(a => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.95rem;">${a.name}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">Ertrag: ${a.productIcon} ${a.productName} (§${a.productValue})</div>
            </div>
            <div>
              <button class="harvest-animal-btn" data-id="${a.id}" ${!a.isReadyForHarvest ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;"'}>
                ${a.isReadyForHarvest ? 'Melken / Scheren' : `Produziert (${a.harvestProgress}%)`}
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="font-weight: bold; font-size: 0.95rem; margin-top: 6px;">Feld-Kulturen & Ernte:</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${crops.map(c => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.95rem;">${c.name}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">Saatgut: §${c.seedCost} | Marktpreis: §${c.marketPrice}</div>
            </div>
            <div style="display: flex; gap: 6px;">
              ${c.growthProgress === 0 ? `
                <button class="plant-crop-btn" data-id="${c.id}" style="background:#2563eb; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">
                  Pflanzen (§${c.seedCost})
                </button>
              ` : `
                <button class="harvest-crop-btn" data-id="${c.id}" ${!c.isReady ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="background:#10b981; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;"'}>
                  ${c.isReady ? 'Ernten (§' + c.marketPrice + ')' : `Wächst (${c.growthProgress}%)`}
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#ranch-close-btn')?.addEventListener('click', () => this.close());

    content.querySelectorAll('.harvest-animal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = farmSystem.harvestAnimalProduct(id);
          if (res.success) {
            sim.simoleons += res.value;
            soundManager.playBuySound();
            toastManager.showToast(res.message, 'success');
            this.renderContent(farmSystem, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });

    content.querySelectorAll('.plant-crop-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = farmSystem.plantCrop(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'success');
            this.renderContent(farmSystem, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });

    content.querySelectorAll('.harvest-crop-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = farmSystem.harvestCrop(id);
          if (res.success) {
            sim.simoleons += res.value;
            soundManager.playLevelUp();
            toastManager.showToast(res.message, 'success');
            this.renderContent(farmSystem, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
