/**
 * Hobby, Repair & Freelance Modal UI
 */

import type { Sim } from '../entity/Sim';
import { HobbyManager, FREELANCE_GIGS } from '../systems/HobbySystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class HobbyModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-hobby-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 600px;">
          <div class="modal-header">
            <h2>🎸 Hobbys & Freelance Aufträge</h2>
            <button class="btn-close" id="hobby-btn-close">&times;</button>
          </div>
          <div id="hobby-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('hobby-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, hobbyManager: HobbyManager): void {
    const backdrop = document.getElementById('modal-hobby-backdrop');
    const content = document.getElementById('hobby-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    let html = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #f39c12; margin-bottom: 6px;">🔨 Handwerker & Reparatur-Skill</h3>
        <p><strong>Geschicklichkeit Level:</strong> ${hobbyManager.handinessLevel}</p>
        <p style="font-size: 0.85rem; color: #bdc3c7;">Repariere Geräte an der Werkbank, um deinen Skill zu steigern!</p>
      </div>

      <h3 style="color: #2ecc71; margin-bottom: 10px;">💻 Verfügbare Freelance-Gigs:</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    FREELANCE_GIGS.forEach(gig => {
      html += `
        <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>💼 ${gig.title}</strong>
            <p style="font-size: 0.8rem; color: #bdc3c7; margin-top: 2px;">${gig.description}</p>
            <span style="color: #f1c40f; font-weight: bold; font-size: 0.85rem;">Honorar: § ${gig.payout}</span>
          </div>
          <button class="btn-hud btn-do-gig" data-id="${gig.id}" style="background: #27ae60;">Gig annehmen</button>
        </div>
      `;
    });

    html += `</div>`;
    content.innerHTML = html;

    document.querySelectorAll('.btn-do-gig').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.soundManager.playUIClick();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id')!;
        const res = hobbyManager.executeFreelanceGig(sim, id);
        if (res.success) {
          ToastManager.showToast('💻 Freelance Gig', res.message, '💻', 'success');
          this.open(sim, hobbyManager);
        } else {
          ToastManager.showToast('⚠️ Gig Fehler', res.message, '⚠️', 'warning');
        }
      });
    });
  }

  public close(): void {
    document.getElementById('modal-hobby-backdrop')?.classList.remove('active');
  }
}
