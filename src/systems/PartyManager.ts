/**
 * Sims Mobile Party & Event Manager Engine
 * Manages hosting house parties, live goal checklists, guest arrival queues,
 * 5-star scoring system (⭐⭐⭐⭐⭐), and end-of-party Simoleon & Trophy rewards.
 */

export type PartyTypeId = 'housewarming' | 'poolparty' | 'gala';

export interface PartyGoal {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

export interface PartyTypeInfo {
  id: PartyTypeId;
  title: string;
  icon: string;
  description: string;
  durationInGameHours: number;
  goals: PartyGoal[];
}

export class PartyManager {
  public static readonly PARTY_TYPES: Record<PartyTypeId, PartyTypeInfo> = {
    housewarming: {
      id: 'housewarming',
      title: '🥳 Einweihungsparty',
      icon: '🥳',
      description: 'Feiere das neue Heim mit deinen Nachbarn!',
      durationInGameHours: 6,
      goals: [
        { id: 'p_toast', title: 'Party-Toast mit Gästen trinken', points: 25, completed: false },
        { id: 'p_talk', title: 'Mit 3 Partygästen sprechen', points: 25, completed: false },
        { id: 'p_dance', title: 'Am Radio gemeinsam tanzen', points: 25, completed: false },
        { id: 'p_snack', title: 'Party-Snacks servieren', points: 25, completed: false }
      ]
    },
    poolparty: {
      id: 'poolparty',
      title: '🏊‍♂️ Sommer-Poolparty',
      icon: '🏊‍♂️',
      description: 'Erfrischende Abkühlung & Musik am Pool.',
      durationInGameHours: 6,
      goals: [
        { id: 'p_swim', title: 'Gemeinsam im Pool schwimmen', points: 30, completed: false },
        { id: 'p_dance', title: 'Musik am Radio aufdrehen', points: 25, completed: false },
        { id: 'p_toast', title: 'Cocktail-Toast am Pool', points: 25, completed: false },
        { id: 'p_relax', title: 'Auf dem Sofa entspannen', points: 20, completed: false }
      ]
    },
    gala: {
      id: 'gala',
      title: '🎂 Geburtstags-Gala',
      icon: '🎂',
      description: 'Große Gala mit Torte, Musik & Trophäen.',
      durationInGameHours: 8,
      goals: [
        { id: 'p_candles', title: 'Geburtstagskerzen ausblasen', points: 30, completed: false },
        { id: 'p_buffet', title: 'Buffet-Tisch eröffnen', points: 25, completed: false },
        { id: 'p_dance', title: 'Paartanzen mit Gästen', points: 25, completed: false },
        { id: 'p_toast', title: 'Festliche Ansprache halten', points: 20, completed: false }
      ]
    }
  };

  public activeParty: PartyTypeInfo | null = null;
  public remainingMinutes: number = 0;
  public currentScore: number = 0;
  public trophiesUnlocked: string[] = [];

  public startParty(typeId: PartyTypeId): PartyTypeInfo {
    const template = PartyManager.PARTY_TYPES[typeId];
    this.activeParty = JSON.parse(JSON.stringify(template));
    this.remainingMinutes = template.durationInGameHours * 60;
    this.currentScore = 0;
    return this.activeParty!;
  }

  public update(deltaMinutes: number): { partyEnded: boolean; finalStars?: number; rewardSimoleons?: number; trophyAwarded?: string } {
    if (!this.activeParty) return { partyEnded: false };

    this.remainingMinutes -= deltaMinutes;

    if (this.remainingMinutes <= 0) {
      return this.endParty();
    }

    return { partyEnded: false };
  }

  public triggerGoal(goalId: string): boolean {
    if (!this.activeParty) return false;

    const goal = this.activeParty.goals.find(g => g.id === goalId && !g.completed);
    if (goal) {
      goal.completed = true;
      this.currentScore += goal.points;
      return true;
    }

    return false;
  }

  public getStarRating(): number {
    if (this.currentScore >= 90) return 5;
    if (this.currentScore >= 70) return 4;
    if (this.currentScore >= 50) return 3;
    if (this.currentScore >= 25) return 2;
    if (this.currentScore > 0) return 1;
    return 0;
  }

  public endParty(): { partyEnded: boolean; finalStars: number; rewardSimoleons: number; trophyAwarded?: string } {
    if (!this.activeParty) return { partyEnded: false, finalStars: 0, rewardSimoleons: 0 };

    const stars = this.getStarRating();
    const rewardSimoleons = stars * 400 + 200; // § 600 to § 2,200

    let trophyAwarded: string | undefined = undefined;
    if (stars >= 5) {
      trophyAwarded = '🏆 Party-Legende Trophäe (Gold)';
      if (!this.trophiesUnlocked.includes(trophyAwarded)) this.trophiesUnlocked.push(trophyAwarded);
    } else if (stars >= 3) {
      trophyAwarded = '🥈 Party-Profi Trophäe (Silber)';
      if (!this.trophiesUnlocked.includes(trophyAwarded)) this.trophiesUnlocked.push(trophyAwarded);
    }

    this.activeParty = null;
    this.remainingMinutes = 0;

    return {
      partyEnded: true,
      finalStars: stars,
      rewardSimoleons,
      trophyAwarded
    };
  }
}
