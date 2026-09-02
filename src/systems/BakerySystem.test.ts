import { describe, it, expect, beforeEach } from 'vitest';
import { BakerySystem } from './BakerySystem';
import { Sim } from '../entity/Sim';

describe('BakerySystem', () => {
  let bakery: BakerySystem;
  let sim: Sim;

  beforeEach(() => {
    bakery = new BakerySystem();
    sim = new Sim();
  });

  it('should bake wedding cake and stock the display case', () => {
    const res = bakery.bakePastry('wedding_cake', sim);
    expect(res.success).toBe(true);

    const item = bakery.displayCaseInventory.find(i => i.recipeId === 'wedding_cake');
    expect(item).toBeDefined();
    expect(item!.quantity).toBe(1);
  });

  it('should simulate customer purchase and earn revenue', () => {
    bakery.bakePastry('lemon_cupcakes', sim);
    const sale = bakery.simulateCustomerPurchase();

    expect(sale.revenue).toBe(120);
    expect(bakery.totalRevenue).toBe(120);
  });
});
