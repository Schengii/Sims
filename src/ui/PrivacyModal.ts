/**
 * DSGVO & Privacy Statement Modal UI
 * Displays data privacy rules, local storage confirmation, and right-to-erasure button.
 */

import { PrivacyManager } from '../security/PrivacyManager';
import { SoundManager } from '../audio/SoundManager';

export class PrivacyModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onDataPurged?: () => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    const notice = PrivacyManager.getPrivacyNoticeText();

    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-privacy-backdrop" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
        <div class="modal-dialog glass-panel" style="max-width: 550px;">
          <div class="modal-header">
            <h2 id="privacy-title">🛡️ ${notice.title}</h2>
            <button class="btn-close" id="privacy-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px; font-size: 0.95rem; line-height: 1.5;">
            <p>${notice.body}</p>

            <div class="glass-panel" style="padding: 12px; background: rgba(0, 229, 255, 0.05); border-color: rgba(0, 229, 255, 0.2);">
              <h4 style="font-family: var(--font-heading); color: var(--primary-accent); margin-bottom: 4px;">Dein Recht auf Löschung</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${notice.rights}</p>
            </div>

            <button class="btn-hud" id="btn-purge-data" style="background: var(--warning-red); justify-content: center; margin-top: 8px;">
              🗑️ Alle gespeicherten Spieldaten löschen (DSGVO Art. 17)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  public open(): void {
    const backdrop = document.getElementById('modal-privacy-backdrop');
    if (!backdrop) return;

    backdrop.classList.add('active');

    document.getElementById('btn-purge-data')?.addEventListener('click', () => {
      if (confirm('Bist du sicher, dass du ALLE gespeicherten Sims-Daten unwiderruflich löschen möchtest?')) {
        PrivacyManager.purgeAllUserData();
        this.soundManager.playUIClick();
        alert('Alle gespeicherten Daten wurden erfolgreich gelöscht.');
        this.close();
        if (this.onDataPurged) this.onDataPurged();
      }
    });

    document.getElementById('privacy-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-privacy-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
