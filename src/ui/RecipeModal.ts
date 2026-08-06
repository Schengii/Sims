/**
 * RecipeModal UI Component
 * Modal dialog for selecting recipes from the recipe book and preparing meals.
 */

import { CookingManager } from '../systems/CookingSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class RecipeModal {
  private container: HTMLElement;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;
  private modalElement: HTMLElement | null = null;
  private onMealCooked: (hungerBoost: number, mealName: string) => void;

  constructor(
    container: HTMLElement,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager,
    onMealCooked: (hungerBoost: number, mealName: string) => void
  ) {
    this.container = container;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
    this.onMealCooked = onMealCooked;
  }

  public open(): void {
    this.close();

    const cookingLevel = Math.floor(this.sim.skills.cooking);
    const recipes = CookingManager.RECIPES;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content glass-card recipe-modal">
        <div class="modal-header">
          <h2>🍳 Kochbuch & Rezepte (Level ${cookingLevel})</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="recipe-grid">
            ${recipes.map(r => {
              const isUnlocked = r.requiredLevel <= cookingLevel;
              const hasIngredient = r.gardenIngredient && this.sim.inventory.hasItem(r.gardenIngredient);
              return `
                <div class="recipe-card ${isUnlocked ? '' : 'locked'}">
                  <div class="recipe-icon">${r.icon}</div>
                  <div class="recipe-details">
                    <div class="recipe-title">${r.name}</div>
                    <div class="recipe-meta">
                      <span>Hunger +${r.hungerBoost}</span>
                      ${r.gardenIngredient ? `<span class="ingredient-badge ${hasIngredient ? 'owned' : ''}">🌱 ${r.gardenIngredient} (-50%)</span>` : ''}
                    </div>
                  </div>
                  <div class="recipe-actions">
                    ${isUnlocked ? `
                      <button class="btn btn-secondary cook-single" data-id="${r.id}">Einzeln (§${r.costSingle})</button>
                      <button class="btn btn-primary cook-family" data-id="${r.id}">Familie (§${r.costFamily})</button>
                    ` : `
                      <span class="lock-label">🔒 Level ${r.requiredLevel}</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    // Event listeners
    modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    modal.querySelectorAll('.cook-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) this.cook(id, false);
      });
    });

    modal.querySelectorAll('.cook-family').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).dataset.id;
        if (id) this.cook(id, true);
      });
    });
  }

  private cook(recipeId: string, isFamily: boolean): void {
    const res = CookingManager.prepareMeal(this.sim, recipeId, isFamily);
    if (!res.success) {
      this.toastManager.showToast('Kochen fehlgeschlagen', `Nicht genug Simoleons! (§${res.cost} benötigt)`, '❌', 'warning');
      this.soundManager.playUIClick();
      return;
    }

    this.soundManager.playLevelUp();
    this.toastManager.showToast('🍳 Rezept gekocht!', `${res.mealName} gekocht! (-§${res.cost})`, '🍳', 'success');
    this.onMealCooked(res.hungerBoost, res.mealName);
    this.close();
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
