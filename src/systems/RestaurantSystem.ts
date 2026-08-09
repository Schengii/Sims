/**
 * Gourmet Restaurant Management Engine
 * Custom menu designer, staff hiring, and 5-star critic reviews.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export class RestaurantSystem {
  public isOwner: boolean = false;
  public restaurantName: string = 'Chez Simlish';
  public stars: number = 4; // 1 to 5 Stars
  public dailyProfit: number = 850;
  public menu: MenuItem[] = [
    { id: 'm1', name: 'Trüffel Pasta', price: 45, icon: '🍝' },
    { id: 'm2', name: 'Wagyu Steak', price: 85, icon: '🥩' },
    { id: 'm3', name: 'Tiramisu Sublime', price: 25, icon: '🍰' }
  ];

  public buyRestaurant(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): boolean {
    if (sim.simoleons < 12000) {
      toastManager.showToast('Restaurant', 'Nicht genügend Simoleons (§ 12.000 Startkapital benötigt)!', '❌', 'warning');
      return false;
    }

    sim.simoleons -= 12000;
    this.isOwner = true;

    soundManager.playLevelUp();
    toastManager.showToast('🍽️ GOURMET RESTAURANT!', `Du bist jetzt stolzer Besitzer von "${this.restaurantName}"!`, '🍷', 'levelUp');
    return true;
  }

  public collectDailyProfit(sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.isOwner) return;

    sim.simoleons += this.dailyProfit;
    soundManager.playLevelUp();
    toastManager.showToast('💰 RESTAURANT GEWINNE!', `+ § ${this.dailyProfit} Tagesgewinn aus dem Restaurant ausgezahlt!`, '🪙', 'success');
  }
}
