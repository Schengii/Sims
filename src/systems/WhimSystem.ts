/**
 * Wants, Fears & Whims System
 * Manages active whims (short-term desires) and fears for Sims,
 * granting satisfaction reward points upon fulfillment.
 * v18: Whims are now trait-personalized — romantic sims get romance whims, etc.
 */

import { Sim } from '../entity/Sim';

export interface Whim {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardPoints: number;
  category: 'social' | 'creative' | 'fitness' | 'skill' | 'fun' | 'needs' | 'romance';
  isPinned?: boolean;
  /** If set, only shown for sims with this trait ID */
  traitAffinity?: string;
  /** The action type that fulfills this whim */
  fulfillsOn: string;
}

export interface Fear {
  id: string;
  title: string;
  description: string;
  icon: string;
  triggerCondition: string;
  cureCondition: string;
}

export class WhimManager {
  private activeWhims: Whim[] = [];

  private static WHIM_DATABASE: Whim[] = [
    // General Whims
    { id: 'w1',  title: 'Gemälde malen',          description: 'Gieße deine Kreativität auf die Staffelei',          icon: '🎨', rewardPoints: 75,  category: 'creative', fulfillsOn: 'painting' },
    { id: 'w2',  title: 'Freundlich grüßen',       description: 'Plaudere kurz mit einem Nachbarn',                   icon: '👋', rewardPoints: 50,  category: 'social',   fulfillsOn: 'social' },
    { id: 'w3',  title: 'Gourmet-Mahlzeit kochen', description: 'Zaubere ein köstliches Essen am Herd',               icon: '🍳', rewardPoints: 100, category: 'skill',    fulfillsOn: 'cooking' },
    { id: 'w4',  title: 'Im Pool schwimmen',        description: 'Kühle dich mit ein paar Bahnen im Wasser ab',        icon: '🏊', rewardPoints: 60,  category: 'fitness',  fulfillsOn: 'swimming' },
    { id: 'w5',  title: 'Am PC programmieren',      description: 'Schreibe ein neues Programm-Skript',                 icon: '💻', rewardPoints: 90,  category: 'skill',    fulfillsOn: 'programming' },
    { id: 'w6',  title: 'Radio hören & Tanzen',     description: 'Tanze wild zu den Simlish-Beats',                   icon: '🕺', rewardPoints: 40,  category: 'fun',      fulfillsOn: 'dancing' },
    { id: 'w7',  title: 'Schaumbad nehmen',         description: 'Entspanne dich in der warmen Badewanne',             icon: '🛁', rewardPoints: 50,  category: 'needs',    fulfillsOn: 'bathing' },
    { id: 'w8',  title: 'Gitarre spielen',          description: 'Spiele ein akustisches Solo',                        icon: '🎸', rewardPoints: 80,  category: 'creative', fulfillsOn: 'guitar' },
    { id: 'w9',  title: 'Schach spielen',           description: 'Schärfe deinen Verstand bei einer Partie Schach',   icon: '♟️', rewardPoints: 65,  category: 'skill',    fulfillsOn: 'chess' },
    { id: 'w10', title: 'Sport machen',             description: 'Bring deinen Körper in Schwung',                    icon: '🏋️', rewardPoints: 70,  category: 'fitness',  fulfillsOn: 'fitness' },

    // Trait-specific Whims (Romantic trait)
    { id: 'w_romance1', title: 'Romantisches Kompliment', description: 'Mach jemandem ein herzliches Kompliment!',    icon: '💕', rewardPoints: 90,  category: 'romance',  fulfillsOn: 'romance', traitAffinity: 'romantic' },
    { id: 'w_romance2', title: 'Beim Tanzen verführen',   description: 'Tanz und flirte zugleich!',                   icon: '💃', rewardPoints: 80,  category: 'romance',  fulfillsOn: 'dancing', traitAffinity: 'romantic' },
    { id: 'w_romance3', title: 'Liebesbrief schreiben',   description: 'Schreibe einen Brief am PC',                  icon: '💌', rewardPoints: 100, category: 'romance',  fulfillsOn: 'programming', traitAffinity: 'romantic' },

    // Genius trait
    { id: 'w_genius1', title: 'Wissenschaft erkunden',  description: 'Beschäftige dich mit Logik & Technik',          icon: '🧪', rewardPoints: 85,  category: 'skill',    fulfillsOn: 'chess', traitAffinity: 'genius' },
    { id: 'w_genius2', title: 'Meisterwerk programmieren', description: 'Schreibe 3 Stunden lang Code!',              icon: '🖥️', rewardPoints: 120, category: 'skill',    fulfillsOn: 'programming', traitAffinity: 'genius' },

    // Active trait
    { id: 'w_active1', title: 'Marathon-Training',       description: 'Trainiere auf dem Laufband!',                  icon: '🏃', rewardPoints: 90,  category: 'fitness',  fulfillsOn: 'fitness', traitAffinity: 'active' },
    { id: 'w_active2', title: 'Im Regen joggen',         description: 'Sport auch bei schlechtem Wetter!',            icon: '⛈️', rewardPoints: 75,  category: 'fitness',  fulfillsOn: 'swimming', traitAffinity: 'active' },

    // Artistic trait
    { id: 'w_art1', title: 'Meisterwerk erschaffen',      description: 'Male ein besonderes Gemälde',                  icon: '🖼️', rewardPoints: 120, category: 'creative', fulfillsOn: 'painting', traitAffinity: 'creative' },

    // Party trait
    { id: 'w_party1', title: 'Party veranstalten',        description: 'Lade Freunde ein und feiere!',                 icon: '🎉', rewardPoints: 110, category: 'social',   fulfillsOn: 'social', traitAffinity: 'cheerful' },
  ];

  private static FEAR_DATABASE: Fear[] = [
    { id: 'f1', title: 'Angst vor Feuer',      description: 'Trauma nach einem Küchenbrand. Vermeide brennende Herde.', icon: '🔥', triggerCondition: 'fire_event',  cureCondition: 'Koche erfolgreich 3 Mahlzeiten' },
    { id: 'f2', title: 'Angst vor Dunkelheit', description: 'Die Nacht macht dir Unbehagen.',                            icon: '🌙', triggerCondition: 'night_dark',  cureCondition: 'Halte dich in beleuchteten Räumen auf' },
    { id: 'f3', title: 'Angst vor Einsamkeit', description: 'Du vermisst soziale Kontakte.',                             icon: '🥺', triggerCondition: 'low_social',  cureCondition: 'Führe 3 tiefe Gespräche mit Freunden' },
  ];

  constructor() {
    this.refreshWhims();
  }

  /**
   * Refresh whim list, optionally personalizing based on the sim's active traits.
   * Trait-specific whims get 40% of slots; general whims fill the rest.
   */
  public refreshWhims(sim?: Sim): void {
    // Keep pinned whims
    const pinned = this.activeWhims.filter(w => w.isPinned);
    const needed = 3 - pinned.length;

    const activeTraitIds = sim ? sim.getActiveTraitIds() : [];

    // Separate trait-specific from general whims
    const traitWhims = WhimManager.WHIM_DATABASE.filter(w =>
      w.traitAffinity && activeTraitIds.includes(w.traitAffinity) &&
      !pinned.some(p => p.id === w.id)
    );
    const generalWhims = WhimManager.WHIM_DATABASE.filter(w =>
      !w.traitAffinity && !pinned.some(p => p.id === w.id)
    );

    // Give 1-2 trait slots to trait whims if available
    const shuffledTrait = [...traitWhims].sort(() => 0.5 - Math.random());
    const shuffledGeneral = [...generalWhims].sort(() => 0.5 - Math.random());

    const traitCount = Math.min(shuffledTrait.length, Math.floor(needed * 0.5));
    const generalCount = needed - traitCount;

    const newWhims = [
      ...shuffledTrait.slice(0, traitCount),
      ...shuffledGeneral.slice(0, generalCount)
    ];

    this.activeWhims = [...pinned, ...newWhims];
  }

  public getWhims(): Whim[] {
    return this.activeWhims;
  }

  public getFears(): Fear[] {
    return WhimManager.FEAR_DATABASE;
  }

  public pinWhim(whimId: string): void {
    const whim = this.activeWhims.find(w => w.id === whimId);
    if (whim) {
      whim.isPinned = !whim.isPinned;
    }
  }

  public dismissWhim(whimId: string): void {
    this.activeWhims = this.activeWhims.filter(w => w.id !== whimId);
    this.refreshWhims();
  }

  public checkWhimFulfillment(sim: Sim, actionType: string): Whim | null {
    let fulfilled: Whim | null = null;

    this.activeWhims.forEach(whim => {
      if (whim.fulfillsOn === actionType) {
        fulfilled = whim;
      }
    });

    if (fulfilled) {
      const w = fulfilled as Whim;
      sim.aspirationPoints += w.rewardPoints;
      this.dismissWhim(w.id);
      // Refresh with trait-personalized whims
      this.refreshWhims(sim);
      return w;
    }

    return null;
  }
}
