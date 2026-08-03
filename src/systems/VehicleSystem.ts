/**
 * Vehicles & Garage System for Sims 5
 * Manages vehicle ownership, garage storage, and roadtrips.
 */

export interface VehicleDef {
  id: string;
  name: string;
  icon: string;
  price: number;
  speedMultiplier: number;
  funGain: number;
  comfortGain: number;
  description: string;
}

export const VEHICLES_CATALOG: Record<string, VehicleDef> = {
  vehicle_bike: {
    id: 'vehicle_bike',
    name: 'City-Fahrrad "Eco"',
    icon: '🚲',
    price: 350,
    speedMultiplier: 1.5,
    funGain: 40,
    comfortGain: 20,
    description: 'Umweltfreundliches Fahrrad für schnelle Ausflüge in der Nachbarschaft.'
  },
  vehicle_scooter: {
    id: 'vehicle_scooter',
    name: 'E-Roller "Vespa"',
    icon: '🛵',
    price: 850,
    speedMultiplier: 2.0,
    funGain: 60,
    comfortGain: 35,
    description: 'Wendiger Elektro-Roller für stylisches Cruisen durch die Stadt.'
  },
  vehicle_family_car: {
    id: 'vehicle_family_car',
    name: 'Familien-Kombi "Horizon"',
    icon: '🚗',
    price: 3500,
    speedMultiplier: 2.5,
    funGain: 75,
    comfortGain: 60,
    description: 'Geräumiger Kombi für die ganze Familie mit reichlich Platz.'
  },
  vehicle_sports_car: {
    id: 'vehicle_sports_car',
    name: 'Luxus-Sportwagen "Apex GT"',
    icon: '🏎️',
    price: 12000,
    speedMultiplier: 3.5,
    funGain: 100,
    comfortGain: 90,
    description: 'Rasanter Supersportwagen mit Röhrendem Motor und Top-Komfort!'
  }
};

export class VehicleManager {
  public ownedVehicleIds: string[] = ['vehicle_bike'];
  public activeVehicleId: string = 'vehicle_bike';

  public buyVehicle(vehicleId: string, sim: import('../entity/Sim').Sim): boolean {
    const v = VEHICLES_CATALOG[vehicleId];
    if (!v) return false;

    if (sim.simoleons >= v.price && !this.ownedVehicleIds.includes(vehicleId)) {
      sim.simoleons -= v.price;
      this.ownedVehicleIds.push(vehicleId);
      this.activeVehicleId = vehicleId;
      return true;
    }
    return false;
  }

  public goOnRoadtrip(vehicleId: string, game: any): { success: boolean; message: string } {
    const v = VEHICLES_CATALOG[vehicleId];
    if (!v) return { success: false, message: 'Fahrzeug nicht gefunden!' };

    game.sim.needs.modify('fun', v.funGain);
    game.sim.needs.modify('energy', v.comfortGain / 2);
    game.sim.addSkillXP('fitness', 15);

    return {
      success: true,
      message: `🏎️ Spritzfahrt mit ${v.icon} ${v.name} erfolgreich! Spaß & Komfort sind stark gestiegen!`
    };
  }
}
