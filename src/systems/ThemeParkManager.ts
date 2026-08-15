/**
 * Theme Park, Carnival & Attractions System
 * Manages funfair attractions: Ferris Wheel 🎡, Bumper Cars 🏎️, Ghost Train 👻,
 * Cotton Candy Machine 🍭, and ticket revenue / fun boosters.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface ParkAttraction {
  id: string;
  name: string;
  icon: string;
  ticketPrice: number;
  funGain: number;
  description: string;
  moodletTitle: string;
}

export const ATTRACTIONS_CATALOG: ParkAttraction[] = [
  {
    id: 'ferris_wheel',
    name: '🎡 Riesenrad "Sky View"',
    icon: '🎡',
    ticketPrice: 25,
    funGain: 35,
    description: 'Atemberaubende Aussicht über die gesamte Sim-Welt.',
    moodletTitle: 'Schwindelerregender Ausblick'
  },
  {
    id: 'roller_coaster',
    name: '🎢 Looping-Achterbahn "Hyper Blitz"',
    icon: '🎢',
    ticketPrice: 40,
    funGain: 50,
    description: 'Adrenalin pur mit 3 Loopings und steilen Steilkurven.',
    moodletTitle: 'Adrenalin-Rausch'
  },
  {
    id: 'bumper_cars',
    name: '🏎️ Autoscooter Arena',
    icon: '🏎️',
    ticketPrice: 20,
    funGain: 30,
    description: 'Lustige Karambolagen mit Nachbarn und Musik.',
    moodletTitle: 'Scooter-Action'
  },
  {
    id: 'ghost_house',
    name: '👻 Grusel-Geisterbahn',
    icon: '👻',
    ticketPrice: 30,
    funGain: 40,
    description: 'Düstere Gänge, Spinnweben und gruselige Schreckmomente.',
    moodletTitle: 'Gänsehaut-Grusel'
  },
  {
    id: 'cotton_candy',
    name: '🍭 Rosa Zuckerwatte-Stand',
    icon: '🍭',
    ticketPrice: 15,
    funGain: 20,
    description: 'Süße, fluffige Zuckerwatte für pure Gaumenfreude.',
    moodletTitle: 'Zuckerschock-Glück'
  }
];

export class ThemeParkManager {
  public parkLevel: number = 1;
  public totalRidesTaken: number = 0;

  public rideAttraction(attractionId: string, sim: Sim): { success: boolean; message: string } {
    const ride = ATTRACTIONS_CATALOG.find(a => a.id === attractionId);
    if (!ride) return { success: false, message: 'Attraktion nicht gefunden.' };

    if (sim.simoleons < ride.ticketPrice) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${ride.ticketPrice} benötigt)!` };
    }

    sim.simoleons -= ride.ticketPrice;
    sim.needs.modify('fun', ride.funGain);
    sim.needs.modify('social', 15);
    this.totalRidesTaken++;

    sim.triggerEmote(ride.icon, 4000);
    sim.moodletManager.addMoodlet({
      id: `ride_${ride.id}`,
      name: ride.moodletTitle,
      emotion: 'energized',
      weight: 2,
      durationSec: 180,
      icon: ride.icon,
      description: `Riesen-Spaß bei ${ride.name}!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🎡 Freizeitpark',
      message: `${sim.customization.name} hatte riesigen Spaß bei ${ride.name}!`,
      icon: ride.icon,
      type: 'success'
    });

    return { success: true, message: `Fahrt mit ${ride.name} genossen! (+${ride.funGain} Spaß)` };
  }
}
