/**
 * Renters & Sub-Leasing Modal UI
 */

import { Sim } from '../entity/Sim';
import { RentersManager } from '../systems/RentersSystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class RentersModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-rent-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 600px;">
          <div class="modal-header">
            <h2>🏢 Vermietung & Mitbewohner</h2>
            <button class="btn-close" id="rent-btn-close">&times;</button>
          </div>
          <div id="rent-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('rent-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, rentersManager: RentersManager, onUpdateSimoleons: (amount: number) => void): void {
    const backdrop = document.getElementById('modal-rent-backdrop');
    const content = document.getElementById('rent-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    let html = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #f1c40f;">🏠 Mieteinnahmen</h3>
          <p style="font-size: 0.85rem; color: #bdc3c7;">Verwalte deine Mitbewohner & Untermieter.</p>
        </div>
        <button class="btn-hud" id="btn-collect-rent" style="background: #27ae60;">💰 Miete Kassieren</button>
      </div>

      <h3 style="color: #e67e22; margin-bottom: 10px;">👤 Aktuelle Mieter (${rentersManager.tenants.length})</h3>
    `;

    if (rentersManager.tenants.length === 0) {
      html += `<p style="font-size: 0.9rem; color: #95a5a6; font-style: italic;">Keine Mieter eingezogen.</p>`;
    } else {
      html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
      rentersManager.tenants.forEach(t => {
        html += `
          <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">${t.avatar}</span>
              <div>
                <strong>${t.name}</strong>
                <p style="font-size: 0.8rem; color: #bdc3c7;">Etage: ${t.assignedFloor} | Miete: § ${t.weeklyRent}/Woche | Zufriedenheit: ${t.satisfaction}%</p>
              </div>
            </div>
            <button class="btn-hud btn-evict-tenant" data-id="${t.id}" style="background: #c0392b; font-size: 0.8rem;">Kündigen</button>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `
      <div style="margin-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
        <h4>➕ Neuen Untermieter anwerben</h4>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn-hud" id="btn-add-tenant-1" style="flex: 1;">👨‍🦱 Mortimer (EG - § 350/W)</button>
          <button class="btn-hud" id="btn-add-tenant-2" style="flex: 1;">👩‍🦰 Summer (1. OG - § 450/W)</button>
        </div>
      </div>
    `;

    content.innerHTML = html;

    document.getElementById('btn-collect-rent')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const res = rentersManager.collectRent();
      if (res.totalCollected > 0) {
        onUpdateSimoleons(res.totalCollected);
        ToastManager.showToast('💰 Miete Kassiert', res.log, '💰', 'success');
      } else {
        ToastManager.showToast('🏠 Miete', res.log, 'ℹ️', 'info');
      }
      this.open(sim, rentersManager, onUpdateSimoleons);
    });

    document.getElementById('btn-add-tenant-1')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      rentersManager.addTenant('Mortimer Goth', '👨‍🦱', 0, 350);
      ToastManager.showToast('🏡 Mieter Einzug', 'Mortimer als Mieter im EG eingezogen!', '👨‍🦱', 'success');
      this.open(sim, rentersManager, onUpdateSimoleons);
    });

    document.getElementById('btn-add-tenant-2')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      rentersManager.addTenant('Summer Holiday', '👩‍🦰', 1, 450);
      ToastManager.showToast('🏡 Mieter Einzug', 'Summer als Mieterin im 1. OG eingezogen!', '👩‍🦰', 'success');
      this.open(sim, rentersManager, onUpdateSimoleons);
    });

    document.querySelectorAll('.btn-evict-tenant').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.soundManager.playUIClick();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id')!;
        rentersManager.evictTenant(id);
        ToastManager.showToast('🚪 Kündigung', 'Mieter gekündigt.', '🚪', 'warning');
        this.open(sim, rentersManager, onUpdateSimoleons);
      });
    });
  }

  public close(): void {
    document.getElementById('modal-rent-backdrop')?.classList.remove('active');
  }
}
