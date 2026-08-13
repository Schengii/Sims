/**
 * Pet Breeding, Nursery & Adoption Shelter Modal
 * Manage pet breeding, care for puppies/kittens, and adopt rescue animals.
 */

import { PetBreedingSystem } from '../systems/PetBreedingSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';
import { PetManager } from '../entity/PetManager';

export class PetShelterModal {
  private container: HTMLDivElement | null = null;

  public open(breedingSystem: PetBreedingSystem, petManager: PetManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(breedingSystem, petManager, sim, toastManager, soundManager);
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
    content.id = 'pet-shelter-modal-content';
    content.style.cssText = `
      width: 540px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      border-radius: 20px;
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

  private renderContent(breedingSystem: PetBreedingSystem, petManager: PetManager, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#pet-shelter-modal-content');
    if (!content) return;

    const shelterPets = breedingSystem.getShelterPets();
    const gestation = breedingSystem.getGestationStatus();
    const housePets = petManager.pets;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🐾 Tierheim & Haustier-Zucht
        </h2>
        <button id="shelter-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <span>Guthaben: <strong style="color: #4ade80;">§${sim.simoleons.toLocaleString()}</strong></span>
        <span>Eigene Haustiere: <strong>${housePets.length}</strong></span>
      </div>

      ${gestation.isGestationActive ? `
        <div style="background: rgba(236, 72, 153, 0.15); border: 1px solid #ec4899; border-radius: 12px; padding: 12px;">
          <div style="font-weight: bold; color: #f472b6; font-size: 0.95rem;">🐾 Trächtigkeit im Gange!</div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 2px;">Eltern: ${gestation.parents[0]} & ${gestation.parents[1]}</div>
          <div style="width: 100%; background: rgba(255,255,255,0.1); border-radius: 6px; height: 10px; margin-top: 8px; overflow: hidden;">
            <div style="width: ${gestation.progress}%; background: #ec4899; height: 100%;"></div>
          </div>
        </div>
      ` : `
        ${housePets.length >= 2 ? `
          <div style="background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 12px; text-align: center;">
            <button id="start-breeding-btn" style="background: linear-gradient(135deg, #ec4899, #db2777); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer;">
              💕 Haustier-Zucht veranlassen
            </button>
          </div>
        ` : ''}
      `}

      <div style="font-weight: bold; font-size: 0.95rem; margin-top: 4px;">Tiere zur Adoption:</div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${shelterPets.map(p => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.95rem;">${p.name} (${p.species})</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Rasse: ${p.breed} | Alter: ${p.age} | Merkmal: ${p.trait}
              </div>
            </div>
            <div>
              <button class="adopt-pet-btn" data-id="${p.id}" style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Adoptieren (§${p.adoptionFee})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#shelter-close-btn')?.addEventListener('click', () => this.close());

    content.querySelector('#start-breeding-btn')?.addEventListener('click', () => {
      if (housePets.length >= 2) {
        const res = breedingSystem.startBreeding(housePets[0].name, housePets[1].name);
        if (res.success) {
          soundManager.playUIClick();
          toastManager.showToast(res.message, 'success');
          this.renderContent(breedingSystem, petManager, sim, toastManager, soundManager);
        }
      }
    });

    content.querySelectorAll('.adopt-pet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = breedingSystem.adoptShelterPet(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.fee;
            if (res.pet) {
              petManager.addPet(res.pet.name, res.pet.species.includes('Hund') ? 'dog' : 'cat', res.pet.coatColor);
            }
            soundManager.playLevelUp();
            toastManager.showToast(res.message, 'success');
            this.renderContent(breedingSystem, petManager, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
