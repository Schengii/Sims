/**
 * Garden & Crop System
 * Manages soil plots, seed planting, watering, growth cycles, and harvesting crops for Simoleons or cooking.
 */

export type CropType = 'tomatoes' | 'strawberries' | 'flowers' | 'dragonfruit' | 'money_tree' | 'orchid';

export interface GardenPlot {
  id: string;
  gridX: number;
  gridY: number;
  cropType?: CropType;
  growthProgress: number; // 0 to 100
  waterLevel: number; // 0 to 100
  isHarvestable: boolean;
}

export class GardenSystem {
  public plots: GardenPlot[] = [];

  public addPlot(gridX: number, gridY: number): GardenPlot {
    const existing = this.plots.find(p => p.gridX === gridX && p.gridY === gridY);
    if (existing) return existing;

    const plot: GardenPlot = {
      id: `plot_${gridX}_${gridY}`,
      gridX,
      gridY,
      growthProgress: 0,
      waterLevel: 50,
      isHarvestable: false
    };
    this.plots.push(plot);
    return plot;
  }

  public plantSeed(gridX: number, gridY: number, cropType: CropType): boolean {
    const plot = this.plots.find(p => p.gridX === gridX && p.gridY === gridY);
    if (!plot || plot.cropType) return false;

    plot.cropType = cropType;
    plot.growthProgress = 10;
    plot.waterLevel = 80;
    plot.isHarvestable = false;
    return true;
  }

  public waterPlot(gridX: number, gridY: number): boolean {
    const plot = this.plots.find(p => p.gridX === gridX && p.gridY === gridY);
    if (!plot) return false;

    plot.waterLevel = 100;
    return true;
  }

  public harvestCrop(gridX: number, gridY: number): { name: string; icon: string; value: number } | null {
    const plot = this.plots.find(p => p.gridX === gridX && p.gridY === gridY);
    if (!plot || !plot.isHarvestable || !plot.cropType) return null;

    let harvestData = { name: 'Frische Tomaten', icon: '🍅', value: 120 };
    if (plot.cropType === 'strawberries') {
      harvestData = { name: 'Süße Erdbeeren', icon: '🍓', value: 180 };
    } else if (plot.cropType === 'flowers') {
      harvestData = { name: 'Duftende Blumen', icon: '💐', value: 150 };
    } else if (plot.cropType === 'dragonfruit') {
      harvestData = { name: 'Exotische Drachenfrucht', icon: '🐉', value: 350 };
    } else if (plot.cropType === 'money_tree') {
      harvestData = { name: 'Goldene Simoleon-Früchte', icon: '💸', value: 500 };
    } else if (plot.cropType === 'orchid') {
      harvestData = { name: 'Seltene Edelorchidee', icon: '🌺', value: 280 };
    }

    // Reset plot
    plot.cropType = undefined;
    plot.growthProgress = 0;
    plot.isHarvestable = false;

    return harvestData;
  }

  public update(deltaMinutes: number): void {
    for (const plot of this.plots) {
      if (plot.cropType) {
        // Water decreases over time
        plot.waterLevel = Math.max(0, plot.waterLevel - deltaMinutes * 0.1);

        // Growth advances if watered
        if (plot.waterLevel > 10 && !plot.isHarvestable) {
          plot.growthProgress += deltaMinutes * 0.25;
          if (plot.growthProgress >= 100) {
            plot.growthProgress = 100;
            plot.isHarvestable = true;
          }
        }
      }
    }
  }
}
