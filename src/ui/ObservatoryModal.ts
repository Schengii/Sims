/**
 * Astronomy Observatory Modal UI
 * Allows Sims to scan the galaxy, observe meteorite showers, search for alien signals, and view discovery archives.
 */

import { ObservatorySystem } from '../systems/ObservatorySystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class ObservatoryModal {
  private container: HTMLElement;
  private observatorySystem: ObservatorySystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    observatorySystem: ObservatorySystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.observatorySystem = observatorySystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-observatory';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(10, 15, 35, 0.96); border: 1px solid rgba(56, 189, 248, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.85);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🔭</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Sternwarte & Astronomie-Observatorium</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #bae6fd;">Himmelskörper erforschen, Sternschnuppen sammeln & Alien-Signale empfangen</p>
            </div>
          </div>
          <button id="close-observatory-modal" style="background: transparent; border: none; font-size: 26px; color: #bae6fd; cursor: pointer;">&times;</button>
        </div>

        <!-- Action Grid -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">🌌 Astronomische Beobachtungen & Experimente:</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px;">
          <button id="scan-sky-btn" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: white; padding: 14px 10px; border-radius: 10px; cursor: pointer; text-align: center;">
            <span style="font-size: 26px; display: block;">🔭</span>
            <span style="font-size: 13px; font-weight: bold; display: block; margin-top: 4px;">Himmel scannen</span>
            <span style="font-size: 10px; color: #bae6fd;">Planeten & Kometen erforschen</span>
          </button>

          <button id="collect-meteorite-btn" style="background: linear-gradient(135deg, #d97706, #b45309); border: 1px solid #fbbf24; color: white; padding: 14px 10px; border-radius: 10px; cursor: pointer; text-align: center;">
            <span style="font-size: 26px; display: block;">☄️</span>
            <span style="font-size: 13px; font-weight: bold; display: block; margin-top: 4px;">Meteorit bergen</span>
            <span style="font-size: 10px; color: #fde68a;">Sternschnuppen-Gestein</span>
          </button>

          <button id="search-aliens-btn" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); border: 1px solid #c084fc; color: white; padding: 14px 10px; border-radius: 10px; cursor: pointer; text-align: center;">
            <span style="font-size: 26px; display: block;">👽</span>
            <span style="font-size: 13px; font-weight: bold; display: block; margin-top: 4px;">Alien-Signale suchen</span>
            <span style="font-size: 10px; color: #e9d5ff;">Radioteleskop lauschen</span>
          </button>
        </div>

        <!-- Discovery Archive -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-weight: bold; font-size: 13px; color: #38bdf8;">🪐 Galaktisches Entdeckungs-Logbuch (${this.observatorySystem.discoveries.length})</span>
            <span style="font-size: 11px; color: #94a3b8;">Geborgene Meteoriten: ${this.observatorySystem.meteoritesCollected} | Alien-Kontakte: ${this.observatorySystem.alienSignalsDetected}</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto;">
            ${this.observatorySystem.discoveries.length > 0 ? this.observatorySystem.discoveries.map(disc => `
              <div style="background: rgba(0,0,0,0.4); padding: 8px 12px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 22px;">${disc.icon}</span>
                  <div>
                    <div style="font-size: 13px; font-weight: bold; color: #f8fafc;">${disc.name}</div>
                    <div style="font-size: 10px; color: #94a3b8;">Kategorie: ${disc.type.toUpperCase()} | ${disc.dateStr}</div>
                  </div>
                </div>
                <span style="color: #34d399; font-weight: bold; font-size: 12px;">+§ ${disc.value.toLocaleString()}</span>
              </div>
            `).join('') : `
              <div style="text-align: center; color: #94a3b8; font-size: 12px; padding: 10px;">Bisher noch keine Himmelskörper im Archiv verzeichnet.</div>
            `}
          </div>
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-observatory-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#scan-sky-btn')?.addEventListener('click', () => {
      const res = this.observatorySystem.scanTheSky(this.sim);
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🔭 Himmelskörper entdeckt', res.message, '✨', 'success');
      this.open();
    });

    backdrop.querySelector('#collect-meteorite-btn')?.addEventListener('click', () => {
      const res = this.observatorySystem.collectMeteoriteShower(this.sim);
      this.soundManager.playBuySound();
      this.toastManager.showToast('☄️ Meteorit geborgen', res.message, '🪙', 'success');
      this.open();
    });

    backdrop.querySelector('#search-aliens-btn')?.addEventListener('click', () => {
      const res = this.observatorySystem.searchAlienSignals(this.sim);
      if (res.detected) {
        this.soundManager.playPhoneRing();
        this.toastManager.showToast('👽 ALIEN-SIGNAL EMPFANGEN!', res.message, '🛸', 'levelUp');
      } else {
        this.toastManager.showToast('📡 Teleskop-Scan', res.message, 'ℹ️', 'info');
      }
      this.open();
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-observatory');
    if (existing) existing.remove();
  }
}
