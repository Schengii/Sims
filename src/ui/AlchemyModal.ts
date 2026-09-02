/**
 * Alchemy Cauldron & Potion Brewing Modal UI
 * Allows players to brew mystical potions, inspect required botanic ingredients, and consume brewed elixirs.
 */

import { AlchemyBrewingSystem, ALCHEMY_RECIPES } from '../systems/AlchemyBrewingSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class AlchemyModal {
  private container: HTMLElement;
  private alchemySystem: AlchemyBrewingSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    alchemySystem: AlchemyBrewingSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.alchemySystem = alchemySystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-alchemy';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 20, 50, 0.96); border: 1px solid rgba(192, 132, 252, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🔮</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #c084fc;">Magischer Alchemie-Kessel</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #e9d5ff;">Braue mächtige Elixiere aus Botanik-Früchten, Honig & Kristallen</p>
            </div>
          </div>
          <button id="close-alchemy-modal" style="background: transparent; border: none; font-size: 26px; color: #e9d5ff; cursor: pointer;">&times;</button>
        </div>

        <!-- Recipe List -->
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          ${ALCHEMY_RECIPES.map(recipe => {
            const stock = this.alchemySystem.brewedPotions.find(p => p.recipeId === recipe.id)?.count || 0;
            return `
              <div style="
                background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(192, 132, 252, 0.25);
                border-radius: 12px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;
              ">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 30px;">${recipe.icon}</span>
                  <div>
                    <div style="font-weight: bold; font-size: 15px; color: #f8fafc;">${recipe.name}</div>
                    <p style="margin: 2px 0 6px 0; font-size: 12px; color: #cbd5e1;">${recipe.description}</p>
                    <div style="display: flex; gap: 8px; align-items: center;">
                      <span style="font-size: 11px; color: #a855f7; font-weight: 600;">Zutaten:</span>
                      ${recipe.requiredIngredients.map(ing => `<span style="background: rgba(192, 132, 252, 0.15); border: 1px solid rgba(192, 132, 252, 0.3); border-radius: 4px; padding: 2px 6px; font-size: 11px; color: #f3e8ff;">${ing.icon} ${ing.name}</span>`).join('')}
                    </div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; align-items: flex-end;">
                  <div style="font-size: 11px; color: #c084fc;">Im Schrank: <b>${stock}x</b></div>
                  <div style="display: flex; gap: 6px;">
                    <button class="brew-potion-btn" data-id="${recipe.id}" style="
                      background: linear-gradient(135deg, #7c3aed, #6d28d9); border: 1px solid #c084fc;
                      color: white; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: bold; cursor: pointer;
                    ">⚗️ Brauen</button>
                    ${stock > 0 ? `
                      <button class="drink-potion-btn" data-id="${recipe.id}" style="
                        background: linear-gradient(135deg, #059669, #047857); border: 1px solid #34d399;
                        color: white; border-radius: 6px; padding: 6px 12px; font-size: 11px; font-weight: bold; cursor: pointer;
                      ">🧪 Trinken</button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-alchemy-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.brew-potion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        const res = this.alchemySystem.brewPotion(id, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('⚗️ Trank gebraut', res.message, '✨', 'success');
          this.open();
        }
      });
    });

    backdrop.querySelectorAll('.drink-potion-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        const res = this.alchemySystem.drinkPotion(id, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🧪 Trank getrunken', res.message, '🌟', 'levelUp');
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-alchemy');
    if (existing) existing.remove();
  }
}
