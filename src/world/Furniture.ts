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
  swatchColor?: string;
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
  },

  garden_plot: {
    id: 'garden_plot',
    name: 'Garten-Pflanzbeet',
    category: 'decor',
    price: 100,
    width: 1,
    height: 1,
    color: '#795548',
    accentColor: '#4caf50',
    icon: '🌱',
    description: 'Nährstoffreiches Beet zum Anbauen von Tomaten, Erdbeeren & Blumen.',
    interactions: [
      {
        id: 'interact_garden',
        label: 'Garten pflegen',
        icon: '🧑‍🌾',
        duration: 4,
        needEffects: { fun: 25, energy: -5 }
      }
    ]
  },

  pet_bed: {
    id: 'pet_bed',
    name: 'Orthopädisches Pet-Bett',
    category: 'comfort',
    price: 180,
    width: 1,
    height: 1,
    color: '#e74c3c',
    accentColor: '#f39c12',
    icon: '🛋️',
    description: 'Weiches Kissen für Hunde und Katzen zum Schlafen.',
    interactions: [
      {
        id: 'cuddle_pet_bed',
        label: 'Haustier zum Schlafen bringen',
        icon: '🐶',
        duration: 3,
        needEffects: { social: 30, fun: 20 }
      }
    ]
  },

  pet_bowl: {
    id: 'pet_bowl',
    name: 'Futternapf "Gourmet"',
    category: 'appliances',
    price: 90,
    width: 1,
    height: 1,
    color: '#34495e',
    accentColor: '#e67e22',
    icon: '🦴',
    description: 'Befülle den Napf mit Futter für Hunde & Katzen.',
    interactions: [
      {
        id: 'fill_pet_bowl',
        label: 'Futternapf auffüllen (§ 20)',
        icon: '🥩',
        duration: 2,
        needEffects: { social: 25 }
      }
    ]
  },

  cat_tree: {
    id: 'cat_tree',
    name: 'Kletter- & Kratzbaum XL',
    category: 'entertainment',
    price: 240,
    width: 1,
    height: 1,
    color: '#d35400',
    accentColor: '#ecf0f1',
    icon: '🐱',
    description: 'Mehrstöckiger Kratzbaum für Katzen zum Klettern und Spielen.',
    interactions: [
      {
        id: 'play_cat_tree',
        label: 'Mit Katze am Kratzbaum spielen',
        icon: '🧶',
        duration: 5,
        needEffects: { fun: 45, social: 35 }
      }
    ]
  },

  pet_toy: {
    id: 'pet_toy',
    name: 'Pet Spielzeugkiste',
    category: 'entertainment',
    price: 120,
    width: 1,
    height: 1,
    color: '#f1c40f',
    accentColor: '#9b59b6',
    icon: '🎾',
    description: 'Bälle, Kauknochen & Maussuch-Spiele für Haustiere.',
    interactions: [
      {
        id: 'play_pet_fetch',
        label: 'Stöckchen & Ball werfen',
        icon: '🎾',
        duration: 6,
        needEffects: { fun: 65, social: 50 }
      }
    ]
  },

  stairs_wood: {
    id: 'stairs_wood',
    name: 'Holztreppe (Klassisch)',
    category: 'comfort',
    price: 400,
    width: 1,
    height: 1,
    color: '#8d5524',
    accentColor: '#d35400',
    icon: '🪜',
    description: 'Verbindet Stockwerke. Ermöglicht den Aufstieg ins nächste Geschoss.',
    interactions: [
      {
        id: 'climb_stairs_up',
        label: 'Etage nach oben steigen',
        icon: '⬆️',
        duration: 2,
        needEffects: { energy: -2 }
      },
      {
        id: 'climb_stairs_down',
        label: 'Etage nach unten steigen',
        icon: '⬇️',
        duration: 2,
        needEffects: { energy: -2 }
      }
    ]
  },

  stairs_modern: {
    id: 'stairs_modern',
    name: 'Design Glas-Metalltreppe',
    category: 'comfort',
    price: 750,
    width: 1,
    height: 1,
    color: '#34495e',
    accentColor: '#00e5ff',
    icon: '🪜',
    description: 'Moderne Luxus-Treppe für edle Villen.',
    interactions: [
      {
        id: 'climb_stairs_up',
        label: 'Etage nach oben steigen',
        icon: '⬆️',
        duration: 2,
        needEffects: { energy: -2 }
      },
      {
        id: 'climb_stairs_down',
        label: 'Etage nach unten steigen',
        icon: '⬇️',
        duration: 2,
        needEffects: { energy: -2 }
      }
    ]
  },

  dj_booth: {
    id: 'dj_booth',
    name: 'Profi DJ-Pult (Club VIP)',
    category: 'entertainment',
    price: 1200,
    width: 2,
    height: 1,
    color: '#8e44ad',
    accentColor: '#00e5ff',
    icon: '🎧',
    description: 'Mische Beats auf der Tanzfläche auf!',
    interactions: [
      {
        id: 'dj_mix',
        label: 'DJ Beats auflegen',
        icon: '🎛️',
        duration: 8,
        needEffects: { fun: 95, social: 60 },
        skillGain: { skill: 'charisma', amount: 30 }
      }
    ]
  },

  bar_counter: {
    id: 'bar_counter',
    name: 'Cocktail-Bar Counter',
    category: 'appliances',
    price: 900,
    width: 2,
    height: 1,
    color: '#2c3e50',
    accentColor: '#e74c3c',
    icon: '🍸',
    description: 'Serviere Erfrischungsdrinks an der Club-Bar.',
    interactions: [
      {
        id: 'drink_cocktail',
        label: 'Cocktail mixen & trinken',
        icon: '🍹',
        duration: 5,
        needEffects: { fun: 80, social: 40 }
      }
    ]
  },

  treadmill: {
    id: 'treadmill',
    name: 'Fitness Pro Laufband',
    category: 'entertainment',
    price: 850,
    width: 1,
    height: 1,
    color: '#27ae60',
    accentColor: '#2ecc71',
    icon: '🏃',
    description: 'Verbessert die Ausdauer und hält deinen Sim fit.',
    interactions: [
      {
        id: 'run_treadmill',
        label: 'Laufen gehen',
        icon: '🏃‍♂️',
        duration: 8,
        needEffects: { fun: 60, energy: -20, hygiene: -20 },
        skillGain: { skill: 'fitness', amount: 35 }
      }
    ]
  },

  coffee_bar: {
    id: 'coffee_bar',
    name: 'Espresso Barista Stand',
    category: 'appliances',
    price: 650,
    width: 1,
    height: 1,
    color: '#d35400',
    accentColor: '#f39c12',
    icon: '☕',
    description: 'Frisch gemahlener Kaffee für vollen Energieschub.',
    interactions: [
      {
        id: 'drink_espresso',
        label: 'Espresso trinken',
        icon: '☕',
        duration: 3,
        needEffects: { energy: 50, fun: 30 }
      }
    ]
  },

  // NEW ECO & MAGIC FURNITURE
  solar_panel: {
    id: 'solar_panel',
    name: 'Solarpanel XL',
    category: 'decor',
    price: 800,
    width: 1,
    height: 1,
    color: '#2980b9',
    accentColor: '#f1c40f',
    icon: '☀️',
    description: 'Erzeugt sauberen Solarstrom & spart § 50 auf jeder Nebenkosten-Rechnung!',
    interactions: [
      {
        id: 'inspect_solar',
        label: 'Solarertrag prüfen',
        icon: '🔋',
        duration: 2,
        needEffects: { fun: 15 }
      }
    ]
  },

  wind_turbine: {
    id: 'wind_turbine',
    name: 'Mini Windkraftanlage',
    category: 'decor',
    price: 1200,
    width: 1,
    height: 1,
    color: '#bdc3c7',
    accentColor: '#00e5ff',
    icon: '🌀',
    description: 'Nutzt die Kraft des Windes & spart § 75 auf jeder Nebenkosten-Rechnung!',
    interactions: [
      {
        id: 'inspect_wind',
        label: 'Windrad inspecten',
        icon: '💨',
        duration: 2,
        needEffects: { fun: 15 }
      }
    ]
  },

  magic_cauldron: {
    id: 'magic_cauldron',
    name: 'Alchemie Zauberkessel',
    category: 'appliances',
    price: 600,
    width: 1,
    height: 1,
    color: '#8e44ad',
    accentColor: '#2ecc71',
    icon: '🧪',
    description: 'Braue magische Elixiere und steigere deine Magie-Stufe.',
    interactions: [
      {
        id: 'brew_potion',
        label: 'Elixier brauen',
        icon: '✨',
        duration: 6,
        needEffects: { fun: 40, energy: -10 }
      }
    ]
  },

  spell_book: {
    id: 'spell_book',
    name: 'Historisches Zauberbuch-Pult',
    category: 'entertainment',
    price: 450,
    width: 1,
    height: 1,
    color: '#d35400',
    accentColor: '#f1c40f',
    icon: '📜',
    description: 'Studiere alte Zaubersprüche & sammle Magie-Erfahrung.',
    interactions: [
      {
        id: 'study_spells',
        label: 'Zaubersprüche studieren',
        icon: '📖',
        duration: 5,
        needEffects: { fun: 50, energy: -10 }
      }
    ]
  },

  chicken_coop: {
    id: 'chicken_coop',
    name: 'Landhaus Hühnerstall',
    category: 'decor',
    price: 500,
    width: 2,
    height: 1,
    color: '#d35400',
    accentColor: '#f1c40f',
    icon: '🐔',
    description: 'Bietet glücklichen Hühnern ein Zuhause. Frische Landeier ernten!',
    interactions: [
      {
        id: 'collect_eggs',
        label: 'Frische Eier einsammeln',
        icon: '🥚',
        duration: 4,
        needEffects: { hunger: 20, fun: 15 }
      }
    ]
  },

  beehive: {
    id: 'beehive',
    name: 'Bio-Bienenstock',
    category: 'decor',
    price: 350,
    width: 1,
    height: 1,
    color: '#f39c12',
    accentColor: '#f1c40f',
    icon: '🐝',
    description: 'Fleißige Bienen produzieren süßen Bio-Honig im Garten.',
    interactions: [
      {
        id: 'harvest_honey',
        label: 'Bio-Honig ernten',
        icon: '🍯',
        duration: 3,
        needEffects: { hunger: 15, fun: 20 }
      }
    ]
  },

  wedding_arch: {
    id: 'wedding_arch',
    name: 'Blumen-Hochzeitsbogen',
    category: 'decor',
    price: 750,
    width: 2,
    height: 1,
    color: '#ecf0f1',
    accentColor: '#e84393',
    icon: '💒',
    description: 'Bogen für Romantik & unvergessliche Hochzeits-Zeremonien.',
    interactions: [
      {
        id: 'hold_wedding',
        label: 'Ja-Wort geben & Heiraten',
        icon: '💍',
        duration: 8,
        needEffects: { social: 60, fun: 50 }
      }
    ]
  },

  guitar_acoustic: {
    id: 'guitar_acoustic',
    name: 'Akustik-Gitarre',
    category: 'entertainment',
    price: 450,
    width: 1,
    height: 1,
    color: '#d35400',
    accentColor: '#f39c12',
    icon: '🎸',
    description: 'Spiele romantische Balladen oder Straßenmusik für Simoleons.',
    interactions: [
      {
        id: 'play_guitar',
        label: 'Gitarre spielen',
        icon: '🎵',
        duration: 6,
        needEffects: { fun: 45, social: 15 }
      }
    ]
  },

  chess_table: {
    id: 'chess_table',
    name: 'Großmeister Schach-Tisch',
    category: 'entertainment',
    price: 550,
    width: 1,
    height: 1,
    color: '#2c3e50',
    accentColor: '#ecf0f1',
    icon: '♟️',
    description: 'Fördert den Logik-Skill und bringt Spaß.',
    interactions: [
      {
        id: 'play_chess',
        label: 'Schach spielen',
        icon: '🧠',
        duration: 8,
        needEffects: { fun: 50 }
      }
    ]
  },

  wood_bench: {
    id: 'wood_bench',
    name: 'Handwerker-Werkbank',
    category: 'surfaces',
    price: 650,
    width: 2,
    height: 1,
    color: '#795548',
    accentColor: '#8d6e63',
    icon: '🔨',
    description: 'Repariere kaputte Geräte oder schnitze Holzskulpturen.',
    interactions: [
      {
        id: 'carve_wood',
        label: 'Holzskulptur schnitzen',
        icon: '🪚',
        duration: 8,
        needEffects: { fun: 40, energy: -10 }
      }
    ]
  },

  gravestone: {
    id: 'gravestone',
    name: 'Historischer Grabstein',
    category: 'decor',
    price: 200,
    width: 1,
    height: 1,
    color: '#7f8c8d',
    accentColor: '#34495e',
    icon: '🪦',
    description: 'Erinnert an vergangene Ahnengenerationen. Geister spuken nachts um ihn herum.',
    interactions: [
      {
        id: 'mourn_ghost',
        label: 'Trauern & Geist besänftigen',
        icon: '👻',
        duration: 5,
        needEffects: { social: 20, fun: -10 }
      }
    ]
  },

  invention_workbench: {
    id: 'invention_workbench',
    name: 'Sci-Fi Erfinder-Werkbank',
    category: 'appliances',
    price: 1800,
    width: 2,
    height: 1,
    color: '#0284c7',
    accentColor: '#38bdf8',
    icon: '🔬',
    description: 'Station zur Erfindung von Sci-Fi-Gadgets und Brauen chemischer Serumpotionen.',
    interactions: [
      {
        id: 'use_invention_bench',
        label: 'Tüfteln & Erfinden',
        icon: '⚙️',
        duration: 6,
        needEffects: { fun: 45, energy: -10 },
        skillGain: { skill: 'programming', amount: 15 }
      }
    ]
  },

  pet_nursery_bed: {
    id: 'pet_nursery_bed',
    name: 'Welpen & Kätzchen Nest',
    category: 'comfort',
    price: 450,
    width: 1,
    height: 1,
    color: '#f472b6',
    accentColor: '#fbcfe8',
    icon: '🐾',
    description: 'Ein kuscheliges Körbchen für neugeborene Tierbabys und Zuchtnachwuchs.',
    interactions: [
      {
        id: 'cuddle_nursery_pet',
        label: 'Tierbaby knuddeln',
        icon: '💖',
        duration: 4,
        needEffects: { fun: 50, social: 30 }
      }
    ]
  },

  resort_reception: {
    id: 'resort_reception',
    name: 'Resort Empfangs-Tresen',
    category: 'surfaces',
    price: 2400,
    width: 2,
    height: 1,
    color: '#0d9488',
    accentColor: '#2dd4bf',
    icon: '🏨',
    description: 'Eleganter Rezeptionstresen zur Verwaltung deines Insel-Hotels und Gäste-Checkins.',
    interactions: [
      {
        id: 'checkin_resort_guests',
        label: 'Gäste einchecken',
        icon: '📋',
        duration: 5,
        needEffects: { social: 25, fun: 20 }
      }
    ]
  },

  decorator_drafting_table: {
    id: 'decorator_drafting_table',
    name: 'Architekten Zeichentisch',
    category: 'surfaces',
    price: 1100,
    width: 2,
    height: 1,
    color: '#d97706',
    accentColor: '#fef08a',
    icon: '📐',
    description: 'Entwirf Grundrisse und erstelle Kunden-Präsentationen für deinen Raumausstatter-Auftrag.',
    interactions: [
      {
        id: 'draft_blueprint',
        label: 'Entwurf zeichnen',
        icon: '✏️',
        duration: 7,
        needEffects: { fun: 35, energy: -5 }
      }
    ]
  },

  cow_pasture_barn: {
    id: 'cow_pasture_barn',
    name: 'Ranch Kuh-Stall',
    category: 'appliances',
    price: 2200,
    width: 2,
    height: 2,
    color: '#854d0e',
    accentColor: '#fef08a',
    icon: '🐄',
    description: 'Unterstand für Rinder & Schafe. Melke frische Bio-Milch und schere Wolle.',
    interactions: [
      {
        id: 'milk_cow',
        label: 'Kuh melken & füttern',
        icon: '🥛',
        duration: 6,
        needEffects: { fun: 30, social: 20 }
      }
    ]
  },

  movie_camera_rig: {
    id: 'movie_camera_rig',
    name: 'Hollywood Kamera-Rig',
    category: 'appliances',
    price: 3800,
    width: 2,
    height: 1,
    color: '#0f172a',
    accentColor: '#f59e0b',
    icon: '🎥',
    description: 'Profi-Kamera für Hollywood-Blockbuster, Regie-Proben und Starlight-Auditions.',
    interactions: [
      {
        id: 'direct_scene',
        label: 'Filmszene regieführen',
        icon: '🎬',
        duration: 8,
        needEffects: { fun: 45, energy: -10 }
      }
    ]
  },

  yacht_helm_wheel: {
    id: 'yacht_helm_wheel',
    name: 'Mega-Yacht Steuerrad',
    category: 'entertainment',
    price: 4500,
    width: 1,
    height: 1,
    color: '#0284c7',
    accentColor: '#bae6fd',
    icon: '☸️',
    description: 'Kapitäns-Steuerrad zur Navigation deiner Mega-Yacht auf hoher See.',
    interactions: [
      {
        id: 'steer_yacht',
        label: 'Yacht steuern & auslaufen',
        icon: '⚓',
        duration: 7,
        needEffects: { fun: 50, social: 15 }
      }
    ]
  },

  tractor_workbench: {
    id: 'tractor_workbench',
    name: 'Traktor-Werkbank',
    category: 'surfaces',
    price: 1600,
    width: 2,
    height: 1,
    color: '#15803d',
    accentColor: '#86efac',
    icon: '🚜',
    description: 'Warte Landmaschinen und bereite Erntemaschinen für das Feld vor.',
    interactions: [
      {
        id: 'repair_tractor',
        label: 'Traktor warten',
        icon: '🔧',
        duration: 6,
        needEffects: { fun: 30, energy: -10 }
      }
    ]
  },

  safe_vault: {
    id: 'safe_vault',
    name: 'Titan Banktresor',
    category: 'appliances',
    price: 1500,
    width: 1,
    height: 1,
    color: '#334155',
    accentColor: '#fbbf24',
    icon: '🏦',
    description: 'Schwerer Panzertresor zur sicheren Aufbewahrung von Simoleons, Gold und Diamanten.',
    interactions: [
      {
        id: 'open_vault',
        label: 'Tresor öffnen & verwalten',
        icon: '🔑',
        duration: 3,
        needEffects: { fun: 20 }
      }
    ]
  },

  gold_display_case: {
    id: 'gold_display_case',
    name: 'Gold-Schauvitrine',
    category: 'decor',
    price: 800,
    width: 1,
    height: 1,
    color: '#b45309',
    accentColor: '#fde68a',
    icon: '🏆',
    description: 'Edle beleuchtete Vitrine zur Schaukelung deiner Goldbarren und Edelsteine.',
    interactions: [
      {
        id: 'admire_gold',
        label: 'Goldbarren bewundern',
        icon: '✨',
        duration: 4,
        needEffects: { fun: 30, social: 10 }
      }
    ]
  },

  alchemy_cauldron: {
    id: 'alchemy_cauldron',
    name: 'Alchemie-Kessel',
    category: 'appliances',
    price: 1200,
    width: 1,
    height: 1,
    color: '#3b0764',
    accentColor: '#c084fc',
    icon: '🔮',
    description: 'Brodelnder Kessel zum Brauen von Verjüngungs-, Glücks- und Midas-Elixieren.',
    interactions: [
      {
        id: 'open_alchemy',
        label: 'Trank brauen & alchemieren',
        icon: '⚗️',
        duration: 5,
        needEffects: { fun: 25, energy: -5 }
      }
    ]
  },

  potion_cabinet: {
    id: 'potion_cabinet',
    name: 'Apothekerschrank',
    category: 'surfaces',
    price: 650,
    width: 1,
    height: 1,
    color: '#1e1b4b',
    accentColor: '#818cf8',
    icon: '🧪',
    description: 'Aufbewahrungsschrank für gebraute Elixiere, Kräuter und Tinkturen.',
    interactions: [
      {
        id: 'inspect_potions',
        label: 'Trankbestand prüfen',
        icon: '🔍',
        duration: 3,
        needEffects: { fun: 15 }
      }
    ]
  },

  pet_nursery_nest: {
    id: 'pet_nursery_nest',
    name: 'Haustier-Kinderstube & Nest',
    category: 'comfort',
    price: 450,
    width: 1,
    height: 1,
    color: '#831843',
    accentColor: '#f43f5e',
    icon: '🍼',
    description: 'Kuscheliges Wärmenest für trächtige Haustiere und neugeborene Welpen & Kätzchen.',
    interactions: [
      {
        id: 'open_nursery',
        label: 'Kinderstube & Nest öffnen',
        icon: '🐾',
        duration: 3,
        needEffects: { fun: 25, social: 15 }
      }
    ]
  },

  studio_camera: {
    id: 'studio_camera',
    name: 'Stativ-Studiokamera',
    category: 'entertainment',
    price: 850,
    width: 1,
    height: 1,
    color: '#1e293b',
    accentColor: '#38bdf8',
    icon: '📷',
    description: 'Professionelle Spiegelreflexkamera auf Dreibeinstativ für hochauflösende Porträtaufnahmen.',
    interactions: [
      {
        id: 'open_studio',
        label: 'Fotostudio & Shooting öffnen',
        icon: '📸',
        duration: 4,
        needEffects: { fun: 30, social: 15 }
      }
    ]
  },

  photo_backdrop: {
    id: 'photo_backdrop',
    name: 'Foto-Studioleinwand',
    category: 'decor',
    price: 400,
    width: 2,
    height: 1,
    color: '#334155',
    accentColor: '#fbbf24',
    icon: '🖼️',
    description: 'Thematische Hintergrundkulisse für Porträts, Paar- und Haustiershootings.',
    interactions: [
      {
        id: 'pose_backdrop',
        label: 'Vor Leinwand posieren',
        icon: '🕺',
        duration: 3,
        needEffects: { fun: 20 }
      }
    ]
  },

  bakery_oven: {
    id: 'bakery_oven',
    name: 'Gourmet-Backofen',
    category: 'appliances',
    price: 1400,
    width: 1,
    height: 1,
    color: '#b45309',
    accentColor: '#fbbf24',
    icon: '🥐',
    description: 'Leistungsstarker Konvektionsofen zum Backen von Torten, Croissants und Baguettes.',
    interactions: [
      {
        id: 'open_bakery',
        label: 'Bäckerei & Rezepte öffnen',
        icon: '👩‍🍳',
        duration: 4,
        needEffects: { hunger: 20, fun: 15 }
      }
    ]
  },

  pastry_display_case: {
    id: 'pastry_display_case',
    name: 'Konditorei-Glaskuchentheke',
    category: 'surfaces',
    price: 750,
    width: 2,
    height: 1,
    color: '#78350f',
    accentColor: '#fde68a',
    icon: '🍰',
    description: 'Gekühlte Verkaufsvitrine für frisch gebackene Hochzeitstorten und Gebäck.',
    interactions: [
      {
        id: 'open_bakery',
        label: 'Vitrine bestücken & Erlöse prüfen',
        icon: '💰',
        duration: 3,
        needEffects: { fun: 10 }
      }
    ]
  },

  cinema_projector_screen: {
    id: 'cinema_projector_screen',
    name: 'Heimkino-Leinwand & Beamer',
    category: 'entertainment',
    price: 2200,
    width: 3,
    height: 1,
    color: '#0f172a',
    accentColor: '#ec4899',
    icon: '🎬',
    description: '4K Laser-Projektionsleinwand für echtes Kinosaal-Feeling im eigenen Zuhause.',
    interactions: [
      {
        id: 'open_cinema',
        label: 'Heimkino starten',
        icon: '🎥',
        duration: 5,
        needEffects: { fun: 40, social: 25 }
      }
    ]
  },

  popcorn_maker: {
    id: 'popcorn_maker',
    name: 'Retro-Popcorn-Maschine',
    category: 'appliances',
    price: 350,
    width: 1,
    height: 1,
    color: '#dc2626',
    accentColor: '#fef08a',
    icon: '🍿',
    description: 'Klassische Popcorn-Maschine mit knisterndem Heißluft-Kessel.',
    interactions: [
      {
        id: 'open_cinema',
        label: 'Popcorn zubereiten',
        icon: '🍿',
        duration: 3,
        needEffects: { hunger: 15, fun: 10 }
      }
    ]
  },

  luxury_cinema_seats: {
    id: 'luxury_cinema_seats',
    name: 'Luxus-Kinosaalsessel',
    category: 'comfort',
    price: 600,
    width: 2,
    height: 1,
    color: '#831843',
    accentColor: '#f43f5e',
    icon: '💺',
    description: 'Bequeme rote Samtsessel mit Getränkehaltern für den perfekten Filmgenuss.',
    interactions: [
      {
        id: 'open_cinema',
        label: 'In Kinosessel entspannen',
        icon: '🍿',
        duration: 4,
        needEffects: { energy: 25, fun: 20 }
      }
    ]
  },

  agility_hurdle: {
    id: 'agility_hurdle',
    name: 'Agility-Sprunghürde',
    category: 'entertainment',
    price: 300,
    width: 1,
    height: 1,
    color: '#0284c7',
    accentColor: '#38bdf8',
    icon: '🚧',
    description: 'Verstellbare Trainingshürde für Sprung- und Geschicklichkeitstraining von Haustieren.',
    interactions: [
      {
        id: 'open_agility',
        label: 'Agility-Training starten',
        icon: '🐕',
        duration: 4,
        needEffects: { fun: 25, social: 20 }
      }
    ]
  },

  agility_slalom_poles: {
    id: 'agility_slalom_poles',
    name: 'Agility-Slalomstangen',
    category: 'entertainment',
    price: 350,
    width: 2,
    height: 1,
    color: '#eab308',
    accentColor: '#fde047',
    icon: '🚩',
    description: 'Reihe farbiger Slalomstangen für präzise Wendemanöver.',
    interactions: [
      {
        id: 'open_agility',
        label: 'Slalom trainieren',
        icon: '🐾',
        duration: 4,
        needEffects: { fun: 25, social: 20 }
      }
    ]
  },

  agility_tunnel: {
    id: 'agility_tunnel',
    name: 'Agility-Kriechtunnel',
    category: 'entertainment',
    price: 400,
    width: 2,
    height: 1,
    color: '#16a34a',
    accentColor: '#86efac',
    icon: '🚇',
    description: 'Flexibler Stofftunnel für schnelles Hindernistraining.',
    interactions: [
      {
        id: 'open_agility',
        label: 'Tunnellauf trainieren',
        icon: '🏃',
        duration: 4,
        needEffects: { fun: 25, social: 20 }
      }
    ]
  }
};
