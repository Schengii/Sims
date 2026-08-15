/**
 * Equestrian Center, Horse Riding & Jumping Tournaments System
 * Manage horses, train dressage and show-jumping, and compete in equestrian tournaments.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface HorseProfile {
  name: string;
  breed: string;
  speed: number;
  jumping: number;
  affection: number;
}

export class EquestrianManager {
  public horse: HorseProfile = {
    name: 'Pegasus Spirit',
    breed: 'Edler Araber-Schimmel',
    speed: 4,
    jumping: 3,
    affection: 80
  };
  public tournamentTrophies: number = 0;

  public trainHorse(activity: 'speed' | 'jumping', sim: Sim): { success: boolean; message: string } {
    if (sim.needs.getValues().energy < 20) {
      return { success: false, message: 'Zu erschöpft für das Pferdetraining!' };
    }

    sim.needs.modify('energy', -20);
    sim.needs.modify('fun', 25);
    this.horse.affection = Math.min(100, this.horse.affection + 10);

    if (activity === 'speed') {
      this.horse.speed = Math.min(10, this.horse.speed + 0.5);
    } else {
      this.horse.jumping = Math.min(10, this.horse.jumping + 0.5);
    }

    sim.triggerEmote('🐎', 3500);
    return {
      success: true,
      message: `Training erfolgreich absolviert! Tempo: ${this.horse.speed.toFixed(1)}, Sprungkraft: ${this.horse.jumping.toFixed(1)}`
    };
  }

  public competeInTournament(sim: Sim): { success: boolean; prize: number; message: string } {
    const totalScore = this.horse.speed + this.horse.jumping;
    if (totalScore < 6) {
      return { success: false, prize: 0, message: 'Das Pferd benötigt mehr Training vor einem großen Turnier!' };
    }

    const prize = Math.floor(totalScore * 250 + Math.random() * 500);
    sim.simoleons += prize;
    this.tournamentTrophies++;

    sim.triggerEmote('🏆', 4000);
    sim.moodletManager.addMoodlet({
      id: 'equestrian_champion',
      name: 'Reit-Champion',
      emotion: 'energized',
      weight: 3,
      durationSec: 240,
      icon: '🐎',
      description: 'Goldmedaille beim Springreit-Turnier gewonnen!'
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🐎 REIT-TURNIER GEWONNEN!',
      message: `${this.horse.name} holt Gold! Preisgeld: +§ ${prize}`,
      icon: '🏆',
      type: 'levelUp'
    });

    return { success: true, prize, message: `Goldmedaille gewonnen! Preisgeld: § ${prize}` };
  }
}
