/**
 * Farm & Ranch Life Empire System
 * Manages livestock (Cows, Sheep, Llamas), crop harvesting (Pumpkin, Watermelon, Wheat),
 * milk/wool yields, and market sales.
 */

export interface FarmAnimal {
  id: string;
  name: string;
  type: 'cow' | 'sheep' | 'llama';
  productName: string;
  productIcon: string;
  productValue: number;
  isReadyForHarvest: boolean;
  harvestProgress: number; // 0 to 100%
}

export interface FarmCropField {
  id: string;
  name: string;
  icon: string;
  seedCost: number;
  marketPrice: number;
  growthProgress: number; // 0 to 100%
  isReady: boolean;
}

export class FarmSystem {
  private animals: FarmAnimal[] = [];
  private cropFields: FarmCropField[] = [];

  constructor() {
    this.initDefaultFarm();
  }

  private initDefaultFarm() {
    this.animals = [
      {
        id: 'animal_cow_1',
        name: 'Berta (Kuh 🐄)',
        type: 'cow',
        productName: 'Frische Bio-Vollmilch',
        productIcon: '🥛',
        productValue: 120,
        isReadyForHarvest: true,
        harvestProgress: 100
      },
      {
        id: 'animal_sheep_1',
        name: 'Wolly (Schaf 🐑)',
        type: 'sheep',
        productName: 'Weiche Alpaka-Wolle',
        productIcon: '🧶',
        productValue: 180,
        isReadyForHarvest: true,
        harvestProgress: 100
      },
      {
        id: 'animal_llama_1',
        name: 'Paco (Llama 🦙)',
        productName: 'Edle Llama-Seide',
        type: 'llama',
        productIcon: '🦙',
        productValue: 260,
        isReadyForHarvest: false,
        harvestProgress: 40
      }
    ];

    this.cropFields = [
      {
        id: 'crop_pumpkin',
        name: 'Riesen-Kürbis Feld 🎃',
        icon: '🎃',
        seedCost: 80,
        marketPrice: 350,
        growthProgress: 100,
        isReady: true
      },
      {
        id: 'crop_watermelon',
        name: 'Saftige Wassermelone 🍉',
        icon: '🍉',
        seedCost: 60,
        marketPrice: 280,
        growthProgress: 60,
        isReady: false
      },
      {
        id: 'crop_wheat',
        name: 'Goldenes Weizenfeld 🌾',
        icon: '🌾',
        seedCost: 40,
        marketPrice: 190,
        growthProgress: 100,
        isReady: true
      }
    ];
  }

  public getAnimals(): FarmAnimal[] {
    return this.animals;
  }

  public getCropFields(): FarmCropField[] {
    return this.cropFields;
  }

  public harvestAnimalProduct(animalId: string): { success: boolean; message: string; value: number } {
    const animal = this.animals.find(a => a.id === animalId);
    if (!animal) return { success: false, message: 'Tier nicht gefunden.', value: 0 };
    if (!animal.isReadyForHarvest) return { success: false, message: `${animal.name} produziert noch...`, value: 0 };

    animal.isReadyForHarvest = false;
    animal.harvestProgress = 0;

    return {
      success: true,
      message: `🥛 Ertrag geerntet: ${animal.productName} von ${animal.name}! (Wert: §${animal.productValue})`,
      value: animal.productValue
    };
  }

  public plantCrop(cropId: string, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    const crop = this.cropFields.find(c => c.id === cropId);
    if (!crop) return { success: false, message: 'Feld nicht gefunden.', cost: 0 };
    if (crop.growthProgress > 0) return { success: false, message: 'Feld ist bereits bepflanzt!', cost: 0 };
    if (currentSimoleons < crop.seedCost) {
      return { success: false, message: `Nicht genug Simoleons! Saatgut kostet §${crop.seedCost}.`, cost: 0 };
    }

    crop.growthProgress = 10;
    crop.isReady = false;
    return {
      success: true,
      message: `🌾 Saatgut für ${crop.name} gepflanzt!`,
      cost: crop.seedCost
    };
  }

  public harvestCrop(cropId: string): { success: boolean; message: string; value: number } {
    const crop = this.cropFields.find(c => c.id === cropId);
    if (!crop) return { success: false, message: 'Feld nicht gefunden.', value: 0 };
    if (!crop.isReady) return { success: false, message: `${crop.name} ist noch nicht reif!`, value: 0 };

    crop.isReady = false;
    crop.growthProgress = 0;

    return {
      success: true,
      message: `🚜 Ernte erfolgreich! ${crop.name} eingeholt für §${crop.marketPrice}!`,
      value: crop.marketPrice
    };
  }

  public updateTick(): void {
    this.animals.forEach(a => {
      if (!a.isReadyForHarvest) {
        a.harvestProgress += 5;
        if (a.harvestProgress >= 100) {
          a.harvestProgress = 100;
          a.isReadyForHarvest = true;
        }
      }
    });

    this.cropFields.forEach(c => {
      if (c.growthProgress > 0 && !c.isReady) {
        c.growthProgress += 5;
        if (c.growthProgress >= 100) {
          c.growthProgress = 100;
          c.isReady = true;
        }
      }
    });
  }

  public exportData(): any {
    return {
      animals: this.animals,
      cropFields: this.cropFields
    };
  }

  public importData(data: any): void {
    if (data) {
      if (Array.isArray(data.animals)) this.animals = data.animals;
      if (Array.isArray(data.cropFields)) this.cropFields = data.cropFields;
    }
  }
}
