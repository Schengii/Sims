/**
 * Sims Life Stage Engine
 * Defines 6 life stages (Baby, Toddler, Child, Teen, Adult, Senior),
 * render scaling, aging day thresholds, and stage progression.
 */

export type LifeStageType = 'baby' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';

export interface LifeStageInfo {
  type: LifeStageType;
  label: string;
  icon: string;
  renderScale: number;
  daysInStage: number;
}

export class LifeStage {
  public static getInfo(stage: LifeStageType): LifeStageInfo {
    switch (stage) {
      case 'baby':
        return { type: 'baby', label: 'Baby', icon: '🍼', renderScale: 0.45, daysInStage: 5 };
      case 'toddler':
        return { type: 'toddler', label: 'Kleinkind', icon: '🧸', renderScale: 0.65, daysInStage: 7 };
      case 'child':
        return { type: 'child', label: 'Kind', icon: '🎒', renderScale: 0.8, daysInStage: 10 };
      case 'teen':
        return { type: 'teen', label: 'Teenager', icon: '🎧', renderScale: 0.95, daysInStage: 12 };
      case 'adult':
        return { type: 'adult', label: 'Erwachsener', icon: '💼', renderScale: 1.0, daysInStage: 20 };
      case 'senior':
        return { type: 'senior', label: 'Senior', icon: '👵', renderScale: 0.95, daysInStage: 15 };
    }
  }

  public static getNextStage(stage: LifeStageType): LifeStageType {
    const order: LifeStageType[] = ['baby', 'toddler', 'child', 'teen', 'adult', 'senior'];
    const idx = order.indexOf(stage);
    return idx < order.length - 1 ? order[idx + 1] : 'senior';
  }
}
