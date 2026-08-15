/**
 * Smart Garden Tech & Auto Sprinklers System
 * Install automated pop-up sprinklers to automatically water all garden plots and boost crop harvest quality.
 */

import type { GardenSystem } from '../world/GardenSystem';
import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export class SmartGardenSystem {
  public sprinklersInstalled: boolean = false;
  public autoFertilizerActive: boolean = false;

  public installSprinklers(sim: Sim, gardenSystem: GardenSystem): { success: boolean; message: string } {
    const cost = 450;
    if (sim.simoleons < cost) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${cost} erforderlich)!` };
    }

    sim.simoleons -= cost;
    this.sprinklersInstalled = true;

    // Immediately water all existing plots
    gardenSystem.plots.forEach(plot => {
      plot.waterLevel = 100;
    });

    sim.triggerEmote('💧', 3500);
    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '💧 Smarte Bewässerungsanlage',
      message: 'Automatische Rasensprenger installiert! Alle Beete sind optimal bewässert.',
      icon: '🌱',
      type: 'success'
    });

    return { success: true, message: 'Smarte Rasensprenger erfolgreich im Garten installiert!' };
  }

  public updateSprinklers(gardenSystem: GardenSystem): void {
    if (this.sprinklersInstalled) {
      // Auto-water any dry plot
      gardenSystem.plots.forEach(plot => {
        if (plot.waterLevel < 60) {
          plot.waterLevel = 100;
        }
      });
    }
  }
}
