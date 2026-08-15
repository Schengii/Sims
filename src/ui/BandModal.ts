/**
 * Band & Rockstar Career UI Modal
 * Displays band members, rehearsal actions, gig booking, and album releases.
 */

import { BandManager } from '../systems/BandManager';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class BandModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(bandManager: BandManager, sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'band-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 640px; width: 90%;">
        <div class="modal-header">
          <h2>🎸 Rockband & Live-Konzerte</h2>
          <button class="close-btn" id="close-band-modal">&times;</button>
        </div>

        <div style="background: rgba(231, 76, 60, 0.15); border: 1px solid #e74c3c; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #e74c3c; font-size: 16px;">⚡ Band: ${bandManager.bandName}</span>
            <span style="color: #f1c40f; font-weight: bold;">👥 Fanbase: ${bandManager.fanBase} Fans</span>
          </div>

          <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 12px;">
            Besetzung: ${bandManager.bandMembers.map(m => `${m.name} (${m.instrument})`).join(' • ')}
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px;">
            <button class="hud-btn" id="btn-rehearse-band" style="background: #34495e; color: #fff; font-size: 11px; font-weight: bold; justify-content: center;">
              🎼 Bandprobe
            </button>
            <button class="hud-btn" id="btn-live-gig" style="background: #e74c3c; color: #fff; font-size: 11px; font-weight: bold; justify-content: center;">
              🎤 Live-Gig spielen
            </button>
            <button class="hud-btn" id="btn-release-album" style="background: #f39c12; color: #000; font-size: 11px; font-weight: bold; justify-content: center;">
              💿 Album aufnehmen
            </button>
          </div>
        </div>

        <div style="font-size: 12px; color: #bdc3c7; text-align: center;">
          Alben veröffentlicht: ${bandManager.releasedAlbums} 💿
        </div>

        <div style="margin-top: 18px; text-align: right;">
          <button class="hud-btn" id="close-band-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-band-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-band-bottom')?.addEventListener('click', () => this.close());

    modal.querySelector('#btn-rehearse-band')?.addEventListener('click', () => {
      const res = bandManager.practiceBandRehearsal(sim);
      this.soundManager.playUIClick();
      toastManager?.showToast('🎸 Bandprobe', res.message, '🎵', 'info');
      this.open(bandManager, sim, toastManager);
    });

    modal.querySelector('#btn-live-gig')?.addEventListener('click', () => {
      const res = bandManager.playLiveGig(sim);
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('⚡ Live-Konzert', res.message, '🎤', 'levelUp');
        this.open(bandManager, sim, toastManager);
      } else {
        toastManager?.showToast('Live-Auftritt', res.message, '⚠️', 'warning');
      }
    });

    modal.querySelector('#btn-release-album')?.addEventListener('click', () => {
      const res = bandManager.releaseAlbum(sim, 'Simlish Greatest Hits');
      if (res.success) {
        this.soundManager.playLevelUp();
        toastManager?.showToast('💿 Album-Hit', res.message, '🌟', 'levelUp');
        this.open(bandManager, sim, toastManager);
      } else {
        toastManager?.showToast('Album-Release', res.message, '⚠️', 'warning');
      }
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
