/**
 * Magic & Spellbook UI Modal for Sims 5
 * Displays Mana bar, magic skill level, spell catalog, and spellcasting buttons.
 */

import { SoundManager } from '../audio/SoundManager';
import { SPELLS_CATALOG, type MagicManager } from '../systems/MagicSystem';
import type { ToastManager } from './ToastManager';

export class MagicModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(magicManager: MagicManager, game: any, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'magic-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 650px; width: 90%;">
        <div class="modal-header">
          <h2>🪄 Magie-Buch & Alchemie</h2>
          <button class="close-btn" id="close-magic-modal">&times;</button>
        </div>

        <!-- Magic Level & Mana Bar -->
        <div style="background: rgba(142,68,173,0.15); border: 1px solid #8e44ad; padding: 14px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #9b59b6; font-size: 16px;">✨ Magie-Stufe ${magicManager.magicLevel} / 5</span>
            <span style="color: #00e5ff; font-weight: bold;">🔮 Mana: ${Math.round(magicManager.manaPoints)} / ${magicManager.maxMana}</span>
          </div>

          <div style="background: rgba(0,0,0,0.4); height: 12px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
            <div style="background: linear-gradient(90deg, #8e44ad, #00e5ff); width: ${(magicManager.manaPoints / magicManager.maxMana) * 100}%; height: 100%;"></div>
          </div>
        </div>

        <h4 style="margin: 0 0 10px 0; color: #f1c40f;">📜 Verfügbare Zaubersprüche:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto;">
          ${Object.values(SPELLS_CATALOG).map(spell => {
            const unlocked = magicManager.unlockedSpells.includes(spell.id);
            const canCast = unlocked && magicManager.manaPoints >= spell.manaCost;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; border-left: 4px solid ${unlocked ? '#9b59b6' : '#7f8c8d'};">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 28px;">${spell.icon}</span>
                  <div>
                    <div style="font-weight: bold; color: ${unlocked ? '#ffffff' : '#7f8c8d'};">
                      ${spell.name} ${!unlocked ? `(Sperre: Stufe ${spell.minLevel})` : ''}
                    </div>
                    <div style="font-size: 12px; color: #bdc3c7;">${spell.description}</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 12px; color: #00e5ff; font-weight: bold;">🔮 ${spell.manaCost} Mana</span>
                  <button class="hud-btn btn-cast-spell" data-id="${spell.id}" ${canCast ? '' : 'disabled'} style="padding: 6px 12px; background: ${canCast ? '#8e44ad' : '#7f8c8d'}; font-weight: bold;">
                    Zaubern
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-magic-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-magic-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-magic-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-cast-spell').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const spellId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (spellId) {
          const res = magicManager.castSpell(spellId, game);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🪄 ZAUBER GELUNGEN!', res.message, '✨', 'levelUp');
            this.open(magicManager, game, toastManager);
          } else {
            toastManager?.showToast('Magie fehlgeschlagen', res.message, '⚠️', 'warning');
          }
        }
      });
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
