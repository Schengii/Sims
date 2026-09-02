/**
 * City Council & Neighborhood Ecosystem Modal
 * Allows players to inspect their city district, view eco & safety metrics, and vote on weekly town policies.
 */

import { CityEcoSystem } from '../systems/CityEcoSystem';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class CityCouncilModal {
  private container: HTMLElement;
  private citySystem: CityEcoSystem;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    citySystem: CityEcoSystem,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.citySystem = citySystem;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-city-council';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const district = this.citySystem.getActiveDistrict();

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(56, 189, 248, 0.3); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 28px;">🏛️</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Stadtverwaltung & Nachbarschafts-Rat</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Ökosystem, Viertel-Statistiken & Bürger-Abstimmungen</p>
            </div>
          </div>
          <button id="close-city-modal" style="background: transparent; border: none; font-size: 24px; color: #94a3b8; cursor: pointer;">&times;</button>
        </div>

        <!-- District Selector -->
        <div style="display: flex; gap: 10px; margin-bottom: 20px;">
          ${Object.values(this.citySystem.districts).map(d => `
            <button class="district-btn" data-id="${d.id}" style="
              flex: 1; padding: 10px; border-radius: 10px; cursor: pointer;
              background: ${d.id === district.id ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(15, 23, 42, 0.6)'};
              border: 1px solid ${d.id === district.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'};
              color: white; display: flex; flex-direction: column; align-items: center; gap: 4px;
            ">
              <span style="font-size: 20px;">${d.icon}</span>
              <span style="font-weight: bold; font-size: 13px;">${d.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Active District Metrics Card -->
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h3 style="margin: 0; color: #f8fafc; font-size: 16px;">${district.icon} ${district.name}</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #94a3b8;">${district.description}</p>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; color: #94a3b8;">Immobilien-Index</span>
              <div style="font-size: 16px; font-weight: bold; color: #34d399;">§ ${district.averagePropertyValue.toLocaleString()}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 14px;">
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">🌱 Öko-Fußabdruck</div>
              <div style="font-size: 15px; font-weight: bold; color: ${district.ecoFootprint > 50 ? '#4ade80' : '#f87171'};">${district.ecoFootprint > 0 ? '+' : ''}${district.ecoFootprint}% ${district.ecoFootprint > 50 ? 'Grün' : 'Industriell'}</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">🛡️ Sicherheits-Index</div>
              <div style="font-size: 15px; font-weight: bold; color: #38bdf8;">${district.safetyScore} / 100</div>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center;">
              <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">⭐ Zufriedenheit</div>
              <div style="font-size: 15px; font-weight: bold; color: #fbbf24;">${district.happinessIndex} %</div>
            </div>
          </div>
        </div>

        <!-- Weekly Policies & Ballots -->
        <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #e2e8f0;">📜 Aktive Stadtverordnungen & Bürgerabstimmungen</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${this.citySystem.policies.map(p => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid ${p.isActive ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255,255,255,0.08)'};
              border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">${p.icon}</span>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: bold; font-size: 14px; color: #f8fafc;">${p.title}</span>
                    ${p.isActive ? '<span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">AKTIV</span>' : ''}
                  </div>
                  <p style="margin: 3px 0 0 0; font-size: 12px; color: #94a3b8;">${p.description}</p>
                  <span style="font-size: 11px; color: #34d399; font-weight: 500;">Effekt: ${p.effectDescription}</span>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 12px; color: #94a3b8;">🗳️ ${p.votes} Stimmen</span>
                <button class="vote-policy-btn" data-id="${p.id}" style="
                  background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8;
                  color: white; border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer;
                ">Stimme abgeben</button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    // Event listeners
    backdrop.querySelector('#close-city-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.district-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') as any;
        this.citySystem.setDistrict(id);
        this.soundManager.playUIClick();
        this.open();
      });
    });

    backdrop.querySelectorAll('.vote-policy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') || '';
        if (this.citySystem.castVote(id)) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🗳️ Stimme gezählt', 'Deine Stimme für die Stadtverordnung wurde gewertet!', '🏛️', 'success');
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-city-council');
    if (existing) existing.remove();
  }
}
