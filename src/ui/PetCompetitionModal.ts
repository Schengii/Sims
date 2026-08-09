/**
 * Pet Show & Agility Competition Modal
 * Enter household dogs and cats into agility contests for trophies and Simoleon rewards.
 */

import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PetCompetitionModal {
  private container: HTMLDivElement | null = null;

  public open(pet: Pet, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(pet, sim, toastManager, soundManager);
      this.container.style.display = 'flex';
    }
  }

  public close(): void {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.className = 'glass-modal-overlay';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.id = 'pet-comp-modal-content';
    content.style.cssText = `
      width: 440px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(pet: Pet, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#pet-comp-modal-content');
    if (!content) return;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #f59e0b;">🏆 Jährliche Pet Agility Show</h3>
        <button id="pet-comp-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
        <span style="font-size: 32px;">${pet.species === 'dog' ? '🐕' : '🐈'}</span>
        <div>
          <div style="font-weight: bold; font-size: 15px;">${pet.name}</div>
          <div style="font-size: 12px; color: #38bdf8;">Trick-Skill: Stufe ${pet.trickSkillLevel} / 5</div>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button id="btn-train-trick" style="padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          🦴 Kunststücke trainieren (+35 XP)
        </button>

        <button id="btn-enter-show" style="padding: 12px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">
          🏆 An Wettbewerb teilnehmen (Gebühr § 50)
        </button>
      </div>
    `;

    content.querySelector('#pet-comp-close')?.addEventListener('click', () => this.close());

    content.querySelector('#btn-train-trick')?.addEventListener('click', () => {
      const leveledUp = pet.addTrickXP(35);
      soundManager.playUIClick();
      pet.triggerEmote('🦴', 3000);
      if (leveledUp) {
        soundManager.playLevelUp();
        toastManager.showToast('✨ SKILL UP!', `${pet.name} beherrscht Kunststücke jetzt auf Stufe ${pet.trickSkillLevel}!`, '🦴', 'levelUp');
      } else {
        toastManager.showToast('Haustier-Training', `${pet.name} hat fleißig trainiert! (+35 Trick XP)`, '🦴', 'info');
      }
      this.renderContent(pet, sim, toastManager, soundManager);
    });

    content.querySelector('#btn-enter-show')?.addEventListener('click', () => {
      if (sim.simoleons < 50) {
        toastManager.showToast('Wettbewerb', 'Nicht genügend Simoleons (§ 50 Teilnahmegebühr)!', '❌', 'warning');
        return;
      }

      sim.simoleons -= 50;
      const score = pet.trickSkillLevel * 20 + Math.floor(Math.random() * 20);

      if (score >= 60) {
        const reward = pet.trickSkillLevel * 400;
        sim.simoleons += reward;
        soundManager.playLevelUp();
        toastManager.showToast('🏆 1. PLATZ GEWONNEN!', `${pet.name} holt den Goldpokal & § ${reward} Preisgeld!`, '🥇', 'levelUp');
      } else {
        sim.simoleons += 100;
        toastManager.showToast('🎖️ Ehrenpreis!', `${pet.name} belegt Platz 2 und gewinnt § 100!`, '🥈', 'success');
      }

      this.close();
    });
  }
}
