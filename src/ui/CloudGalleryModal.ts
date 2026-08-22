/**
 * CloudGalleryModal UI
 * Community Cloud browser for showcasing and 1-click importing
 * trending lots, luxury villas, and famous creator households.
 */

import { BaseModal } from './BaseModal';
import { CloudGallerySystem } from '../systems/CloudGallerySystem';
import { Game } from '../engine/Game';
import { ToastManager } from './ToastManager';

export class CloudGalleryModal extends BaseModal {
  private game: Game;
  private toastManager: ToastManager;
  private currentFilter: 'all' | 'lot' | 'household' = 'all';

  constructor(container: HTMLElement, game: Game, toastManager: ToastManager) {
    super(container, { className: 'cloud-gallery-modal-overlay', ariaLabel: 'Community Cloud Galerie' });
    this.game = game;
    this.toastManager = toastManager;
  }

  protected renderHTML(): string {
    const items = CloudGallerySystem.getItems(this.currentFilter);

    return `
      <div class="modal-header">
        <h2>🌐 Sims Community Cloud-Galerie</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 8px; margin-bottom: 14px;">
          <button class="btn ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'}" id="filter-all">🌟 Alle Kreationen</button>
          <button class="btn ${this.currentFilter === 'lot' ? 'btn-primary' : 'btn-secondary'}" id="filter-lots">🏰 Grundstücke & Villen</button>
          <button class="btn ${this.currentFilter === 'household' ? 'btn-primary' : 'btn-secondary'}" id="filter-hh">👨‍👩‍👧‍👦 Haushalte & Familien</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
          ${items.map(item => `
            <div class="gallery-card glass-card" style="padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 20px;">${item.icon}</span>
                  <span style="font-size: 11px; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                    ${item.type === 'lot' ? 'GRUNDSTÜCK' : 'HAUSHALT'}
                  </span>
                </div>
                <h4 style="margin: 0 0 4px 0; color: #f8fafc; font-size: 14px;">${item.title}</h4>
                <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">von <strong>${item.creator}</strong></div>
                <p style="font-size: 12px; color: #cbd5e1; margin: 0 0 8px 0; line-height: 1.3;">${item.description}</p>
                <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
                  ${item.tags.map(t => `<span style="font-size: 10px; color: #c084fc; background: rgba(168, 85, 247, 0.15); padding: 1px 4px; border-radius: 3px;">${t}</span>`).join('')}
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px; color: #94a3b8;">
                  <span>📥 ${item.downloads} Downloads</span>
                  <button class="btn-like-gallery" data-id="${item.id}" style="background: none; border: none; cursor: pointer; color: #f43f5e; font-size: 12px;">❤️ ${item.upvotes}</button>
                </div>
                <button class="btn btn-primary btn-import-gallery" data-id="${item.id}" style="width: 100%; padding: 6px; font-size: 12px;">
                  ⬇️ ${item.type === 'lot' ? 'Auf Lot platzieren' : 'Einziehen lassen'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const bindFilter = (id: string, filter: 'all' | 'lot' | 'household') => {
      const btn = this.$(`#${id}`);
      if (btn) {
        this.listen(btn, 'click', () => {
          this.currentFilter = filter;
          this.open();
        });
      }
    };

    bindFilter('filter-all', 'all');
    bindFilter('filter-lots', 'lot');
    bindFilter('filter-hh', 'household');

    // Likes
    this.$$('.btn-like-gallery').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id && CloudGallerySystem.upvoteItem(id)) {
          this.toastManager.show('❤️ Kreation geliked!', 'success');
          this.open();
        }
      });
    });

    // Import action
    this.$$('.btn-import-gallery').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (!id) return;
        const item = CloudGallerySystem.getItems().find(i => i.id === id);
        if (!item) return;

        if (item.type === 'lot') {
          const res = CloudGallerySystem.importLot(this.game.house, item);
          this.toastManager.show(res.message, res.success ? 'success' : 'error');
          if (res.success) this.close();
        } else if (item.type === 'household') {
          const res = CloudGallerySystem.importHousehold(this.game.household, item);
          this.toastManager.show(res.message, res.success ? 'success' : 'error');
          if (res.success) this.close();
        }
      });
    });
  }
}
