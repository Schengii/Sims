/**
 * LlamaEats Delivery System
 * Handles food orders, delivery timer, delivery driver spawning, and inventory placement.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export interface DeliveryItem {
  id: string;
  name: string;
  category: 'food' | 'drink';
  price: number;
  icon: string;
  hungerBoost: number;
  funBoost: number;
  description: string;
}

export const DELIVERY_CATALOG: DeliveryItem[] = [
  {
    id: 'pizza_margherita',
    name: 'Steinofen-Pizza Margherita',
    category: 'food',
    price: 35,
    icon: '🍕',
    hungerBoost: 45,
    funBoost: 15,
    description: 'Knusprige Steinofen-Pizza mit frischem Basilikum.'
  },
  {
    id: 'sushi_combo',
    name: 'Gourmet Sushi Set',
    category: 'food',
    price: 60,
    icon: '🍣',
    hungerBoost: 55,
    funBoost: 25,
    description: 'Frische Nigiri und Maki Rollen mit Lachs & Wasabi.'
  },
  {
    id: 'burger_deluxe',
    name: 'Llama Burger Deluxe',
    category: 'food',
    price: 40,
    icon: '🍔',
    hungerBoost: 50,
    funBoost: 20,
    description: 'Saftiger Bacon-Burger mit Süßkartoffel-Pommes.'
  },
  {
    id: 'bubble_tea',
    name: 'Taro Bubble Tea',
    category: 'drink',
    price: 15,
    icon: '🧋',
    hungerBoost: 15,
    funBoost: 30,
    description: 'Erfrischender Taro-Milchtee mit Tapioka-Perlen.'
  }
];

export class DeliverySystem {
  private pendingOrders: Array<{ item: DeliveryItem; remainingSec: number }> = [];

  public orderItem(item: DeliveryItem, sim: Sim, toastManager: ToastManager): boolean {
    if (sim.simoleons < item.price) {
      toastManager.showToast('LlamaEats Delivery', 'Nicht genügend Simoleons auf dem Konto!', '❌', 'warning');
      return false;
    }

    sim.simoleons -= item.price;
    this.pendingOrders.push({
      item,
      remainingSec: 8 // Delivery arrives in 8 real-time seconds
    });

    toastManager.showToast('LlamaEats Bestellung', `${item.name} bestellt! Lieferung trifft in Kürze ein...`, '🛵', 'info');
    return true;
  }

  public update(deltaSec: number, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    for (let i = this.pendingOrders.length - 1; i >= 0; i--) {
      this.pendingOrders[i].remainingSec -= deltaSec;
      if (this.pendingOrders[i].remainingSec <= 0) {
        const order = this.pendingOrders.splice(i, 1)[0];
        
        sim.inventory.addItem({
          name: order.item.name,
          type: 'crop',
          icon: order.item.icon,
          value: order.item.price,
          description: order.item.description
        });

        sim.needs.modify('hunger', order.item.hungerBoost);
        sim.needs.modify('fun', order.item.funBoost);

        soundManager.playLevelUp();
        toastManager.showToast('🛵 LIEFERUNG EINGETROFFEN!', `${order.item.name} wurde geliefert & verzehrt!`, order.item.icon, 'success');
      }
    }
  }
}
