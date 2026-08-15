/**
 * Veterinary Clinic UI Modal
 * Displays Pet health status, diagnoses fleas/cold/ailments, and performs vet treatments.
 */

import { VetClinicManager, PET_AILMENT_CATALOG } from '../systems/VetClinicManager';
import type { Pet } from '../entity/Pet';
import type { Sim } from '../entity/Sim';
import { SoundManager } from '../audio/SoundManager';
import type { ToastManager } from './ToastManager';

export class VetClinicModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;
  private soundManager: SoundManager;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
  }

  public open(vetManager: VetClinicManager, pets: Pet[], sim: Sim, toastManager?: ToastManager): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'vet-clinic-modal';

    modal.innerHTML = `
      <div class="modal-card glassmorphism-card" style="max-width: 640px; width: 90%;">
        <div class="modal-header">
          <h2>🐾 Tierklinik & Haustier-Gesundheit</h2>
          <button class="close-btn" id="close-vet-modal">&times;</button>
        </div>

        <p style="color: #bdc3c7; font-size: 13px; margin-top: -6px;">
          Untersuche deine Haustiere auf Flöhe, Erkältungen und Verletzungen. Professionelle Behandlungen stellen Zuneigung & Wohlbefinden wieder her!
        </p>

        <div style="display: flex; flex-direction: column; gap: 14px; max-height: 380px; overflow-y: auto;">
          ${pets.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: #bdc3c7;">
              🐕 Du hast aktuell keine Haustiere im Haushalt. Adoptiere ein Haustier im Tierheim!
            </div>
          ` : pets.map(pet => {
            const ailment = vetManager.getPetAilment(pet.id);
            const info = PET_AILMENT_CATALOG[ailment];
            const isSick = ailment !== 'none';

            return `
              <div class="glass-panel" style="padding: 14px; border: 2px solid ${isSick ? '#e74c3c' : '#2ecc71'}; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 32px; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 10px;">
                    ${pet.species === 'dog' ? '🐕' : '🐈'}
                  </span>
                  <div>
                    <h4 style="margin: 0; color: #ffffff;">${pet.name} (${pet.species === 'dog' ? 'Hund' : 'Katze'})</h4>
                    <div style="font-size: 12px; color: ${isSick ? '#e74c3c' : '#2ecc71'}; font-weight: bold; margin-top: 2px;">
                      ${info.icon} ${info.name}
                    </div>
                    <div style="font-size: 11px; color: #bdc3c7; margin-top: 2px;">${info.description}</div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px;">
                  <button class="hud-btn btn-flea-bath" data-id="${pet.id}" style="font-size: 12px; background: #3498db;">
                    🧼 Flohbad
                  </button>
                  <button class="hud-btn btn-treat-pet" data-id="${pet.id}" ${isSick ? '' : 'disabled'} style="font-size: 12px; background: ${isSick ? '#27ae60' : '#7f8c8d'};">
                    💊 ${isSick ? `Behandeln (§ ${info.treatmentCost})` : 'Gesund'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button class="hud-btn" id="close-vet-bottom">Schließen</button>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('#close-vet-modal')?.addEventListener('click', () => this.close());
    modal.querySelector('#close-vet-bottom')?.addEventListener('click', () => this.close());

    modal.querySelectorAll('.btn-treat-pet').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const petId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const pet = pets.find(p => p.id === petId);
        if (pet) {
          const res = vetManager.treatPet(pet, sim);
          if (res.success) {
            this.soundManager.playLevelUp();
            toastManager?.showToast('🐾 Tierklinik', res.message, '💉', 'levelUp');
            this.open(vetManager, pets, sim, toastManager); // Refresh UI
          } else {
            toastManager?.showToast('⚠️ Tierklinik', res.message, '🪙', 'warning');
          }
        }
      });
    });

    modal.querySelectorAll('.btn-flea-bath').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const petId = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const pet = pets.find(p => p.id === petId);
        if (pet) {
          const res = vetManager.giveFleaBath(pet, sim);
          this.soundManager.playUIClick();
          toastManager?.showToast('🧼 Floh-Spezialbad', res.message, '🛁', 'success');
          this.open(vetManager, pets, sim, toastManager); // Refresh UI
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
