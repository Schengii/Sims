/**
 * CommunityLotManager
 * Manages playable public travel destinations (Fitness Studio, Sunset Bar & Lounge, Central Park, City Library).
 */

import type { PlacedFurniture } from './Furniture';

export interface CommunityLot {
  id: string;
  name: string;
  category: 'gym' | 'lounge' | 'park' | 'library';
  icon: string;
  description: string;
  skillBonus: string;
  walls: boolean[][];
  floors: string[][];
  furniture: PlacedFurniture[];
  visitorNames: string[];
}

export class CommunityLotManager {
  private static LOTS: Record<string, CommunityLot> = {
    gym: {
      id: 'gym',
      name: '🏋️ Fit & Flex Studio',
      category: 'gym',
      icon: '🏋️',
      description: 'Modernes Fitnessstudio mit Laufbändern, Hantelbänken & Protein-Bar. 2x Fitness Skill-Bonus!',
      skillBonus: 'fitness',
      walls: Array(12).fill(0).map(() => Array(12).fill(false)),
      floors: Array(12).fill(0).map(() => Array(12).fill('wood')),
      furniture: [
        { instanceId: 'g1', furnitureId: 'pc_station', gridX: 2, gridY: 2, rotation: 0 },
        { instanceId: 'g2', furnitureId: 'stereo', gridX: 6, gridY: 2, rotation: 0 },
        { instanceId: 'g3', furnitureId: 'shower_glass', gridX: 9, gridY: 2, rotation: 0 },
      ],
      visitorNames: ['Penny Pizazz', 'Akira Kibo', 'Marcus Flex']
    },
    lounge: {
      id: 'lounge',
      name: '🍸 Sunset Lounge & Bar',
      category: 'lounge',
      icon: '🍸',
      description: 'Edler VIP-Nachtclub mit Cocktailbar, Tanzfläche & DJ-Pult. Perfekt für Romantik & Parties!',
      skillBonus: 'charisma',
      walls: Array(12).fill(0).map(() => Array(12).fill(false)),
      floors: Array(12).fill(0).map(() => Array(12).fill('marble')),
      furniture: [
        { instanceId: 'l1', furnitureId: 'stereo', gridX: 5, gridY: 5, rotation: 0 },
        { instanceId: 'l2', furnitureId: 'party_buffet', gridX: 2, gridY: 8, rotation: 0 },
        { instanceId: 'l3', furnitureId: 'sofa_luxury', gridX: 8, gridY: 8, rotation: 0 },
      ],
      visitorNames: ['Mortimer Goth', 'Bella Goth', 'Don Lothario']
    },
    park: {
      id: 'park',
      name: '🌳 Plumbob Zentralpark',
      category: 'park',
      icon: '🌳',
      description: 'Idyllischer Stadtpark mit Angelteich, Picknick-Tischen & Großmeister-Schachtisch.',
      skillBonus: 'painting',
      walls: Array(12).fill(0).map(() => Array(12).fill(false)),
      floors: Array(12).fill(0).map(() => Array(12).fill('grass')),
      furniture: [
        { instanceId: 'p1', furnitureId: 'chess_table', gridX: 4, gridY: 4, rotation: 0 },
        { instanceId: 'p2', furnitureId: 'easel', gridX: 8, gridY: 4, rotation: 0 },
        { instanceId: 'p3', furnitureId: 'bench_park', gridX: 6, gridY: 8, rotation: 0 },
      ],
      visitorNames: ['Summer Holiday', 'Liberty Lee', 'Travis Scott']
    },
    library: {
      id: 'library',
      name: '📚 Willow Creek Bibliothek',
      category: 'library',
      icon: '📚',
      description: 'Ruhige Studienbibliothek mit Buchregalen & High-Speed Programmier-Laptops. 2x Programmieren & Kochen Bonus!',
      skillBonus: 'programming',
      walls: Array(12).fill(0).map(() => Array(12).fill(false)),
      floors: Array(12).fill(0).map(() => Array(12).fill('carpet')),
      furniture: [
        { instanceId: 'b1', furnitureId: 'pc_station', gridX: 3, gridY: 3, rotation: 0 },
        { instanceId: 'b2', furnitureId: 'pc_station', gridX: 7, gridY: 3, rotation: 0 },
        { instanceId: 'b3', furnitureId: 'sofa_luxury', gridX: 5, gridY: 7, rotation: 0 },
      ],
      visitorNames: ['Alexander Goth', 'Eliza Pancakes', 'Bob Pancakes']
    }
  };

  public static getLot(lotId: string): CommunityLot | null {
    return this.LOTS[lotId] || null;
  }

  public static getAllLots(): CommunityLot[] {
    return Object.values(this.LOTS);
  }
}
