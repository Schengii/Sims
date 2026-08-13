/**
 * Pet Breeding, Nursery & Adoption Shelter System
 * Enables household pets to breed, manage puppy & kitten nurseries, inherit genetic coat colors,
 * and put offspring up for adoption or adopt new rescue pets.
 */

export interface ShelterPet {
  id: string;
  name: string;
  species: 'Hund 🐶' | 'Katze 🐱';
  breed: string;
  age: 'Welpe 🍼' | 'Erwachsen 🐕';
  coatColor: string;
  trait: string;
  adoptionFee: number;
}

export class PetBreedingSystem {
  private shelterPets: ShelterPet[] = [];
  private breedingGestationProgress: number = 0; // 0 to 100%
  private isGestationActive: boolean = false;
  private parentPetNames: [string, string] = ['', ''];

  constructor() {
    this.initDefaultShelterPets();
  }

  private initDefaultShelterPets() {
    this.shelterPets = [
      {
        id: 'pet_golden_welpe',
        name: 'Buster',
        species: 'Hund 🐶',
        breed: 'Golden Retriever',
        age: 'Welpe 🍼',
        coatColor: '#EEDC82',
        trait: 'Verspielt & Treu',
        adoptionFee: 650
      },
      {
        id: 'pet_perser_katze',
        name: 'Luna',
        species: 'Katze 🐱',
        breed: 'Perserkatze',
        age: 'Erwachsen 🐕',
        coatColor: '#FFFFFF',
        trait: 'Verschmust & Verschlafen',
        adoptionFee: 800
      },
      {
        id: 'pet_husky_welpe',
        name: 'Shadow',
        species: 'Hund 🐶',
        breed: 'Sibirischer Husky',
        age: 'Welpe 🍼',
        coatColor: '#888888',
        trait: 'Energetisch & Mutig',
        adoptionFee: 1100
      },
      {
        id: 'pet_siamesen_katze',
        name: 'Milo',
        species: 'Katze 🐱',
        breed: 'Siamkatze',
        age: 'Welpe 🍼',
        coatColor: '#D2B48C',
        trait: 'Neugierig & Frech',
        adoptionFee: 750
      }
    ];
  }

  public getShelterPets(): ShelterPet[] {
    return this.shelterPets;
  }

  public startBreeding(pet1Name: string, pet2Name: string): { success: boolean; message: string } {
    if (this.isGestationActive) {
      return { success: false, message: 'Eine Haustier-Trächtigkeit ist bereits im Gange!' };
    }

    this.isGestationActive = true;
    this.breedingGestationProgress = 0;
    this.parentPetNames = [pet1Name, pet2Name];

    return {
      success: true,
      message: `🐾 Zuchtversuch gestartet zwischen ${pet1Name} und ${pet2Name}! Die Trächtigkeit beginnt.`
    };
  }

  public updateGestationTick(): { birthed: boolean; puppyName?: string; species?: string } {
    if (!this.isGestationActive) return { birthed: false };

    this.breedingGestationProgress += 10;
    if (this.breedingGestationProgress >= 100) {
      this.isGestationActive = false;
      this.breedingGestationProgress = 0;
      const isDog = Math.random() > 0.4;
      const puppyName = isDog ? 'Bella Jr.' : 'Felix Jr.';
      const species = isDog ? 'Hund 🐶' : 'Katze 🐱';

      return {
        birthed: true,
        puppyName,
        species
      };
    }

    return { birthed: false };
  }

  public adoptShelterPet(petId: string, currentSimoleons: number): { success: boolean; message: string; pet?: ShelterPet; fee: number } {
    const petIndex = this.shelterPets.findIndex(p => p.id === petId);
    if (petIndex === -1) {
      return { success: false, message: 'Haustier im Heim nicht gefunden.', fee: 0 };
    }

    const pet = this.shelterPets[petIndex];
    if (currentSimoleons < pet.adoptionFee) {
      return { success: false, message: `Nicht genug Simoleons! Adoptionsgebühr: §${pet.adoptionFee}.`, fee: 0 };
    }

    this.shelterPets.splice(petIndex, 1);
    return {
      success: true,
      message: `🎉 Willkommen zu Hause! Du hast ${pet.name} (${pet.breed}) erfolgreich adoptiert!`,
      pet,
      fee: pet.adoptionFee
    };
  }

  public getGestationStatus(): { isGestationActive: boolean; progress: number; parents: [string, string] } {
    return {
      isGestationActive: this.isGestationActive,
      progress: this.breedingGestationProgress,
      parents: this.parentPetNames
    };
  }

  public exportData(): any {
    return {
      shelterPets: this.shelterPets,
      isGestationActive: this.isGestationActive,
      breedingGestationProgress: this.breedingGestationProgress,
      parentPetNames: this.parentPetNames
    };
  }

  public importData(data: any) {
    if (data) {
      if (Array.isArray(data.shelterPets)) this.shelterPets = data.shelterPets;
      this.isGestationActive = data.isGestationActive || false;
      this.breedingGestationProgress = data.breedingGestationProgress || 0;
      this.parentPetNames = data.parentPetNames || ['', ''];
    }
  }
}
