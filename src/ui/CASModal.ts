/**
 * Create-A-Sim (CAS) Modal UI Editor
 * Provides customization for Sim name, gender, skin color, hair color, outfit style,
 * personality traits, and aspiration. Fully WCAG accessible.
 */

import { Sim } from '../entity/Sim';
import { Sanitizer } from '../security/Sanitizer';
import { SoundManager } from '../audio/SoundManager';

export class CASModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onSimUpdated?: (sim: Sim) => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-cas-backdrop" role="dialog" aria-modal="true" aria-labelledby="cas-title">
        <div class="modal-dialog glass-panel">
          <div class="modal-header">
            <h2 id="cas-title">✨ Create-A-Sim Editor (CAS)</h2>
            <button class="btn-close" id="cas-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <form id="cas-form" style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label for="cas-name" style="display: block; margin-bottom: 6px; font-weight: 600;">Sim Name</label>
              <input type="text" id="cas-name" maxlength="24" required style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label for="cas-gender" style="display: block; margin-bottom: 6px; font-weight: 600;">Geschlecht</label>
                <select id="cas-gender" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white;">
                  <option value="female">Weiblich</option>
                  <option value="male">Männlich</option>
                  <option value="non-binary">Divers / Non-Binär</option>
                </select>
              </div>

              <div>
                <label for="cas-trait" style="display: block; margin-bottom: 6px; font-weight: 600;">Hauptmerkmal</label>
                <select id="cas-trait" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white;">
                  <option value="Genial">Genial (Lerne-Bonus)</option>
                  <option value="Kreativ">Kreativ (Malen & Spaß)</option>
                  <option value="Romantisch">Romantisch (Sozial-Bonus)</option>
                  <option value="Aktiv">Aktiv (Fitness)</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <div>
                <label for="cas-skin" style="display: block; margin-bottom: 6px; font-size: 0.85rem;">Hautfarbe</label>
                <input type="color" id="cas-skin" value="#f1c27d" style="width: 100%; height: 40px; border-radius: 6px; border: none; cursor: pointer;" />
              </div>
              <div>
                <label for="cas-hair" style="display: block; margin-bottom: 6px; font-size: 0.85rem;">Haarfarbe</label>
                <input type="color" id="cas-hair" value="#2c3e50" style="width: 100%; height: 40px; border-radius: 6px; border: none; cursor: pointer;" />
              </div>
              <div>
                <label for="cas-outfit" style="display: block; margin-bottom: 6px; font-size: 0.85rem;">Outfit-Farbe</label>
                <input type="color" id="cas-outfit" value="#e74c3c" style="width: 100%; height: 40px; border-radius: 6px; border: none; cursor: pointer;" />
              </div>
            </div>

            <button type="submit" class="btn-hud" style="margin-top: 12px; justify-content: center; background: var(--simoleon-green);">
              💾 Sim Speichern & Übernehmen
            </button>
          </form>
        </div>
      </div>
    `;
  }

  public open(sim: Sim): void {
    const backdrop = document.getElementById('modal-cas-backdrop');
    if (!backdrop) return;

    // Populate current values
    (document.getElementById('cas-name') as HTMLInputElement).value = sim.customization.name;
    (document.getElementById('cas-gender') as HTMLSelectElement).value = sim.customization.gender;
    (document.getElementById('cas-trait') as HTMLSelectElement).value = sim.customization.trait;
    (document.getElementById('cas-skin') as HTMLInputElement).value = sim.customization.skinColor;
    (document.getElementById('cas-hair') as HTMLInputElement).value = sim.customization.hairColor;
    (document.getElementById('cas-outfit') as HTMLInputElement).value = sim.customization.outfitColor;

    backdrop.classList.add('active');

    // Attach form submit listener
    const form = document.getElementById('cas-form') as HTMLFormElement;
    form.onsubmit = (e) => {
      e.preventDefault();
      this.soundManager.playLevelUp();

      sim.customization.name = Sanitizer.sanitizeText((document.getElementById('cas-name') as HTMLInputElement).value, 24);
      sim.customization.gender = (document.getElementById('cas-gender') as HTMLSelectElement).value as any;
      sim.customization.trait = Sanitizer.sanitizeText((document.getElementById('cas-trait') as HTMLSelectElement).value, 30);
      sim.customization.skinColor = (document.getElementById('cas-skin') as HTMLInputElement).value;
      sim.customization.hairColor = (document.getElementById('cas-hair') as HTMLInputElement).value;
      sim.customization.outfitColor = (document.getElementById('cas-outfit') as HTMLInputElement).value;

      // Play Simlish chatter greeting
      this.soundManager.playSimlish(1.2, 'happy');

      this.close();
      if (this.onSimUpdated) this.onSimUpdated(sim);
    };

    document.getElementById('cas-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-cas-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
