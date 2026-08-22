/**
 * ModdingSystem - Custom Content (CC) & Extensibility Engine
 * Allows players and modders to safely register and import custom furniture,
 * custom careers, custom recipes, and custom quests via JSON mod packages (.simpack).
 */

import { Sanitizer } from '../security/Sanitizer';
import { FURNITURE_CATALOG, type FurnitureDefinition } from '../world/Furniture';

export interface CustomModPackage {
  id: string;
  name: string;
  author: string;
  version: string;
  furniture?: FurnitureDefinition[];
  careers?: Array<{
    id: string;
    title: string;
    icon: string;
    salary: number;
    description: string;
  }>;
  recipes?: Array<{
    id: string;
    name: string;
    icon: string;
    hungerValue: number;
    cost: number;
  }>;
}

export class ModdingSystem {
  private static installedMods: Map<string, CustomModPackage> = new Map();

  /**
   * Installs and registers a custom mod package safely.
   */
  public static installMod(rawJson: string | object): { success: boolean; message: string; modId?: string } {
    try {
      let modData: CustomModPackage | null = null;
      if (typeof rawJson === 'string') {
        modData = Sanitizer.safeJSONParse<CustomModPackage | null>(rawJson, null);
      } else if (rawJson && typeof rawJson === 'object') {
        modData = rawJson as CustomModPackage;
      }

      if (!modData || !modData.id || !modData.name) {
        return { success: false, message: 'Ungültiges Mod-Format: ID und Name erforderlich.' };
      }

      // 1. Register Custom Furniture Items
      if (Array.isArray(modData.furniture)) {
        modData.furniture.forEach(item => {
          if (item.id && item.name) {
            FURNITURE_CATALOG[item.id] = {
              id: item.id,
              name: item.name,
              category: item.category || 'misc' as any,
              price: typeof item.price === 'number' ? Math.max(0, item.price) : 100,
              icon: item.icon || '📦',
              color: item.color || '#3498db',
              accentColor: (item as any).accentColor || '#ffffff',
              description: (item as any).description || 'Benutzerdefiniertes Möbelstück',
              width: item.width || 1,
              height: item.height || 1,
              interactions: item.interactions || []
            };
          }
        });
      }

      this.installedMods.set(modData.id, modData);
      return {
        success: true,
        message: `Mod "${modData.name}" von ${modData.author || 'Community'} erfolgreich installiert!`,
        modId: modData.id
      };
    } catch (e: any) {
      return { success: false, message: `Fehler beim Laden des Mods: ${e.message}` };
    }
  }

  public static getInstalledMods(): CustomModPackage[] {
    return Array.from(this.installedMods.values());
  }

  public static getModCount(): number {
    return this.installedMods.size;
  }

  public static uninstallMod(modId: string): boolean {
    const mod = this.installedMods.get(modId);
    if (!mod) return false;

    // Remove registered furniture
    if (mod.furniture) {
      mod.furniture.forEach(f => {
        delete FURNITURE_CATALOG[f.id];
      });
    }

    this.installedMods.delete(modId);
    return true;
  }
}
