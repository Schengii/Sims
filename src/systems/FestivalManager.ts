/**
 * Festival & Seasonal Activities Manager
 * Handles seasonal market booths, festivals (Spring Blossom, Summer Splash, Autumn Harvest, Winter Wonderland),
 * activities (Snowman building, Pumpkin carving, Water balloon fight, Blossom flower picking).
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonalFestivalInfo {
  season: SeasonType;
  name: string;
  icon: string;
  description: string;
  themeColor: string;
  activities: Array<{
    id: string;
    label: string;
    icon: string;
    rewardDesc: string;
    funGain: number;
  }>;
}

export const FESTIVALS_CATALOG: Record<SeasonType, SeasonalFestivalInfo> = {
  spring: {
    season: 'spring',
    name: '🌸 Frühlingsblüten-Fest',
    icon: '🌸',
    description: 'Bunte Blumenwiesen, frische Garten-Samen und traditioneller Tanz um den Maibaum.',
    themeColor: '#e84393',
    activities: [
      { id: 'pick_flowers', label: 'Wilde Blüten pflücken', icon: '💐', rewardDesc: 'Blumenstrauß im Inventar (+§ 60)', funGain: 25 },
      { id: 'egg_hunt', label: 'Ostereier-Suche im Park', icon: '🥚', rewardDesc: 'Schoko-Belohnung (+§ 100)', funGain: 35 }
    ]
  },
  summer: {
    season: 'summer',
    name: '☀️ Sommer-Sonnwend & Beach-Party',
    icon: '☀️',
    description: 'Pool-Spiele, Wasserballon-Schlachten und erfrischendes Fruchteis.',
    themeColor: '#f1c40f',
    activities: [
      { id: 'water_balloon', label: 'Wasserballon-Schlacht', icon: '🎈', rewardDesc: 'Maximale Abkühlung & Spaß', funGain: 45 },
      { id: 'sunbath', label: 'Sonnenbaden & Eis schlecken', icon: '🍦', rewardDesc: 'Sommerlicher Stimmungs-Boost', funGain: 30 }
    ]
  },
  autumn: {
    season: 'autumn',
    name: '🎃 Herbst-Ernte & Grusel-Kürbisfest',
    icon: '🎃',
    description: 'Kürbisschnitzen, Apfeltauchen und bunte Herbstlaub-Haufen zum Hineinspringen.',
    themeColor: '#d35400',
    activities: [
      { id: 'carve_pumpkin', label: 'Halloween-Kürbis schnitzen', icon: '🎃', rewardDesc: 'Geschnitzter Leuchtkürbis (+§ 90)', funGain: 30 },
      { id: 'leaf_jump', label: 'In Laubhaufen springen', icon: '🍂', rewardDesc: 'Pure Lebensfreude', funGain: 40 }
    ]
  },
  winter: {
    season: 'winter',
    name: '❄️ Winter-Wunderland & Eisfestival',
    icon: '❄️',
    description: 'Schneemann bauen, Schneeballschlacht und Eislaufen auf dem gefrorenen Teich.',
    themeColor: '#00e5ff',
    activities: [
      { id: 'build_snowman', label: 'Schneemann bauen', icon: '☃️', rewardDesc: 'Herrlicher Schneemann errichtet', funGain: 35 },
      { id: 'ice_skate', label: 'Eislauf-Pirouetten drehen', icon: '⛸️', rewardDesc: 'Fitness & Anmut trainiert', funGain: 40 }
    ]
  }
};

export class FestivalManager {
  public static getSeasonFromDay(day: number): SeasonType {
    const cycle = (Math.floor((day - 1) / 7)) % 4;
    const seasons: SeasonType[] = ['spring', 'summer', 'autumn', 'winter'];
    return seasons[cycle];
  }

  public static getFestivalForDay(day: number): SeasonalFestivalInfo {
    const season = this.getSeasonFromDay(day);
    return FESTIVALS_CATALOG[season];
  }

  public static executeActivity(
    activityId: string,
    sim: Sim,
    season: SeasonType
  ): { success: boolean; message: string; icon: string } {
    const fest = FESTIVALS_CATALOG[season];
    const act = fest.activities.find(a => a.id === activityId);
    if (!act) return { success: false, message: 'Unbekannte Aktivität', icon: '❓' };

    sim.needs.modify('fun', act.funGain);
    sim.needs.modify('social', 15);

    if (activityId === 'pick_flowers') {
      sim.inventory.addItem({
        name: 'Bunter Frühlings-Blumenstrauß',
        type: 'crop',
        icon: '💐',
        value: 60,
        description: 'Frisch gepflückte Frühlingsblumen vom Festival.'
      });
    } else if (activityId === 'egg_hunt') {
      sim.simoleons += 100;
    } else if (activityId === 'carve_pumpkin') {
      sim.inventory.addItem({
        name: 'Leuchtender Grusel-Kürbis',
        type: 'painting',
        icon: '🎃',
        value: 90,
        description: 'Ein von Hand kunstvoll geschnitzter Kürbis.'
      });
    }

    sim.triggerEmote(act.icon, 3500);
    sim.moodletManager.addMoodlet({
      id: `festival_${activityId}`,
      name: `Festival: ${act.label}`,
      emotion: 'happy',
      weight: 2,
      durationSec: 180,
      icon: act.icon,
      description: act.rewardDesc
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: fest.name,
      message: `${sim.customization.name}: ${act.label} abgeschlossen! (${act.rewardDesc})`,
      icon: act.icon,
      type: 'success'
    });

    return { success: true, message: `${act.label} abgeschlossen! ${act.rewardDesc}`, icon: act.icon };
  }
}
