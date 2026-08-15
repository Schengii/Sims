/**
 * Magic & Spellbook UI Modal for Sims 5
 * Displays Mana bar, magic skill level, spell catalog, and spellcasting buttons.
 */

import { SoundManager } from '../audio/SoundManager';
import { SPELLS_CATALOG, POTIONS_CATALOG, type MagicManager } from '../systems/MagicSystem';
import { FAMILIARS_CATALOG } from '../systems/FamiliarManager';
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
          <h2>🪄 Magie-Buch & Alchemie-Kessel</h2>
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

        <h4 style="margin: 0 0 8px 0; color: #f1c40f;">📜 Verfügbare Zaubersprüche:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 150px; overflow-y: auto; margin-bottom: 14px;">
          ${Object.values(SPELLS_CATALOG).map(spell => {
            const unlocked = magicManager.unlockedSpells.includes(spell.id);
            const canCast = unlocked && magicManager.manaPoints >= spell.manaCost;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border-left: 4px solid ${unlocked ? '#9b59b6' : '#7f8c8d'};">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 24px;">${spell.icon}</span>
                  <div>
                    <div style="font-weight: bold; color: ${unlocked ? '#ffffff' : '#7f8c8d'}; font-size: 13px;">
                      ${spell.name} ${!unlocked ? `(Stufe ${spell.minLevel})` : ''}
                    </div>
                    <div style="font-size: 11px; color: #bdc3c7;">${spell.description}</div>
                  </div>
                </div>

                <button class="hud-btn btn-cast-spell" data-id="${spell.id}" ${canCast ? '' : 'disabled'} style="padding: 4px 10px; font-size: 11px; background: ${canCast ? '#8e44ad' : '#7f8c8d'};">
                  🔮 ${spell.manaCost} Mana
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <h4 style="margin: 0 0 8px 0; color: #e84393;">⚗️ Alchemie-Kessel: Zaubertränke brauen</h4>
        <div style="display: flex; flex-direction: column; gap: 8px; max-height: 120px; overflow-y: auto; margin-bottom: 14px;">
          ${Object.values(POTIONS_CATALOG).map(pot => {
            const canBrew = magicManager.manaPoints >= pot.manaCost;
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(232, 67, 147, 0.1); padding: 8px 12px; border-radius: 8px; border-left: 4px solid #e84393;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 24px;">${pot.icon}</span>
                  <div>
                    <div style="font-weight: bold; color: #ffffff; font-size: 13px;">${pot.name}</div>
                    <div style="font-size: 11px; color: #bdc3c7;">${pot.description}</div>
                  </div>
                </div>

                <button class="hud-btn btn-brew-potion" data-id="${pot.id}" ${canBrew ? '' : 'disabled'} style="padding: 4px 10px; font-size: 11px; background: ${canBrew ? '#e84393' : '#7f8c8d'}; font-weight: bold;">
                  ⚗️ Brauen (${pot.manaCost} Mana)
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <h4 style="margin: 0 0 8px 0; color: #2ecc71;">🦉 Magische Haustiere & Zauber-Vertraute:</h4>
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
          ${FAMILIARS_CATALOG.map(fam => {
            const isCurrent = game.familiarManager?.activeFamiliar?.id === fam.id;
            return `
              <div class="glass-panel" style="padding: 8px 12px; min-width: 140px; text-align: center; border-color: ${isCurrent ? '#2ecc71' : 'rgba(255,255,255,0.1)'};">
                <div style="font-size: 24px;">${fam.icon}</div>
                <div style="font-size: 11px; font-weight: bold; color: #ffffff; margin-top: 2px;">${fam.name}</div>
                <button class="hud-btn btn-summon-familiar" data-id="${fam.id}" style="margin-top: 6px; width: 100%; font-size: 10px; justify-content: center; background: ${isCurrent ? '#27ae60' : '#34495e'};">
                  ${isCurrent ? '✅ Aktiv' : 'Beschwören'}
                </button>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 16px; text-align: right;">
          <button class="hud-btn" id="close-magic-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-magic-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-magic-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-brew-potion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const potionId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (potionId) {
          const res = magicManager.brewPotion(potionId, game.sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('⚗️ TRANK GEBRAUT!', res.message, '✨', 'levelUp');
            this.open(magicManager, game, toastManager);
          } else {
            toastManager?.showToast('Kessel-Magie fehlgeschlagen', res.message, '⚠️', 'warning');
          }
        }
      });
    });

    modal.querySelectorAll('.btn-summon-familiar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const famId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (famId && game.familiarManager) {
          const res = game.familiarManager.summonFamiliar(famId, game.sim);
          this.soundManager.playLevelUp();
          toastManager?.showToast('🔮 Zauber-Vertrauter', res.message, '✨', 'levelUp');
          this.open(magicManager, game, toastManager);
        }
      });
    });

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
