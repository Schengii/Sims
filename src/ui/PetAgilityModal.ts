/**
 * Pet Agility Course & Tournament Modal UI
 * Allows Sims to train pets on hurdles, slalom poles, and tunnels, and participate in cups.
 */

import { PetAgilitySystem, AGILITY_CHAMPIONSHIPS } from '../systems/PetAgilitySystem';
import { PetManager } from '../entity/PetManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PetAgilityModal {
  private container: HTMLElement;
  private agilitySystem: PetAgilitySystem;
  private petManager: PetManager;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    agilitySystem: PetAgilitySystem,
    petManager: PetManager,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.agilitySystem = agilitySystem;
    this.petManager = petManager;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const activePet = this.petManager.pets[0];

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-pet-agility';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(20, 35, 30, 0.96); border: 1px solid rgba(16, 185, 129, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🐕</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #34d399;">Haustier-Agility Parcours & Turniere</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #a7f3d0;">
                Stufe: <b>${this.agilitySystem.agilitySkillLevel}/5</b> (XP: ${this.agilitySystem.agilityXP}/${this.agilitySystem.agilitySkillLevel * 100})
                | Pokale: ${this.agilitySystem.trophiesWon.join(' ') || 'Keine'}
              </p>
            </div>
          </div>
          <button id="close-agility-modal" style="background: transparent; border: none; font-size: 26px; color: #a7f3d0; cursor: pointer;">&times;</button>
        </div>

        <!-- Active Pet Overview -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 30px;">🐾</span>
            <div>
              <div style="font-size: 14px; font-weight: bold; color: #f8fafc;">Aktives Trainings-Haustier: ${activePet ? activePet.name : 'Kein Haustier'}</div>
              <div style="font-size: 11px; color: #94a3b8;">Rasse: ${activePet ? (activePet.species === 'dog' ? 'Hund' : 'Katze') : '-'}</div>
            </div>
          </div>
          <button id="train-agility-btn" ${!activePet ? 'disabled' : ''} style="
            background: linear-gradient(135deg, #10b981, #059669); border: none; color: white;
            padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;
          ">
            🏃 Parcours trainieren (+35 XP)
          </button>
        </div>

        <!-- Tournaments Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">🏆 An Meisterschaften & Turnieren teilnehmen:</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${AGILITY_CHAMPIONSHIPS.map(champ => {
            const canEnter = this.agilitySystem.agilitySkillLevel >= champ.minSkill;
            return `
              <div style="
                background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
              ">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span style="font-size: 28px;">${champ.trophy}</span>
                  <div>
                    <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${champ.title}</div>
                    <div style="font-size: 11px; color: #94a3b8;">Benötigt: Stufe ${champ.minSkill} | Preisgeld: <b style="color: #34d399;">§ ${champ.prizeMoney.toLocaleString()}</b></div>
                  </div>
                </div>

                <button class="enter-cup-btn" data-id="${champ.id}" ${!canEnter || !activePet ? 'disabled' : ''} style="
                  background: ${canEnter ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.1)'};
                  border: none; color: white; border-radius: 6px; padding: 8px 14px; font-weight: bold;
                  cursor: ${canEnter ? 'pointer' : 'not-allowed'};
                ">🥇 Antreten</button>
              </div>
            `;
          }).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-agility-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#train-agility-btn')?.addEventListener('click', () => {
      if (!activePet) return;
      const res = this.agilitySystem.trainPet(activePet, this.sim);
      this.soundManager.playBuySound();
      activePet.triggerEmote('🏃', 3500);
      this.toastManager.showToast('🏃 Agility-Training', res.message, '✨', 'success');
      this.open();
    });

    backdrop.querySelectorAll('.enter-cup-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!activePet) return;
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id') as any;
        const res = this.agilitySystem.enterTournament(id, activePet, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🏆 Turniersieg', res.message, '🌟', 'levelUp');
          this.open();
        } else {
          this.toastManager.showToast('⚠️ Turnier', res.message, 'ℹ️', 'warning');
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-pet-agility');
    if (existing) existing.remove();
  }
}
