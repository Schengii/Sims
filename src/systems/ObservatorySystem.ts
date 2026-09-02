/**
 * Astronomy Observatory & Meteorite System
 * Allows Sims to scan deep space with the observatory telescope, discover asteroids, observe meteor showers, and collect celestial artifacts.
 */

import { Sim } from '../entity/Sim';

export interface CelestialDiscovery {
  id: string;
  name: string;
  type: 'planet' | 'asteroid' | 'comet' | 'meteorite';
  icon: string;
  value: number;
  dateStr: string;
}

export class ObservatorySystem {
  public discoveries: CelestialDiscovery[] = [];
  public meteoritesCollected: number = 0;
  public alienSignalsDetected: number = 0;

  public scanTheSky(sim: Sim): { discovery?: CelestialDiscovery; message: string } {
    sim.addSkillXP('logic', 40);
    sim.needs.modify('fun', 30);

    const outcomes: Array<{ name: string; type: 'planet' | 'asteroid' | 'comet' | 'meteorite'; icon: string; value: number }> = [
      { name: 'Ringplanet Chronos', type: 'planet', icon: '🪐', value: 800 },
      { name: 'Komet Halley-Beta', type: 'comet', icon: '☄️', value: 650 },
      { name: 'Asteroid Sim-2026', type: 'asteroid', icon: '🌑', value: 1200 },
      { name: 'Pallasit-Kristallmeteorit', type: 'meteorite', icon: '💎', value: 950 }
    ];

    const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
    const discovery: CelestialDiscovery = {
      id: `celestial_${Date.now()}`,
      name: pick.name,
      type: pick.type,
      icon: pick.icon,
      value: pick.value,
      dateStr: new Date().toLocaleDateString('de-DE')
    };

    this.discoveries.push(discovery);
    sim.simoleons += pick.value;

    return {
      discovery,
      message: `🔭 Neuer Himmelskörper "${discovery.name}" entdeckt! Forschungsgeld erhalten: +§ ${discovery.value.toLocaleString()}`
    };
  }

  public collectMeteoriteShower(sim: Sim): { meteoriteValue: number; message: string } {
    this.meteoritesCollected += 1;
    const value = 600 + Math.floor(Math.random() * 400);
    sim.simoleons += value;
    sim.needs.modify('fun', 35);
    sim.triggerEmote('☄️', 3500);

    return {
      meteoriteValue: value,
      message: `☄️ Sternschnuppe & Meteoritengestein geborgen! (+§ ${value.toLocaleString()})`
    };
  }

  public searchAlienSignals(sim: Sim): { detected: boolean; message: string } {
    sim.addSkillXP('logic', 50);
    const detected = Math.random() > 0.3;
    if (detected) {
      this.alienSignalsDetected += 1;
      sim.triggerEmote('👽', 4000);
      return {
        detected: true,
        message: '👽 Kosmisches Signal aus den Weiten der Galaxie empfangen! (+50 Logik-XP, Alien-Moodlet)'
      };
    }
    return {
      detected: false,
      message: '📡 Nur interstellares Rauschen im Radioteleskop empfangen.'
    };
  }

  public exportData(): Record<string, any> {
    return {
      discoveries: this.discoveries,
      meteoritesCollected: this.meteoritesCollected,
      alienSignalsDetected: this.alienSignalsDetected
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.discoveries) this.discoveries = data.discoveries;
    if (data.meteoritesCollected !== undefined) this.meteoritesCollected = data.meteoritesCollected;
    if (data.alienSignalsDetected !== undefined) this.alienSignalsDetected = data.alienSignalsDetected;
  }
}
