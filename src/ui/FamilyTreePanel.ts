/**
 * Family Tree Panel UI
 * Displays household family hierarchy (Sim, Partner, Children), active life stages, and age progress.
 */

import { Sim } from '../entity/Sim';
import { LifeStage } from '../entity/LifeStage';
import { Sanitizer } from '../security/Sanitizer';

export class FamilyTreePanel {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-family-backdrop" role="dialog" aria-modal="true" aria-labelledby="family-title">
        <div class="modal-dialog glass-panel" style="max-width: 650px;">
          <div class="modal-header">
            <h2 id="family-title">👨‍👩‍👧‍👦 Familienstammbaum & Lebensphasen</h2>
            <button class="btn-close" id="family-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;" id="family-tree-content">
            <!-- Dynamically populated -->
          </div>
        </div>
      </div>
    `;
  }

  public open(sim: Sim): void {
    const backdrop = document.getElementById('modal-family-backdrop');
    const content = document.getElementById('family-tree-content');
    if (!backdrop || !content) return;

    const currentStageInfo = LifeStage.getInfo(sim.lifeStage);

    content.innerHTML = `
      <!-- Active Sim Card -->
      <div class="glass-panel" style="padding: 16px; background: rgba(0, 229, 255, 0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem;">
            ${currentStageInfo.icon} ${Sanitizer.sanitizeText(sim.customization.name, 24)}
          </h3>
          <span style="font-family: var(--font-heading); font-weight: 700; color: var(--primary-accent);">
            Lebensphase: ${currentStageInfo.label}
          </span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">
          Eigenschaft: ${sim.customization.trait} | Lebensziel: ${sim.customization.aspiration}
        </p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
          Alterungsfortschritt: Tag ${sim.ageDays} von ${currentStageInfo.daysInStage}
        </div>
        <div class="need-progress-bg" style="width: 100%; height: 8px;">
          <div class="need-progress-fill" style="width: ${Math.min(100, (sim.ageDays / currentStageInfo.daysInStage) * 100)}%; background: var(--primary-accent);"></div>
        </div>
      </div>

      <!-- Partner Section -->
      <div class="glass-panel" style="padding: 14px;">
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">💍 Lebenspartner(in)</h4>
        <p style="font-size: 0.9rem; color: ${sim.partnerName ? 'var(--text-main)' : 'var(--text-muted)'};">
          ${sim.partnerName ? `❤️ ${Sanitizer.sanitizeText(sim.partnerName, 24)}` : 'Noch keinen festen Lebenspartner gefunden.'}
        </p>
      </div>

      <!-- Children Section -->
      <div class="glass-panel" style="padding: 14px;">
        <h4 style="font-family: var(--font-heading); margin-bottom: 6px;">👶 Kinder & Nachkommen</h4>
        ${sim.childrenNames.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${sim.childrenNames.map(childName => `
              <div style="padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 6px; font-size: 0.9rem;">
                🍼 ${Sanitizer.sanitizeText(childName, 24)} (Säugling)
              </div>
            `).join('')}
          </div>
        ` : `
          <p style="font-size: 0.9rem; color: var(--text-muted);">Noch keine Kinder in der Familie.</p>
        `}
      </div>
    `;

    backdrop.classList.add('active');
    document.getElementById('family-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-family-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
