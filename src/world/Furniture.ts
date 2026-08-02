/**
 * Furniture Catalog & Object Properties
 * Defines available household items, placement sizes, prices (§), and interaction outcomes.
 */

export interface FurnitureDefinition {
  id: string;
  name: string;
  category: 'comfort' | 'surfaces' | 'plumbing' | 'appliances' | 'entertainment' | 'decor';
  price: number;
  width: number;
  height: number;
  color: string;
  accentColor: string;
  icon: string;
  description: string;
  interactions: Array<{
    id: string;
    label: string;
    icon: string;
    duration: number;
    needEffects: {
      hunger?: number;
      energy?: number;
      hygiene?: number;
      bladder?: number;
      fun?: number;
      social?: number;
    };
    skillGain?: {
      skill: 'cooking' | 'programming' | 'painting' | 'fitness' | 'charisma';
      amount: number;
    };
  }>;
}

export interface PlacedFurniture {
  instanceId: string;
  furnitureId: string;
  gridX: number;
  gridY: number;
  rotation: 0 | 90 | 180 | 270;
}

export const FURNITURE_CATALOG: Record<string, FurnitureDefinition> = {
  bed_basic: {
    id: 'bed_basic',
    name: 'Gemütliches Bett',
    category: 'comfort',
    price: 350,
    width: 2,
    height: 1,
    color: '#34495e',
    accentColor: '#ecf0f1',
    icon: '🛏️',
    description: 'Stellt Energie und Komfort schnell wieder her.',
    interactions: [
      {
        id: 'sleep',
        label: 'Schlafen',
        icon: '😴',
        duration: 12,
        needEffects: { energy: 80, fun: 10 }
      },
      {
        id: 'nap',
        label: 'Nickerchen machen',
        icon: '💤',
        duration: 5,
        needEffects: { energy: 35 }
      }
    ]
  },

  fridge_modern: {
    id: 'fridge_modern',
    name: 'Gefrier-Kombination "Frost"',
    category: 'appliances',
    price: 600,
    width: 1,
    height: 1,
    color: '#bdc3c7',
    accentColor: '#3498db',
    icon: '🧊',
    description: 'Hält Speisen frisch. Perfekt für schnelle Snacks.',
    interactions: [
      {
        id: 'snack',
        label: 'Quick Snack essen',
        icon: '🥪',
        duration: 4,
        needEffects: { hunger: 45 }
      },
      {
        id: 'cook_gourmet',
        label: 'Gourmet-Mahlzeit kochen',
        icon: '🍳',
        duration: 8,
        needEffects: { hunger: 90, fun: 15 },
        skillGain: { skill: 'cooking', amount: 15 }
      }
    ]
  },

  shower_glass: {
    id: 'shower_glass',
    name: 'Wellness Glasdusche',
    category: 'plumbing',
    price: 450,
    width: 1,
    height: 1,
    color: '#3498db',
    accentColor: '#ffffff',
    icon: '🚿',
    description: 'Sorgt für beste Hygiene und Frische.',
    interactions: [
      {
        id: 'shower',
        label: 'Duschen',
        icon: '🧼',
        duration: 5,
        needEffects: { hygiene: 90, energy: 10 }
      }
    ]
  },

  toilet_deluxe: {
    id: 'toilet_deluxe',
    name: 'Keramik WC',
    category: 'plumbing',
    price: 250,
    width: 1,
    height: 1,
    color: '#ffffff',
    accentColor: '#95a5a6',
    icon: '🚽',
    description: 'Entlastet die Blase zuverlässig.',
    interactions: [
      {
        id: 'use_toilet',
        label: 'WC benutzen',
        icon: '🧻',
        duration: 3,
        needEffects: { bladder: 100 }
      }
    ]
  },

  pc_station: {
    id: 'pc_station',
    name: 'CyberStation Pro 5',
    category: 'entertainment',
    price: 1200,
    width: 1,
    height: 1,
    color: '#2c3e50',
    accentColor: '#e74c3c',
    icon: '🖥️',
    description: 'Zum Programmieren, Spielen und Arbeiten.',
    interactions: [
      {
        id: 'play_games',
        label: 'Spiele zocken',
        icon: '🎮',
        duration: 6,
        needEffects: { fun: 75, energy: -10 }
      },
      {
        id: 'code',
        label: 'Spiele programmieren',
        icon: '💻',
        duration: 8,
        needEffects: { fun: 30, energy: -15 },
        skillGain: { skill: 'programming', amount: 25 }
      }
    ]
  },

  easel_artist: {
    id: 'easel_artist',
    name: 'Künstler-Staffelei',
    category: 'entertainment',
    price: 300,
    width: 1,
    height: 1,
    color: '#d35400',
    accentColor: '#f39c12',
    icon: '🎨',
    description: 'Drücke dich kreativ aus und verkaufe Gemälde.',
    interactions: [
      {
        id: 'paint',
        label: 'Gemälde malen',
        icon: '🖌️',
        duration: 7,
        needEffects: { fun: 60, energy: -10 },
        skillGain: { skill: 'painting', amount: 20 }
      }
    ]
  },

  sofa_luxury: {
    id: 'sofa_luxury',
    name: 'Modulares Ecksofa',
    category: 'comfort',
    price: 500,
    width: 2,
    height: 1,
    color: '#8e44ad',
    accentColor: '#9b59b6',
    icon: '🛋️',
    description: 'Perfekt zum Entspannen und Fernsehen.',
    interactions: [
      {
        id: 'relax',
        label: 'Entspannen',
        icon: '😌',
        duration: 5,
        needEffects: { energy: 25, fun: 30 }
      }
    ]
  },

  tv_smart: {
    id: 'tv_smart',
    name: '65" Ultra-HD Smart-TV',
    category: 'entertainment',
    price: 850,
    width: 2,
    height: 1,
    color: '#111111',
    accentColor: '#00e5ff',
    icon: '📺',
    description: 'Streamen & Serien schauen steigert Spaß und Geselligkeit.',
    interactions: [
      {
        id: 'watch_tv',
        label: 'Serien schauen',
        icon: '🍿',
        duration: 6,
        needEffects: { fun: 80, social: 15 }
      }
    ]
  },

  pool_ladder: {
    id: 'pool_ladder',
    name: 'Pool-Leiter Pro',
    category: 'entertainment',
    price: 350,
    width: 1,
    height: 1,
    color: '#3498db',
    accentColor: '#ecf0f1',
    icon: '🏊',
    description: 'Einstieg in den Swimming-Pool. Steigert Fitness, Hygiene & Spaß!',
    interactions: [
      {
        id: 'swim',
        label: 'Im Pool schwimmen',
        icon: '🏊‍♂️',
        duration: 8,
        needEffects: { fun: 85, hygiene: 30, energy: -15 },
        skillGain: { skill: 'fitness', amount: 30 }
      }
    ]
  },

  birthday_cake: {
    id: 'birthday_cake',
    name: 'Geburtstagstorte',
    category: 'appliances',
    price: 150,
    width: 1,
    height: 1,
    color: '#e74c3c',
    accentColor: '#f1c40f',
    icon: '🎂',
    description: 'Puste die Kerzen aus, um in die nächste Lebensphase aufzusteigen!',
    interactions: [
      {
        id: 'blow_candles',
        label: 'Kerzen ausblasen (Altern)',
        icon: '🎉',
        duration: 5,
        needEffects: { fun: 90, social: 30 }
      }
    ]
  },

  baby_crib: {
    id: 'baby_crib',
    name: 'Gemütliche Baby-Wiege',
    category: 'comfort',
    price: 280,
    width: 1,
    height: 1,
    color: '#9b59b6',
    accentColor: '#ffffff',
    icon: '🍼',
    description: 'Bietet Wiegekomfort für Säuglinge & Babys.',
    interactions: [
      {
        id: 'cuddle_baby',
        label: 'Baby wiegen & füttern',
        icon: '👶',
        duration: 6,
        needEffects: { social: 75, fun: 50 }
      }
    ]
  },

  stereo_hifi: {
    id: 'stereo_hifi',
    name: 'HiFi-Stereoanlage Pro',
    category: 'entertainment',
    price: 400,
    width: 1,
    height: 1,
    color: '#34495e',
    accentColor: '#00e5ff',
    icon: '📻',
    description: '4 Simlish-Radiosender (Pop, Retro, Lo-Fi, Electro) & Tanzfläche.',
    interactions: [
      {
        id: 'toggle_radio',
        label: 'Radio An / Aus',
        icon: '🎵',
        duration: 2,
        needEffects: { fun: 20 }
      },
      {
        id: 'cycle_station',
        label: 'Radiosender wechseln',
        icon: '🎛️',
        duration: 2,
        needEffects: { fun: 15 }
      },
      {
        id: 'dance_solo',
        label: 'Allein tanzen',
        icon: '🕺',
        duration: 7,
        needEffects: { fun: 85, energy: -10 },
        skillGain: { skill: 'fitness', amount: 20 }
      },
      {
        id: 'dance_couple',
        label: 'Paartanzen mit Nachbar',
        icon: '💃',
        duration: 8,
        needEffects: { fun: 90, social: 80 },
        skillGain: { skill: 'charisma', amount: 25 }
      }
    ]
  },

  party_buffet: {
    id: 'party_buffet',
    name: 'Gourmet Party-Buffet',
    category: 'appliances',
    price: 500,
    width: 2,
    height: 1,
    color: '#e67e22',
    accentColor: '#f1c40f',
    icon: '🍇',
    description: 'Reichhaltiges Party-Buffet für festliche Anlässe & Hauspartys.',
    interactions: [
      {
        id: 'serve_buffet',
        label: 'Party-Snacks servieren',
        icon: '🍱',
        duration: 6,
        needEffects: { hunger: 95, fun: 40, social: 50 }
      }
    ]
  }
};
