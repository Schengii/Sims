/**
 * Pet Manager Class
 * Manages active pets in the household.
 */

import { Pet, type PetSpecies } from './Pet';

export class PetManager {
  public pets: Pet[] = [];

  constructor() {
    this.initDefaultPets();
  }

  private initDefaultPets(): void {
    // Default starter pet: Golden Retriever Dog "Bello"
    const bello = new Pet('Bello', 'dog', '#e67e22');
    bello.gridPos = { x: 7, y: 6 };
    bello.renderPos = { x: 7, y: 6 };
    this.pets.push(bello);

    // Starter cat "Luna"
    const luna = new Pet('Luna', 'cat', '#95a5a6');
    luna.gridPos = { x: 9, y: 6 };
    luna.renderPos = { x: 9, y: 6 };
    this.pets.push(luna);
  }

  public addPet(name: string, species: PetSpecies, color?: string): Pet {
    const pet = new Pet(name, species, color);
    pet.gridPos = { x: 8, y: 8 };
    pet.renderPos = { x: 8, y: 8 };
    this.pets.push(pet);
    return pet;
  }

  public removePet(id: string): boolean {
    const idx = this.pets.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.pets.splice(idx, 1);
      return true;
    }
    return false;
  }

  public getPetAt(x: number, y: number): Pet | null {
    for (const pet of this.pets) {
      const dist = Math.sqrt(Math.pow(pet.gridPos.x - x, 2) + Math.pow(pet.gridPos.y - y, 2));
      if (dist <= 1.0) {
        return pet;
      }
    }
    return null;
  }

  public update(deltaSec: number, deltaMinutes: number): void {
    this.pets.forEach(pet => pet.update(deltaSec, deltaMinutes));
  }
}
