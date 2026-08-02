/**
 * Relationships Panel UI
 * Displays list of all known Sims, their friendship % and romance % levels, and relationship titles.
 */

import { NPCManager } from '../entity/NPCManager';
import { Sanitizer } from '../security/Sanitizer';

export class RelationshipsPanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-rel-backdrop" role="dialog" aria-modal="true" aria-labelledby="rel-title">
        <div class="modal-dialog glass-panel" style="max-width: 600px;">
          <div class="modal-header">
            <h2 id="rel-title">💕 Beziehungen & Bekannte</h2>
            <button class="btn-close" id="rel-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div id="rel-sims-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 60vh; overflow-y: auto;">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>
    `;
  }

  public open(npcManager: NPCManager): void {
    const backdrop = document.getElementById('modal-rel-backdrop');
    const listEl = document.getElementById('rel-sims-list');
    if (!backdrop || !listEl) return;

    listEl.innerHTML = npcManager.npcs.map(npc => {
      const rel = npc.relationship;
      const status = rel.getStatusTitle();

      return `
        <div class="glass-panel" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: ${npc.outfitColor}; border: 2px solid ${npc.skinColor}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              👤
            </div>
            <div>
              <h4 style="font-family: var(--font-heading); font-size: 1.05rem;">${Sanitizer.sanitizeText(npc.name, 24)}</h4>
              <p style="font-size: 0.8rem; color: var(--primary-accent);">${status} (Merkmal: ${npc.trait})</p>
            </div>
          </div>

          <div style="min-width: 180px; display: flex; flex-direction: column; gap: 6px;">
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 2px;">
                <span>Freundschaft</span>
                <span>${Math.round(rel.friendship)}%</span>
              </div>
              <div class="need-progress-bg" style="width: 100%; height: 6px;">
                <div class="need-progress-fill" style="width: ${rel.friendship}%; background: var(--simoleon-green);"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 2px;">
                <span>Romantik</span>
                <span>${Math.round(rel.romance)}%</span>
              </div>
              <div class="need-progress-bg" style="width: 100%; height: 6px;">
                <div class="need-progress-fill" style="width: ${rel.romance}%; background: #e74c3c;"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    backdrop.classList.add('active');
    document.getElementById('rel-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-rel-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
