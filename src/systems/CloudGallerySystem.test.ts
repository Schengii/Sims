import { describe, it, expect } from 'vitest';
import { CloudGallerySystem } from './CloudGallerySystem';
import { House } from '../world/House';
import { Household } from '../entity/Household';

describe('CloudGallerySystem', () => {
  it('retrieves filtered gallery items and handles upvoting', () => {
    const allItems = CloudGallerySystem.getItems('all');
    expect(allItems.length).toBeGreaterThan(0);

    const lotItems = CloudGallerySystem.getItems('lot');
    expect(lotItems.every(i => i.type === 'lot')).toBe(true);

    const firstItem = allItems[0];
    const initialUpvotes = firstItem.upvotes;
    CloudGallerySystem.upvoteItem(firstItem.id);
    expect(firstItem.upvotes).toBe(initialUpvotes + 1);
  });

  it('imports lot blueprint and household properly', () => {
    const house = new House();
    const lotItem = CloudGallerySystem.getItems('lot')[0];
    const lotRes = CloudGallerySystem.importLot(house, lotItem);
    expect(lotRes.success).toBe(true);

    const household = new Household();
    const hhItem = CloudGallerySystem.getItems('household')[0];
    const hhRes = CloudGallerySystem.importHousehold(household, hhItem);
    expect(hhRes.success).toBe(true);
    expect(household.sims.length).toBeGreaterThan(1);
  });
});
