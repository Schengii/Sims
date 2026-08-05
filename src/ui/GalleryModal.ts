/**
 * Sims Gallery & Import/Export Modal UI
 */

import { Game } from '../engine/Game';
import { GalleryManager } from '../systems/GallerySystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class GalleryModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-gal-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 550px;">
          <div class="modal-header">
            <h2>🌐 Sims Galerie & Import/Export</h2>
            <button class="btn-close" id="gal-btn-close">&times;</button>
          </div>
          <div id="gal-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('gal-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(game: Game): void {
    const backdrop = document.getElementById('modal-gal-backdrop');
    const content = document.getElementById('gal-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    content.innerHTML = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #f1c40f; margin-bottom: 6px;">📤 Aktuelles Bauwerk / Haushalt Exportieren</h3>
        <p style="font-size: 0.85rem; color: #bdc3c7;">Generiere einen Galerie-Code für dein Haus und deine Sims.</p>
        <button class="btn-hud" id="btn-export-blueprint" style="margin-top: 8px; background: #2980b9;">Code Generieren & Kopieren</button>
        <input type="text" id="export-code-input" readonly style="width: 100%; margin-top: 8px; padding: 6px; background: rgba(0,0,0,0.4); border: 1px solid #555; color: #fff; border-radius: 4px; display: none;" />
      </div>

      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px;">
        <h3 style="color: #2ecc71; margin-bottom: 6px;">📥 Galerie-Bauwerk Importieren</h3>
        <p style="font-size: 0.85rem; color: #bdc3c7;">Füge einen Galerie-Code ein, um ein fertiges Bauwerk zu laden.</p>
        <textarea id="import-code-input" placeholder="Galerie-Code hier einfügen..." style="width: 100%; height: 60px; margin-top: 8px; padding: 6px; background: rgba(0,0,0,0.4); border: 1px solid #555; color: #fff; border-radius: 4px;"></textarea>
        <button class="btn-hud" id="btn-import-blueprint" style="margin-top: 8px; background: #27ae60;">Bauwerk Laden & Anwenden</button>
      </div>
    `;

    document.getElementById('btn-export-blueprint')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const code = GalleryManager.exportBlueprint(game);
      const input = document.getElementById('export-code-input') as HTMLInputElement;
      if (input) {
        input.value = code;
        input.style.display = 'block';
        input.select();
        navigator.clipboard?.writeText(code);
        ToastManager.showToast('📋 Galerie Export', 'Galerie-Code in Zwischenablage kopiert!', '📋', 'success');
      }
    });

    document.getElementById('btn-import-blueprint')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const textarea = document.getElementById('import-code-input') as HTMLTextAreaElement;
      if (textarea && textarea.value) {
        const res = GalleryManager.importBlueprint(game, textarea.value);
        if (res.success) {
          ToastManager.showToast('📥 Galerie Import', res.message, '🌐', 'success');
          this.close();
        } else {
          ToastManager.showToast('⚠️ Galerie Fehler', res.message, '⚠️', 'warning');
        }
      }
    });
  }

  public close(): void {
    document.getElementById('modal-gal-backdrop')?.classList.remove('active');
  }
}
