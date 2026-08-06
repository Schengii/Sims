/**
 * Sim Inventory System
 * Manages items held by the Sim, such as painted canvases, harvested crops,
 * and unlocked party trophies.
 */

export interface InventoryItem {
  id: string;
  name: string;
  type: 'painting' | 'crop' | 'trophy' | 'collectible';
  icon: string;
  value: number; // Sale price in Simoleons (§)
  quality?: 'normal' | 'fine' | 'masterpiece';
  description: string;
  createdAt: number;
}

export class Inventory {
  public items: InventoryItem[] = [];

  public addItem(item: Omit<InventoryItem, 'id' | 'createdAt'>): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    this.items.push(newItem);
    return newItem;
  }

  public removeItem(id: string): InventoryItem | null {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      return this.items.splice(index, 1)[0];
    }
    return null;
  }

  public getItem(id: string): InventoryItem | undefined {
    return this.items.find(item => item.id === id);
  }

  public hasItem(name: string): boolean {
    return this.items.some(item => item.name === name);
  }

  public removeItemByName(name: string): boolean {
    const index = this.items.findIndex(item => item.name === name);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  public clear(): void {
    this.items = [];
  }
}

