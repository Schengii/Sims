/**
 * Sims Mobile Party & Event Host Modal UI
 * Allows starting Hauspartys, viewing active party goals, and inspecting unlocked trophies.
 */

import { PartyManager, type PartyTypeId } from '../systems/PartyManager';
import { SoundManager } from '../audio/SoundManager';

export class PartyModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onPartyStarted?: (typeId: PartyTypeId) => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-party-backdrop" role="dialog" aria-modal="true" aria-labelledby="party-title">
        <div class="modal-dialog glass-panel" style="max-width: 650px;">
          <div class="modal-header">
            <h2 id="party-title">🎉 Hausparty & Event-Veranstaltung</h2>
            <button class="btn-close" id="party-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <p style="font-size: 0.9rem; color: var(--text-muted);">
              Veranstalte eine unvergessliche Party! Nachbar-Gäste treffen ein, absolvierte Ziele steigern deine Sterne-Bewertung (⭐⭐⭐⭐⭐) und bringen Simoleons (§) sowie Party-Trophäen ein!
            </p>

            <!-- Party Types Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;" id="party-types-grid">
              <!-- Dynamically populated -->
            </div>

            <!-- Trophies Section -->
            <div class="glass-panel" style="padding: 14px; background: rgba(0, 229, 255, 0.05);">
              <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">🏆 Verdiente Party-Trophäen</h4>
              <div id="party-trophies-list" style="font-size: 0.85rem; color: var(--text-muted);">
                Noch keine Trophäen freigeschaltet. Erreiche 3+ Sterne auf deinen Partys!
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public open(partyManager: PartyManager): void {
    const backdrop = document.getElementById('modal-party-backdrop');
    const grid = document.getElementById('party-types-grid');
    const trophiesList = document.getElementById('party-trophies-list');
    if (!backdrop || !grid) return;

    grid.innerHTML = Object.values(PartyManager.PARTY_TYPES).map(pt => `
      <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
        <div>
          <div style="font-size: 2.2rem; margin-bottom: 6px;">${pt.icon}</div>
          <h4 style="font-family: var(--font-heading); font-size: 0.95rem; margin-bottom: 4px;">${pt.title}</h4>
          <p style="font-size: 0.75rem; color: var(--text-muted);">${pt.description}</p>
        </div>
        <button class="btn-hud start-party-btn" data-id="${pt.id}" style="margin-top: 10px; width: 100%; justify-content: center; font-size: 0.8rem; background: var(--simoleon-green);">
          🚀 Party Starten
        </button>
      </div>
    `).join('');

    if (trophiesList) {
      if (partyManager.trophiesUnlocked.length > 0) {
        trophiesList.innerHTML = partyManager.trophiesUnlocked.map(t => `<div style="padding: 4px 0;">${t}</div>`).join('');
      } else {
        trophiesList.innerText = 'Noch keine Trophäen freigeschaltet. Erreiche 3+ Sterne auf deinen Partys!';
      }
    }

    backdrop.classList.add('active');

    grid.querySelectorAll('.start-party-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') as PartyTypeId;
        if (id && this.onPartyStarted) {
          this.soundManager.playLevelUp();
          this.onPartyStarted(id);
          this.close();
        }
      });
    });

    document.getElementById('party-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-party-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
