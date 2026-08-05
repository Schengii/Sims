/**
 * Blueprint & Preset Rooms System
 * Allows 1-click placement of pre-built architect room templates in the Build mode.
 */

export interface PresetRoom {
  id: string;
  name: string;
  icon: string;
  category: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'patio';
  cost: number;
  description: string;
  width: number;
  height: number;
  items: Array<{ furnitureId: string; offsetX: number; offsetY: number }>;
}

export const PRESET_ROOMS: PresetRoom[] = [
  {
    id: 'room_starter_bedroom',
    name: 'Starter-Schlafzimmer',
    icon: '🛏️',
    category: 'bedroom',
    cost: 850,
    description: 'Enthält ein gemütliches Bett, Nachttisch und Kleiderschrank.',
    width: 3,
    height: 3,
    items: [
      { furnitureId: 'bed_basic', offsetX: 0, offsetY: 0 },
      { furnitureId: 'easel', offsetX: 2, offsetY: 0 }
    ]
  },
  {
    id: 'room_luxury_bathroom',
    name: 'Wellness-Badezimmer',
    icon: '🛁',
    category: 'bathroom',
    cost: 1400,
    description: 'Moderne Dusche, Designer-Toilette und Fliesen.',
    width: 3,
    height: 2,
    items: [
      { furnitureId: 'shower_modern', offsetX: 0, offsetY: 0 },
      { furnitureId: 'toilet_basic', offsetX: 2, offsetY: 0 }
    ]
  },
  {
    id: 'room_tech_office',
    name: 'High-Tech Arbeitszimmer',
    icon: '💻',
    category: 'living',
    cost: 1900,
    description: 'Profi-PC, Schreibtisch und bequemer Bürostuhl.',
    width: 3,
    height: 2,
    items: [
      { furnitureId: 'computer_desk', offsetX: 0, offsetY: 0 }
    ]
  }
];
