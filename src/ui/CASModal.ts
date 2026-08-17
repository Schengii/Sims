/**
 * Create-A-Sim (CAS) Modal UI Editor
 * Provides customization for Sim name, gender, skin color, hair color, outfit style,
 * personality traits (up to 3), and aspiration. Fully WCAG accessible.
 * v18: Now supports 3 trait slots like Sims 4. Traits are linked to TRAIT_CATALOG IDs.
 */

import { Sim } from '../entity/Sim';
import { Sanitizer } from '../security/Sanitizer';
import { SoundManager } from '../audio/SoundManager';
import { TRAIT_CATALOG } from '../systems/TraitSystem';

/** Build the trait <option> list from TRAIT_CATALOG */
function buildTraitOptions(selectedId?: string): string {
  const entries = Object.values(TRAIT_CATALOG);
  return entries.map(t => `
    <option value="${t.id}" ${t.id === selectedId ? 'selected' : ''}>${t.icon} ${t.name}</option>
  `).join('');
}

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
    const traitOpts = buildTraitOptions();
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
                <label style="display: block; margin-bottom: 6px; font-weight: 600;">🧬 Aspiration</label>
                <select id="cas-aspiration" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white;">
                  <option value="Meisterköchin">🍽️ Meisterköchin</option>
                  <option value="Weltberühmter Maler">🎨 Weltberühmter Maler</option>
                  <option value="Fitness-Guru">🏃 Fitness-Guru</option>
                  <option value="Technik-Genie">💻 Technik-Genie</option>
                  <option value="Soziale Ikone">🌟 Soziale Ikone</option>
                  <option value="Romantischer Weltenbummler">💕 Romantischer Weltenbummler</option>
                  <option value="Familie">👨‍👩‍👧 Familie</option>
                  <option value="Erfolgreicher Unternehmer">💼 Erfolgreicher Unternehmer</option>
                </select>
              </div>
            </div>

            <!-- 3 Trait Slots (v18) -->
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 600;">🧠 Merkmale (bis zu 3 aktiv, wie in Sims 4)</label>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                <div>
                  <label for="cas-trait-1" style="font-size: 0.8rem; display: block; margin-bottom: 4px; color: var(--plumbob-green);">Merkmal 1</label>
                  <select id="cas-trait-1" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white; font-size: 0.85rem;">
                    <option value="">– Kein Merkmal –</option>
                    ${traitOpts}
                  </select>
                </div>
                <div>
                  <label for="cas-trait-2" style="font-size: 0.8rem; display: block; margin-bottom: 4px; color: var(--plumbob-green);">Merkmal 2</label>
                  <select id="cas-trait-2" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white; font-size: 0.85rem;">
                    <option value="">– Kein Merkmal –</option>
                    ${traitOpts}
                  </select>
                </div>
                <div>
                  <label for="cas-trait-3" style="font-size: 0.8rem; display: block; margin-bottom: 4px; color: var(--plumbob-green);">Merkmal 3</label>
                  <select id="cas-trait-3" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid var(--panel-border); background: rgba(0,0,0,0.4); color: white; font-size: 0.85rem;">
                    <option value="">– Kein Merkmal –</option>
                    ${traitOpts}
                  </select>
                </div>
              </div>
              <p style="margin-top: 6px; font-size: 0.78rem; color: #aaa;">Jedes Merkmal beeinflusst Bedürfnis-Abbau, Launen und Whims deines Sims!</p>
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
    if (!backdrop) {
      this.renderBaseHTML();
    }
    const bd = document.getElementById('modal-cas-backdrop');
    if (!bd) return;

    // Populate current values
    (document.getElementById('cas-name') as HTMLInputElement).value = sim.customization.name;
    (document.getElementById('cas-gender') as HTMLSelectElement).value = sim.customization.gender;
    (document.getElementById('cas-skin') as HTMLInputElement).value = sim.customization.skinColor;
    (document.getElementById('cas-hair') as HTMLInputElement).value = sim.customization.hairColor;
    (document.getElementById('cas-outfit') as HTMLInputElement).value = sim.customization.outfitColor;

    if (sim.customization.aspiration) {
      const asp = document.getElementById('cas-aspiration') as HTMLSelectElement;
      if (asp) asp.value = sim.customization.aspiration;
    }

    // Populate trait slots
    const activeTraits = sim.customization.traits && sim.customization.traits.length > 0
      ? sim.customization.traits
      : [sim.getActiveTraitIds()[0] ?? '', '', ''];
    for (let i = 0; i < 3; i++) {
      const sel = document.getElementById(`cas-trait-${i + 1}`) as HTMLSelectElement;
      if (sel) sel.value = activeTraits[i] ?? '';
    }

    bd.classList.add('active');

    // Attach form submit listener (replace to avoid duplicates)
    const form = document.getElementById('cas-form') as HTMLFormElement;
    const newForm = form.cloneNode(true) as HTMLFormElement;
    form.parentNode!.replaceChild(newForm, form);

    newForm.onsubmit = (e) => {
      e.preventDefault();
      this.soundManager.playLevelUp();

      sim.customization.name = Sanitizer.sanitizeText((document.getElementById('cas-name') as HTMLInputElement).value, 24);
      sim.customization.gender = (document.getElementById('cas-gender') as HTMLSelectElement).value as any;
      sim.customization.skinColor = (document.getElementById('cas-skin') as HTMLInputElement).value;
      sim.customization.hairColor = (document.getElementById('cas-hair') as HTMLInputElement).value;
      sim.customization.outfitColor = (document.getElementById('cas-outfit') as HTMLInputElement).value;
      sim.customization.aspiration = (document.getElementById('cas-aspiration') as HTMLSelectElement)?.value ?? sim.customization.aspiration;

      // Collect up to 3 traits
      const traits: string[] = [];
      for (let i = 1; i <= 3; i++) {
        const val = (document.getElementById(`cas-trait-${i}`) as HTMLSelectElement)?.value;
        if (val) traits.push(val);
      }
      sim.customization.traits = traits;
      // Update legacy single trait for backward compat
      sim.customization.trait = traits[0] ? (TRAIT_CATALOG[traits[0]]?.name ?? traits[0]) : sim.customization.trait;

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
