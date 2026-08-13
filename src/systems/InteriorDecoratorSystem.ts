/**
 * Interior Decorator Career & Client Gigs System
 * Allows Sims to accept interior design jobs for NPC Townies, comply with style briefs,
 * and earn money, client reviews, and decorator reputation.
 */

export interface DecoratorGig {
  id: string;
  clientName: string;
  roomType: 'Wohnzimmer' | 'Schlafzimmer' | 'Küche' | 'Luxus-Bad' | 'Spiele-Zimmer';
  preferredStyle: 'Modern' | 'Klassisch' | 'Cyberpunk' | 'Gemütlich' | 'Luxus';
  preferredColor: 'Rot' | 'Blau' | 'Grün' | 'Gold' | 'Lila';
  budget: number;
  reward: number;
  minItemsReq: number;
  status: 'available' | 'active' | 'completed';
}

export class InteriorDecoratorSystem {
  private gigs: DecoratorGig[] = [];
  private activeGig: DecoratorGig | null = null;
  private reputationRank: number = 1; // 1 to 5
  private reputationXP: number = 0;

  constructor() {
    this.generateDefaultGigs();
  }

  private generateDefaultGigs() {
    this.gigs = [
      {
        id: 'gig_goth_living',
        clientName: 'Mortimer Goth',
        roomType: 'Wohnzimmer',
        preferredStyle: 'Klassisch',
        preferredColor: 'Rot',
        budget: 4500,
        reward: 1800,
        minItemsReq: 3,
        status: 'available'
      },
      {
        id: 'gig_pizazz_bedroom',
        clientName: 'Penny Pizazz',
        roomType: 'Schlafzimmer',
        preferredStyle: 'Cyberpunk',
        preferredColor: 'Lila',
        budget: 6000,
        reward: 2600,
        minItemsReq: 4,
        status: 'available'
      },
      {
        id: 'gig_pancakes_kitchen',
        clientName: 'Bob Pancakes',
        roomType: 'Küche',
        preferredStyle: 'Gemütlich',
        preferredColor: 'Grün',
        budget: 3500,
        reward: 1400,
        minItemsReq: 3,
        status: 'available'
      },
      {
        id: 'gig_landgraab_bath',
        clientName: 'Geoffrey Landgraab',
        roomType: 'Luxus-Bad',
        preferredStyle: 'Luxus',
        preferredColor: 'Gold',
        budget: 9000,
        reward: 4200,
        minItemsReq: 4,
        status: 'available'
      }
    ];
  }

  public getGigs(): DecoratorGig[] {
    return this.gigs;
  }

  public getActiveGig(): DecoratorGig | null {
    return this.activeGig;
  }

  public getReputationRank(): number {
    return this.reputationRank;
  }

  public getReputationXP(): number {
    return this.reputationXP;
  }

  public acceptGig(gigId: string): { success: boolean; message: string } {
    if (this.activeGig) {
      return { success: false, message: 'Du arbeitest bereits an einem aktiven Einrichtungsauftrag!' };
    }

    const gig = this.gigs.find(g => g.id === gigId);
    if (!gig || gig.status !== 'available') {
      return { success: false, message: 'Dieser Auftrag ist nicht mehr verfügbar.' };
    }

    gig.status = 'active';
    this.activeGig = gig;
    return {
      success: true,
      message: `🎨 Auftrag für ${gig.clientName} (${gig.roomType}) angenommen! Budget: §${gig.budget}.`
    };
  }

  public submitActiveGig(itemsPlacedCount: number): { success: boolean; message: string; reward: number; ratingStars: number } {
    if (!this.activeGig) {
      return { success: false, message: 'Kein aktiver Auftrag vorhanden.', reward: 0, ratingStars: 0 };
    }

    const gig = this.activeGig;
    let ratingStars = 3.0;

    if (itemsPlacedCount >= gig.minItemsReq) {
      ratingStars += 1.5;
    } else {
      ratingStars -= 1.0;
    }

    ratingStars = Math.min(5.0, Math.max(1.0, ratingStars));
    const totalPayout = Math.round(gig.reward * (ratingStars / 4.0));

    this.reputationXP += Math.round(150 * ratingStars);
    if (this.reputationXP >= this.reputationRank * 400 && this.reputationRank < 5) {
      this.reputationRank++;
    }

    gig.status = 'completed';
    this.activeGig = null;

    // Refresh available gigs
    setTimeout(() => {
      gig.status = 'available';
    }, 10000);

    const clientReaction = ratingStars >= 4.0 ? 'ist absolut begeistert! ❤️' : 'findet das Design ganz nett. 🙂';

    return {
      success: true,
      message: `✨ Auftrag abgeschlossen! ${gig.clientName} ${clientReaction} ⭐ Bewertung: ${ratingStars.toFixed(1)}/5.0. Honoriar: §${totalPayout.toLocaleString()}!`,
      reward: totalPayout,
      ratingStars
    };
  }

  public exportData(): any {
    return {
      gigs: this.gigs,
      activeGig: this.activeGig,
      reputationRank: this.reputationRank,
      reputationXP: this.reputationXP
    };
  }

  public importData(data: any) {
    if (data) {
      if (Array.isArray(data.gigs)) this.gigs = data.gigs;
      this.activeGig = data.activeGig || null;
      this.reputationRank = data.reputationRank || 1;
      this.reputationXP = data.reputationXP || 0;
    }
  }
}
