/**
 * Neighborhood World Map & Venues UI Modal
 * Displays an interactive city map for traveling between locations.
 */

import { SoundManager } from '../audio/SoundManager';
import { VENUES_CATALOG, type WorldMap } from '../world/WorldMap';
import type { ToastManager } from './ToastManager';

export class WorldMapModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(worldMap: WorldMap, game: any, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'world-map-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 720px; width: 90%;">
        <div class="modal-header">
          <h2>🗺️ Nachbarschafts-Karte & Ausflüge</h2>
          <button class="close-btn" id="close-map-modal">&times;</button>
        </div>

        <p style="color: #bdc3c7; font-size: 14px; margin-top: -6px; margin-bottom: 16px;">
          Wähle ein Ziel in der Nachbarschaft aus, um mit deinem Sim dorthin zu reisen, Freunde zu treffen und Events zu erleben!
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; max-height: 380px; overflow-y: auto;">
          ${Object.values(VENUES_CATALOG).map(venue => {
            const isCurrent = venue.id === worldMap.currentVenueId;
            return `
              <div style="background: rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; border: 2px solid ${isCurrent ? '#00e5ff' : 'rgba(255,255,255,0.1)'}; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 32px; background: ${venue.bgColor}; padding: 6px 12px; border-radius: 10px;">${venue.icon}</span>
                    <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${isCurrent ? '#00e5ff' : '#95a5a6'}; font-weight: bold; background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px;">
                      ${isCurrent ? '📍 Aktueller Ort' : venue.category}
                    </span>
                  </div>
                  <h3 style="margin: 4px 0; color: #ffffff; font-size: 16px;">${venue.name}</h3>
                  <div style="font-size: 12px; color: #bdc3c7; line-height: 1.4; margin-bottom: 12px;">${venue.description}</div>
                </div>

                <button class="hud-btn btn-travel-venue" data-id="${venue.id}" ${isCurrent ? 'disabled' : ''} style="width: 100%; justify-content: center; background: ${isCurrent ? '#7f8c8d' : '#3498db'}; font-weight: bold;">
                  ${isCurrent ? 'Hier befindest du dich' : `🚶 Reiseticket buchen (§ 0)`}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-map-bottom">Karte Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    // Attach Event Listeners
    modal.querySelector('#close-map-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-map-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-travel-venue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const venueId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (venueId) {
          const venue = VENUES_CATALOG[venueId];
          const success = worldMap.travelToVenue(venueId, game);
          if (success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🚀 Reise angetreten!', `Angekommen in: ${venue.icon} ${venue.name}`, venue.icon, 'success');
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
