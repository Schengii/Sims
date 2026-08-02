/**
 * Career & Job Promotion Engine
 * Tracks career progression, required skill levels, daily salary (§), and promotions.
 */

import { Sim } from '../entity/Sim';

export interface CareerTrack {
  id: string;
  title: string;
  icon: string;
  levels: Array<{
    rank: number;
    jobTitle: string;
    salaryPerDay: number;
    requiredSkill: {
      skill: keyof Sim['skills'];
      level: number;
    };
  }>;
}

export const CAREERS: Record<string, CareerTrack> = {
  tech_guru: {
    id: 'tech_guru',
    title: 'Tech Guru & Software Dev',
    icon: '💻',
    levels: [
      { rank: 1, jobTitle: 'QA Tester', salaryPerDay: 180, requiredSkill: { skill: 'programming', level: 1 } },
      { rank: 2, jobTitle: 'Junior Developer', salaryPerDay: 350, requiredSkill: { skill: 'programming', level: 2 } },
      { rank: 3, jobTitle: 'Lead Software Architect', salaryPerDay: 750, requiredSkill: { skill: 'programming', level: 4 } },
      { rank: 4, jobTitle: 'CTO & Tech Startup Founder', salaryPerDay: 1500, requiredSkill: { skill: 'programming', level: 6 } }
    ]
  },

  master_chef: {
    id: 'master_chef',
    title: 'Gourmet Chef',
    icon: '🍳',
    levels: [
      { rank: 1, jobTitle: 'Tellerwäscher', salaryPerDay: 150, requiredSkill: { skill: 'cooking', level: 1 } },
      { rank: 2, jobTitle: 'Sous Chef', salaryPerDay: 320, requiredSkill: { skill: 'cooking', level: 2 } },
      { rank: 3, jobTitle: 'Chef de Cuisine', salaryPerDay: 680, requiredSkill: { skill: 'cooking', level: 4 } },
      { rank: 4, jobTitle: '3-Sterne Sternekoch', salaryPerDay: 1400, requiredSkill: { skill: 'cooking', level: 6 } }
    ]
  },

  artist: {
    id: 'artist',
    title: 'Freiberuflicher Künstler',
    icon: '🎨',
    levels: [
      { rank: 1, jobTitle: 'Straßenmaler', salaryPerDay: 140, requiredSkill: { skill: 'painting', level: 1 } },
      { rank: 2, jobTitle: 'Galerie-Aussteller', salaryPerDay: 300, requiredSkill: { skill: 'painting', level: 2 } },
      { rank: 3, jobTitle: 'Renommierter Meistermaler', salaryPerDay: 700, requiredSkill: { skill: 'painting', level: 4 } }
    ]
  }
};

export class CareerManager {
  public currentCareerId: string = 'tech_guru';
  public currentRank: number = 1;

  public getCareerInfo() {
    const career = CAREERS[this.currentCareerId];
    const currentLevel = career.levels.find(l => l.rank === this.currentRank) || career.levels[0];
    const nextLevel = career.levels.find(l => l.rank === this.currentRank + 1);

    return {
      careerTitle: career.title,
      icon: career.icon,
      jobTitle: currentLevel.jobTitle,
      salary: currentLevel.salaryPerDay,
      nextLevel
    };
  }

  public checkPromotion(sim: Sim): { promoted: boolean; newJobTitle?: string } {
    const career = CAREERS[this.currentCareerId];
    const nextLevel = career.levels.find(l => l.rank === this.currentRank + 1);

    if (!nextLevel) return { promoted: false }; // Max rank reached

    const req = nextLevel.requiredSkill;
    const currentSkillLevel = Math.floor(sim.skills[req.skill]);

    if (currentSkillLevel >= req.level) {
      this.currentRank++;
      return { promoted: true, newJobTitle: nextLevel.jobTitle };
    }

    return { promoted: false };
  }

  public payoutDailySalary(sim: Sim): number {
    const info = this.getCareerInfo();
    sim.simoleons += info.salary;
    return info.salary;
  }
}
