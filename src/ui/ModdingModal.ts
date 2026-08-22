/**
 * ModdingModal UI
 * Allows players to view installed Custom Content (CC) mods,
 * import custom .json mod packages, and export/import house blueprints.
 */

import { BaseModal } from './BaseModal';
import { ModdingSystem } from '../systems/ModdingSystem';
import { BlueprintManager } from '../systems/BlueprintSystem';
import { Game } from '../engine/Game';
import { ToastManager } from './ToastManager';

export class ModdingModal extends BaseModal {
  private game: Game;
  private toastManager: ToastManager;

  constructor(container: HTMLElement, game: Game, toastManager: ToastManager) {
    super(container, { className: 'modding-modal-overlay', ariaLabel: 'Custom Content & Blueprint Manager' });
    this.game = game;
    this.toastManager = toastManager;
  }

  protected renderHTML(): string {
    const installed = ModdingSystem.getInstalledMods();

    return `
      <div class="modal-header">
        <h2>📦 Modding & Blueprint Hub (CC)</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 12px; margin-bottom: 16px;">
          <button class="btn btn-primary" id="btn-tab-cc">🧩 Custom Content (Mods)</button>
          <button class="btn btn-secondary" id="btn-tab-blueprints">📐 Haus-Baupläne</button>
        </div>

        <div id="section-cc" class="tab-content">
          <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 12px;">
            Installiere benutzerdefinierte Möbel, Karrieren und Rezepte per JSON-Mod-Paket.
          </p>

          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; margin-bottom: 12px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #38bdf8;">Installierte Mods (${installed.length}):</div>
            ${installed.length === 0 ? '<div style="color: #94a3b8; font-size: 12px;">Keine externen Mods installiert.</div>' : ''}
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${installed.map(m => `
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px; border-radius: 6px;">
                  <div>
                    <strong>${m.name}</strong> <span style="font-size: 11px; color: #94a3b8;">(v${m.version} von ${m.author})</span>
                  </div>
                  <button class="btn btn-danger btn-sm uninstall-mod-btn" data-mod="${m.id}" style="padding: 2px 8px; font-size: 11px;">Entfernen</button>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-outline" id="btn-load-sample-mod">🎁 Beispiel-Mod laden (Sci-Fi Möbel)</button>
            <label class="btn btn-primary" style="cursor: pointer;">
              📂 .json Mod importieren
              <input type="file" id="mod-file-input" accept=".json" style="display: none;">
            </label>
          </div>
        </div>

        <div id="section-blueprints" class="tab-content" style="display: none;">
          <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 12px;">
            Exportiere dein gebautes Traumhaus als Bauplan oder importiere geteilte Grundrisse von Freunden!
          </p>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button class="btn btn-primary" id="btn-export-blueprint">💾 Aktuellen Bauplan exportieren</button>
            <textarea id="blueprint-json-area" placeholder="Bauplan JSON-Code hier einfügen..." style="width: 100%; height: 120px; background: rgba(0,0,0,0.5); color: #00e5ff; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 8px; font-family: monospace; font-size: 11px;"></textarea>
            <button class="btn btn-secondary" id="btn-import-blueprint">📥 Bauplan auf Grundstück anwenden</button>
          </div>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const tabCC = this.$('#btn-tab-cc');
    const tabBP = this.$('#btn-tab-blueprints');
    const secCC = this.$('#section-cc');
    const secBP = this.$('#section-blueprints');

    if (tabCC && tabBP && secCC && secBP) {
      this.listen(tabCC, 'click', () => {
        tabCC.className = 'btn btn-primary';
        tabBP.className = 'btn btn-secondary';
        secCC.style.display = 'block';
        secBP.style.display = 'none';
      });

      this.listen(tabBP, 'click', () => {
        tabBP.className = 'btn btn-primary';
        tabCC.className = 'btn btn-secondary';
        secBP.style.display = 'block';
        secCC.style.display = 'none';
      });
    }

    // Sample mod button
    const sampleBtn = this.$('#btn-load-sample-mod');
    if (sampleBtn) {
      this.listen(sampleBtn, 'click', () => {
        const sampleMod = {
          id: 'scifi_furniture_pack',
          name: 'Cyberpunk Hologram Pack',
          author: 'Sims5Studio',
          version: '1.0',
          furniture: [
            {
              id: 'holo_emitter',
              name: 'Holo-Projektor 3000',
              category: 'misc' as const,
              price: 1250,
              icon: '🔮',
              color: '#00e5ff',
              width: 1,
              height: 1,
              interactions: [
                {
                  id: 'watch_holo',
                  label: 'Holo-Konzert ansehen',
                  icon: '✨',
                  duration: 5,
                  needEffects: { fun: 40 }
                }
              ]
            }
          ]
        };

        const res = ModdingSystem.installMod(sampleMod);
        this.toastManager.show(res.message, res.success ? 'success' : 'error');
        this.open();
      });
    }

    // File import input
    const fileInput = this.$<HTMLInputElement>('#mod-file-input');
    if (fileInput) {
      this.listen(fileInput, 'change', (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            const res = ModdingSystem.installMod(content);
            this.toastManager.show(res.message, res.success ? 'success' : 'error');
            this.open();
          };
          reader.readAsText(file);
        }
      });
    }

    // Blueprint export
    const expBtn = this.$('#btn-export-blueprint');
    const area = this.$<HTMLTextAreaElement>('#blueprint-json-area');
    if (expBtn && area) {
      this.listen(expBtn, 'click', () => {
        const bp = BlueprintManager.exportBlueprint(this.game.house, 'Spieler-Villa', this.game.sim.customization.name);
        area.value = bp;
        navigator.clipboard?.writeText(bp);
        this.toastManager.show('📋 Bauplan in die Zwischenablage kopiert!', 'success');
      });
    }

    // Blueprint import
    const impBtn = this.$('#btn-import-blueprint');
    if (impBtn && area) {
      this.listen(impBtn, 'click', () => {
        if (!area.value.trim()) {
          this.toastManager.show('⚠️ Bitte füge zuerst einen Bauplan-JSON-Text ein.', 'warning');
          return;
        }
        const res = BlueprintManager.importBlueprint(this.game.house, area.value);
        this.toastManager.show(res.message, res.success ? 'success' : 'error');
        if (res.success) this.close();
      });
    }

    // Uninstall buttons
    this.$$('.uninstall-mod-btn').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const modId = (e.currentTarget as HTMLElement).dataset.mod;
        if (modId) {
          ModdingSystem.uninstallMod(modId);
          this.toastManager.show('Mod entfernt.', 'info');
          this.open();
        }
      });
    });
  }
}
