/**
 * CloudGallerySystem - Community Lot & Household Hub
 * Manages pre-built curated creator homes, trending lots, famous families,
 * and allows instant 1-click importing and rating.
 */

import { House } from '../world/House';
import { BlueprintManager, type HouseBlueprintData } from './BlueprintSystem';
import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';

export interface GalleryItem {
  id: string;
  type: 'lot' | 'household';
  title: string;
  creator: string;
  icon: string;
  tags: string[];
  downloads: number;
  upvotes: number;
  description: string;
  cost: number;
  blueprintData?: HouseBlueprintData;
  householdData?: Array<{ name: string; trait: string; outfitColor: string; skinColor: string }>;
}

export class CloudGallerySystem {
  private static items: GalleryItem[] = [
    {
      id: 'lot_bella_vista',
      type: 'lot',
      title: 'Villa Bella Vista',
      creator: 'Architekt_Max',
      icon: '🏰',
      tags: ['#Luxury', '#Pool', '#ModernVilla'],
      downloads: 1420,
      upvotes: 890,
      description: 'Prachtvolle 2-stöckige Villa mit Marmorböden, Swimmingpool und Kamin.',
      cost: 45000,
      blueprintData: {
        version: '1.0',
        title: 'Villa Bella Vista',
        author: 'Architekt_Max',
        width: 16,
        height: 16,
        floors: {
          0: {
            tiles: [
              { x: 4, y: 4, type: 'marble', color: '#ffffff', hasWallNorth: true, hasWallWest: true },
              { x: 5, y: 4, type: 'marble', color: '#ffffff', hasWallNorth: true },
              { x: 6, y: 4, type: 'marble', color: '#ffffff', hasWallNorth: true },
              { x: 4, y: 5, type: 'marble', color: '#ffffff', hasWallWest: true },
              { x: 5, y: 5, type: 'marble', color: '#ffffff' },
              { x: 6, y: 5, type: 'marble', color: '#ffffff' },
              { x: 7, y: 5, type: 'pool', color: '#00e5ff' },
              { x: 7, y: 6, type: 'pool', color: '#00e5ff' }
            ],
            furniture: [
              { instanceId: 'f1', furnitureId: 'fireplace_stone', gridX: 4, gridY: 4, rotation: 0 },
              { instanceId: 'f2', furnitureId: 'sofa_luxury', gridX: 5, gridY: 5, rotation: 0 },
              { instanceId: 'f3', furnitureId: 'tv_smart', gridX: 6, gridY: 4, rotation: 0 }
            ]
          }
        }
      }
    },
    {
      id: 'lot_cozy_cottage',
      type: 'lot',
      title: 'Romantisches Landhaus',
      creator: 'GreenThumb_Lisa',
      icon: '🏡',
      tags: ['#Cozy', '#Garden', '#Farm'],
      downloads: 980,
      upvotes: 620,
      description: 'Idyllisches Landhaus mit Holzparkett und großzügigem Gartenbereich.',
      cost: 14500,
      blueprintData: {
        version: '1.0',
        title: 'Romantisches Landhaus',
        author: 'GreenThumb_Lisa',
        width: 16,
        height: 16,
        floors: {
          0: {
            tiles: [
              { x: 4, y: 4, type: 'wood', color: '#8d5524', hasWallNorth: true, hasWallWest: true },
              { x: 5, y: 4, type: 'wood', color: '#8d5524', hasWallNorth: true },
              { x: 4, y: 5, type: 'wood', color: '#8d5524', hasWallWest: true },
              { x: 5, y: 5, type: 'wood', color: '#8d5524' }
            ],
            furniture: [
              { instanceId: 'f4', furnitureId: 'bed_basic', gridX: 4, gridY: 4, rotation: 0 },
              { instanceId: 'f5', furnitureId: 'easel_artist', gridX: 5, gridY: 5, rotation: 0 }
            ]
          }
        }
      }
    },
    {
      id: 'hh_goth_family',
      type: 'household',
      title: 'Die legendäre Goth-Familie',
      creator: 'Sims_Official',
      icon: '👨‍👩‍👧‍👦',
      tags: ['#Classic', '#Mysterious', '#Rich'],
      downloads: 3200,
      upvotes: 2150,
      description: 'Mortimer und Bella Goth mit exklusiver Kleidung und hoher Charisma-Stufe.',
      cost: 0,
      householdData: [
        { name: 'Mortimer Goth', trait: 'Genial', outfitColor: '#800020', skinColor: '#e0ac69' },
        { name: 'Bella Goth', trait: 'Romantisch', outfitColor: '#dc2626', skinColor: '#c68642' }
      ]
    }
  ];

  public static getItems(typeFilter?: 'all' | 'lot' | 'household'): GalleryItem[] {
    if (!typeFilter || typeFilter === 'all') return this.items;
    return this.items.filter(i => i.type === typeFilter);
  }

  public static upvoteItem(id: string): boolean {
    const item = this.items.find(i => i.id === id);
    if (!item) return false;
    item.upvotes += 1;
    return true;
  }

  public static importLot(house: House, item: GalleryItem): { success: boolean; message: string } {
    if (item.type !== 'lot' || !item.blueprintData) {
      return { success: false, message: 'Dieser Eintrag ist kein gültiges Grundstück!' };
    }
    const jsonStr = JSON.stringify(item.blueprintData);
    const res = BlueprintManager.importBlueprint(house, jsonStr);
    if (res.success) {
      item.downloads += 1;
    }
    return res;
  }

  public static importHousehold(household: Household, item: GalleryItem): { success: boolean; message: string } {
    if (item.type !== 'household' || !item.householdData) {
      return { success: false, message: 'Dieser Eintrag ist kein gültiger Haushalt!' };
    }

    item.householdData.forEach(member => {
      const sim = new Sim({
        name: member.name,
        trait: member.trait,
        outfitColor: member.outfitColor,
        skinColor: member.skinColor
      });
      household.addSim(sim);
    });

    item.downloads += 1;
    return {
      success: true,
      message: `Haushalt "${item.title}" (${item.householdData.length} Sims) ist eingezogen!`
    };
  }
}
