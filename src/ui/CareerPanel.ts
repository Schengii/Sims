/**
 * Career & Daily Quests Panel UI
 * Displays active job, salary, skill meters, and Sims Mobile daily quests with rewards.
 */

import { Sim } from '../entity/Sim';
import { CareerManager } from '../systems/CareerSystem';
import { QuestManager } from '../systems/QuestSystem';
import { SoundManager } from '../audio/SoundManager';

export class CareerPanel {
  private container: HTMLElement;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-career-backdrop" role="dialog" aria-modal="true" aria-labelledby="career-title">
        <div class="modal-dialog glass-panel" style="max-width: 650px;">
          <div class="modal-header">
            <h2 id="career-title">💼 Karriere & Quests</h2>
            <button class="btn-close" id="career-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 18px;">
            <!-- Active Career Overview -->
            <div class="glass-panel" style="padding: 16px; background: rgba(0,229,255,0.06);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3 id="career-name" style="font-family: var(--font-heading);">Karriere: Tech Guru</h3>
                <span id="career-salary" style="color: var(--simoleon-green); font-weight: 700;">Gehalt: § 180 / Tag</span>
              </div>
              <p id="career-level-title" style="color: var(--text-muted); font-size: 0.9rem;">Aktuelle Position: QA Tester (Rang 1)</p>
              <button class="btn-hud" id="btn-claim-salary" style="margin-top: 10px; width: 100%; justify-content: center;">
                💵 Tagesgehalt abholen (§)
              </button>
            </div>

            <!-- Skills Progress -->
            <div>
              <h4 style="font-family: var(--font-heading); margin-bottom: 10px;">Fähigkeiten (Skills)</h4>
              <div id="skills-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <!-- Populated dynamically -->
              </div>
            </div>

            <!-- Sims Mobile Daily Quests -->
            <div>
              <h4 style="font-family: var(--font-heading); margin-bottom: 10px;">Tägliche Quests (Sims Mobile)</h4>
              <div id="quests-list" style="display: flex; flex-direction: column; gap: 8px;">
                <!-- Populated dynamically -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public open(sim: Sim, career: CareerManager, questManager: QuestManager): void {
    const backdrop = document.getElementById('modal-career-backdrop');
    if (!backdrop) return;

    // Populate career info
    const info = career.getCareerInfo();
    const nameEl = document.getElementById('career-name');
    if (nameEl) nameEl.innerText = `${info.icon} ${info.careerTitle}`;

    const salaryEl = document.getElementById('career-salary');
    if (salaryEl) salaryEl.innerText = `Gehalt: § ${info.salary} / Tag`;

    const levelEl = document.getElementById('career-level-title');
    if (levelEl) levelEl.innerText = `Aktuelle Position: ${info.jobTitle} (Rang ${career.currentRank})`;

    // Claim salary button
    const claimBtn = document.getElementById('btn-claim-salary');
    if (claimBtn) {
      claimBtn.onclick = () => {
        const earned = career.payoutDailySalary(sim);
        this.soundManager.playBuySound();
        alert(`🎉 Tagesgehalt abgeholt! Du hast § ${earned} erhalten.`);
        this.open(sim, career, questManager);
      };
    }

    // Populate skills
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = Object.entries(sim.skills).map(([skill, val]) => `
        <div class="glass-panel" style="padding: 8px 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
            <span style="text-transform: capitalize;">${skill}</span>
            <span>Stufe ${Math.floor(val)}</span>
          </div>
          <div class="need-progress-bg" style="width: 100%;">
            <div class="need-progress-fill" style="width: ${(val % 1) * 100}%; background: var(--primary-accent);"></div>
          </div>
        </div>
      `).join('');
    }

    // Populate Quests
    const questsList = document.getElementById('quests-list');
    if (questsList) {
      const quests = questManager.getQuests();
      questsList.innerHTML = quests.map(q => `
        <div class="glass-panel" style="padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; background: ${q.completed ? 'rgba(46,204,113,0.1)' : 'rgba(255,255,255,0.04)'};">
          <div>
            <h5 style="font-family: var(--font-heading);">${q.title}</h5>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${q.description}</p>
          </div>
          <div style="text-align: right;">
            <span style="color: var(--simoleon-green); font-weight: 700; font-size: 0.9rem;">+ § ${q.rewardSimoleons}</span>
            <div style="font-size: 0.75rem; color: ${q.completed ? 'var(--simoleon-green)' : 'var(--text-muted)'}; margin-top: 2px;">
              ${q.completed ? '✅ Erledigt' : 'Offen'}
            </div>
          </div>
        </div>
      `).join('');
    }

    backdrop.classList.add('active');
    document.getElementById('career-btn-close')?.addEventListener('click', () => this.close());
  }

  public close(): void {
    const backdrop = document.getElementById('modal-career-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
