/**
 * Wants, Fears & Whims System
 * Manages active whims (short-term desires) and fears for Sims,
 * granting satisfaction reward points upon fulfillment.
 */

import { Sim } from '../entity/Sim';

export interface Whim {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardPoints: number;
  category: 'social' | 'creative' | 'fitness' | 'skill' | 'fun' | 'needs';
  isPinned?: boolean;
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
    { id: 'w1', title: 'Gemälde malen', description: 'Gieße deine Kreativität auf die Staffelei', icon: '🎨', rewardPoints: 75, category: 'creative' },
    { id: 'w2', title: 'Freundlich grüßen', description: 'Plaudere kurz mit einem Nachbarn', icon: '👋', rewardPoints: 50, category: 'social' },
    { id: 'w3', title: 'Gourmet-Mahlzeit kochen', description: 'Zaubere ein köstliches Essen am Herd', icon: '🍳', rewardPoints: 100, category: 'skill' },
    { id: 'w4', title: 'Im Pool schwimmen', description: 'Kühle dich mit ein paar Bahnen im Wasser ab', icon: '🏊', rewardPoints: 60, category: 'fitness' },
    { id: 'w5', title: 'Am PC programmieren', description: 'Schreibe ein neues Programm-Skript', icon: '💻', rewardPoints: 90, category: 'skill' },
    { id: 'w6', title: 'Radio hören & Tanzen', description: 'Tanze wild zu den Simlish-Beats', icon: '🕺', rewardPoints: 40, category: 'fun' },
    { id: 'w7', title: 'Schaumbad nehmen', description: 'Entspanne dich in der warmen Badewanne', icon: '🛁', rewardPoints: 50, category: 'needs' },
    { id: 'w8', title: 'Gitarre spielen', description: 'Spiele ein akustisches Solo', icon: '🎸', rewardPoints: 80, category: 'creative' },
  ];

  private static FEAR_DATABASE: Fear[] = [
    { id: 'f1', title: 'Angst vor Feuer', description: 'Trauma nach einem Küchenbrand. Vermeide brennende Herde.', icon: '🔥', triggerCondition: 'fire_event', cureCondition: 'Koche erfolgreich 3 Mahlzeiten' },
    { id: 'f2', title: 'Angst vor Dunkelheit', description: 'Die Nacht macht dir Unbehagen.', icon: '🌙', triggerCondition: 'night_dark', cureCondition: 'Halte dich in beleuchteten Räumen auf' },
    { id: 'f3', title: 'Angst vor Einsamkeit', description: 'Du vermisst soziale Kontakte.', icon: '🥺', triggerCondition: 'low_social', cureCondition: 'Führe 3 tiefe Gespräche mit Freunden' },
  ];

  constructor() {
    this.refreshWhims();
  }

  public refreshWhims(): void {
    // Keep pinned whims
    const pinned = this.activeWhims.filter(w => w.isPinned);
    const needed = 3 - pinned.length;

    const available = WhimManager.WHIM_DATABASE.filter(w => !pinned.some(p => p.id === w.id));
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const newWhims = shuffled.slice(0, needed);

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
      if (
        (whim.id === 'w1' && actionType === 'painting') ||
        (whim.id === 'w2' && actionType === 'social') ||
        (whim.id === 'w3' && actionType === 'cooking') ||
        (whim.id === 'w4' && actionType === 'swimming') ||
        (whim.id === 'w5' && actionType === 'programming') ||
        (whim.id === 'w6' && actionType === 'dancing') ||
        (whim.id === 'w7' && actionType === 'bathing') ||
        (whim.id === 'w8' && actionType === 'guitar')
      ) {
        fulfilled = whim;
      }
    });

    if (fulfilled) {
      const w = fulfilled as Whim;
      sim.aspirationPoints += w.rewardPoints;
      this.dismissWhim(w.id);
      return w;
    }

    return null;
  }
}
