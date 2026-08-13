/**
 * Mega-Yacht & Island Cruise Modal
 * Management interface for luxury yachts, upgrades, and charter profits.
 */

import { YachtManager } from '../systems/YachtManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class CruiseModal {
  private container: HTMLDivElement | null = null;

  public open(yachtManager: YachtManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(yachtManager, sim, toastManager, soundManager);
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
    content.id = 'cruise-modal-content';
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

  private renderContent(yachtManager: YachtManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#cruise-modal-content');
    if (!content) return;

    const yachts = yachtManager.getYachts();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          ⛵ Mega-Yacht & Insel-Kreuzfahrt Flotte
        </h2>
        <button id="cruise-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; font-size: 0.9rem; display:flex; justify-content:space-between; align-items:center;">
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
        <button id="cruise-collect-btn" style="background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; border: none; padding: 8px 14px; border-radius: 8px; font-weight: bold; cursor: pointer;">
          ⚓ Charter-Einnahmen Abholen
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${yachts.map(y => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-weight: bold; font-size: 1.05rem;">${y.name}</span>
                <div style="font-size: 0.8rem; color: #94a3b8;">Typ: ${y.type} | Gäste / Tag: ${y.dailyCharterGuests}</div>
              </div>
              <div>
                ${y.isOwned
                  ? `<span style="background: #0284c7; color: #7dd3fc; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; font-weight: bold;">BESITZT</span>`
                  : `<button class="yacht-buy-btn" data-id="${y.id}" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">Kaufen (§${y.price.toLocaleString()})</button>`
                }
              </div>
            </div>

            ${y.isOwned ? `
              <div style="background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; font-size: 0.85rem; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <div>Charterpreis: <strong>§${y.charterRate}/Gast</strong></div>
                <div>Tägliche Einnahmen: <span style="color:#4ade80; font-weight:bold;">+§${y.dailyRevenue.toLocaleString()}</span></div>
              </div>

              <div style="font-size: 0.8rem; margin-top: 4px; display: flex; flex-wrap: wrap; gap: 6px;">
                <button class="yacht-upgrade-btn" data-id="${y.id}" data-key="helipad" data-cost="8000" style="background: ${y.upgrades.helipad ? '#0369a1' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${y.upgrades.helipad ? '✓' : '+'} Helipad Deck (§8.000)
                </button>
                <button class="yacht-upgrade-btn" data-id="${y.id}" data-key="vipCasino" data-cost="12000" style="background: ${y.upgrades.vipCasino ? '#0369a1' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${y.upgrades.vipCasino ? '✓' : '+'} VIP Casino (§12.000)
                </button>
                <button class="yacht-upgrade-btn" data-id="${y.id}" data-key="jacuzziDeck" data-cost="5000" style="background: ${y.upgrades.jacuzziDeck ? '#0369a1' : '#334155'}; color: white; border: none; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
                  ${y.upgrades.jacuzziDeck ? '✓' : '+'} Jacuzzi Lounge (§5.000)
                </button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#cruise-close-btn')?.addEventListener('click', () => this.close());

    content.querySelector('#cruise-collect-btn')?.addEventListener('click', () => {
      const res = yachtManager.collectDailyCharter();
      if (res.totalRevenue > 0) {
        sim.simoleons += res.totalRevenue;
        soundManager.playBuySound();
        toastManager.showToast(res.message, 'success');
        this.renderContent(yachtManager, sim, toastManager, soundManager);
      } else {
        toastManager.showToast(res.message, 'info');
      }
    });

    content.querySelectorAll('.yacht-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = yachtManager.buyYacht(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playLevelUp();
            toastManager.showToast(res.message, 'success');
            this.renderContent(yachtManager, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });

    content.querySelectorAll('.yacht-upgrade-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const id = el.getAttribute('data-id');
        const key = el.getAttribute('data-key') as any;
        const cost = parseInt(el.getAttribute('data-cost') || '0', 10);

        if (id && key) {
          const res = yachtManager.toggleUpgrade(id, key, cost, sim.simoleons);
          if (res.success) {
            if (res.cost > 0) sim.simoleons -= res.cost;
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'success');
            this.renderContent(yachtManager, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
