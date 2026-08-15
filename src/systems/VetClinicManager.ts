/**
 * Pet Veterinary & Clinic System
 * Simulates Pet illnesses (Fleas 🪲, Cold Nose 🐶, Hairball 🐱, Tired Paw 🐾),
 * treatments (Flea Bath, Vet Health Checkup, Deworming Injection),
 * and Veterinary Clinic Management.
 */

import type { Pet } from '../entity/Pet';
import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export type PetAilmentType = 'none' | 'fleas' | 'cold_nose' | 'hairball' | 'tired_paw';

export interface PetAilmentInfo {
  type: PetAilmentType;
  name: string;
  icon: string;
  description: string;
  remedyHint: string;
  treatmentCost: number;
}

export const PET_AILMENT_CATALOG: Record<PetAilmentType, PetAilmentInfo> = {
  none: {
    type: 'none',
    name: 'Gesund & Vital',
    icon: '🐾',
    description: 'Das Haustier ist putzmunter und voller Spielfreude.',
    remedyHint: 'Regelmäßiges Streicheln & Gassi gehen halten fit!',
    treatmentCost: 0
  },
  fleas: {
    type: 'fleas',
    name: 'Flöhe & Juckreiz',
    icon: '🪲',
    description: 'Unangenehmes Kratzen und Unruhe durch Fellparasiten.',
    remedyHint: 'Anti-Floh Spezialbad in der Wanne oder Tierarzt-Kur',
    treatmentCost: 120
  },
  cold_nose: {
    type: 'cold_nose',
    name: 'Schnupfen-Nase',
    icon: '🤧',
    description: 'Triefende Nase und reduzierter Spieltrieb.',
    remedyHint: 'Tierarzt-Vitaminspritze & warme Decke',
    treatmentCost: 150
  },
  hairball: {
    type: 'hairball',
    name: 'Magen-Haarballen',
    icon: '🐱',
    description: 'Typisch bei Katzen: Unwohlsein nach der Fellpflege.',
    remedyHint: 'Katzengras-Paste oder Tierarzt-Check',
    treatmentCost: 90
  },
  tired_paw: {
    type: 'tired_paw',
    name: 'Verstauchte Pfote',
    icon: '🩹',
    description: 'Hinken nach zu viel Agility-Training oder wildem Toben.',
    remedyHint: 'Pfoten-Salbe & Ruhepause im Haustierbett',
    treatmentCost: 180
  }
};

export class VetClinicManager {
  public petAilments: Record<string, PetAilmentType> = {};
  public vetReputation: number = 100; // 0 - 500 XP

  public getPetAilment(petId: string): PetAilmentType {
    return this.petAilments[petId] || 'none';
  }

  public setPetAilment(petId: string, ailment: PetAilmentType): void {
    this.petAilments[petId] = ailment;
  }

  public update(pets: Pet[]): void {
    // Random chance to catch an ailment if pet has low affection / energy
    pets.forEach(pet => {
      const current = this.getPetAilment(pet.id);
      if (current === 'none' && Math.random() < 0.002) {
        const list: PetAilmentType[] = pet.species === 'dog' ? ['fleas', 'cold_nose', 'tired_paw'] : ['fleas', 'hairball'];
        const picked = list[Math.floor(Math.random() * list.length)];
        this.setPetAilment(pet.id, picked);
        pet.triggerEmote(PET_AILMENT_CATALOG[picked].icon, 4000);

        EventBus.getInstance().emit('TOAST_TRIGGER', {
          title: `Tierklinik: ${pet.name}`,
          message: `${pet.name} hat Beschwerden: ${PET_AILMENT_CATALOG[picked].name}!`,
          icon: PET_AILMENT_CATALOG[picked].icon,
          type: 'warning'
        });
      }
    });
  }

  public treatPet(pet: Pet, sim: Sim): { success: boolean; message: string } {
    const ailment = this.getPetAilment(pet.id);
    if (ailment === 'none') {
      return { success: false, message: `${pet.name} ist kerngesund und benötigt keine Behandlung!` };
    }

    const info = PET_AILMENT_CATALOG[ailment];
    if (sim.simoleons < info.treatmentCost) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${info.treatmentCost} erforderlich)!` };
    }

    sim.simoleons -= info.treatmentCost;
    this.setPetAilment(pet.id, 'none');
    pet.needs.affection = 100;
    pet.triggerEmote('💖', 4000);

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🩺 Tierarzt-Behandlung erfolgreich',
      message: `${pet.name} wurde von "${info.name}" geheilt! (-§ ${info.treatmentCost})`,
      icon: '🐾',
      type: 'success'
    });

    return { success: true, message: `${pet.name} wurde erfolgreich behandelt und fühlt sich wieder pudelwohl!` };
  }

  public giveFleaBath(pet: Pet, _sim?: Sim): { success: boolean; message: string } {
    const ailment = this.getPetAilment(pet.id);
    if (ailment === 'fleas') {
      this.setPetAilment(pet.id, 'none');
      pet.needs.affection = Math.min(100, pet.needs.affection + 20);
      pet.triggerEmote('🧼', 3500);
      return { success: true, message: `Anti-Floh-Bad in der Wanne war erfolgreich! ${pet.name} ist flohfrei.` };
    }
    return { success: true, message: `${pet.name} wurde gründlich gewaschen und riecht herrlich frisch!` };
  }
}
