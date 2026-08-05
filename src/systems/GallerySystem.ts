/**
 * Sims Gallery & Import/Export System
 * Allows exporting and importing house blueprints and Sims as Base64/JSON strings.
 */

import { type GameSaveData } from './SaveManager';
import { Game } from '../engine/Game';

export class GalleryManager {
  public static exportBlueprint(game: Game): string {
    const saveData = {
      version: '1.0.0',
      timestamp: Date.now(),
      sim: {
        customization: game.sim.customization,
        gridPos: game.sim.gridPos,
        needs: game.sim.needs.getValues(),
        simoleons: game.sim.simoleons,
        skills: game.sim.skills,
        lifeStage: game.sim.lifeStage
      },
      house: {
        placedFurniture: game.house.placedFurniture,
        wallDisplayMode: game.house.wallDisplayMode,
        activeFloor: game.house.activeFloor
      }
    };
    const jsonStr = JSON.stringify(saveData);
    return btoa(unescape(encodeURIComponent(jsonStr)));
  }

  public static importBlueprint(game: Game, base64Code: string): { success: boolean; message: string } {
    try {
      const jsonStr = decodeURIComponent(escape(atob(base64Code.trim())));
      const saveData = JSON.parse(jsonStr) as GameSaveData;
      if (saveData.house && Array.isArray(saveData.house.placedFurniture)) {
        game.house.placedFurniture = saveData.house.placedFurniture;
      }
      return { success: true, message: '🎉 Galerie-Bauwerk / Haushalt erfolgreich importiert!' };
    } catch (e) {
      return { success: false, message: '❌ Ungültiger Galerie-Code! Bitte überprüfe die Zeichenkette.' };
    }
  }
}
