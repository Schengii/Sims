/**
 * Thought Bubble & Emote FX Engine
 * Calculates real-time thought bubbles (Hunger 🍕, Energy 💤, Fun 🎮, Simoleons 🪙) over Sims.
 */

import type { Sim } from '../entity/Sim';

export class ThoughtBubbleManager {
  public static getThoughtForSim(sim: Sim): { icon: string; text: string } | null {
    const lowest = sim.needs.getLowestNeed();

    if (lowest.value < 40) {
      if (lowest.need === 'hunger') return { icon: '🍕', text: 'Ich habe Bärenhunger!' };
      if (lowest.need === 'energy') return { icon: '💤', text: 'Ich bin so müde...' };
      if (lowest.need === 'bladder') return { icon: '🚽', text: 'Muss dringend aufs Klo!' };
      if (lowest.need === 'hygiene') return { icon: '🧼', text: 'Brauche dringend eine Dusche.' };
      if (lowest.need === 'fun') return { icon: '🎮', text: 'Will etwas Lustiges machen!' };
      if (lowest.need === 'social') return { icon: '💬', text: 'Ich fühle mich einsam.' };
    }

    if (sim.simoleons < 100) return { icon: '🪙', text: 'Ich brauche mehr Geld...' };
    if (sim.partnerName) return { icon: '💖', text: `Denke an ${sim.partnerName}` };

    return { icon: '✨', text: 'Träume vom perfekten Sim-Leben' };
  }
}
