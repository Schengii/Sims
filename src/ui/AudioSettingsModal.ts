/**
 * Audio Settings Modal UI
 * Allows real-time adjustment of Master Volume, Sound Effects (SFX), and Radio Volume.
 */

import { SoundManager } from '../audio/SoundManager';
import type { RadioManager } from '../audio/RadioManager';

export class AudioSettingsModal {
  private container: HTMLElement;
  private soundManager: SoundManager;
  private radioManager?: RadioManager;
  private modalEl: HTMLElement | null = null;

  constructor(parentContainer: HTMLElement, soundManager: SoundManager, radioManager?: RadioManager) {
    this.container = parentContainer;
    this.soundManager = soundManager;
    this.radioManager = radioManager;
  }

  public open(): void {
    this.close();

    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop';
    this.modalEl.innerHTML = `
      <div class="modal-card glass-panel" style="max-width: 440px; animation: popIn 0.3s ease-out;">
        <div class="modal-header">
          <h2 style="margin: 0; font-size: 1.25rem;">🔊 Audio- & Sound-Einstellungen</h2>
          <button class="btn-icon" id="close-audio-modal">✕</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-top: 1rem;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-weight: 600;">
              <span>🎚️ Gesamtlautstärke (Master)</span>
              <span id="val-master">${Math.round(this.soundManager.masterVolume * 100)}%</span>
            </div>
            <input type="range" id="slider-master" min="0" max="1" step="0.05" value="${this.soundManager.masterVolume}" style="width: 100%;">
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-weight: 600;">
              <span>🔔 Sound-Effekte (SFX)</span>
              <span id="val-sfx">${Math.round(this.soundManager.sfxVolume * 100)}%</span>
            </div>
            <input type="range" id="slider-sfx" min="0" max="1" step="0.05" value="${this.soundManager.sfxVolume}" style="width: 100%;">
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-weight: 600;">
              <span>📻 Radio Synthesizer</span>
              <span id="val-radio">${Math.round(this.soundManager.radioVolume * 100)}%</span>
            </div>
            <input type="range" id="slider-radio" min="0" max="1" step="0.05" value="${this.soundManager.radioVolume}" style="width: 100%;">
          </div>
        </div>

        <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
          <button class="btn-primary" id="btn-audio-done" style="padding: 0.6rem 1.5rem;">Fertig</button>
        </div>
      </div>
    `;

    this.container.appendChild(this.modalEl);

    const closeBtn = this.modalEl.querySelector('#close-audio-modal');
    const doneBtn = this.modalEl.querySelector('#btn-audio-done');

    const handleClose = () => {
      this.soundManager.playUIClick();
      this.close();
    };

    closeBtn?.addEventListener('click', handleClose);
    doneBtn?.addEventListener('click', handleClose);

    const sliderMaster = this.modalEl.querySelector('#slider-master') as HTMLInputElement;
    const sliderSFX = this.modalEl.querySelector('#slider-sfx') as HTMLInputElement;
    const sliderRadio = this.modalEl.querySelector('#slider-radio') as HTMLInputElement;

    sliderMaster?.addEventListener('input', () => {
      const val = parseFloat(sliderMaster.value);
      this.soundManager.setMasterVolume(val);
      const label = this.modalEl?.querySelector('#val-master');
      if (label) label.textContent = `${Math.round(val * 100)}%`;
    });

    sliderSFX?.addEventListener('input', () => {
      const val = parseFloat(sliderSFX.value);
      this.soundManager.setSFXVolume(val);
      const label = this.modalEl?.querySelector('#val-sfx');
      if (label) label.textContent = `${Math.round(val * 100)}%`;
    });

    sliderRadio?.addEventListener('input', () => {
      const val = parseFloat(sliderRadio.value);
      this.soundManager.setRadioVolume(val);
      if (this.radioManager) this.radioManager.setVolume(val);
      const label = this.modalEl?.querySelector('#val-radio');
      if (label) label.textContent = `${Math.round(val * 100)}%`;
    });
  }

  public close(): void {
    if (this.modalEl && this.modalEl.parentNode === this.container) {
      this.container.removeChild(this.modalEl);
      this.modalEl = null;
    }
  }
}
