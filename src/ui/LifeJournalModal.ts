/**
 * Illustrated Life History Journal Modal
 * Visual chronicle of all life stages, milestones, achievements, and trait quest badges.
 */

import { Sim } from '../entity/Sim';
import { TraitQuestSystem } from '../systems/TraitQuestSystem';
import { SoundManager } from '../audio/SoundManager';

export class LifeJournalModal {
  private container: HTMLDivElement | null = null;

  public open(sim: Sim, traitQuestSystem: TraitQuestSystem, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(sim, traitQuestSystem, soundManager);
      this.container.style.display = 'flex';
    }
  }

  public close(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.className = 'glass-modal-overlay';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.id = 'life-journal-modal-content';
    content.style.cssText = `
      width: 500px;
      max-height: 80vh;
      padding: 24px;
      border-radius: 20px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(sim: Sim, questSystem: TraitQuestSystem, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#life-journal-modal-content');
    if (!content) return;

    const quests = questSystem.getQuestsForSim(sim);

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">📖 Lebenschronik & Auszeichnungen</h3>
        <button id="journal-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 32px;">💎</span>
        <div>
          <div style="font-weight: bold; font-size: 15px;">${sim.customization.name}</div>
          <div style="font-size: 12px; color: #94a3b8;">Merkmal: ${sim.customization.trait} • Bestrebung: ${sim.customization.aspiration}</div>
        </div>
      </div>

      <div style="font-weight: bold; color: #facc15; font-size: 14px; margin-top: 6px;">🎯 Merkmals-Quests & Badges:</div>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${quests.map(q => `
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 14px; color: ${q.isCompleted ? '#4ade80' : '#ffffff'};">${q.title}</div>
              <div style="font-size: 11px; color: #94a3b8;">${q.description}</div>
              <div style="font-size: 11px; color: #facc15; margin-top: 2px;">Belohnung: § ${q.rewardSimoleons} + ${q.rewardAP} AP</div>
            </div>

            <button class="btn-claim-quest" data-id="${q.id}" ${q.isCompleted ? 'disabled' : ''} style="padding: 8px 12px; background: ${q.isCompleted ? '#475569' : '#0284c7'}; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px;">
              ${q.isCompleted ? '✓ Erfüllt' : 'Abschließen'}
            </button>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#journal-modal-close')?.addEventListener('click', () => this.close());

    content.querySelectorAll('.btn-claim-quest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          questSystem.completeQuest(id, sim, (window as any).game.toastManager, soundManager);
          this.renderContent(sim, questSystem, soundManager);
        }
      });
    });
  }
}
