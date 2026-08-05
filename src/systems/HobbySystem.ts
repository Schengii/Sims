/**
 * Hobby, Repair & Freelance System
 * Handles guitar/piano music skills, chess logic skills, handiness repair, and freelance jobs.
 */

import type { Sim } from '../entity/Sim';

export interface FreelanceGig {
  id: string;
  title: string;
  payout: number;
  requiredSkill: 'programming' | 'painting' | 'cooking' | 'charisma';
  description: string;
}

export const FREELANCE_GIGS: FreelanceGig[] = [
  { id: 'web_design', title: 'Start-Up Website Coden', payout: 600, requiredSkill: 'programming', description: 'Programmiere eine moderne Landingpage.' },
  { id: 'portrait_art', title: 'Porträt-Auftragsmalerei', payout: 450, requiredSkill: 'painting', description: 'Male ein Ölgemälde für einen Sammler.' },
  { id: 'catering_gig', title: 'Party Catering Service', payout: 500, requiredSkill: 'cooking', description: 'Bereite Häppchen für ein Event vor.' }
];

export class HobbyManager {
  public handinessXP: number = 0;
  public handinessLevel: number = 1;

  public addHandinessXP(amount: number): boolean {
    this.handinessXP += amount;
    if (this.handinessXP >= this.handinessLevel * 100) {
      this.handinessLevel++;
      return true; // Leveled up
    }
    return false;
  }

  public executeFreelanceGig(sim: Sim, gigId: string): { success: boolean; message: string } {
    const gig = FREELANCE_GIGS.find(g => g.id === gigId);
    if (!gig) return { success: false, message: 'Gig nicht gefunden.' };

    sim.simoleons += gig.payout;
    sim.needs.modify('energy', -15);
    sim.needs.modify('fun', 10);
    return { success: true, message: `💻 Gig "${gig.title}" abgeschlossen! Ertrag: +§ ${gig.payout}` };
  }
}
