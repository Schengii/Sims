/**
 * Education & University Modal UI
 */

import { Sim } from '../entity/Sim';
import { EducationManager, DEGREE_PROGRAMS } from '../systems/EducationSystem';
import { SoundManager } from '../audio/SoundManager';
import { ToastManager } from './ToastManager';

export class EducationModal {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-edu-backdrop" role="dialog" aria-modal="true" aria-labelledby="edu-title">
        <div class="modal-dialog glass-panel" style="max-width: 600px;">
          <div class="modal-header">
            <h2 id="edu-title">🎓 Bildung & Universität</h2>
            <button class="btn-close" id="edu-btn-close">&times;</button>
          </div>
          <div id="edu-content" style="padding: 10px;"></div>
        </div>
      </div>
    `;

    document.getElementById('edu-btn-close')?.addEventListener('click', () => this.close());
  }

  public open(sim: Sim, eduManager: EducationManager, onUpdateSimoleons: (amount: number) => void): void {
    const backdrop = document.getElementById('modal-edu-backdrop');
    const content = document.getElementById('edu-content');
    if (!backdrop || !content) return;

    backdrop.classList.add('active');

    let html = `
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
        <h3 style="color: #f1c40f; margin-bottom: 6px;">🎒 Schul- & Studienstand</h3>
        <p><strong>Aktueller Sim:</strong> ${sim.customization.name}</p>
        <p><strong>Schulnote (Schule/Grundstudium):</strong> <span style="color: #2ecc71; font-weight: bold;">${eduManager.grade.toFixed(1)}</span></p>
        <button class="btn-hud" id="btn-do-homework" style="margin-top: 8px;">📚 Hausaufgaben machen (-20 Min)</button>
      </div>
    `;

    if (eduManager.enrolledDegree) {
      const degree = DEGREE_PROGRAMS[eduManager.enrolledDegree];
      html += `
        <div style="background: rgba(52, 152, 219, 0.2); border: 1px solid #3498db; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
          <h4 style="color: #3498db; margin-bottom: 6px;">🎓 Aktueller Studiengang: ${degree?.name || eduManager.enrolledDegree}</h4>
          <p>${degree?.description || ''}</p>
          <div style="background: rgba(0,0,0,0.4); height: 16px; border-radius: 8px; overflow: hidden; margin: 10px 0;">
            <div style="width: ${eduManager.degreeProgress}%; background: #3498db; height: 100%;"></div>
          </div>
          <p style="font-size: 0.85rem; color: #bdc3c7;">Fortschritt: ${eduManager.degreeProgress}%</p>
          <button class="btn-hud" id="btn-study-exam" style="margin-top: 8px;">📖 Für Vorlesung & Prüfung büffeln (+25%)</button>
        </div>
      `;
    } else {
      html += `
        <h3 style="color: #e67e22; margin-bottom: 10px;">🏛️ Universitäts-Einschreibung</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
      `;

      Object.values(DEGREE_PROGRAMS).forEach(degree => {
        html += `
          <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>${degree.icon} ${degree.name}</strong>
              <p style="font-size: 0.8rem; color: #bdc3c7; margin-top: 2px;">${degree.description}</p>
              <span style="color: #f1c40f; font-weight: bold; font-size: 0.85rem;">Gebühr: § ${degree.tuitionFee}</span>
            </div>
            <button class="btn-hud btn-enroll-degree" data-id="${degree.id}" style="background: #27ae60;">Einschreiben</button>
          </div>
        `;
      });

      html += `</div>`;
    }

    if (eduManager.completedDegrees.length > 0) {
      html += `
        <div style="margin-top: 16px;">
          <h4 style="color: #2ecc71;">🏆 Erlangte Abschlüsse:</h4>
          <ul style="margin-left: 20px; font-size: 0.85rem;">
            ${eduManager.completedDegrees.map(d => `<li>${DEGREE_PROGRAMS[d]?.name || d}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    content.innerHTML = html;

    document.getElementById('btn-do-homework')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const msg = eduManager.doHomework();
      ToastManager.showToast('📚 Hausaufgaben', msg, '📚', 'success');
      this.open(sim, eduManager, onUpdateSimoleons);
    });

    document.getElementById('btn-study-exam')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      const msg = eduManager.studyForExam();
      ToastManager.showToast('📖 Studium', msg, '🎓', 'info');
      this.open(sim, eduManager, onUpdateSimoleons);
    });

    document.querySelectorAll('.btn-enroll-degree').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.soundManager.playUIClick();
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id')!;
        const res = eduManager.enrollInUniversity(id, sim.simoleons);
        if (res.success) {
          onUpdateSimoleons(-res.cost);
          ToastManager.showToast('🎓 Universität', res.message, '🎓', 'success');
          this.open(sim, eduManager, onUpdateSimoleons);
        } else {
          ToastManager.showToast('⚠️ Warnung', res.message, '⚠️', 'warning');
        }
      });
    });
  }

  public close(): void {
    document.getElementById('modal-edu-backdrop')?.classList.remove('active');
  }
}
