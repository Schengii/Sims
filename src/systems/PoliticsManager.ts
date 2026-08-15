/**
 * City Politics, Mayor Election & Town Ordinances System
 * Allows Sims to run for Mayor 🏛️, deliver campaign speeches, and pass city ordinances
 * (e.g. Eco Energy Subsidy, Strict Night Curfew, Arts & Culture Grants, Tax Cut).
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export interface CityOrdinance {
  id: string;
  name: string;
  icon: string;
  description: string;
  active: boolean;
  costToEnact: number;
  effectType: 'eco' | 'curfew' | 'culture' | 'tax_relief';
}

export class PoliticsManager {
  public politicalRank: number = 1; // 1: Bürger, 2: Kampagnenleiter, 3: Stadtrat, 4: Vize-Bürgermeister, 5: Oberbürgermeister 🏛️
  public voterSupport: number = 20; // 0 to 100%
  public campaignFunds: number = 500;
  public ordinances: CityOrdinance[] = [
    {
      id: 'eco_grant',
      name: '🌱 Grüne Energie & Solarförderung',
      icon: '☀️',
      description: 'Reduziert die wöchentlichen Haushalts-Stromrechnungen um 50%.',
      active: false,
      costToEnact: 600,
      effectType: 'eco'
    },
    {
      id: 'curfew',
      name: '🌙 Strikte Nachbarschafts-Nachtruhe',
      icon: '🔕',
      description: 'Verhindert Einbrüche und garantiert ungestörten Schlaf (schnellere Energie-Regeneration).',
      active: false,
      costToEnact: 400,
      effectType: 'curfew'
    },
    {
      id: 'culture_boost',
      name: '🎨 Kunst & Kultur-Stipendien',
      icon: '🎭',
      description: 'Gemälde, Romane und Songaufnahmen erzielen 40% mehr Verkaufserlöse.',
      active: false,
      costToEnact: 800,
      effectType: 'culture'
    },
    {
      id: 'tax_relief',
      name: '🪙 Bürger-Steuersenkung & Konjunktur-Bonus',
      icon: '💰',
      description: 'Alle Haushalts-Gehälter und Karriere-Beförderungsboni steigen um 25%.',
      active: false,
      costToEnact: 1200,
      effectType: 'tax_relief'
    }
  ];

  public deliverCampaignSpeech(sim: Sim): { success: boolean; supportGained: number; message: string } {
    if (sim.needs.getValues().energy < 20) {
      return { success: false, supportGained: 0, message: 'Zu erschöpft für eine mitreißende Wahlkampfrede!' };
    }

    sim.needs.modify('energy', -20);
    sim.needs.modify('social', 25);

    const gain = Math.floor(8 + Math.random() * 12);
    this.voterSupport = Math.min(100, this.voterSupport + gain);
    sim.triggerEmote('📢', 3500);

    if (this.voterSupport >= 80 && this.politicalRank < 5) {
      this.politicalRank = 5; // Elected Mayor!
      sim.simoleons += 2500;
      EventBus.getInstance().emit('TOAST_TRIGGER', {
        title: '🏛️ WAHL GEWONNEN!',
        message: `${sim.customization.name} wurde zum Oberbürgermeister gewählt! Bonus: +§ 2.500`,
        icon: '👑',
        type: 'levelUp'
      });
      return { success: true, supportGained: gain, message: `Grandioser Rede-Erfolg! Du hast die Wahl gewonnen und bist jetzt Bürgermeister! (+${gain}% Zustimmung)` };
    }

    return {
      success: true,
      supportGained: gain,
      message: `Begeisternde Rede auf dem Marktplatz gehalten! Zustimmung: ${this.voterSupport}% (+${gain}%)`
    };
  }

  public enactOrdinance(ordinanceId: string, sim: Sim): { success: boolean; message: string } {
    const ord = this.ordinances.find(o => o.id === ordinanceId);
    if (!ord) return { success: false, message: 'Verordnung nicht gefunden.' };

    if (this.politicalRank < 3) {
      return { success: false, message: 'Du benötigst mindestens Rang 3 (Stadtrat), um Verordnungen zu erlassen!' };
    }

    if (sim.simoleons < ord.costToEnact) {
      return { success: false, message: `Nicht genügend Simoleons (§ ${ord.costToEnact} benötigt)!` };
    }

    sim.simoleons -= ord.costToEnact;
    ord.active = !ord.active;

    const statusText = ord.active ? 'in Kraft gesetzt' : 'aufgehoben';
    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🏛️ Stadtratsbeschluss',
      message: `${ord.name} wurde ${statusText}!`,
      icon: ord.icon,
      type: 'success'
    });

    return { success: true, message: `${ord.name} wurde ${statusText}!` };
  }
}
