/**
 * Photo Studio & Wall Art Framing System
 * Takes high-resolution portraits with thematic backdrops, mounts them directly onto walls, and organizes family photo albums.
 */

import { Sim } from '../entity/Sim';
import { House, type WallArtPiece } from '../world/House';

export interface StudioPhoto {
  id: string;
  title: string;
  theme: 'family' | 'pet' | 'romantic' | 'glamour';
  icon: string;
  dateStr: string;
  photographedSimName: string;
}

export class PhotoStudioSystem {
  public studioPhotos: StudioPhoto[] = [];

  public shootPortrait(
    theme: 'family' | 'pet' | 'romantic' | 'glamour',
    sim: Sim,
    house: House,
    mountOnWall: boolean = true
  ): StudioPhoto {
    const themeData = {
      family: { title: 'Familien-Meisterporträt', icon: '👨‍👩‍👧' },
      pet: { title: 'Haustier-Fotoshooting', icon: '🐾' },
      romantic: { title: 'Romantisches Paarporträt', icon: '💑' },
      glamour: { title: 'Glamour-Passbild', icon: '🌟' }
    }[theme];

    const photo: StudioPhoto = {
      id: `studio_photo_${Date.now()}`,
      title: themeData.title,
      theme,
      icon: themeData.icon,
      dateStr: new Date().toLocaleDateString('de-DE'),
      photographedSimName: sim.customization.name
    };

    this.studioPhotos.push(photo);

    sim.needs.modify('fun', 30);
    sim.needs.modify('social', 20);

    if (mountOnWall) {
      const artPiece: WallArtPiece = {
        id: photo.id,
        gridX: Math.min(sim.gridPos.x, house.width - 2),
        gridY: Math.min(sim.gridPos.y, house.height - 2),
        wall: 'north',
        title: photo.title,
        icon: photo.icon,
        artType: 'photo',
        auraBuff: 25
      };
      house.addWallArt(artPiece);
    }

    return photo;
  }

  public exportData(): Record<string, any> {
    return {
      studioPhotos: this.studioPhotos
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.studioPhotos) this.studioPhotos = data.studioPhotos;
  }
}
