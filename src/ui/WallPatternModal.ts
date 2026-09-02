/**
 * Wall Pattern & Wallpaper Designer Modal UI
 * Allows players to choose wall patterns (Brick, Wood Panel, Floral Wallpaper, Marble Tile) and custom colors.
 */

import { House, type WallPattern } from '../world/House';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class WallPatternModal {
  private container: HTMLElement;
  private house: House;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    house: House,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.house = house;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-wall-pattern';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    const patterns: { id: WallPattern; name: string; icon: string; desc: string; defaultColor: string }[] = [
      { id: 'plain', name: 'Glatt verputzt', icon: '🎨', desc: 'Schlichte, moderne Wand mit frei wählbarer Farbe', defaultColor: '#334155' },
      { id: 'brick', name: 'Backstein-Mauerwerk', icon: '🧱', desc: 'Rustikale Klinker-Optik für Loft-Flair', defaultColor: '#991b1b' },
      { id: 'wood_panel', name: 'Holzvertäfelung', icon: '🪵', desc: 'Skandinavische Holzlamellen mit warmer Akzentuierung', defaultColor: '#78350f' },
      { id: 'wallpaper_floral', name: 'Vintage Blumen-Tapete', icon: '🌸', desc: 'Elegante florale Ornamente für gemütliche Wohnräume', defaultColor: '#475569' },
      { id: 'marble_tile', name: 'Carrara Marmor-Fliesen', icon: '🏛️', desc: 'Hochglänzende Luxus-Marmorwand für Bäder & Salons', defaultColor: '#f8fafc' }
    ];

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 680px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.96); border: 1px solid rgba(56, 189, 248, 0.3); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 30px;">🧱</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #38bdf8;">Wand-Tapeten & Muster-Designer</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #94a3b8;">Verleihe Wänden individuelle Tapetenmuster & Farbkonzepte</p>
            </div>
          </div>
          <button id="close-wall-pattern-modal" style="background: transparent; border: none; font-size: 26px; color: #94a3b8; cursor: pointer;">&times;</button>
        </div>

        <!-- Color Picker -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <label style="font-weight: 600; font-size: 13px; color: #f8fafc;">🎨 Wand-Grundfarbe anpassen:</label>
            <p style="font-size: 11px; color: #94a3b8; margin: 2px 0 0 0;">Wähle die Basistönung für die ausgewählte Tapete</p>
          </div>
          <input type="color" id="pattern-color-picker" value="#334155" style="width: 50px; height: 36px; border: none; border-radius: 6px; cursor: pointer;" />
        </div>

        <!-- Pattern Grid -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${patterns.map(pat => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1);
              border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
            ">
              <div style="display: flex; align-items: center; gap: 14px;">
                <span style="font-size: 28px;">${pat.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${pat.name}</div>
                  <p style="margin: 2px 0 0 0; font-size: 12px; color: #cbd5e1;">${pat.desc}</p>
                </div>
              </div>

              <button class="apply-pattern-btn" data-pattern="${pat.id}" data-color="${pat.defaultColor}" style="
                background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8;
                color: white; border-radius: 6px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
              ">Auf alle Wände anwenden</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-wall-pattern-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.apply-pattern-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pattern = (e.currentTarget as HTMLElement).getAttribute('data-pattern') as WallPattern;
        const colorInput = (backdrop.querySelector('#pattern-color-picker') as HTMLInputElement)?.value;
        const count = this.house.applyPatternToAllWalls(pattern, colorInput);
        this.soundManager.playBuySound();
        this.sim.triggerEmote('🎨', 3000);
        this.toastManager.showToast('🧱 Tapetenmuster angewendet', `${count} Wandsegmente wurden mit "${pattern}" neu tapeziert!`, '✨', 'success');
        this.close();
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-wall-pattern');
    if (existing) existing.remove();
  }
}
