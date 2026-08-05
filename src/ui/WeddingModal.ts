/**
 * Wedding & Family Expansion Modal UI
 */

import type { Sim } from '../entity/Sim';
import { WeddingManager } from '../systems/WeddingSystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class WeddingModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-wed-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 550px;">
          <div class="modal-header">
            <h2>💒 Hochzeit & Familie</h2>
            <button class="btn-close" id="wed-btn-close">&times;</button>
          </div>
          <div id="wed-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('wed-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, weddingManager: WeddingManager): void {
    const backdrop = document.getElementById('modal-wed-backdrop');
    const content = document.getElementById('wed-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    const data = weddingManager.weddingData;
    let html = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #e84393; margin-bottom: 6px;">💍 Beziehungs-Status</h3>
        <p><strong>Partner:</strong> ${sim.partnerName || 'Single'}</p>
        <p><strong>Verlobt:</strong> ${data.isEngaged ? 'Ja 💍' : 'Nein'}</p>
        <p><strong>Verheiratet:</strong> ${data.isMarried ? 'Ja 💒' : 'Nein'}</p>
      </div>
    `;

    if (!data.isEngaged && !data.isMarried) {
      html += `
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">
          <h4>💍 Heiratsantrag machen</h4>
          <p style="font-size: 0.85rem; color: #bdc3c7; margin: 4px 0 8px 0;">Kaufe einen Verlobungsring für § 500 und mache deiner großen Liebe einen Antrag.</p>
          <button class="btn-hud" id="btn-propose" style="background: #e84393;">💍 Antrag machen (§ 500)</button>
        </div>
      `;
    } else if (data.isEngaged && !data.isMarried) {
      html += `
        <div style="background: rgba(232, 67, 147, 0.2); border: 1px solid #e84393; padding: 12px; border-radius: 8px;">
          <h4>💒 Hochzeitsfeier ausrichten</h4>
          <p style="font-size: 0.85rem; color: #ecf0f1; margin: 4px 0 8px 0;">Platziere den Blumen-Hochzeitsbogen im Garten und feiere dein Ja-Wort!</p>
          <button class="btn-hud" id="btn-hold-ceremony" style="background: #27ae60;">💒 Hochzeits-Zeremonie starten</button>
        </div>
      `;
    } else {
      html += `
        <div style="background: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; padding: 12px; border-radius: 8px;">
          <h4 style="color: #2ecc71;">🎉 Glücklich Verheiratet!</h4>
          <p style="font-size: 0.85rem; color: #ecf0f1;">Ihr genießt euer gemeinsames Leben im Traumhaus!</p>
        </div>
      `;
    }

    content.innerHTML = html;

    document.getElementById('btn-propose')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const targetName = sim.partnerName || 'Bella Goth';
      const res = weddingManager.proposeToPartner(sim, targetName);
      if (res.success) {
        ToastManager.showToast('💍 Verlobung', res.message, '💍', 'levelUp');
        this.open(sim, weddingManager);
      } else {
        ToastManager.showToast('⚠️ Verlobung', res.message, '⚠️', 'warning');
      }
    });

    document.getElementById('btn-hold-ceremony')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const res = weddingManager.holdCeremony(sim);
      if (res.success) {
        ToastManager.showToast('💒 Hochzeit', res.message, '💒', 'levelUp');
        this.open(sim, weddingManager);
      } else {
        ToastManager.showToast('⚠️ Hochzeit', res.message, '⚠️', 'warning');
      }
    });
  }

  public close(): void {
    document.getElementById('modal-wed-backdrop')?.classList.remove('active');
  }
}
