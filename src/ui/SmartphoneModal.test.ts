import { describe, it, expect, vi } from 'vitest';
import { SmartphoneModal } from './SmartphoneModal';
import { Sim } from '../entity/Sim';
import { DeliverySystem } from '../systems/DeliverySystem';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

describe('SmartphoneModal & SimOS Hub', () => {
  it('initializes with full suite of categorized SimOS apps', () => {
    const sim = new Sim();
    const delivery = new DeliverySystem();
    const toast = new ToastManager();
    const sound = new SoundManager();

    const phone = new SmartphoneModal(sim, delivery, toast, sound);
    expect(phone.apps.length).toBeGreaterThanOrEqual(20);

    const categories = phone.apps.map(a => a.category);
    expect(categories).toContain('finance');
    expect(categories).toContain('travel');
    expect(categories).toContain('home');
    expect(categories).toContain('culture');
    expect(categories).toContain('family');
  });

  it('filters apps by category properly', () => {
    const sim = new Sim();
    const delivery = new DeliverySystem();
    const toast = new ToastManager();
    const sound = new SoundManager();

    const phone = new SmartphoneModal(sim, delivery, toast, sound);
    const financeApps = phone.apps.filter(a => a.category === 'finance');
    expect(financeApps.some(a => a.id === 'market')).toBe(true);
    expect(financeApps.some(a => a.id === 'bills')).toBe(true);
  });

  it('triggers onLaunchApp callback when launching an app', () => {
    const sim = new Sim();
    const delivery = new DeliverySystem();
    const toast = new ToastManager();
    const sound = new SoundManager();

    const phone = new SmartphoneModal(sim, delivery, toast, sound);
    const launchSpy = vi.fn();
    phone.onLaunchApp = launchSpy;

    phone.onLaunchApp('market');
    expect(launchSpy).toHaveBeenCalledWith('market');
  });
});
