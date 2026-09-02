import { describe, it, expect, beforeEach } from 'vitest';
import { BotanyGreenhouseSystem } from './BotanyGreenhouseSystem';

describe('BotanyGreenhouseSystem', () => {
  let botany: BotanyGreenhouseSystem;

  beforeEach(() => {
    botany = new BotanyGreenhouseSystem();
  });

  it('should splice tomato and strawberry into dragonfruit', () => {
    const result = botany.spliceCrops('tomatoes', 'strawberries');
    expect(result).not.toBeNull();
    expect(result!.resultCrop).toBe('dragonfruit');
    expect(botany.discoveredHybrids).toContain('dragonfruit');
  });

  it('should apply fertilizers and deduct from inventory', () => {
    const initialCompost = botany.fertilizerInventory.compost;
    const boost = botany.applyFertilizer('compost');

    expect(boost).not.toBeNull();
    expect(boost!.speedBoost).toBeGreaterThan(1.0);
    expect(botany.fertilizerInventory.compost).toBe(initialCompost - 1);
  });

  it('should export and import botany data', () => {
    botany.spliceCrops('dragonfruit', 'flowers');
    const exported = botany.exportData();

    const newBotany = new BotanyGreenhouseSystem();
    newBotany.importData(exported);

    expect(newBotany.discoveredHybrids).toContain('money_tree');
  });
});
