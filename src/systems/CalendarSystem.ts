/**
 * In-Game Calendar & Seasonal Holiday System for Sims 5
 * Manages seasonal calendar days, annual holidays, traditions, and rewards.
 */

export interface Tradition {
  id: string;
  name: string;
  icon: string;
  description: string;
  isCompleted?: boolean;
}

export interface HolidayDef {
  id: string;
  name: string;
  icon: string;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
  dayOfSeason: number;
  description: string;
  traditions: Tradition[];
  rewardSimoleons: number;
}

export const HOLIDAYS_CATALOG: Record<string, HolidayDef> = {
  winterfest: {
    id: 'winterfest',
    name: 'Winterfest ❄️',
    icon: '🎄',
    season: 'winter',
    dayOfSeason: 5,
    description: 'Feiere das große Winterfest! Auspacken von Geschenken, Festmahl genießen & den Weihnachtsbaum schmücken.',
    rewardSimoleons: 1000,
    traditions: [
      { id: 't_presents', name: 'Geschenke auspacken', icon: '🎁', description: 'Öffne ein Überraschungsgeschenk im Inventar.' },
      { id: 't_feast', name: 'Festmahl genießen', icon: '🍖', description: 'Isst eine warme Mahlzeit am Esstisch.' },
      { id: 't_snowman', name: 'Schneemann bauen', icon: '⛄', description: 'Baue im verschneiten Garten einen Schneemann.' }
    ]
  },
  love_day: {
    id: 'love_day',
    name: 'Tag der Liebe 💘',
    icon: '💖',
    season: 'spring',
    dayOfSeason: 3,
    description: 'Ein Tag voller Romantik! Verschenke Blumen, stoße mit deinem Herzblatt an und genieße die Liebe.',
    rewardSimoleons: 800,
    traditions: [
      { id: 't_flowers', name: 'Blumen schenken', icon: '💐', description: 'Schenke deinem Partner oder Nachbarn Blumen.' },
      { id: 't_flirt', name: 'Romantisch flirten', icon: '💋', description: 'Führe 2 romantische Interaktionen aus.' },
      { id: 't_toast', name: 'Liebes-Toast anstoßen', icon: '🥂', description: 'Stoße mit einem Erfrischungsgetränk an.' }
    ]
  },
  summer_fest: {
    id: 'summer_fest',
    name: 'Sommerfest & Pool-Party ☀️',
    icon: '🏖️',
    season: 'summer',
    dayOfSeason: 4,
    description: 'Sommer, Sonne & Badespaß! Springe in den Pool, veranstalte ein BBQ und genieße kühle Drinks.',
    rewardSimoleons: 900,
    traditions: [
      { id: 't_pool', name: 'Im Pool schwimmen', icon: '🏊', description: 'Schwimme mindestens einmal im Swimming-Pool.' },
      { id: 't_bbq', name: 'BBQ Grillen', icon: '🌭', description: 'Bereite Party-Snacks am Buffet zu.' },
      { id: 't_sun', name: 'Sonnenbaden & Tanzen', icon: '🕺', description: 'Tanze am Radio zu Sommer-Beats.' }
    ]
  },
  halloween: {
    id: 'halloween',
    name: 'Gruselnacht 🎃',
    icon: '👻',
    season: 'autumn',
    dayOfSeason: 6,
    description: 'Süßes oder Saures! Schnitze Kürbisse, verkleide dich und erschrecke die Nachbarschaft.',
    rewardSimoleons: 750,
    traditions: [
      { id: 't_pumpkin', name: 'Kürbis schnitzen', icon: '🎃', description: 'Ernte oder schnitze einen gruseligen Kürbis.' },
      { id: 't_costume', name: 'Kostüm anziehen', icon: '🧙‍♂️', description: 'Ziehe ein magisches Grusel-Outfit an.' },
      { id: 't_scare', name: 'Nachbarn erschrecken', icon: '🕷️', description: 'Scherze und streichle mit Besuchern.' }
    ]
  }
};

export class CalendarManager {
  public currentSeason: 'spring' | 'summer' | 'autumn' | 'winter' = 'spring';
  public dayOfSeason: number = 1;
  public completedTraditions: string[] = [];

  public updateTime(day: number): void {
    const seasons: Array<'spring' | 'summer' | 'autumn' | 'winter'> = ['spring', 'summer', 'autumn', 'winter'];
    const seasonIndex = Math.floor(((day - 1) / 7) % 4);
    const oldSeason = this.currentSeason;
    this.currentSeason = seasons[seasonIndex];
    this.dayOfSeason = ((day - 1) % 7) + 1;

    // Reset completed traditions on season change
    if (oldSeason !== this.currentSeason) {
      this.completedTraditions = [];
    }
  }

  public getTodayHoliday(): HolidayDef | null {
    return Object.values(HOLIDAYS_CATALOG).find(
      h => h.season === this.currentSeason && h.dayOfSeason === this.dayOfSeason
    ) || null;
  }

  public completeTradition(traditionId: string): boolean {
    if (!this.completedTraditions.includes(traditionId)) {
      this.completedTraditions.push(traditionId);
      return true; // Newly completed!
    }
    return false;
  }
}
