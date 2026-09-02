/**
 * Pet Nursery & Offspring Modal UI
 * Allows players to breed pets in the nursery nest, manage expected litters, and welcome newborn puppies & kittens.
 */

import { PetNurserySystem } from '../systems/PetNurserySystem';
import { PetManager } from '../entity/PetManager';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PetNurseryModal {
  private container: HTMLElement;
  private nurserySystem: PetNurserySystem;
  private petManager: PetManager;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    nurserySystem: PetNurserySystem,
    petManager: PetManager,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.nurserySystem = nurserySystem;
    this.petManager = petManager;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(currentDay: number = 1): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-pet-nursery';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const adultPets = this.petManager.pets;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 680px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.96); border: 1px solid rgba(244, 63, 94, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🍼</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #f43f5e;">Haustier-Kinderstube & Welpen-Nest</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fecdd3;">Nachwuchs züchten, Genetik vererben & Welpen/Kätzchen umsorgen</p>
            </div>
          </div>
          <button id="close-nursery-modal" style="background: transparent; border: none; font-size: 26px; color: #fecdd3; cursor: pointer;">&times;</button>
        </div>

        <!-- Nursery Status -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #f43f5e;">🐾 Nest-Status:</h3>
          ${this.nurserySystem.isExpecting ? `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 14px; font-weight: bold; color: #fecdd3;">🎉 Nachwuchs ist im Anmarsch!</div>
                <div style="font-size: 12px; color: #94a3b8;">Eltern: ${this.nurserySystem.parentNames[0]} & ${this.nurserySystem.parentNames[1]}</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="baby-pet-name" value="Teddy" style="padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(0,0,0,0.4); color: white; font-size: 12px;" />
                <button id="deliver-baby-btn" style="background: linear-gradient(135deg, #f43f5e, #e11d48); border: none; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">🐣 Geburt einleiten!</button>
              </div>
            </div>
          ` : `
            <p style="margin: 0; font-size: 13px; color: #cbd5e1;">Das Haustiernest ist aktuell bereit für eine Verpaarung.</p>
          `}
        </div>

        <!-- Breeding Selection -->
        ${!this.nurserySystem.isExpecting ? `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">💕 Eltern-Haustiere auswählen (Mindestens 2 Haustiere im Haushalt erforderlich):</h3>
            ${adultPets.length >= 2 ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div>
                  <label style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">Elterntier 1:</label>
                  <select id="parent-pet-1" style="width: 100%; padding: 8px; border-radius: 6px; background: rgba(0,0,0,0.4); color: white; border: 1px solid rgba(255,255,255,0.2);">
                    ${adultPets.map(p => `<option value="${p.id}">${p.species === 'dog' ? '🐶' : '🐱'} ${p.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px;">Elterntier 2:</label>
                  <select id="parent-pet-2" style="width: 100%; padding: 8px; border-radius: 6px; background: rgba(0,0,0,0.4); color: white; border: 1px solid rgba(255,255,255,0.2);">
                    ${adultPets.map((p, idx) => `<option value="${p.id}" ${idx === 1 ? 'selected' : ''}>${p.species === 'dog' ? '🐶' : '🐱'} ${p.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              <button id="start-breeding-btn" style="width: 100%; background: linear-gradient(135deg, #f43f5e, #e11d48); border: none; color: white; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                🐾 Verpaarung im Haustiernest starten
              </button>
            ` : `
              <p style="margin: 0; font-size: 12px; color: #f87171;">⚠️ Du benötigst mindestens 2 Haustiere im Haushalt, um Nachwuchs zu züchten!</p>
            `}
          </div>
        ` : ''}

        <!-- Litter History -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">🐾 Stammbaum & Bisheriger Nachwuchs:</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${this.nurserySystem.litters.length > 0 ? this.nurserySystem.litters.map(litter => `
            <div style="background: rgba(15, 23, 42, 0.6); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 22px;">${litter.species === 'dog' ? '🐶' : '🐱'}</span>
                <div>
                  <div style="font-weight: bold; font-size: 13px; color: #fecdd3;">${litter.name} (${litter.stage === 'puppy' ? 'Welpe' : 'Kätzchen'})</div>
                  <div style="font-size: 11px; color: #94a3b8;">${litter.breed} | Merkmal: ${litter.trait}</div>
                </div>
              </div>
              <span style="background: rgba(244, 63, 94, 0.2); color: #f43f5e; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold;">GEBOREN TAG ${litter.birthDay}</span>
            </div>
          `).join('') : `
            <div style="font-size: 12px; color: #94a3b8; text-align: center; padding: 12px;">Noch kein Nachwuchs in diesem Haushalt geboren.</div>
          `}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-nursery-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#start-breeding-btn')?.addEventListener('click', () => {
      const p1Id = (backdrop.querySelector('#parent-pet-1') as HTMLSelectElement)?.value;
      const p2Id = (backdrop.querySelector('#parent-pet-2') as HTMLSelectElement)?.value;
      const p1 = this.petManager.pets.find(p => p.id === p1Id);
      const p2 = this.petManager.pets.find(p => p.id === p2Id);

      if (p1 && p2 && p1Id !== p2Id) {
        const res = this.nurserySystem.startBreeding(p1, p2, this.sim);
        if (res.success) {
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🐾 Verpaarung geglückt', res.message, '💖', 'success');
          this.open(currentDay);
        } else {
          this.toastManager.showToast('⚠️ Fehler', res.message, 'ℹ️', 'warning');
        }
      } else {
        this.toastManager.showToast('⚠️ Ungültige Auswahl', 'Wähle zwei unterschiedliche Tiere aus!', '🐕', 'warning');
      }
    });

    backdrop.querySelector('#deliver-baby-btn')?.addEventListener('click', () => {
      const babyName = (backdrop.querySelector('#baby-pet-name') as HTMLInputElement)?.value || 'Neuzugang';
      const baby = this.nurserySystem.deliverOffspring(this.petManager, babyName, currentDay);
      if (baby) {
        this.soundManager.playLevelUp();
        this.toastManager.showToast('🎉 WELPEN-GEBURT!', `${baby.name} wurde im Haustiernest geboren! Herzlichen Glückwunsch!`, '🍼', 'levelUp');
        this.open(currentDay);
      }
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-pet-nursery');
    if (existing) existing.remove();
  }
}
