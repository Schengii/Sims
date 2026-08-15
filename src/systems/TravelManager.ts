/**
 * World Travel, Airport & Vacation Resorts System
 * Book flights to exotic destinations (Sulani Tropics 🏝️, Mt. Komorebi Alps 🏔️, Oasis Springs 🏜️),
 * relax in luxury suites, collect foreign souvenirs, and gain vacation buffs.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface VacationDestination {
  id: string;
  name: string;
  icon: string;
  climate: string;
  flightCost: number;
  souvenirName: string;
  description: string;
  funBoost: number;
}

export const VACATIONS_CATALOG: VacationDestination[] = [
  {
    id: 'sulani',
    name: '🏝️ Sulani Tropenparadies',
    icon: '🏝️',
    climate: 'Tropisch warm & sonnig',
    flightCost: 650,
    souvenirName: 'Polynesische Tiki-Holzschnitzerei',
    description: 'Kristallklares Wasser, Korallenriffe, Kokosnuss-Cocktails und Schnorchel-Abenteuer.',
    funBoost: 50
  },
  {
    id: 'komorebi',
    name: '🏔️ Mt. Komorebi Ski- & Onsen-Resort',
    icon: '🏔️',
    climate: 'Verschneit & erfrischend',
    flightCost: 750,
    souvenirName: 'Traditionelle Komorebi-Teekanne',
    description: 'Rasante Skipisten, wärmende heiße Onsen-Quellen und meditative Bambuswälder.',
    funBoost: 55
  },
  {
    id: 'oasis',
    name: '🏜️ Oasis Springs Wüsten-Oase',
    icon: '🏜️',
    climate: 'Heiß & trocken',
    flightCost: 500,
    souvenirName: 'Seltene Wüsten-Geode',
    description: 'Exotische Kakteen-Canyons, Sternenhimmel in der Wüste und Luxus-Pools.',
    funBoost: 45
  }
];

export class TravelManager {
  public currentVacation: VacationDestination | null = null;
  public vacationHistory: string[] = [];

  public bookVacationFlight(destinationId: string, sim: Sim): { success: boolean; message: string } {
    const dest = VACATIONS_CATALOG.find(d => d.id === destinationId);
    if (!dest) return { success: false, message: 'Urlaubsziel nicht gefunden.' };

    if (sim.simoleons < dest.flightCost) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${dest.flightCost} für Flug & Hotel benötigt)!` };
    }

    sim.simoleons -= dest.flightCost;
    sim.needs.fillAll(); // Urlaub revitalisiert vollkommen
    this.currentVacation = dest;
    this.vacationHistory.push(dest.name);

    sim.inventory.addItem({
      name: dest.souvenirName,
      type: 'collectible',
      icon: dest.icon,
      value: Math.floor(dest.flightCost * 0.6),
      description: `Kostbares Souvenir aus dem Urlaub: ${dest.name}`
    });

    sim.triggerEmote('✈️', 4000);
    sim.moodletManager.addMoodlet({
      id: `vacation_${dest.id}`,
      name: 'Urlaubs-Glückseligkeit',
      emotion: 'inspired',
      weight: 3,
      durationSec: 300,
      icon: dest.icon,
      description: `Tiefenentspannt nach der Traumreise nach ${dest.name}!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '✈️ URLAUBS-FLUG GEBUCHT!',
      message: `Willkommen in ${dest.name}! Alle Bedürfnisse sind auf 100% aufgeladen.`,
      icon: dest.icon,
      type: 'levelUp'
    });

    return { success: true, message: `Flug nach ${dest.name} angetreten! Alle Bedürfnisse auf 100% revitalisiert.` };
  }
}
