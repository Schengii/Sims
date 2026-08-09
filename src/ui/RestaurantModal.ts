/**
 * Gourmet Restaurant Owner Modal
 */

import { RestaurantSystem } from '../systems/RestaurantSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class RestaurantModal {
  private container: HTMLDivElement | null = null;

  public open(restSystem: RestaurantSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(restSystem, sim, toastManager, soundManager);
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
    content.id = 'restaurant-modal-content';
    content.style.cssText = `
      width: 480px;
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

  private renderContent(restSystem: RestaurantSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#restaurant-modal-content');
    if (!content) return;

    const stars = '⭐'.repeat(restSystem.stars);

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #f97316;">🍽️ Gourmet-Restaurant Manager</h3>
        <button id="rest-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(249, 115, 22, 0.1); border: 1px solid #f97316; padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: bold; font-size: 16px;">${restSystem.restaurantName}</div>
          <div style="font-size: 13px; color: #f97316;">Bewertung: ${stars} (${restSystem.stars}/5 Sterne)</div>
          <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-top: 2px;">Tagesgewinn: § ${restSystem.dailyProfit} / Tag</div>
        </div>

        ${restSystem.isOwner ? `
          <button id="btn-collect-rest-profit" style="padding: 8px 14px; background: #22c55e; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            💰 Gewinne
          </button>
        ` : `
          <button id="btn-buy-rest" style="padding: 8px 14px; background: #ea580c; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
            Kaufen (§ 12.000)
          </button>
        `}
      </div>

      <div style="font-weight: bold; font-size: 13px; color: #cbd5e1;">Aktuelle Speisekarte:</div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${restSystem.menu.map(m => `
          <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>${m.icon}</span>
              <span style="font-weight: bold; font-size: 13px;">${m.name}</span>
            </div>
            <span style="color: #4ade80; font-weight: bold;">§ ${m.price}</span>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#rest-modal-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-buy-rest')?.addEventListener('click', () => {
      restSystem.buyRestaurant(sim, toastManager, soundManager);
      this.renderContent(restSystem, sim, toastManager, soundManager);
    });

    content.querySelector('#btn-collect-rest-profit')?.addEventListener('click', () => {
      restSystem.collectDailyProfit(sim, toastManager, soundManager);
    });
  }
}
