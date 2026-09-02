import { describe, it, expect, vi } from 'vitest';
import { WorldPieMenu, type WorldPieOption } from './WorldPieMenu';
import { SoundManager } from '../audio/SoundManager';

describe('WorldPieMenu', () => {
  it('should initialize with closed status in headless environment', () => {
    const mockContainer = { appendChild: vi.fn() } as any;
    const soundManager = new SoundManager();
    const pieMenu = new WorldPieMenu(mockContainer, soundManager);

    expect(pieMenu.isOpen).toBe(false);
  });

  it('should handle options callback and closing', () => {
    const mockContainer = { appendChild: vi.fn() } as any;
    const soundManager = new SoundManager();
    const pieMenu = new WorldPieMenu(mockContainer, soundManager);

    let executed = false;
    const options: WorldPieOption[] = [
      {
        id: 'opt1',
        label: 'Schlafen',
        icon: '💤',
        badge: '+50 Energie',
        onExecute: () => {
          executed = true;
        }
      }
    ];

    options[0].onExecute();
    expect(executed).toBe(true);

    pieMenu.close();
    expect(pieMenu.isOpen).toBe(false);
  });
});
