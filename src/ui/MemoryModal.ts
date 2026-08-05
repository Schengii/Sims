/**
 * Memory Log & Milestones Modal UI
 */

import { Sim } from '../entity/Sim';
import { MemoryManager } from '../systems/MemorySystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class MemoryModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-mem-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 600px;">
          <div class="modal-header">
            <h2>📖 Lebenschronik & Erinnerungen</h2>
            <button class="btn-close" id="mem-btn-close">&times;</button>
          </div>
          <div id="mem-content" style="padding: 10px; max-height: 60vh; overflow-y: auto;"></div>
        </div>
      </div>
    `;

    document.getElementById('mem-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, memManager: MemoryManager): void {
    const backdrop = document.getElementById('modal-mem-backdrop');
    const content = document.getElementById('mem-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    if (memManager.memories.length === 0) {
      memManager.addMemory('Neuanfang in der Sims-Welt', '🏡', 'Einzug in das Traumhaus vollbracht!', 'happy');
    }

    let html = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    memManager.memories.forEach(m => {
      html += `
        <div style="background: rgba(255,255,255,0.06); padding: 12px; border-radius: 8px; border-left: 4px solid #f1c40f;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 1rem; color: #f39c12;">${m.icon} ${m.title}</strong>
            <span style="font-size: 0.75rem; color: #95a5a6;">${m.timestamp}</span>
          </div>
          <p style="font-size: 0.85rem; color: #ecf0f1; margin-top: 4px;">${m.description}</p>
          <button class="btn-hud btn-reminisce" style="margin-top: 6px; font-size: 0.75rem; padding: 2px 6px;">💭 In Erinnerung schwelgen (+Glücklich)</button>
        </div>
      `;
    });

    html += `</div>`;
    content.innerHTML = html;

    document.querySelectorAll('.btn-reminisce').forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundManager.playUIClick();
        sim.needs.modify('fun', 15);
        ToastManager.showToast('💭 Erinnerungen', 'In schönen Erinnerungen geschwelgt! (+15 Spaß)', '💭', 'success');
      });
    });
  }

  public close(): void {
    document.getElementById('modal-mem-backdrop')?.classList.remove('active');
  }
}
