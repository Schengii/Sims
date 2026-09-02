/**
 * Gourmet Bakery & Confectionery Modal UI
 * Allows players to bake artisanal cakes, croissants, and baguettes, stock the display case, and collect sales earnings.
 */

import { BakerySystem, BAKERY_RECIPES } from '../systems/BakerySystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class BakeryModal {
  private container: HTMLElement;
  private bakerySystem: BakerySystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    bakerySystem: BakerySystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.bakerySystem = bakerySystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-bakery';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(40, 30, 20, 0.96); border: 1px solid rgba(245, 158, 11, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🥐</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #fbbf24;">Gourmet-Bäckerei & Konditorei</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fde68a;">Hochzeitstorten, Croissants & Baguettes backen und verkaufen</p>
            </div>
          </div>
          <button id="close-bakery-modal" style="background: transparent; border: none; font-size: 26px; color: #fde68a; cursor: pointer;">&times;</button>
        </div>

        <!-- Revenue Dashboard -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #94a3b8;">💰 Gesamtumsatz aus Bäckereiverkäufen</div>
            <div style="font-size: 20px; font-weight: bold; color: #34d399; margin-top: 2px;">§ ${this.bakerySystem.totalRevenue.toLocaleString()}</div>
          </div>
          <button id="collect-revenue-btn" style="background: linear-gradient(135deg, #10b981, #059669); border: none; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            💵 Einnahmen auszahlen
          </button>
        </div>

        <!-- Recipe Catalog -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">👩‍🍳 Frisches Backwerk zubereiten & Vitrine bestücken:</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${BAKERY_RECIPES.map(recipe => {
            const stock = this.bakerySystem.displayCaseInventory.find(i => i.recipeId === recipe.id)?.quantity || 0;
            return `
              <div style="
                background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.2);
                border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
              ">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 28px;">${recipe.icon}</span>
                  <div>
                    <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${recipe.name}</div>
                    <div style="font-size: 11px; color: #94a3b8;">Zutaten: ${recipe.ingredients} | Verkaufspreis: <b style="color: #fbbf24;">§ ${recipe.sellingPrice}</b></div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 12px; color: #fbbf24;">In Vitrine: <b>${stock}x</b></span>
                  <button class="bake-btn" data-id="${recipe.id}" style="
                    background: linear-gradient(135deg, #d97706, #b45309); border: 1px solid #fbbf24;
                    color: white; border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: bold; cursor: pointer;
                  ">🔥 Backen</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-bakery-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#collect-revenue-btn')?.addEventListener('click', () => {
      const revenue = this.bakerySystem.totalRevenue;
      if (revenue > 0) {
        this.sim.simoleons += revenue;
        this.bakerySystem.totalRevenue = 0;
        this.soundManager.playBuySound();
        this.toastManager.showToast('💰 Bäckerei-Erlös ausgezahlt', `+§ ${revenue.toLocaleString()} auf das Sim-Konto überwiesen!`, '🥐', 'success');
        this.open();
      } else {
        this.toastManager.showToast('ℹ️ Keine Erlöse', 'Aktuell liegen keine neuen Verkaufseinnahmen vor.', '🥖', 'info');
      }
    });

    backdrop.querySelectorAll('.bake-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        const res = this.bakerySystem.bakePastry(id, this.sim);
        if (res.success) {
          this.soundManager.playCookingSizzle();
          this.sim.triggerEmote('🥐', 3500);
          this.toastManager.showToast('🥐 Frisch gebacken', res.message, '✨', 'success');
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-bakery');
    if (existing) existing.remove();
  }
}
