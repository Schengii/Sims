/**
 * Resort Empire & Island Getaway Modal
 * Management dashboard for buying resorts, upgrading amenities, setting prices,
 * and collecting daily profits.
 */

import { ResortManager } from '../systems/ResortManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class ResortModal {
  private container: HTMLDivElement | null = null;

  public open(resortManager: ResortManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(resortManager, sim, toastManager, soundManager);
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
    content.id = 'resort-modal-content';
    content.style.cssText = `
      width: 580px;
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

  private renderContent(resortManager: ResortManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#resort-modal-content');
    if (!content) return;

    const resorts = resortManager.getResorts();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🏝️ Resort-Imperium & Insel-Hotels
        </h2>
        <button id="resort-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; font-size: 0.9rem; display:flex; justify-content:space-between; align-items:center;">
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
        <button id="resort-collect-btn" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">
          💰 Gewinne Abholen
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${resorts.map(r => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-weight: bold; font-size: 1.05rem;">${r.name}</span>
                <div style="font-size: 0.8rem; color: #94a3b8;">📍 ${r.location} | ⭐ ${r.starRating.toFixed(1)} / 5.0</div>
              </div>
              <div>
                ${r.isOwned
                  ? `<span style="background: #065f46; color: #34d399; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold;">BESITZT</span>`
                  : `<button class="resort-buy-btn" data-id="${r.id}" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Kaufen (§${r.price.toLocaleString()})</button>`
                }
              </div>
            </div>

            ${r.isOwned ? `
              <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div>Gäste / Tag: <strong>${r.dailyGuests}</strong></div>
                <div>Zimmerpreis: <strong>§${r.roomRate}/Nacht</strong></div>
                <div>Tägliche Ausgaben: <span style="color:#ef4444;">-§${r.dailyExpenses}</span></div>
                <div>Täglicher Gewinn: <span style="color:#4ade80; font-weight:bold;">+§${r.netProfit}</span></div>
              </div>

              <div style="font-size: 0.8rem; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 6px;">
                <button class="resort-amenity-btn" data-id="${r.id}" data-key="poolBar" data-cost="2000" style="background: ${r.amenities.poolBar ? '#047857' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${r.amenities.poolBar ? '✓' : '+'} Pool-Bar (§2.000)
                </button>
                <button class="resort-amenity-btn" data-id="${r.id}" data-key="luxurySpa" data-cost="4500" style="background: ${r.amenities.luxurySpa ? '#047857' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${r.amenities.luxurySpa ? '✓' : '+'} Wellness Spa (§4.500)
                </button>
                <button class="resort-amenity-btn" data-id="${r.id}" data-key="fireShow" data-cost="3000" style="background: ${r.amenities.fireShow ? '#047857' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${r.amenities.fireShow ? '✓' : '+'} Feuer-Show (§3.000)
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#resort-close-btn')?.addEventListener('click', () => this.close());

    content.querySelector('#resort-collect-btn')?.addEventListener('click', () => {
      const res = resortManager.collectDailyProfits();
      if (res.totalProfit > 0) {
        sim.simoleons += res.totalProfit;
        soundManager.playBuySound();
        toastManager.showToast(res.text, 'success');
        this.renderContent(resortManager, sim, toastManager, soundManager);
      } else {
        toastManager.showToast(res.text, 'info');
      }
    });

    content.querySelectorAll('.resort-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = resortManager.buyResort(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playLevelUp();
            toastManager.showToast(res.message, 'success');
            this.renderContent(resortManager, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });

    content.querySelectorAll('.resort-amenity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const id = el.getAttribute('data-id');
        const key = el.getAttribute('data-key') as any;
        const cost = parseInt(el.getAttribute('data-cost') || '0', 10);

        if (id && key) {
          const res = resortManager.toggleAmenity(id, key, cost, sim.simoleons);
          if (res.success) {
            if (res.cost > 0) sim.simoleons -= res.cost;
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'success');
            this.renderContent(resortManager, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
