/**
 * Garage & Vehicles UI Modal for Sims 5
 * Displays vehicle inventory, garage catalog, and roadtrip actions.
 */

import { SoundManager } from '../audio/SoundManager';
import { VEHICLES_CATALOG, type VehicleManager } from '../systems/VehicleSystem';
import type { ToastManager } from './ToastManager';

export class VehicleModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(vehicleManager: VehicleManager, game: any, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'vehicle-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 680px; width: 90%;">
        <div class="modal-header">
          <h2>🚗 Garage & Fahrzeug-Fuhrpark</h2>
          <button class="close-btn" id="close-veh-modal">&times;</button>
        </div>

        <p style="color: #bdc3c7; font-size: 14px; margin-top: -6px; margin-bottom: 16px;">
          Wähle dein bevorzugtes Fahrzeug für Spritzfahrten oder kaufe neue Autos und Scooter für deine Garage!
        </p>

        <h4 style="margin: 0 0 10px 0; color: #00e5ff;">🏎️ Fahrzeug-Katalog:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-height: 320px; overflow-y: auto;">
          ${Object.values(VEHICLES_CATALOG).map(v => {
            const owned = vehicleManager.ownedVehicleIds.includes(v.id);
            const canAfford = game.sim.simoleons >= v.price;
            const isActive = vehicleManager.activeVehicleId === v.id;
            return `
              <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; border: 2px solid ${isActive ? '#00e5ff' : 'rgba(255,255,255,0.1)'}; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-size: 32px;">${v.icon}</span>
                    <span style="font-size: 12px; font-weight: bold; color: ${owned ? '#2ecc71' : '#f1c40f'}; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">
                      ${owned ? 'Besitzt ✅' : `§ ${v.price.toLocaleString()}`}
                    </span>
                  </div>
                  <h3 style="margin: 4px 0; color: #ffffff; font-size: 15px;">${v.name}</h3>
                  <div style="font-size: 11px; color: #bdc3c7; margin-bottom: 10px;">${v.description}</div>
                </div>

                <div style="display: flex; gap: 6px;">
                  ${owned ? `
                    <button class="hud-btn btn-roadtrip-veh" data-id="${v.id}" style="flex: 1; justify-content: center; background: #3498db; font-weight: bold;">
                      🚘 Spritzfahrt
                    </button>
                  ` : `
                    <button class="hud-btn btn-buy-veh" data-id="${v.id}" ${canAfford ? '' : 'disabled'} style="flex: 1; justify-content: center; background: ${canAfford ? '#2ecc71' : '#7f8c8d'}; font-weight: bold;">
                      Kaufen (§ ${v.price.toLocaleString()})
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-veh-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-veh-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-veh-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-buy-veh').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (vId && vehicleManager.buyVehicle(vId, game.sim)) {
          this.soundManager.playLevelUp();
          const v = VEHICLES_CATALOG[vId];
          toastManager?.showToast('Fahrzeug gekauft!', `Glückwunsch zu deinem neuen ${v.icon} ${v.name}!`, v.icon, 'success');
          this.open(vehicleManager, game, toastManager);
        }
      });
    });

    modal.querySelectorAll('.btn-roadtrip-veh').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const vId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (vId) {
          const res = vehicleManager.goOnRoadtrip(vId, game);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🚀 Spritzfahrt!', res.message, '🏎️', 'success');
            this.close();
          }
        }
      });
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
