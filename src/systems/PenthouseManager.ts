/**
 * High-Rise Living & Luxury Penthouse Auctions System
 * Bid on sky-rise penthouses, furnish luxury roof-decks, and collect weekly sky-loft dividends.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface PenthouseProperty {
  id: string;
  name: string;
  price: number;
  weeklyRent: number;
  owned: boolean;
  viewDesc: string;
}

export class PenthouseManager {
  public properties: PenthouseProperty[] = [
    {
      id: 'skyline_tower',
      name: '🏙️ "Skyline Tower" Penthouse (Etage 45)',
      price: 15000,
      weeklyRent: 2200,
      owned: false,
      viewDesc: 'Panorama-Glasfronten über die gesamte Skyline.'
    },
    {
      id: 'starlight_suite',
      name: '✨ "Starlight Crown" Luxus-Loft',
      price: 25000,
      weeklyRent: 3800,
      owned: false,
      viewDesc: 'Dachterrasse mit Infinity-Pool und privatem Hubschrauberlandeplatz.'
    }
  ];

  public buyPenthouse(propertyId: string, sim: Sim): { success: boolean; message: string } {
    const prop = this.properties.find(p => p.id === propertyId);
    if (!prop) return { success: false, message: 'Immobilie nicht gefunden.' };
    if (prop.owned) return { success: false, message: 'Dieses Penthouse gehört dir bereits!' };

    if (sim.simoleons < prop.price) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${prop.price.toLocaleString()} benötigt)!` };
    }

    sim.simoleons -= prop.price;
    prop.owned = true;

    sim.triggerEmote('🏙️', 4000);
    sim.moodletManager.addMoodlet({
      id: `penthouse_${prop.id}`,
      name: 'High-Rise Elite',
      emotion: 'inspired',
      weight: 3,
      durationSec: 300,
      icon: '🏙️',
      description: `Stolzer Besitzer von ${prop.name}!`
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🏙️ PENTHOUSE ERWORBEN!',
      message: `Du bist nun Eigentümer von ${prop.name}! Wöchentliche Mieteinnahmen: +§ ${prop.weeklyRent}`,
      icon: '💎',
      type: 'levelUp'
    });

    return { success: true, message: `${prop.name} erfolgreich ersteigert!` };
  }

  public collectRent(sim: Sim): { success: boolean; payout: number; message: string } {
    const owned = this.properties.filter(p => p.owned);
    if (owned.length === 0) {
      return { success: false, payout: 0, message: 'Du besitzt noch keine Penthouses.' };
    }

    const totalPayout = owned.reduce((sum, p) => sum + p.weeklyRent, 0);
    sim.simoleons += totalPayout;

    sim.triggerEmote('💰', 3500);
    return { success: true, payout: totalPayout, message: `Penthouse-Mietdividenden ausgezahlt: +§ ${totalPayout}` };
  }

  public exportData(): any {
    return { properties: (this as any).properties ?? [] };
  }

  public importData(data: any): void {
    if (!data) return;
    if (Array.isArray(data.properties)) (this as any).properties = data.properties;
  }
}

