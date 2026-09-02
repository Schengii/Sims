/**
 * Photo Studio & Family Album Modal UI
 * Allows players to shoot themed studio portraits with backdrops and view all framed album photos.
 */

import { PhotoStudioSystem } from '../systems/PhotoStudioSystem';
import { Sim } from '../entity/Sim';
import { House } from '../world/House';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PhotoStudioModal {
  private container: HTMLElement;
  private studioSystem: PhotoStudioSystem;
  private sim: Sim;
  private house: House;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    studioSystem: PhotoStudioSystem,
    sim: Sim,
    house: House,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.studioSystem = studioSystem;
    this.sim = sim;
    this.house = house;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-photo-studio';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.96); border: 1px solid rgba(56, 189, 248, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">📷</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Fotostudio & Familien-Fotoalbum</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Porträts mit Kulisse schießen & direkt als Wandkunst aufhängen</p>
            </div>
          </div>
          <button id="close-studio-modal" style="background: transparent; border: none; font-size: 26px; color: #94a3b8; cursor: pointer;">&times;</button>
        </div>

        <!-- Themed Shootings Grid -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">📸 Neues Fotostudio-Shooting starten:</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <button class="shoot-btn" data-theme="family" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); color: white; padding: 12px 8px; border-radius: 8px; cursor: pointer; text-align: center;">
            <span style="font-size: 24px; display: block;">👨‍👩‍👧</span>
            <span style="font-size: 12px; font-weight: 600;">Familienporträt</span>
          </button>
          <button class="shoot-btn" data-theme="pet" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(244, 63, 94, 0.3); color: white; padding: 12px 8px; border-radius: 8px; cursor: pointer; text-align: center;">
            <span style="font-size: 24px; display: block;">🐾</span>
            <span style="font-size: 12px; font-weight: 600;">Haustier-Shooting</span>
          </button>
          <button class="shoot-btn" data-theme="romantic" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(236, 72, 153, 0.3); color: white; padding: 12px 8px; border-radius: 8px; cursor: pointer; text-align: center;">
            <span style="font-size: 24px; display: block;">💑</span>
            <span style="font-size: 12px; font-weight: 600;">Paarfoto</span>
          </button>
          <button class="shoot-btn" data-theme="glamour" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(234, 179, 8, 0.3); color: white; padding: 12px 8px; border-radius: 8px; cursor: pointer; text-align: center;">
            <span style="font-size: 24px; display: block;">🌟</span>
            <span style="font-size: 12px; font-weight: 600;">Glamour-Porträt</span>
          </button>
        </div>

        <!-- Album Gallery -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">🖼️ Gesammelte Studio-Porträts & Wandgemälde (${this.studioSystem.studioPhotos.length}):</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${this.studioSystem.studioPhotos.length > 0 ? this.studioSystem.studioPhotos.map(photo => `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 26px;">${photo.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 13px; color: #f8fafc;">${photo.title}</div>
                  <div style="font-size: 11px; color: #94a3b8;">Sim: ${photo.photographedSimName} | ${photo.dateStr}</div>
                </div>
              </div>
              <span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">GERAHMT AN WAND</span>
            </div>
          `).join('') : `
            <div style="font-size: 12px; color: #94a3b8; text-align: center; padding: 12px;">Noch keine Studiofotos aufgenommen.</div>
          `}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-studio-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.shoot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = (e.currentTarget as HTMLElement).getAttribute('data-theme') as any;
        const photo = this.studioSystem.shootPortrait(theme, this.sim, this.house, true);
        this.soundManager.playPhoneRing();
        this.sim.triggerEmote('📷', 3500);
        this.toastManager.showToast('📸 Foto aufgenommen & aufgehängt', `"${photo.title}" wurde gerahmt an deiner Wand befestigt!`, '🖼️', 'success');
        this.open();
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-photo-studio');
    if (existing) existing.remove();
  }
}
