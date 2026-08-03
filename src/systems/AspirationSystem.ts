/**
 * Aspiration & Milestone System for Sims 5
 * Manages life goals, milestone achievements, aspiration points,
 * and the Reward Store for special potions and traits.
 */

export interface Milestone {
  id: string;
  level: number;
  description: string;
  rewardPoints: number;
}

export interface AspirationDef {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  milestones: Milestone[];
}

export interface RewardItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  effect: 'replenish_needs' | 'simoleons' | 'age_reset' | 'double_skill_xp';
}

export const ASPIRATIONS_CATALOG: Record<string, AspirationDef> = {
  gourmet_chef: {
    id: 'gourmet_chef',
    title: 'Meisterkoch / Meisterköchin',
    icon: '👨‍🍳',
    category: 'Essen & Genuss',
    description: 'Träumt davon, die kulinarische Welt mit fantastischen Gerichten und Gourmet-Buffets zu erobern.',
    milestones: [
      { id: 'chef_m1', level: 1, description: 'Erreiche Kochen Level 2', rewardPoints: 150 },
      { id: 'chef_m2', level: 2, description: 'Serviere 3 Snacks am Party-Buffet', rewardPoints: 300 },
      { id: 'chef_m3', level: 3, description: 'Erreiche Kochen Level 5', rewardPoints: 500 },
      { id: 'chef_m4', level: 4, description: 'Ernte 5 frische Zutaten im Garten', rewardPoints: 800 }
    ]
  },
  party_animal: {
    id: 'party_animal',
    title: 'Party-Löwe',
    icon: '🎉',
    category: 'Sozial',
    description: 'Will die legendärsten Partys der Stadt veranstalten und stets im Mittelpunkt stehen.',
    milestones: [
      { id: 'party_m1', level: 1, description: 'Veranstalte deine erste Hausparty', rewardPoints: 200 },
      { id: 'party_m2', level: 2, description: 'Stoße mit 3 Gästen an (🥂)', rewardPoints: 350 },
      { id: 'party_m3', level: 3, description: 'Erreiche eine 5-Sterne Partywertung', rewardPoints: 600 },
      { id: 'party_m4', level: 4, description: 'Schalte 3 Party-Trophäen frei', rewardPoints: 1000 }
    ]
  },
  computer_genius: {
    id: 'computer_genius',
    title: 'Computer-Genie',
    icon: '💻',
    category: 'Wissen & Tech',
    description: 'Möchte alles über Programmieren lernen und als Tech-Guru das Vermögen mehren.',
    milestones: [
      { id: 'tech_m1', level: 1, description: 'Erreiche Programmieren Level 2', rewardPoints: 150 },
      { id: 'tech_m2', level: 2, description: 'Schließe 2 Quests am PC ab', rewardPoints: 300 },
      { id: 'tech_m3', level: 3, description: 'Erreiche Programmieren Level 5', rewardPoints: 550 },
      { id: 'tech_m4', level: 4, description: 'Beförderung in der Tech-Karriere auf Stufe 3', rewardPoints: 850 }
    ]
  },
  wealthy_baron: {
    id: 'wealth_baron',
    title: 'Reich & Berühmt',
    icon: '💰',
    category: 'Vermögen',
    description: 'Strebt nach immensem Reichtum, Luxus-Möbeln und einem riesigen Anwesen.',
    milestones: [
      { id: 'wealth_m1', level: 1, description: 'Besitze mindestens § 5.000 Simoleons', rewardPoints: 250 },
      { id: 'wealth_m2', level: 2, description: 'Verkaufe 3 Kunstwerke oder Ernteerträge', rewardPoints: 400 },
      { id: 'wealth_m3', level: 3, description: 'Besitze mindestens § 15.000 Simoleons', rewardPoints: 700 },
      { id: 'wealth_m4', level: 4, description: 'Baue einen eigenen Pool und 2 Stockwerke', rewardPoints: 1200 }
    ]
  },
  master_gardener: {
    id: 'master_gardener',
    title: 'Pflanzendoktor',
    icon: '🌻',
    category: 'Natur',
    description: 'Liebt die Natur und möchte den schönsten Garten der Nachbarschaft hegen.',
    milestones: [
      { id: 'garden_m1', level: 1, description: 'Lege 2 Gartenbeete an', rewardPoints: 150 },
      { id: 'garden_m2', level: 2, description: 'Pflanze 3 Tomatensamen', rewardPoints: 300 },
      { id: 'garden_m3', level: 3, description: 'Ernte 5 Bio-Gemüse', rewardPoints: 500 },
      { id: 'garden_m4', level: 4, description: 'Besitze 6 blühende Gartenbeete', rewardPoints: 800 }
    ]
  },
  animal_lover: {
    id: 'animal_lover',
    title: 'Tierfreund & Haustier-Flüsterer',
    icon: '🐕',
    category: 'Tiere',
    description: 'Möchte eine tiefe Bindung zu Hunden und Katzen aufbauen und ihr bester Freund sein.',
    milestones: [
      { id: 'pet_m1', level: 1, description: 'Adoptiere dein erstes Haustier', rewardPoints: 200 },
      { id: 'pet_m2', level: 2, description: 'Streichle & füttere ein Haustier 5 Mal', rewardPoints: 350 },
      { id: 'pet_m3', level: 3, description: 'Bringe alle Pet-Bedürfnisse ins Grüne', rewardPoints: 600 },
      { id: 'pet_m4', level: 4, description: 'Adoptiere 2 Haustiere im Haushalt', rewardPoints: 900 }
    ]
  }
};

export const REWARD_STORE_ITEMS: RewardItem[] = [
  {
    id: 'potion_needs',
    name: 'Sofort-Erfrischungs-Trank',
    icon: '🧪',
    cost: 400,
    description: 'Füllt alle 6 Bedürfnissbalken deines Sims augenblicklich auf 100% auf.',
    effect: 'replenish_needs'
  },
  {
    id: 'potion_youth',
    name: 'Junge-Jahre-Trank',
    icon: '✨',
    cost: 1000,
    description: 'Setzt das Alter deines Sims in der aktuellen Lebensphase auf Tag 0 zurück.',
    effect: 'age_reset'
  },
  {
    id: 'money_tree_seed',
    name: 'Geldbaum-Samenpaket',
    icon: '🌱',
    cost: 1500,
    description: 'Gibt dir sofort einen Simoleon-Bonus von § 5.000 als Investor-Spritze.',
    effect: 'simoleons'
  },
  {
    id: 'potion_inspiration',
    name: 'Elixier des Genies',
    icon: '⚡',
    cost: 800,
    description: 'Verleugnet Müdigkeit und verleiht allen Fertigkeiten sofortigen Erfahrungsschub.',
    effect: 'double_skill_xp'
  }
];

export class AspirationManager {
  public static checkMilestones(sim: import('../entity/Sim').Sim, game: any): string[] {
    const newlyCompleted: string[] = [];
    const asp = ASPIRATIONS_CATALOG[sim.aspirationId];
    if (!asp) return newlyCompleted;

    asp.milestones.forEach(m => {
      if (sim.completedMilestones.includes(m.id)) return;

      let achieved = false;

      switch (m.id) {
        // Chef
        case 'chef_m1': achieved = sim.skills.cooking >= 2; break;
        case 'chef_m2': achieved = game.partyManager?.trophiesUnlocked?.length > 0 || sim.inventory.items.some(i => i.type === 'crop'); break;
        case 'chef_m3': achieved = sim.skills.cooking >= 5; break;
        case 'chef_m4': achieved = sim.inventory.items.filter(i => i.type === 'crop').length >= 5; break;

        // Party
        case 'party_m1': achieved = !!game.partyManager?.activeParty; break;
        case 'party_m2': achieved = (game.partyManager?.livePoints || 0) >= 150; break;
        case 'party_m3': achieved = (game.partyManager?.trophiesUnlocked?.length || 0) >= 1; break;
        case 'party_m4': achieved = (game.partyManager?.trophiesUnlocked?.length || 0) >= 3; break;

        // Tech
        case 'tech_m1': achieved = sim.skills.programming >= 2; break;
        case 'tech_m2': achieved = game.careerManager?.currentRank >= 2; break;
        case 'tech_m3': achieved = sim.skills.programming >= 5; break;
        case 'tech_m4': achieved = game.careerManager?.currentRank >= 3; break;

        // Wealth
        case 'wealth_m1': achieved = sim.simoleons >= 5000; break;
        case 'wealth_m2': achieved = sim.inventory.items.length >= 3; break;
        case 'wealth_m3': achieved = sim.simoleons >= 15000; break;
        case 'wealth_m4': achieved = game.house?.placedFurniture?.length >= 10; break;

        // Garden
        case 'garden_m1': achieved = (game.gardenSystem?.plots?.length || 0) >= 2; break;
        case 'garden_m2': achieved = game.gardenSystem?.plots?.some((p: any) => p.cropType === 'tomatoes'); break;
        case 'garden_m3': achieved = sim.inventory.items.filter(i => i.type === 'crop').length >= 3; break;
        case 'garden_m4': achieved = (game.gardenSystem?.plots?.length || 0) >= 6; break;

        // Pets
        case 'pet_m1': achieved = (game.petManager?.pets?.length || 0) >= 1; break;
        case 'pet_m2': achieved = game.petManager?.pets?.some((p: any) => p.needs.affection > 50); break;
        case 'pet_m3': achieved = game.petManager?.pets?.some((p: any) => p.needs.hunger > 80 && p.needs.affection > 80); break;
        case 'pet_m4': achieved = (game.petManager?.pets?.length || 0) >= 2; break;
      }

      if (achieved) {
        sim.completedMilestones.push(m.id);
        sim.aspirationPoints += m.rewardPoints;
        newlyCompleted.push(m.description);
      }
    });

    return newlyCompleted;
  }
}
