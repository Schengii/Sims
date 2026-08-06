/**
 * WhimPanel UI Component
 * Floating glassmorphism HUD panel displaying active wants, rewards, and fears.
 */

import { WhimManager } from '../systems/WhimSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';

export class WhimPanel {
  private container: HTMLElement;
  private whimManager: WhimManager;
  private activeSim: Sim;
  private toastManager: ToastManager;

  constructor(container: HTMLElement, whimManager: WhimManager, sim: Sim, toastManager: ToastManager) {
    this.container = container;
    this.whimManager = whimManager;
    this.activeSim = sim;
    this.toastManager = toastManager;
    this.render();
  }

  public setSim(sim: Sim): void {
    this.activeSim = sim;
    this.render();
  }

  public update(): void {
    this.render();
  }

  public render(): void {
    let panel = document.getElementById('whim-hud-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'whim-hud-panel';
      panel.className = 'whim-hud-panel glass-card';
      this.container.appendChild(panel);
    }

    const whims = this.whimManager.getWhims();
    const fears = this.whimManager.getFears();

    panel.innerHTML = `
      <div class="whim-header">
        <span class="whim-title">💭 Wünsche & Ängste (${this.activeSim.customization.name})</span>
        <button id="whim-refresh-btn" class="whim-refresh-btn" title="Neue Wünsche erwürfeln">🎲</button>
      </div>
      <div class="whims-list">
        ${whims.map(w => `
          <div class="whim-card ${w.isPinned ? 'pinned' : ''}" data-id="${w.id}">
            <span class="whim-icon">${w.icon}</span>
            <div class="whim-info">
              <div class="whim-card-title">${w.title}</div>
              <div class="whim-reward">+${w.rewardPoints} 💎</div>
            </div>
            <button class="whim-pin-btn" data-id="${w.id}" title="${w.isPinned ? 'Entpinnen' : 'Pinnen'}">${w.isPinned ? '📌' : '📍'}</button>
          </div>
        `).join('')}
      </div>
      ${fears.length > 0 ? `
        <div class="fears-list">
          ${fears.map(f => `
            <div class="fear-card">
              <span class="fear-icon">${f.icon}</span>
              <div class="fear-info">
                <div class="fear-card-title">${f.title}</div>
                <div class="fear-desc">${f.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;

    // Event handlers
    const refreshBtn = panel.querySelector('#whim-refresh-btn');
    refreshBtn?.addEventListener('click', () => {
      this.whimManager.refreshWhims();
      this.render();
      this.toastManager.show('🎲 Wünsche neu erwürfelt!', 'info');
    });

    panel.querySelectorAll('.whim-pin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.id;
        if (id) {
          this.whimManager.pinWhim(id);
          this.render();
        }
      });
    });
  }
}
