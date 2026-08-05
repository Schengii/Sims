/**
 * Trait & Personality System
 * Defines 10 distinct traits modifying need decay rates, moodlets, and autonomous behavior.
 */

export interface TraitDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  needDecayMultipliers: {
    hunger?: number;
    energy?: number;
    hygiene?: number;
    bladder?: number;
    fun?: number;
    social?: number;
  };
  specialBonus?: string;
}

export const TRAIT_CATALOG: Record<string, TraitDefinition> = {
  genius: {
    id: 'genius',
    name: 'Genial',
    icon: '🧠',
    description: 'Lernt Fertigkeiten 25% schneller und benötigt weniger Spaß bei Geistestätigkeiten.',
    needDecayMultipliers: { fun: 0.8 },
    specialBonus: '25% schnelleres Skill-Learning'
  },
  romantic: {
    id: 'romantic',
    name: 'Romantisch',
    icon: '💖',
    description: 'Baut Romantik doppelt so schnell auf und hat ein erhöhtes Sozialbedürfnis.',
    needDecayMultipliers: { social: 1.2 },
    specialBonus: 'Doppelter Romantik-Zuwachs'
  },
  active: {
    id: 'active',
    name: 'Aktiv & Sportlich',
    icon: '🏃',
    description: 'Verliert langsamer Energie und liebt Bewegung & Fitness.',
    needDecayMultipliers: { energy: 0.75 },
    specialBonus: 'Verlangsamerter Energieabbau'
  },
  party_animal: {
    id: 'party_animal',
    name: 'Partylöwe',
    icon: '🥳',
    description: 'Generiert doppelte Punkte auf Hauspartys und liebt laute Musik.',
    needDecayMultipliers: { social: 0.7, fun: 0.7 },
    specialBonus: 'Doppelte Party-Punkte'
  },
  creative: {
    id: 'creative',
    name: 'Kreativ',
    icon: '🎨',
    description: 'Malt wertvollere Gemälde und schöpft Inspiration aus der Kunst.',
    needDecayMultipliers: { fun: 0.85 },
    specialBonus: '50% höhere Gemälde-Verkaufserlöse'
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfektionist',
    icon: '⭐',
    description: 'Liefert hervorragende Ergebnisse in Karriere und Kochen, wird aber schneller gestresst.',
    needDecayMultipliers: { hygiene: 1.2 },
    specialBonus: 'Höhere Beförderungschance'
  },
  slob: {
    id: 'slob',
    name: 'Chaotisch',
    icon: '🍕',
    description: 'Hygiene sinkt langsamer und leidet nicht unter schmutzigen Umgebungen.',
    needDecayMultipliers: { hygiene: 0.5 },
    specialBonus: 'Unempfindlich gegen Schmutz'
  },
  lonewolf: {
    id: 'lonewolf',
    name: 'Einsamer Wolf',
    icon: '🐺',
    description: 'Sozialbedürfnis sinkt extrem langsam. Genießt Zeit allein.',
    needDecayMultipliers: { social: 0.3 },
    specialBonus: 'Braucht kaum soziale Interaktion'
  },
  tech_geek: {
    id: 'tech_geek',
    name: 'Tech-Geek',
    icon: '💻',
    description: 'Liebt Programmieren und Videospiele. Spaß-Bedürfnis füllt sich am PC doppelt so schnell.',
    needDecayMultipliers: { fun: 0.75 },
    specialBonus: 'Doppelter Spaß am PC'
  },
  pet_lover: {
    id: 'pet_lover',
    name: 'Tierliebhaber',
    icon: '🐾',
    description: 'Interaktionen mit Haustieren bringen maximale Freude und Zuneigung.',
    needDecayMultipliers: { social: 0.8 },
    specialBonus: 'Maximale Bindung zu Pets'
  }
};
