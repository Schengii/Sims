/**
 * Sims Mobile Quest & Goal Engine
 * Daily rewards, tasks, and achievements to keep gameplay engaging.
 */

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardSimoleons: number;
  completed: boolean;
  progress: number;
  targetProgress: number;
}

export class QuestManager {
  private quests: Quest[] = [];

  constructor() {
    this.generateDailyQuests();
  }

  public generateDailyQuests(): void {
    this.quests = [
      {
        id: 'q_cook',
        title: 'Meisterkoch in Ausbildung',
        description: 'Bereite eine Mahlzeit am Kühlschrank zu.',
        rewardSimoleons: 150,
        completed: false,
        progress: 0,
        targetProgress: 1
      },
      {
        id: 'q_code',
        title: 'Digitale Zukunft',
        description: 'Verbringe Zeit am PC und lerne Programmieren.',
        rewardSimoleons: 200,
        completed: false,
        progress: 0,
        targetProgress: 1
      },
      {
        id: 'q_sleep',
        title: 'Guter Schlaf',
        description: 'Schlafe im gemütlichen Bett, um Energie aufzuladen.',
        rewardSimoleons: 100,
        completed: false,
        progress: 0,
        targetProgress: 1
      }
    ];
  }

  public getQuests(): Quest[] {
    return [...this.quests];
  }

  public triggerQuestProgress(questId: string): Quest | null {
    const quest = this.quests.find(q => q.id === questId && !q.completed);
    if (quest) {
      quest.progress++;
      if (quest.progress >= quest.targetProgress) {
        quest.completed = true;
        return quest;
      }
    }
    return null;
  }
}
