/**
 * Beekeeping Manufactory Modal UI
 * Allows Sims to spin honeycombs, pour scented beeswax candles, mix cosmetics, and brew propolis elixirs.
 */

import { BeekeepingManufactorySystem, HONEY_RECIPES } from '../systems/BeekeepingManufactorySystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class BeekeepingModal {
  private container: HTMLElement;
  private beekeepingSystem: BeekeepingManufactorySystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    beekeepingSystem: BeekeepingManufactorySystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.beekeepingSystem = beekeepingSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-beekeeping';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(35, 25, 15, 0.96); border: 1px solid rgba(245, 158, 11, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🐝</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #fbbf24;">Imker-Honigmanufaktur & Wachsgießerei</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fde68a;">
                Honig schleudern, Bienenwachskerzen gießen & Propolis-Elixiere herstellen
              </p>
            </div>
          </div>
          <button id="close-beekeeping-modal" style="background: transparent; border: none; font-size: 26px; color: #fde68a; cursor: pointer;">&times;</button>
        </div>

        <!-- Quick Honey Spin Banner -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 28px;">🍯</span>
            <div>
              <div style="font-size: 14px; font-weight: bold; color: #fde68a;">Elektrische Honigschleuder</div>
              <div style="font-size: 11px; color: #94a3b8;">Bisher geschleudert: ${this.beekeepingSystem.honeySpunCount} Waben</div>
            </div>
          </div>
          <button id="spin-honey-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            ⚡ Honig schleudern (+§ 90)
          </button>
        </div>

        <!-- Crafting Recipes Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">🕯️ Manufaktur-Produkte herstellen & veredeln:</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${HONEY_RECIPES.map(item => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(245, 158, 11, 0.2);
              border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 30px;">${item.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${item.name}</div>
                  <div style="font-size: 11px; color: #94a3b8;">Zutaten: ${item.ingredients} | Wert: <b style="color: #fbbf24;">§ ${item.value}</b></div>
                </div>
              </div>

              <button class="craft-honey-btn" data-id="${item.id}" style="
                background: linear-gradient(135deg, #d97706, #b45309); border: 1px solid #fbbf24;
                color: white; border-radius: 6px; padding: 8px 16px; font-weight: bold; font-size: 12px; cursor: pointer;
              ">✨ Gießen & Herstellen</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-beekeeping-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#spin-honey-btn')?.addEventListener('click', () => {
      const res = this.beekeepingSystem.spinHoney(this.sim);
      this.soundManager.playBuySound();
      this.toastManager.showToast('🍯 Honigschleuder', res.message, '✨', 'success');
      this.open();
    });

    backdrop.querySelectorAll('.craft-honey-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        const res = this.beekeepingSystem.craftProduct(id, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🐝 Manufaktur', res.message, '🕯️', 'success');
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-beekeeping');
    if (existing) existing.remove();
  }
}
