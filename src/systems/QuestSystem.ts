/**
 * Sims Mobile Quest & Goal Engine
 * Daily rewards, tasks, and achievements to keep gameplay engaging.
 * v18: Rotating pool of 20+ quests with daily reset and multi-step progress tracking.
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardSimoleons: number;
  rewardAspirationPoints: number;
  completed: boolean;
  progress: number;
  targetProgress: number;
  category: 'skill' | 'social' | 'needs' | 'build' | 'career' | 'life' | 'special';
  requiredTraitId?: string; // If set, only shown for sims with this trait
}

const QUEST_POOL: Omit<Quest, 'completed' | 'progress'>[] = [
  // Skill quests
  { id: 'q_cook',         title: 'Meisterkoch in Ausbildung',    description: 'Bereite eine Mahlzeit am Kühlschrank zu.',                     icon: '🍳', rewardSimoleons: 150, rewardAspirationPoints: 50,  targetProgress: 1, category: 'skill' },
  { id: 'q_cook3',        title: 'Gourmet-Wochenende',           description: 'Koche 3 verschiedene Mahlzeiten in Folge.',                      icon: '👨‍🍳', rewardSimoleons: 400, rewardAspirationPoints: 100, targetProgress: 3, category: 'skill' },
  { id: 'q_code',         title: 'Digitale Zukunft',             description: 'Verbringe Zeit am PC und lerne Programmieren.',                  icon: '💻', rewardSimoleons: 200, rewardAspirationPoints: 60,  targetProgress: 1, category: 'skill' },
  { id: 'q_code2',        title: 'Software Architekt',           description: 'Programmiere an 2 verschiedenen Tagen.',                         icon: '🖥️', rewardSimoleons: 350, rewardAspirationPoints: 90,  targetProgress: 2, category: 'skill' },
  { id: 'q_paint',        title: 'Kreative Stunde',              description: 'Male ein Gemälde an der Staffelei.',                             icon: '🎨', rewardSimoleons: 180, rewardAspirationPoints: 55,  targetProgress: 1, category: 'skill' },
  { id: 'q_paint3',       title: 'Galeriekünstler',              description: 'Male 3 Gemälde und verkaufe sie.',                               icon: '🖼️', rewardSimoleons: 500, rewardAspirationPoints: 120, targetProgress: 3, category: 'skill' },
  { id: 'q_fitness',      title: 'Sportlicher Start',            description: 'Trainiere auf dem Laufband oder im Pool.',                       icon: '🏃', rewardSimoleons: 160, rewardAspirationPoints: 50,  targetProgress: 1, category: 'skill' },
  { id: 'q_music',        title: 'Gitarren-Solo',                description: 'Spiele Gitarre und sammle Trinkgeld.',                           icon: '🎸', rewardSimoleons: 220, rewardAspirationPoints: 65,  targetProgress: 1, category: 'skill' },
  // Social quests
  { id: 'q_social',       title: 'Sozialschmetterling',          description: 'Unterhalte dich mit einem Nachbarn.',                            icon: '💬', rewardSimoleons: 120, rewardAspirationPoints: 40,  targetProgress: 1, category: 'social' },
  { id: 'q_social3',      title: 'Beliebtheitswelle',            description: 'Interagiere mit 3 verschiedenen NPCs.',                          icon: '🤝', rewardSimoleons: 300, rewardAspirationPoints: 80,  targetProgress: 3, category: 'social' },
  { id: 'q_romance',      title: 'Romantische Atmosphäre',       description: 'Komplimentiere einen anderen Sim.',                               icon: '💕', rewardSimoleons: 200, rewardAspirationPoints: 70,  targetProgress: 1, category: 'social' },
  { id: 'q_dance',        title: 'Party-Löwe',                   description: 'Tanze zum Radio.',                                               icon: '🕺', rewardSimoleons: 130, rewardAspirationPoints: 45,  targetProgress: 1, category: 'social' },
  // Needs quests
  { id: 'q_sleep',        title: 'Guter Schlaf',                 description: 'Schlafe im gemütlichen Bett, um Energie aufzuladen.',            icon: '😴', rewardSimoleons: 100, rewardAspirationPoints: 30,  targetProgress: 1, category: 'needs' },
  { id: 'q_hygiene',      title: 'Frisch & Sauber',              description: 'Dusche oder bade dich.',                                         icon: '🚿', rewardSimoleons: 80,  rewardAspirationPoints: 25,  targetProgress: 1, category: 'needs' },
  { id: 'q_swim',         title: 'Kühle Bahnen',                 description: 'Schwimme im Pool.',                                              icon: '🏊', rewardSimoleons: 140, rewardAspirationPoints: 40,  targetProgress: 1, category: 'needs' },
  // Career quests
  { id: 'q_career',       title: 'Karriere-Booster',             description: 'Arbeite an deiner Karriere und erfülle Skill-Anforderungen.',    icon: '💼', rewardSimoleons: 250, rewardAspirationPoints: 75,  targetProgress: 1, category: 'career' },
  { id: 'q_skill_up',     title: 'Skill-Aufstieg',               description: 'Steigere einen beliebigen Skill um 1 Level.',                    icon: '⬆️', rewardSimoleons: 300, rewardAspirationPoints: 85,  targetProgress: 1, category: 'career' },
  // Life quests
  { id: 'q_garden',       title: 'Grüner Daumen',                description: 'Gieße deine Gartenpflanzen.',                                    icon: '🌱', rewardSimoleons: 110, rewardAspirationPoints: 35,  targetProgress: 1, category: 'life' },
  { id: 'q_party',        title: 'Gastgeber des Abends',         description: 'Veranstalte eine Hausparty.',                                    icon: '🎉', rewardSimoleons: 350, rewardAspirationPoints: 100, targetProgress: 1, category: 'life' },
  { id: 'q_simoleons',    title: 'Sparfuchs',                    description: 'Spare 1.000 Simoleons in einer Spielsitzung.',                   icon: '💰', rewardSimoleons: 200, rewardAspirationPoints: 60,  targetProgress: 1000, category: 'life' },
  // Special quests
  { id: 'q_magic',        title: 'Magische Praxis',              description: 'Wirke einen Zauberspruch.',                                      icon: '🔮', rewardSimoleons: 280, rewardAspirationPoints: 80,  targetProgress: 1, category: 'special' },
  { id: 'q_travel',       title: 'Weltenbummler',                description: 'Reise zu einem Urlaubsziel.',                                    icon: '✈️', rewardSimoleons: 400, rewardAspirationPoints: 110, targetProgress: 1, category: 'special' },
];

export class QuestManager {
  private quests: Quest[] = [];
  private lastResetDay: number = -1;
  private readonly DAILY_QUEST_COUNT = 5;

  constructor() {
    this.generateDailyQuests();
  }

  /**
   * Generate a randomized selection of daily quests from the pool.
   * Called on construction and daily reset.
   */
  public generateDailyQuests(traitId?: string): void {
    // Filter pool: always include non-trait quests, optionally include trait-specific ones
    const available = QUEST_POOL.filter(q => !q.requiredTraitId || q.requiredTraitId === traitId);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    this.quests = shuffled.slice(0, this.DAILY_QUEST_COUNT).map(def => ({
      ...def,
      completed: false,
      progress: 0
    }));
  }

  /**
   * Check if a new day has started and reset quests if so.
   * Should be called from the game loop with the current game day number.
   */
  public checkDailyReset(gameDay: number, traitId?: string): boolean {
    if (gameDay !== this.lastResetDay) {
      this.lastResetDay = gameDay;
      // Keep completed quests count for stats, then regenerate
      this.generateDailyQuests(traitId);
      return true; // Reset happened
    }
    return false;
  }

  public getQuests(): Quest[] {
    return [...this.quests];
  }

  public getActiveQuests(): Quest[] {
    return this.quests.filter(q => !q.completed);
  }

  public getCompletedCount(): number {
    return this.quests.filter(q => q.completed).length;
  }

  /**
   * Trigger progress on a quest by ID.
   * @returns The quest if it was just completed, null otherwise.
   */
  public triggerQuestProgress(questId: string, amount: number = 1): Quest | null {
    const quest = this.quests.find(q => q.id === questId && !q.completed);
    if (quest) {
      quest.progress = Math.min(quest.progress + amount, quest.targetProgress);
      if (quest.progress >= quest.targetProgress) {
        quest.completed = true;
        return quest;
      }
    }
    return null;
  }

  /**
   * Trigger progress across ALL matching quest categories or IDs.
   * Useful for "cooking" triggering any cooking-related quest.
   */
  public triggerByCategory(category: Quest['category'], amount: number = 1): Quest[] {
    const completed: Quest[] = [];
    this.quests
      .filter(q => q.category === category && !q.completed)
      .forEach(q => {
        const result = this.triggerQuestProgress(q.id, amount);
        if (result) completed.push(result);
      });
    return completed;
  }

  /** Export state for SaveManager */
  public exportData() {
    return {
      quests: this.quests,
      lastResetDay: this.lastResetDay
    };
  }

  /** Import state from SaveManager */
  public importData(data: any): void {
    if (!data) return;
    if (Array.isArray(data.quests)) this.quests = data.quests;
    if (typeof data.lastResetDay === 'number') this.lastResetDay = data.lastResetDay;
  }
}
