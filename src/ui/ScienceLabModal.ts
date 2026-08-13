/**
 * Sci-Fi Laboratory & Invention Workbench Modal
 * Crafts futuristic gadgets and brews chemical serums.
 */

import { InventionSystem } from '../systems/InventionSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';
import { WeatherSystem } from '../systems/WeatherSystem';

export class ScienceLabModal {
  private container: HTMLDivElement | null = null;

  public open(inventionSystem: InventionSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager, weatherSystem?: WeatherSystem): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(inventionSystem, sim, toastManager, soundManager, weatherSystem);
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
    content.id = 'science-lab-modal-content';
    content.style.cssText = `
      width: 540px;
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

  private renderContent(inventionSystem: InventionSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager, weatherSystem?: WeatherSystem): void {
    const content = this.container?.querySelector('#science-lab-modal-content');
    if (!content) return;

    const items = inventionSystem.getInventions();
    const scienceSkill = sim.skills.programming || 1; // Uses technical programming skill

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🔬 Sci-Fi Labor & Erfinder-Werkbank
        </h2>
        <button id="science-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <span>Wissenschafts-Stufe: <strong style="color: #60a5fa;">Stufe ${scienceSkill}</strong></span>
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${items.map(item => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="font-size: 2rem;">${item.icon}</div>
              <div>
                <div style="font-weight: bold; font-size: 0.95rem;">${item.name}</div>
                <div style="font-size: 0.8rem; color: #94a3b8;">${item.description}</div>
                <div style="font-size: 0.75rem; color: #64748b; margin-top: 2px;">
                  Vorrat: <strong style="color:#60a5fa;">${item.quantity}</strong> | Req Level: ${item.scienceSkillReq}
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              <button class="craft-btn" data-id="${item.id}" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
                Bauen (§${item.craftCost})
              </button>
              ${item.category === 'serum' && item.quantity > 0 ? `
                <button class="use-btn" data-id="${item.id}" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; cursor: pointer;">
                  Trinken
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#science-close-btn')?.addEventListener('click', () => this.close());

    content.querySelectorAll('.craft-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = inventionSystem.craftItem(id, sim.simoleons, scienceSkill);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playLevelUp();
            toastManager.showToast(res.message, 'success');
            this.renderContent(inventionSystem, sim, toastManager, soundManager, weatherSystem);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });

    content.querySelectorAll('.use-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = inventionSystem.useSerum(id);
          if (res.success) {
            soundManager.playLevelUp();
            if (res.effectType === 'serum_energy') {
              sim.needs.modify('energy', 100);
              sim.needs.modify('hygiene', 100);
            } else if (res.effectType === 'serum_midas') {
              sim.simoleons += 3500;
            } else if (res.effectType === 'serum_youth') {
              sim.ageDays = Math.max(0, sim.ageDays - 5);
            }
            toastManager.showToast(res.message, 'success');
            this.renderContent(inventionSystem, sim, toastManager, soundManager, weatherSystem);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
