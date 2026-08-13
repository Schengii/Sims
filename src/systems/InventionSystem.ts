/**
 * Sci-Fi Laboratory & Invention System
 * Allows Sims to craft gadgets (Hoverboard, Sim-Ray, Weather Manipulator, Cloning Pod)
 * and concoct chemical serums for status effects and rewards.
 */

export interface InventionItem {
  id: string;
  name: string;
  category: 'gadget' | 'serum';
  description: string;
  craftCost: number; // §
  scienceSkillReq: number; // level 1-5
  isCrafted: boolean;
  quantity: number;
  icon: string;
}

export class InventionSystem {
  private inventions: InventionItem[] = [];

  constructor() {
    this.initDefaultInventions();
  }

  private initDefaultInventions() {
    this.inventions = [
      {
        id: 'hoverboard_pro',
        name: 'Hoverboard Pro 🛹',
        category: 'gadget',
        description: 'Schwebendes Hightech-Board für superschnelle Fortbewegung auf allen Wegen.',
        craftCost: 1200,
        scienceSkillReq: 1,
        isCrafted: false,
        quantity: 0,
        icon: '🛹'
      },
      {
        id: 'sim_ray',
        name: 'Sim-Ray Strahler 🔫',
        category: 'gadget',
        description: 'Laserstrahler zum Umwandeln von Objekten oder Einfrieren störender Nachbarn.',
        craftCost: 2500,
        scienceSkillReq: 2,
        isCrafted: false,
        quantity: 0,
        icon: '🔫'
      },
      {
        id: 'weather_manipulator',
        name: 'Wetter-Manipulations-Stab 🌩️',
        category: 'gadget',
        description: 'Erlaubt das gezielte Herbeirufen von Sonnenschein, Gewitter oder Schnee.',
        craftCost: 4000,
        scienceSkillReq: 3,
        isCrafted: false,
        quantity: 0,
        icon: '🌩️'
      },
      {
        id: 'cloning_pod',
        name: 'Klon-Kapsel 3000 🧬',
        category: 'gadget',
        description: 'Dupliziert wertvolle Objekte und Essen per Knopfdruck.',
        craftCost: 6500,
        scienceSkillReq: 4,
        isCrafted: false,
        quantity: 0,
        icon: '🧬'
      },
      {
        id: 'serum_energy',
        name: 'Instant-Energie-Serum 🧪',
        category: 'serum',
        description: 'Füllt die Energie- und Hygiene-Leiste des Sims sofort zu 100% auf.',
        craftCost: 300,
        scienceSkillReq: 1,
        isCrafted: false,
        quantity: 0,
        icon: '⚡'
      },
      {
        id: 'serum_genius',
        name: 'Genie-Verstand-Serum 🧪',
        category: 'serum',
        description: 'Verdreifacht die Skill-Lernrate für 12 In-Game-Stunden.',
        craftCost: 600,
        scienceSkillReq: 2,
        isCrafted: false,
        quantity: 0,
        icon: '🧠'
      },
      {
        id: 'serum_youth',
        name: 'Verjüngungs-Elixier 🧪',
        category: 'serum',
        description: 'Setzt die Alterstage der aktuellen Lebensphase um 5 Tage zurück!',
        craftCost: 1500,
        scienceSkillReq: 3,
        isCrafted: false,
        quantity: 0,
        icon: '👶'
      },
      {
        id: 'serum_midas',
        name: 'Midas-Gold-Trank 🧪',
        category: 'serum',
        description: 'Gewährt eine Sofort-Prämie von § 3.500 Simoleons!',
        craftCost: 2200,
        scienceSkillReq: 4,
        isCrafted: false,
        quantity: 0,
        icon: '🪙'
      }
    ];
  }

  public getInventions(): InventionItem[] {
    return this.inventions;
  }

  public craftItem(id: string, currentSimoleons: number, scienceSkillLevel: number): { success: boolean; message: string; cost: number } {
    const item = this.inventions.find(i => i.id === id);
    if (!item) return { success: false, message: 'Erfindung nicht gefunden.', cost: 0 };

    if (scienceSkillLevel < item.scienceSkillReq) {
      return { success: false, message: `Wissenschafts-Skill Level ${item.scienceSkillReq} erforderlich!`, cost: 0 };
    }

    if (currentSimoleons < item.craftCost) {
      return { success: false, message: `Nicht genug Materialkosten (§${item.craftCost})!`, cost: 0 };
    }

    item.isCrafted = true;
    item.quantity += 1;

    return {
      success: true,
      message: `🔬 Erfolgreich hergestellt: ${item.name}! In das Inventar abgelegt.`,
      cost: item.craftCost
    };
  }

  public useSerum(id: string): { success: boolean; message: string; effectType?: string } {
    const item = this.inventions.find(i => i.id === id);
    if (!item || item.quantity <= 0) {
      return { success: false, message: 'Du hast dieses Serum nicht auf Vorrat!' };
    }

    item.quantity -= 1;
    return {
      success: true,
      message: `🧪 Serum ${item.name} getrunken! Wirkung aktiviert.`,
      effectType: item.id
    };
  }

  public exportData(): any {
    return this.inventions;
  }

  public importData(data: any) {
    if (Array.isArray(data)) {
      data.forEach(imported => {
        const item = this.inventions.find(i => i.id === imported.id);
        if (item) {
          Object.assign(item, imported);
        }
      });
    }
  }
}
