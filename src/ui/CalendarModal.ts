/**
 * Seasonal Calendar & Holiday UI Modal for Sims 5
 * Displays annual season schedule, today's holiday, and tradition checklist.
 */

import { SoundManager } from '../audio/SoundManager';
import { CalendarManager, HOLIDAYS_CATALOG } from '../systems/CalendarSystem';
import type { ToastManager } from './ToastManager';

export class CalendarModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(calendar: CalendarManager, game: any, toastManager?: ToastManager): void {
    this.close();

    const todayHoliday = calendar.getTodayHoliday();

    const seasonNames: Record<string, { name: string; icon: string; bg: string }> = {
      spring: { name: 'Frühling', icon: '🌸', bg: '#27ae60' },
      summer: { name: 'Sommer', icon: '☀️', bg: '#f39c12' },
      autumn: { name: 'Herbst', icon: '🍂', bg: '#d35400' },
      winter: { name: 'Winter', icon: '❄️', bg: '#2980b9' }
    };

    const sInfo = seasonNames[calendar.currentSeason];

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'calendar-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 680px; width: 90%;">
        <div class="modal-header">
          <h2>📅 Saisonaler Kalender & Feiertage</h2>
          <button class="close-btn" id="close-cal-modal">&times;</button>
        </div>

        <!-- Season Status Badge -->
        <div style="display: flex; align-items: center; justify-content: space-between; background: ${sInfo.bg}22; border: 1px solid ${sInfo.bg}; padding: 12px 16px; border-radius: 12px; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">${sInfo.icon}</span>
            <div>
              <h3 style="margin: 0; color: #ffffff;">Aktuelle Jahreszeit: ${sInfo.name}</h3>
              <div style="font-size: 13px; color: #bdc3c7;">Tag ${calendar.dayOfSeason} von 7 dieser Saison</div>
            </div>
          </div>
          <div style="font-weight: bold; color: #00e5ff; background: rgba(0,229,255,0.15); padding: 6px 12px; border-radius: 8px;">
            ${todayHoliday ? `🎉 ${todayHoliday.name}` : 'Normaler Alltag'}
          </div>
        </div>

        <!-- Today's Holiday Traditions -->
        ${todayHoliday ? `
          <div style="background: rgba(241,196,15,0.1); border: 1px solid rgba(241,196,15,0.3); padding: 14px; border-radius: 12px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 6px 0; color: #f1c40f;">${todayHoliday.icon} ${todayHoliday.name}</h3>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #ecf0f1;">${todayHoliday.description}</p>

            <h4 style="margin: 0 0 8px 0; color: #ffffff;">📌 Feiertags-Traditionen:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${todayHoliday.traditions.map(t => {
                const done = calendar.completedTraditions.includes(t.id);
                return `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 18px;">${t.icon}</span>
                      <div>
                        <div style="font-weight: bold; color: ${done ? '#2ecc71' : '#ffffff'};">${t.name} ${done ? '✅' : ''}</div>
                        <div style="font-size: 11px; color: #bdc3c7;">${t.description}</div>
                      </div>
                    </div>
                    ${!done ? `
                      <button class="hud-btn btn-do-tradition" data-id="${t.id}" style="padding: 4px 10px; font-size: 11px; background: #27ae60;">Erfüllen</button>
                    ` : `
                      <span style="color: #2ecc71; font-weight: bold; font-size: 12px;">Erfüllt 🎉</span>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Upcoming Annual Holidays -->
        <h4 style="margin: 0 0 10px 0; color: #00e5ff;">🗓️ Jahresübersicht aller Feiertage:</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 200px; overflow-y: auto;">
          ${Object.values(HOLIDAYS_CATALOG).map(h => `
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; border-left: 4px solid #3498db;">
              <div style="font-weight: bold; color: #ffffff; display: flex; align-items: center; gap: 6px;">
                <span>${h.icon}</span>
                <span>${h.name}</span>
              </div>
              <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">
                Saison: ${seasonNames[h.season].name} (Tag ${h.dayOfSeason})
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-cal-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-cal-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-cal-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-do-tradition').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (tId && calendar.completeTradition(tId)) {
          game.sim.simoleons += 300;
          game.sim.aspirationPoints += 150;
          this.soundManager.playLevelUp();
          toastManager?.showToast('🎉 Tradition erfüllt!', 'Du hast § 300 & +150 Bestrebungspunkte erhalten!', '⭐', 'levelUp');
          this.open(calendar, game, toastManager);
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
