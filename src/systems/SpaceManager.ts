/**
 * Space Exploration & Rocket Launch System
 * Build rocket stages, launch orbital & lunar missions, and collect alien moon rocks.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface SpaceMission {
  id: string;
  name: string;
  icon: string;
  durationMinutes: number;
  fuelCost: number;
  rewardSimoleons: number;
  rewardItemName: string;
  description: string;
}

export const MISSIONS_CATALOG: SpaceMission[] = [
  {
    id: 'orbit',
    name: '🛰️ Erd-Orbit Satelliten-Wartung',
    icon: '🛰️',
    durationMinutes: 120,
    fuelCost: 200,
    rewardSimoleons: 600,
    rewardItemName: 'Weltraum-Satelliten-Relais',
    description: 'Fliege in die Schwerelosigkeit und richte GPS-Satelliten neu aus.'
  },
  {
    id: 'moon',
    name: '🌕 Mond-Landung & Krater-Erkundung',
    icon: '🌕',
    durationMinutes: 240,
    fuelCost: 500,
    rewardSimoleons: 1500,
    rewardItemName: 'Glühender Mond-Meteorit',
    description: 'Lande auf dem Mond, hisse die Sim-Flagge und sammle Gesteinsproben.'
  },
  {
    id: 'deep_space',
    name: '👽 Alien-Signal Tiefenraum-Expedition',
    icon: '🛸',
    durationMinutes: 360,
    fuelCost: 1000,
    rewardSimoleons: 3500,
    rewardItemName: 'Antikes Alien-Hyper-Artefakt',
    description: 'Reise an den Rand des Sonnensystems und erforsche außerirdische Signale.'
  }
];

export class SpaceManager {
  public rocketBuildProgress: number = 0; // 0 to 100%
  public completedMissions: number = 0;

  public buildRocket(sim: Sim): { success: boolean; message: string } {
    if (this.rocketBuildProgress >= 100) {
      return { success: false, message: 'Die Weltraumrakete ist bereits zu 100% fertiggestellt und startbereit!' };
    }

    if (sim.needs.getValues().energy < 20) {
      return { success: false, message: 'Zu erschöpft für Raketenbau-Arbeiten!' };
    }

    sim.needs.modify('energy', -20);
    this.rocketBuildProgress = Math.min(100, this.rocketBuildProgress + 25);
    sim.triggerEmote('🚀', 3500);

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🚀 Raketenbau-Fortschritt',
      message: `Baufortschritt: ${this.rocketBuildProgress}% fertiggestellt!`,
      icon: '🛠️',
      type: 'info'
    });

    return { success: true, message: `Raketenstufe montiert! Fortschritt: ${this.rocketBuildProgress}%` };
  }

  public launchMission(missionId: string, sim: Sim): { success: boolean; message: string } {
    if (this.rocketBuildProgress < 100) {
      return { success: false, message: 'Die Rakete muss zuerst vollständig gebaut werden (100%)!' };
    }

    const mission = MISSIONS_CATALOG.find(m => m.id === missionId);
    if (!mission) return { success: false, message: 'Mission nicht gefunden.' };

    if (sim.simoleons < mission.fuelCost) {
      return { success: false, message: `Nicht genügend Simoleons für Raketentreibstoff (§ ${mission.fuelCost} benötigt)!` };
    }

    sim.simoleons -= mission.fuelCost;
    sim.simoleons += mission.rewardSimoleons;
    this.completedMissions++;

    sim.inventory.addItem({
      name: mission.rewardItemName,
      type: 'collectible',
      icon: mission.icon,
      value: Math.floor(mission.rewardSimoleons / 2),
      description: `Seltene Weltraum-Trophäe aus der Mission: ${mission.name}`
    });

    sim.triggerEmote('🚀', 4000);
    sim.moodletManager.addMoodlet({
      id: `space_${mission.id}`,
      name: 'Astronauten-Triumph',
      emotion: 'inspired',
      weight: 3,
      durationSec: 240,
      icon: '🚀',
      description: `Erfolgreich von der Mission "${mission.name}" zurückgekehrt!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🚀 RAKETENSTART ERFOLGREICH!',
      message: `Mission "${mission.name}" beendet! Belohnung: +§ ${mission.rewardSimoleons} & ${mission.rewardItemName}`,
      icon: '🌌',
      type: 'levelUp'
    });

    return { success: true, message: `Mission erfolgreich! +§ ${mission.rewardSimoleons} verdient!` };
  }

  public exportData(): any {
    return {
      rocketBuildProgress: (this as any).rocketBuildProgress ?? 0,
      completedMissions: (this as any).completedMissions ?? [],
      collectedArtifacts: (this as any).collectedArtifacts ?? []
    };
  }

  public importData(data: any): void {
    if (!data) return;
    if (typeof data.rocketBuildProgress === 'number') (this as any).rocketBuildProgress = data.rocketBuildProgress;
    if (Array.isArray(data.completedMissions)) (this as any).completedMissions = data.completedMissions;
    if (Array.isArray(data.collectedArtifacts)) (this as any).collectedArtifacts = data.collectedArtifacts;
  }
}

