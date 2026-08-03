/**
 * Smartphone Camera & Memory Album UI Modal for Sims 5
 * Allows taking snapshot photos, adding decor photos to inventory, and inspecting memories.
 */

import { SoundManager } from '../audio/SoundManager';
import type { PhotoManager } from '../systems/PhotoSystem';
import type { ToastManager } from './ToastManager';

export class PhotoModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(photoManager: PhotoManager, game: any, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'photo-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>📱 Smartphone-Kamera & Fotoalbum</h2>
          <button class="close-btn" id="close-photo-modal">&times;</button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
          <button id="tab-cam-snap" class="hud-btn active" style="flex: 1;">📸 Kamera & Fotos</button>
          <button id="tab-cam-memories" class="hud-btn" style="flex: 1;">📖 Tagebuch (${photoManager.memories.length})</button>
        </div>

        <!-- TAB 1: Camera Snapshots -->
        <div id="view-cam-snap">
          <div style="background: rgba(0,229,255,0.1); border: 1px solid rgba(0,229,255,0.2); padding: 14px; border-radius: 12px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h3 style="margin: 0 0 4px 0; color: #00e5ff;">📱 Smartphone Foto-Kamera</h3>
              <div style="font-size: 12px; color: #bdc3c7;">Nimm ein Foto deines Sims auf & erhalte ein gerahmtes Wandbild für dein Inventar!</div>
            </div>
            <button class="hud-btn" id="btn-take-photo" style="background: #27ae60; font-weight: bold;">
              📸 Foto Knipsen
            </button>
          </div>

          <h4 style="margin: 0 0 10px 0; color: #ffffff;">🖼️ Aufgenommene Fotos (${photoManager.photos.length}):</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 220px; overflow-y: auto;">
            ${photoManager.photos.map(p => `
              <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border-left: 4px solid #00e5ff; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 28px;">${p.icon}</span>
                <div>
                  <div style="font-weight: bold; color: #ffffff; font-size: 13px;">${p.title}</div>
                  <div style="font-size: 11px; color: #bdc3c7;">Aufgenommen: ${p.timestamp}</div>
                  <div style="font-size: 10px; color: #2ecc71;">Stimmung: ${p.mood}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TAB 2: Lifetime Memories -->
        <div id="view-cam-memories" style="display: none;">
          <h4 style="margin: 0 0 10px 0; color: #f1c40f;">📖 Lebens-Chronik & Erinnerungen:</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
            ${photoManager.memories.map(m => `
              <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 12px; border-left: 4px solid #f1c40f;">
                <span style="font-size: 24px;">${m.icon}</span>
                <div>
                  <div style="font-weight: bold; color: #ffffff;">${m.title} <span style="font-size: 11px; color: #f1c40f;">(${m.dateStr})</span></div>
                  <div style="font-size: 12px; color: #bdc3c7;">${m.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-photo-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-photo-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-photo-bottom')?.addEventListener('click', () => this.close());

    // Tab Switching
    const tabSnap = modal.querySelector('#tab-cam-snap');
    const tabMem = modal.querySelector('#tab-cam-memories');
    const viewSnap = modal.querySelector('#view-cam-snap') as HTMLElement;
    const viewMem = modal.querySelector('#view-cam-memories') as HTMLElement;

    tabSnap?.addEventListener('click', () => {
      tabSnap.classList.add('active');
      tabMem?.classList.remove('active');
      viewSnap.style.display = 'block';
      viewMem.style.display = 'none';
      this.soundManager.playUIClick();
    });

    tabMem?.addEventListener('click', () => {
      tabMem.classList.add('active');
      tabSnap?.classList.remove('active');
      viewMem.style.display = 'block';
      viewSnap.style.display = 'none';
      this.soundManager.playUIClick();
    });

    modal.querySelector('#btn-take-photo')?.addEventListener('click', () => {
      const timeStr = game.timeSystem.getTimeString();
      const photo = photoManager.takeSnapshot(game.sim, timeStr);
      this.soundManager.playLevelUp();
      toastManager?.showToast('📸 Foto geknipst!', `"${photo.title}" wurde aufgenommen & im Inventar abgelegt!`, '🖼️', 'success');
      this.open(photoManager, game, toastManager);
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
