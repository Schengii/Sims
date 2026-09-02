/**
 * Pet Nursery, Breeding & Offspring Genetics System
 * Allows household pets to mate, nest, give birth to puppies & kittens with inherited fur colors and traits,
 * and nurture offspring in the nursery nest.
 */

import { PetManager } from '../entity/PetManager';
import { Pet } from '../entity/Pet';
import { Sim } from '../entity/Sim';

export interface PetOffspring {
  id: string;
  name: string;
  species: 'dog' | 'cat';
  breed: string;
  coatColor: string;
  trait: string;
  birthDay: number;
  stage: 'puppy' | 'kitten' | 'adult';
}

export class PetNurserySystem {
  public litters: PetOffspring[] = [];
  public isExpecting: boolean = false;
  public expectedSpecies: 'dog' | 'cat' = 'dog';
  public parentNames: [string, string] = ['', ''];

  public startBreeding(parent1: Pet, parent2: Pet, sim: Sim): { success: boolean; message: string } {
    if (parent1.species !== parent2.species) {
      return { success: false, message: 'Nur Tiere derselben Art können Nachwuchs zeugen!' };
    }
    if (this.isExpecting) {
      return { success: false, message: 'Es wird bereits Nachwuchs im Haustier-Nest erwartet!' };
    }

    this.isExpecting = true;
    this.expectedSpecies = parent1.species;
    this.parentNames = [parent1.name, parent2.name];

    sim.needs.modify('social', 20);
    sim.needs.modify('fun', 20);

    return {
      success: true,
      message: `${parent1.name} und ${parent2.name} erwarten Nachwuchs im Haustiernest!`
    };
  }

  public deliverOffspring(petManager: PetManager, name: string, currentDay: number): PetOffspring | null {
    if (!this.isExpecting) return null;

    const coatColors = this.expectedSpecies === 'dog' ? ['#d97706', '#f59e0b', '#78350f', '#e2e8f0'] : ['#f8fafc', '#1e293b', '#fb923c', '#94a3b8'];
    const chosenColor = coatColors[Math.floor(Math.random() * coatColors.length)];
    const traitList = ['Verspielt & Neugierig', 'Verschmust & Sanft', 'Wild & Energetisch', 'Gelehrig & Treu'];
    const chosenTrait = traitList[Math.floor(Math.random() * traitList.length)];

    const offspring: PetOffspring = {
      id: `baby_pet_${Date.now()}`,
      name,
      species: this.expectedSpecies,
      breed: `${this.parentNames[0]} & ${this.parentNames[1]} Mischling`,
      coatColor: chosenColor,
      trait: chosenTrait,
      birthDay: currentDay,
      stage: this.expectedSpecies === 'dog' ? 'puppy' : 'kitten'
    };

    this.litters.push(offspring);
    this.isExpecting = false;

    // Add new puppy/kitten entity to PetManager
    const newPet = petManager.addPet(
      name,
      this.expectedSpecies,
      chosenColor
    );
    newPet.needs.affection = 100;

    return offspring;
  }

  public exportData(): Record<string, any> {
    return {
      litters: this.litters,
      isExpecting: this.isExpecting,
      expectedSpecies: this.expectedSpecies,
      parentNames: this.parentNames
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.litters) this.litters = data.litters;
    if (data.isExpecting !== undefined) this.isExpecting = data.isExpecting;
    if (data.expectedSpecies) this.expectedSpecies = data.expectedSpecies;
    if (data.parentNames) this.parentNames = data.parentNames;
  }
}
