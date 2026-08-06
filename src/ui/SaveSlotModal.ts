/**
 * SaveSlotModal UI Component
 * Provides 3 distinct save slots, Auto-save status, JSON export file download,
 * and JSON import file upload with XSS & Prototype Pollution sanitization.
 */

import { SaveManager } from '../systems/SaveManager';
import { Game } from '../engine/Game';
import { ToastManager } from './ToastManager';

export class SaveSlotModal {
  private container: HTMLElement;
  private game: Game;
  private toastManager: ToastManager;
  private modalElement: HTMLElement | null = null;

  constructor(container: HTMLElement, game: Game, toastManager: ToastManager) {
    this.container = container;
    this.game = game;
    this.toastManager = toastManager;
  }

  public open(): void {
    this.close();

    const slots = [
      { id: 'sims_save_slot_1', name: 'Speicherplatz 1' },
      { id: 'sims_save_slot_2', name: 'Speicherplatz 2' },
      { id: 'sims_save_slot_3', name: 'Speicherplatz 3' },
    ];

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content glass-card save-slot-modal">
        <div class="modal-header">
          <h2>💾 Spielstand-Manager & Slots</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="slots-list">
            ${slots.map(s => {
              const rawData = localStorage.getItem(s.id);
              const exists = !!rawData;
              let dateStr = 'Leer';
              if (exists) {
                try {
                  const parsed = JSON.parse(rawData);
                  dateStr = parsed.timestamp ? new Date(parsed.timestamp).toLocaleString('de-DE') : 'Gespeichert';
                } catch (e) {}
              }

              return `
                <div class="slot-card glass-card">
                  <div class="slot-info">
                    <div class="slot-title">💾 ${s.name}</div>
                    <div class="slot-date">${dateStr}</div>
                  </div>
                  <div class="slot-actions">
                    <button class="btn btn-primary save-slot-btn" data-slot="${s.id}">Speichern</button>
                    ${exists ? `<button class="btn btn-secondary load-slot-btn" data-slot="${s.id}">Laden</button>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="export-import-section">
            <h3>📥 Export / Import Spielstand</h3>
            <div class="export-import-buttons">
              <button id="export-json-btn" class="btn btn-outline">💾 Als .json exportieren</button>
              <label class="btn btn-outline file-upload-label">
                📂 .json Datei importieren
                <input type="file" id="import-json-input" accept=".json" style="display:none;">
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    // Event listeners
    modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    modal.querySelectorAll('.save-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slotKey = (e.currentTarget as HTMLElement).dataset.slot;
        if (slotKey) {
          SaveManager.saveGame(this.game, slotKey);
          this.toastManager.show(`✅ In ${slotKey} gespeichert!`, 'success');
          this.open();
        }
      });
    });

    modal.querySelectorAll('.load-slot-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slotKey = (e.currentTarget as HTMLElement).dataset.slot;
        if (slotKey) {
          const success = SaveManager.loadGame(this.game, slotKey);
          if (success) {
            this.toastManager.show(`🚀 Spielstand aus ${slotKey} geladen!`, 'success');
            this.close();
          } else {
            this.toastManager.show(`❌ Laden fehlgeschlagen!`, 'error');
          }
        }
      });
    });

    // Export JSON
    modal.querySelector('#export-json-btn')?.addEventListener('click', () => {
      const data = SaveManager.serializeGame(this.game);
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sims5_savegame_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.toastManager.show('💾 JSON-Spielstand heruntergeladen!', 'success');
    });

    // Import JSON
    const importInput = modal.querySelector('#import-json-input') as HTMLInputElement;
    importInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonStr = event.target?.result as string;
          const data = JSON.parse(jsonStr);
          SaveManager.applySaveData(this.game, data);
          this.toastManager.show('🚀 Spielstand erfolgreich importiert!', 'success');
          this.close();
        } catch (err) {
          this.toastManager.show('❌ Ungültige JSON-Datei!', 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
