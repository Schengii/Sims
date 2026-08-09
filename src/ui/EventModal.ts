/**
 * Events, Disasters & Ghosts Modal UI
 */

import type { Sim } from '../entity/Sim';
import { EventManager } from '../systems/EventSystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class EventModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-event-backdrop" role="dialog" aria-modal="true">
        <div class="modal-dialog glass-panel" style="max-width: 550px;">
          <div class="modal-header">
            <h2>🔥 Notfälle & Schicksals-Events</h2>
            <button class="btn-close" id="event-btn-close">&times;</button>
          </div>
          <div id="event-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('event-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, eventManager: EventManager): void {
    const backdrop = document.getElementById('modal-event-backdrop');
    const content = document.getElementById('event-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    const active = eventManager.activeEvent;
    let html = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #e74c3c; margin-bottom: 6px;">⚡ Status der Nachbarschaft</h3>
        <p><strong>Spukende Geister:</strong> ${eventManager.ghostsHaunting} 👻</p>
        <button class="btn-hud" id="btn-trigger-disaster" style="margin-top: 8px; background: #c0392b;">⚡ Zufälligen Notfall auslösen</button>
      </div>
    `;

    if (active) {
      html += `
        <div style="background: rgba(231, 76, 60, 0.25); border: 2px solid #e74c3c; padding: 14px; border-radius: 8px;">
          <h3 style="color: #e74c3c;">${active.icon} ${active.title}</h3>
          <p style="font-size: 0.9rem; color: #ecf0f1; margin: 6px 0 12px 0;">${active.description}</p>
          <button class="btn-hud" id="btn-resolve-event" style="background: #27ae60;">🚨 Eingreifen & Notfall lösen</button>
        </div>
      `;
    } else {
      html += `
        <div style="background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; padding: 12px; border-radius: 8px;">
          <h4 style="color: #2ecc71;">✅ Alles Ruhig im Haus</h4>
          <p style="font-size: 0.85rem; color: #bdc3c7;">Aktuell liegen keine Brände, Einbrüche oder Geisterspuks vor.</p>
        </div>
      `;
    }

    content.innerHTML = html;

    document.getElementById('btn-trigger-disaster')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const ev = eventManager.triggerRandomDisaster();
      if (ev) {
        ToastManager.showToast(ev.title, ev.description, ev.icon, 'warning');
        this.open(sim, eventManager);
      }
    });

    document.getElementById('btn-resolve-event')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      this.close();
      const type = active?.type === 'burglar' ? 'burglar' : 'fire';
      if ((window as any).game?.emergencyRescueModal) {
        (window as any).game.emergencyRescueModal.open(type, sim, (window as any).game.toastManager, this.soundManager);
      }
    });
  }

  public close(): void {
    document.getElementById('modal-event-backdrop')?.classList.remove('active');
  }
}
