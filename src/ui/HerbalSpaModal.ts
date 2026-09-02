/**
 * Herbal Spa & Aromatherapy Modal UI
 * Allows Sims to order hot herbal teas, diffuse aromatherapy oils, and take relaxing wellness treatments.
 */

import { HerbalSpaSystem, SPA_TREATMENTS } from '../systems/HerbalSpaSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class HerbalSpaModal {
  private container: HTMLElement;
  private spaSystem: HerbalSpaSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    spaSystem: HerbalSpaSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.spaSystem = spaSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-herbal-spa';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(20, 35, 30, 0.96); border: 1px solid rgba(52, 211, 153, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🍵</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #34d399;">Kräuter-Teestube & Aromatherapie-Spa</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #a7f3d0;">Bio-Aufgüsse, ätherische Öle & Ganzkörper-Massagen</p>
            </div>
          </div>
          <button id="close-spa-modal" style="background: transparent; border: none; font-size: 26px; color: #a7f3d0; cursor: pointer;">&times;</button>
        </div>

        <!-- Spa Treatments Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">🌿 Wellness-Anwendung auswählen:</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${SPA_TREATMENTS.map(item => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(52, 211, 153, 0.2);
              border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 30px;">${item.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${item.name}</div>
                  <div style="font-size: 11px; color: #94a3b8;">${item.buffDescription} | Preis: <b style="color: #34d399;">§ ${item.cost}</b></div>
                </div>
              </div>

              <button class="apply-spa-btn" data-id="${item.id}" style="
                background: linear-gradient(135deg, #10b981, #059669); border: none; color: white;
                border-radius: 6px; padding: 8px 16px; font-weight: bold; font-size: 12px; cursor: pointer;
              ">💆 Genießen</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-spa-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.apply-spa-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        const res = this.spaSystem.applyTreatment(id, this.sim);
        if (res.success) {
          this.soundManager.playBuySound();
          this.toastManager.showToast('🌿 Wellness-Wohlbefinden', res.message, '✨', 'success');
          this.open();
        } else {
          this.toastManager.showToast('⚠️ Wellness', res.message, 'ℹ️', 'warning');
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-herbal-spa');
    if (existing) existing.remove();
  }
}
