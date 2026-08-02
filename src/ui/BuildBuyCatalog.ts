/**
 * Advanced Build & Buy Catalog UI
 * Supports 5 architectural tabs: Furniture, Wall Construction, Doors & Windows, Floor Styles, Swimming Pools.
 */

import { Sim } from '../entity/Sim';
import { House, type FloorType } from '../world/House';
import { FURNITURE_CATALOG } from '../world/Furniture';
import { SoundManager } from '../audio/SoundManager';

export type BuildToolMode = 'select' | 'wall' | 'door' | 'window' | 'floor' | 'pool';

export class BuildBuyCatalog {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public activeToolMode: BuildToolMode = 'select';
  public activeFloorType: FloorType = 'wood';
  public activeFloorColor: string = '#8d5524';

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-build-backdrop" role="dialog" aria-modal="true" aria-labelledby="build-title">
        <div class="modal-dialog glass-panel" style="max-width: 800px;">
          <div class="modal-header">
            <h2 id="build-title">🛋️ Architekt & Baumodus</h2>
            <button class="btn-close" id="build-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <!-- Tab Navigation Bar -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px;">
            <button class="btn-hud build-tab-btn active" data-tab="furniture">🛋️ Möbel</button>
            <button class="btn-hud build-tab-btn" data-tab="walls">🧱 Wände</button>
            <button class="btn-hud build-tab-btn" data-tab="openings">🚪 Türen & Fenster</button>
            <button class="btn-hud build-tab-btn" data-tab="floors">🎨 Bodenbeläge</button>
            <button class="btn-hud build-tab-btn" data-tab="pools">🏊 Outdoor & Pool</button>
          </div>

          <!-- Content Area -->
          <div id="build-tab-content" style="max-height: 55vh; overflow-y: auto;">
            <!-- Dynamically populated per tab -->
          </div>
        </div>
      </div>
    `;
  }

  public open(sim: Sim, house: House): void {
    const backdrop = document.getElementById('modal-build-backdrop');
    if (!backdrop) return;

    backdrop.classList.add('active');

    // Tab buttons
    const tabBtns = document.querySelectorAll('.build-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const tab = (e.currentTarget as HTMLElement).getAttribute('data-tab') as any;
        this.renderTabContent(sim, house, tab);
      });
    });

    // Default to furniture tab
    this.renderTabContent(sim, house, 'furniture');

    document.getElementById('build-btn-close')?.addEventListener('click', () => this.close());
  }

  private renderTabContent(sim: Sim, house: House, tab: 'furniture' | 'walls' | 'openings' | 'floors' | 'pools'): void {
    const content = document.getElementById('build-tab-content');
    if (!content) return;

    if (tab === 'furniture') {
      content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px;">
          ${Object.values(FURNITURE_CATALOG).map(item => {
            const canAfford = sim.simoleons >= item.price;
            return `
              <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between; border-color: ${canAfford ? 'var(--panel-border)' : 'rgba(231,76,60,0.3)'};">
                <div>
                  <div style="font-size: 2rem; text-align: center; margin-bottom: 8px;">${item.icon}</div>
                  <h4 style="font-family: var(--font-heading); font-size: 1rem;">${item.name}</h4>
                  <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">${item.description}</p>
                </div>
                <div>
                  <div style="font-family: var(--font-heading); font-weight: 700; color: ${canAfford ? 'var(--simoleon-green)' : 'var(--warning-red)'}; margin-bottom: 8px;">
                    § ${item.price.toLocaleString()}
                  </div>
                  <button class="btn-hud buy-item-btn" data-id="${item.id}" ${canAfford ? '' : 'disabled'} style="width: 100%; justify-content: center; font-size: 0.85rem;">
                    ${canAfford ? '🛒 Kaufen & Platzieren' : 'Zu teuer'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      content.querySelectorAll('.buy-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
          if (!id) return;
          const itemDef = FURNITURE_CATALOG[id];

          if (sim.simoleons >= itemDef.price) {
            sim.simoleons -= itemDef.price;
            this.soundManager.playBuySound();
            house.addFurniture(id, 6, 6);
            this.close();
          }
        });
      });
    } else if (tab === 'walls') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Aktiviere das Wand-Werkzeug und klicke auf Kacheln auf dem Spielfeld, um Wände zu bauen oder abzureißen (§ 100 pro Wand segment).</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn-hud ${this.activeToolMode === 'wall' ? 'active' : ''}" id="btn-tool-wall" style="flex: 1; justify-content: center;">
              🧱 Wand-Werkzeug Aktivieren (§ 100)
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-tool-wall')?.addEventListener('click', () => {
        this.activeToolMode = 'wall';
        this.soundManager.playUIClick();
        alert('🧱 Wand-Werkzeug aktiviert! Klicke auf ein Rasterfeld im Spiel, um Wände zu setzen.');
        this.close();
      });
    } else if (tab === 'openings') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Wähle ein Element und klicke auf ein Feld mit Wand, um eine Tür oder ein Fenster einzusetzen.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button class="btn-hud" id="btn-tool-door" style="justify-content: center;">
              🚪 Holztür einsetzen (§ 200)
            </button>
            <button class="btn-hud" id="btn-tool-window" style="justify-content: center;">
              🪟 Panoramafenster einsetzen (§ 250)
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-tool-door')?.addEventListener('click', () => {
        this.activeToolMode = 'door';
        this.soundManager.playUIClick();
        alert('🚪 Tür-Werkzeug aktiviert! Klicke auf ein Feld mit Wand, um eine Tür einzusetzen.');
        this.close();
      });

      document.getElementById('btn-tool-window')?.addEventListener('click', () => {
        this.activeToolMode = 'window';
        this.soundManager.playUIClick();
        alert('🪟 Fenster-Werkzeug aktiviert! Klicke auf ein Feld mit Wand, um ein Fenster einzusetzen.');
        this.close();
      });
    } else if (tab === 'floors') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Wähle einen Bodenbelag und klicke im Haus auf Felder, um den Boden neu zu gestalten (§ 50 pro Feld).</p>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <button class="btn-hud set-floor-btn" data-type="wood" data-color="#8d5524">🪵 Parkett</button>
            <button class="btn-hud set-floor-btn" data-type="marble" data-color="#ecf0f1">🏛️ Edelmarmor</button>
            <button class="btn-hud set-floor-btn" data-type="tile" data-color="#95a5a6">🔳 Fliesen</button>
            <button class="btn-hud set-floor-btn" data-type="carpet" data-color="#8e44ad">🟣 Teppich</button>
          </div>
        </div>
      `;

      content.querySelectorAll('.set-floor-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = (e.currentTarget as HTMLElement).getAttribute('data-type') as FloorType;
          const color = (e.currentTarget as HTMLElement).getAttribute('data-color') || '#8d5524';
          this.activeToolMode = 'floor';
          this.activeFloorType = type;
          this.activeFloorColor = color;
          this.soundManager.playUIClick();
          alert(`🎨 Boden-Werkzeug (${type.toUpperCase()}) aktiviert! Klicke auf Felder im Haus.`);
          this.close();
        });
      });
    } else if (tab === 'pools') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Erstelle einen erfrischenden Swimmingpool auf dem Grundstück (§ 300 pro Pool-Feld).</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn-hud" id="btn-tool-pool" style="flex: 1; justify-content: center; background: #3498db;">
              🏊 Swimmingpool ausheben (§ 300)
            </button>
          </div>
        </div>
      `;

      document.getElementById('btn-tool-pool')?.addEventListener('click', () => {
        this.activeToolMode = 'pool';
        this.soundManager.playUIClick();
        alert('🏊 Pool-Werkzeug aktiviert! Klicke auf Rasenfelder, um Wasser-Kacheln auszuheben.');
        this.close();
      });
    }
  }

  public close(): void {
    const backdrop = document.getElementById('modal-build-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
