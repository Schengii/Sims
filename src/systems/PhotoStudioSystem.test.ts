import { describe, it, expect, beforeEach } from 'vitest';
import { PhotoStudioSystem } from './PhotoStudioSystem';
import { Sim } from '../entity/Sim';
import { House } from '../world/House';

describe('PhotoStudioSystem', () => {
  let studio: PhotoStudioSystem;
  let sim: Sim;
  let house: House;

  beforeEach(() => {
    studio = new PhotoStudioSystem();
    sim = new Sim();
    house = new House();
    house.wallMountedArt = []; // Clear starter art for deterministic test
  });

  it('should shoot a family portrait and mount it to house wall', () => {
    const photo = studio.shootPortrait('family', sim, house, true);

    expect(photo).toBeDefined();
    expect(photo.title).toBe('Familien-Meisterporträt');
    expect(studio.studioPhotos.length).toBe(1);
    expect(house.wallMountedArt.length).toBe(1);
    expect(house.wallMountedArt[0].title).toBe('Familien-Meisterporträt');
  });
});
