/**
 * Aspiration & Reward Store UI Modal
 * Displays active Sim milestones, aspiration progress, and Reward Store catalog.
 */

import { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import { ASPIRATIONS_CATALOG, REWARD_STORE_ITEMS } from '../systems/AspirationSystem';
import type { ToastManager } from './ToastManager';

export class AspirationModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(sim: Sim, toastManager?: ToastManager, onRewardBought?: (effect: string) => void): void {
    this.close();

    const currentAsp = ASPIRATIONS_CATALOG[sim.aspirationId] || ASPIRATIONS_CATALOG.gourmet_chef;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'aspiration-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 680px; width: 90%;">
        <div class="modal-header">
          <h2>🎯 Bestrebungen & Belohnungs-Shop</h2>
          <button class="close-btn" id="close-asp-modal">&times;</button>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
          <button id="tab-asp-goals" class="hud-btn active" style="flex: 1;">🎯 Aktuelles Ziel (${currentAsp.icon})</button>
          <button id="tab-asp-shop" class="hud-btn" style="flex: 1;">🛍️ Belohnungen (${sim.aspirationPoints} Pkt)</button>
        </div>

        <!-- TAB 1: Goals & Milestones -->
        <div id="view-asp-goals">
          <div style="display: flex; align-items: center; gap: 16px; background: rgba(0,229,255,0.1); padding: 14px; border-radius: 12px; margin-bottom: 16px; border: 1px solid rgba(0,229,255,0.2);">
            <div style="font-size: 36px;">${currentAsp.icon}</div>
            <div style="flex: 1;">
              <h3 style="margin: 0 0 4px 0; color: #00e5ff;">${currentAsp.title}</h3>
              <div style="font-size: 13px; color: #bdc3c7;">Kategorie: ${currentAsp.category}</div>
              <div style="font-size: 12px; color: #ecf0f1; margin-top: 4px;">${currentAsp.description}</div>
            </div>
            <div>
              <select id="select-aspiration" style="background: #2c3e50; color: #fff; border: 1px solid #00e5ff; padding: 6px 10px; border-radius: 8px;">
                ${Object.values(ASPIRATIONS_CATALOG).map(a => `
                  <option value="${a.id}" ${a.id === sim.aspirationId ? 'selected' : ''}>${a.icon} ${a.title}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <h4 style="margin: 0 0 10px 0; color: #f1c40f;">📌 Etappen & Meilensteine:</h4>
          <div style="display: flex; flex-direction: column; gap: 10px; max-height: 240px; overflow-y: auto;">
            ${currentAsp.milestones.map(m => {
              const done = sim.completedMilestones.includes(m.id);
              return `
                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; border-left: 4px solid ${done ? '#2ecc71' : '#e67e22'};">
                  <div>
                    <div style="font-weight: 600; color: ${done ? '#2ecc71' : '#ffffff'};">
                      ${done ? '✅' : '⏳'} Stufe ${m.level}: ${m.description}
                    </div>
                  </div>
                  <div style="font-weight: 700; color: #f1c40f; background: rgba(241,196,15,0.15); padding: 4px 8px; border-radius: 6px;">
                    +${m.rewardPoints} Pkt
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- TAB 2: Reward Store -->
        <div id="view-asp-shop" style="display: none;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: rgba(241,196,15,0.1); padding: 10px 14px; border-radius: 8px;">
            <span style="color: #f1c40f; font-weight: bold;">Dein Punkteguthaben:</span>
            <span style="font-size: 18px; font-weight: 800; color: #f1c40f;">⭐ ${sim.aspirationPoints} Punkte</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-height: 260px; overflow-y: auto;">
            ${REWARD_STORE_ITEMS.map(item => {
              const canAfford = sim.aspirationPoints >= item.cost;
              return `
                <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; border: 1px solid rgba(255,255,255,0.1);">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; margin-bottom: 4px; color: #00e5ff;">
                      <span style="font-size: 20px;">${item.icon}</span>
                      <span>${item.name}</span>
                    </div>
                    <div style="font-size: 12px; color: #bdc3c7; margin-bottom: 8px;">${item.description}</div>
                  </div>
                  <button class="hud-btn btn-buy-reward" data-id="${item.id}" ${canAfford ? '' : 'disabled'} style="width: 100%; justify-content: center; background: ${canAfford ? '#2ecc71' : '#7f8c8d'}; opacity: ${canAfford ? '1' : '0.6'}; font-weight: bold;">
                    Kaufen (⭐ ${item.cost})
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-asp-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    // Attach Event Listeners
    modal.querySelector('#close-asp-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-asp-bottom')?.addEventListener('click', () => this.close());

    // Tab Switching
    const tabGoals = modal.querySelector('#tab-asp-goals');
    const tabShop = modal.querySelector('#tab-asp-shop');
    const viewGoals = modal.querySelector('#view-asp-goals') as HTMLElement;
    const viewShop = modal.querySelector('#view-asp-shop') as HTMLElement;

    tabGoals?.addEventListener('click', () => {
      tabGoals.classList.add('active');
      tabShop?.classList.remove('active');
      viewGoals.style.display = 'block';
      viewShop.style.display = 'none';
      this.soundManager.playUIClick();
    });

    tabShop?.addEventListener('click', () => {
      tabShop.classList.add('active');
      tabGoals?.classList.remove('active');
      viewShop.style.display = 'block';
      viewGoals.style.display = 'none';
      this.soundManager.playUIClick();
    });

    // Change Aspiration Select
    const selectAsp = modal.querySelector('#select-aspiration') as HTMLSelectElement;
    selectAsp?.addEventListener('change', (e) => {
      sim.aspirationId = (e.target as HTMLSelectElement).value;
      this.soundManager.playUIClick();
      this.open(sim, toastManager, onRewardBought);
    });

    // Reward Store Purchases
    modal.querySelectorAll('.btn-buy-reward').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const item = REWARD_STORE_ITEMS.find(i => i.id === itemId);
        if (item && sim.aspirationPoints >= item.cost) {
          sim.aspirationPoints -= item.cost;
          this.soundManager.playLevelUp();

          if (item.effect === 'replenish_needs') {
            sim.needs.modify('hunger', 100);
            sim.needs.modify('energy', 100);
            sim.needs.modify('hygiene', 100);
            sim.needs.modify('bladder', 100);
            sim.needs.modify('fun', 100);
            sim.needs.modify('social', 100);
            toastManager?.showToast('Trank getrunken', 'Alle Bedürfnisse sind jetzt auf 100%!', '🧪', 'success');
          } else if (item.effect === 'age_reset') {
            sim.ageDays = 0;
            toastManager?.showToast('Verjüngung!', 'Du fühlst dich wieder jung und erfrischt!', '✨', 'levelUp');
          } else if (item.effect === 'simoleons') {
            sim.simoleons += 5000;
            toastManager?.showToast('Geldsegen!', '§ 5.000 Simoleons wurden auf dein Konto überwiesen!', '💰', 'success');
          } else if (item.effect === 'double_skill_xp') {
            sim.addSkillXP('cooking', 100);
            sim.addSkillXP('programming', 100);
            toastManager?.showToast('Genie-Erleuchtung!', 'Deine Fähigkeiten haben sich rasant gesteigert!', '⚡', 'levelUp');
          }

          if (onRewardBought) onRewardBought(item.effect);
          this.open(sim, toastManager, onRewardBought);
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
