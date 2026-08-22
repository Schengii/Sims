import { describe, it, expect } from 'vitest';
import { ModdingSystem } from './ModdingSystem';
import { FURNITURE_CATALOG } from '../world/Furniture';

describe('ModdingSystem', () => {
  it('installs custom furniture mod package and uninstalls cleanly', () => {
    const mod = {
      id: 'test_mod_sofa',
      name: 'Neon Velvet Sofa Pack',
      author: 'ModderX',
      version: '1.0.0',
      furniture: [
        {
          id: 'neon_sofa_custom',
          name: 'Neon Sofa',
          price: 500,
          icon: '🛋️',
          category: 'comfort' as const,
          color: '#ff0055',
          accentColor: '#ffffff',
          description: 'A custom sofa',
          width: 2,
          height: 1,
          interactions: []
        }
      ]
    };

    const res = ModdingSystem.installMod(mod);
    expect(res.success).toBe(true);
    expect(FURNITURE_CATALOG['neon_sofa_custom']).toBeDefined();
    expect(FURNITURE_CATALOG['neon_sofa_custom'].name).toBe('Neon Sofa');

    const removed = ModdingSystem.uninstallMod('test_mod_sofa');
    expect(removed).toBe(true);
    expect(FURNITURE_CATALOG['neon_sofa_custom']).toBeUndefined();
  });
});
