/**
 * Advanced Build & Buy Catalog UI
 * Supports 5 architectural tabs: Furniture, Wall Construction, Doors & Windows, Floor Styles, Swimming Pools.
 */

import { Sim } from '../entity/Sim';
import { House, type FloorType } from '../world/House';
import { FURNITURE_CATALOG } from '../world/Furniture';
import { SoundManager } from '../audio/SoundManager';

export type BuildToolMode = 'select' | 'wall' | 'room' | 'door' | 'window' | 'floor' | 'pool' | 'rotate' | 'move' | 'sell' | 'garden';

export class BuildBuyCatalog {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public activeToolMode: BuildToolMode = 'select';
  public activeFloorType: FloorType = 'wood';
  public activeFloorColor: string = '#8d5524';
  public selectedInstanceId: string | null = null;

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

          <!-- Quick Action Toolbar -->
          <div style="display: flex; gap: 8px; margin-bottom: 12px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 8px; flex-wrap: wrap;">
            <button class="btn-hud tool-mode-btn" id="btn-tool-room" style="font-size: 0.85rem; background: var(--primary-accent); color: #000; font-weight: bold;">📦 Raum erstellen</button>
            <button class="btn-hud tool-mode-btn" id="btn-tool-rotate" style="font-size: 0.85rem;">🔄 Möbel drehen</button>
            <button class="btn-hud tool-mode-btn" id="btn-tool-move" style="font-size: 0.85rem;">🚚 Möbel verschieben</button>
            <button class="btn-hud tool-mode-btn" id="btn-tool-sell" style="font-size: 0.85rem;">💰 Möbel verkaufen</button>
            <button class="btn-hud tool-mode-btn" id="btn-tool-garden" style="font-size: 0.85rem;">🌱 Gartenbeet (§ 100)</button>
            <button class="btn-hud tool-mode-btn" id="btn-tool-sprinkler" style="font-size: 0.85rem; background: #3498db; color: #fff;">💧 Rasensprenger (§ 450)</button>
          </div>

          <!-- Tab Navigation Bar -->
          <div style="display: flex; gap: 8px; margin-bottom: 16px; overflow-x: auto; padding-bottom: 4px;">
            <button class="btn-hud build-tab-btn active" data-tab="furniture">🛋️ Möbel</button>
            <button class="btn-hud build-tab-btn" data-tab="blueprints">📐 Blaupausen-Räume</button>
            <button class="btn-hud build-tab-btn" data-tab="walls">🧱 Wände</button>
            <button class="btn-hud build-tab-btn" data-tab="openings">🚪 Türen & Fenster</button>
            <button class="btn-hud build-tab-btn" data-tab="floors">🎨 Bodenbeläge</button>
            <button class="btn-hud build-tab-btn" data-tab="roofs">🏠 Dächer & Fassaden</button>
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

    // Quick Toolbar listeners
    document.getElementById('btn-tool-room')?.addEventListener('click', () => {
      this.activeToolMode = 'room';
      this.soundManager.playUIClick();
      alert('📦 Raum-Werkzeug aktiviert!\nKlicke zuerst auf die linke obere Ecke und danach auf die rechte untere Ecke im Haus.');
      this.close();
    });

    document.getElementById('btn-tool-rotate')?.addEventListener('click', () => {
      this.activeToolMode = 'rotate';
      this.soundManager.playUIClick();
      alert('🔄 Drehen-Werkzeug aktiviert! Klicke auf ein platziertes Möbelstück im Haus, um es zu drehen.');
      this.close();
    });

    document.getElementById('btn-tool-move')?.addEventListener('click', () => {
      this.activeToolMode = 'move';
      this.soundManager.playUIClick();
      alert('🚚 Verschieben-Werkzeug aktiviert! Klicke auf ein Möbelstück und danach auf das Ziel-Feld.');
      this.close();
    });

    document.getElementById('btn-tool-sell')?.addEventListener('click', () => {
      this.activeToolMode = 'sell';
      this.soundManager.playUIClick();
      alert('💰 Verkaufen-Werkzeug aktiviert! Klicke auf ein Möbelstück im Haus, um es gegen § Simoleons zu verkaufen.');
      this.close();
    });

    document.getElementById('btn-tool-garden')?.addEventListener('click', () => {
      this.activeToolMode = 'garden';
      this.soundManager.playUIClick();
      alert('🌱 Gartenbeet-Werkzeug aktiviert! Klicke auf ein Rasen-Feld draußen, um ein Pflanzbeet (§ 100) anzulegen.');
      this.close();
    });

    document.getElementById('btn-tool-sprinkler')?.addEventListener('click', () => {
      if (sim.simoleons >= 450) {
        sim.simoleons -= 450;
        this.soundManager.playBuySound();
        alert('💧 Smarte Bewässerung aktiviert! Automatische Rasensprenger wurden im gesamten Garten installiert.');
      } else {
        alert('Nicht genügend Simoleons (§ 450 benötigt)!');
      }
      this.close();
    });

    // Default to furniture tab
    this.renderTabContent(sim, house, 'furniture');

    document.getElementById('build-btn-close')?.addEventListener('click', () => this.close());
  }

  private renderTabContent(sim: Sim, house: House, tab: 'furniture' | 'blueprints' | 'walls' | 'openings' | 'floors' | 'roofs' | 'pools'): void {
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
    } else if (tab === 'blueprints') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Wähle einen fertigen Designer-Raum und platziere ihn mit einem Klick auf deinem Grundstück.</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px;">
            <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; text-align: center; margin-bottom: 8px;">🛏️</div>
                <h4 style="font-family: var(--font-heading);">Starter-Schlafzimmer</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">3x3 Raum inkl. Bett, Staffelei und Parkettboden.</p>
              </div>
              <div>
                <div style="font-weight: bold; color: var(--simoleon-green); margin-bottom: 8px;">§ 850</div>
                <button class="btn-hud blueprint-btn" data-type="bedroom" style="width: 100%; justify-content: center;">📐 Raum Errichten</button>
              </div>
            </div>

            <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; text-align: center; margin-bottom: 8px;">🛁</div>
                <h4 style="font-family: var(--font-heading);">Wellness-Badezimmer</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">3x3 Raum inkl. Dusche, Toilette und Fliesenboden.</p>
              </div>
              <div>
                <div style="font-weight: bold; color: var(--simoleon-green); margin-bottom: 8px;">§ 1.200</div>
                <button class="btn-hud blueprint-btn" data-type="bathroom" style="width: 100%; justify-content: center;">📐 Raum Errichten</button>
              </div>
            </div>

            <div class="glass-panel" style="padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="font-size: 2rem; text-align: center; margin-bottom: 8px;">💻</div>
                <h4 style="font-family: var(--font-heading);">High-Tech Arbeitszimmer</h4>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin: 4px 0 8px 0;">3x3 Raum inkl. PC-Station, Marmorboden & Fenster.</p>
              </div>
              <div>
                <div style="font-weight: bold; color: var(--simoleon-green); margin-bottom: 8px;">§ 1.600</div>
                <button class="btn-hud blueprint-btn" data-type="office" style="width: 100%; justify-content: center;">📐 Raum Errichten</button>
              </div>
            </div>
          </div>
        </div>
      `;

      content.querySelectorAll('.blueprint-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = (e.currentTarget as HTMLElement).getAttribute('data-type');
          if (type === 'bedroom' && sim.simoleons >= 850) {
            sim.simoleons -= 850;
            house.buildRoom(4, 4, 7, 7, 'wood', '#8d5524');
            house.addFurniture('bed_basic', 5, 5);
            house.addFurniture('easel_artist', 7, 5);
            this.soundManager.playBuySound();
            alert('🎉 Starter-Schlafzimmer erfolgreich errichtet!');
            this.close();
          } else if (type === 'bathroom' && sim.simoleons >= 1200) {
            sim.simoleons -= 1200;
            house.buildRoom(8, 4, 11, 7, 'tile', '#95a5a6');
            house.addFurniture('shower_glass', 9, 5);
            house.addFurniture('toilet_deluxe', 10, 5);
            this.soundManager.playBuySound();
            alert('🎉 Wellness-Badezimmer erfolgreich errichtet!');
            this.close();
          } else if (type === 'office' && sim.simoleons >= 1600) {
            sim.simoleons -= 1600;
            house.buildRoom(4, 8, 7, 11, 'marble', '#ecf0f1');
            house.addFurniture('pc_station', 5, 9);
            this.soundManager.playBuySound();
            alert('🎉 High-Tech Büro erfolgreich errichtet!');
            this.close();
          } else {
            alert('Nicht genügend Simoleons vorhanden!');
          }
        });
      });
    } else if (tab === 'walls') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <p style="font-size: 0.9rem; color: var(--text-muted);">Aktiviere das Wand-Werkzeug und klicke auf Kacheln auf dem Spielfeld, um Wände zu bauen oder abzureißen (§ 100 pro Wandsegment).</p>
          <div style="display: flex; gap: 12px;">
            <button class="btn-hud ${this.activeToolMode === 'wall' ? 'active' : ''}" id="btn-tool-wall" style="flex: 1; justify-content: center;">
              🧱 Einzelne Wand Aktivieren (§ 100)
            </button>
            <button class="btn-hud ${this.activeToolMode === 'room' ? 'active' : ''}" id="btn-tool-room-tab" style="flex: 1; justify-content: center; background: var(--primary-accent); color: #000; font-weight: bold;">
              📦 Ganzen Raum ziehen
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

      document.getElementById('btn-tool-room-tab')?.addEventListener('click', () => {
        this.activeToolMode = 'room';
        this.soundManager.playUIClick();
        alert('📦 Raum-Werkzeug aktiviert! Klicke zwei Ecken auf dem Spielfeld an, um einen Raum zu erstellen.');
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
    } else if (tab === 'roofs') {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <h4 style="margin: 0 0 6px 0; color: #ffffff;">🏠 Dach-Stil wählen</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 10px 0;">Wähle die Dachform deines Hauses für die oberste Etage.</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <button class="btn-hud set-roof-btn" data-roof="gabled" data-color="#c0392b">📐 Giebeldach (Klassisch)</button>
              <button class="btn-hud set-roof-btn" data-roof="hipped" data-color="#2c3e50">🏰 Walmdach (Schiefer)</button>
              <button class="btn-hud set-roof-btn" data-roof="flat" data-color="#7f8c8d">🏢 Flachdach (Modern)</button>
              <button class="btn-hud set-roof-btn" data-roof="none" data-color="#000000">🚫 Kein Dach</button>
            </div>
          </div>

          <div>
            <h4 style="margin: 0 0 6px 0; color: #ffffff;">🧱 Außenfassaden-Design</h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 10px 0;">Passe den Anstrich aller Außenwände deines Grundstücks an (§ 300).</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
              <button class="btn-hud set-facade-btn" data-color="#2c3e50">🏛️ Dunkelblau Modern</button>
              <button class="btn-hud set-facade-btn" data-color="#e67e22">🧱 Ziegel-Terracotta</button>
              <button class="btn-hud set-facade-btn" data-color="#ecf0f1">🏛️ Weißer Marmorputz</button>
              <button class="btn-hud set-facade-btn" data-color="#27ae60">🌲 Waldhaus-Grün</button>
            </div>
          </div>
        </div>
      `;

      content.querySelectorAll('.set-roof-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const roof = (e.currentTarget as HTMLElement).getAttribute('data-roof') as any;
          const color = (e.currentTarget as HTMLElement).getAttribute('data-color') || '#c0392b';
          house.roofStyle = roof;
          house.roofColor = color;
          this.soundManager.playBuySound();
          alert(`🏠 Dach-Stil "${roof.toUpperCase()}" erfolgreich eingerichtet!`);
          this.close();
        });
      });

      content.querySelectorAll('.set-facade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const color = (e.currentTarget as HTMLElement).getAttribute('data-color') || '#2c3e50';
          if (sim.simoleons >= 300) {
            sim.simoleons -= 300;
            for (let x = 0; x < house.width; x++) {
              for (let y = 0; y < house.height; y++) {
                if (house.tiles[x][y].hasWallNorth) house.tiles[x][y].wallColor = color;
                if (house.tiles[x][y].hasWallWest) house.tiles[x][y].wallColor = color;
              }
            }
            this.soundManager.playBuySound();
            alert('🧱 Außenfassade erfolgreich neu gestrichen! (-§ 300)');
            this.close();
          } else {
            alert('Nicht genügend Simoleons vorhanden!');
          }
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
