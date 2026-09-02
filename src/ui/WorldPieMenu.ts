/**
 * Sims 4 Interactive 2.5D World Pie Menu
 * Floating radial interaction wheel positioned directly above the clicked 2.5D game object/Sim.
 */

import { SoundManager } from '../audio/SoundManager';
import { Sanitizer } from '../security/Sanitizer';

export interface WorldPieOption {
  id: string;
  label: string;
  icon: string;
  category?: 'primary' | 'social' | 'group' | 'skill' | 'care';
  badge?: string;
  color?: string;
  onExecute: () => void;
}

export class WorldPieMenu {
  private container: HTMLElement;
  private soundManager: SoundManager;
  private menuEl: HTMLElement | null = null;
  public isOpen: boolean = false;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.initDOM();
  }

  private initDOM(): void {
    if (typeof document === 'undefined') return;

    this.menuEl = document.createElement('div');
    this.menuEl.id = 'world-pie-menu';
    this.menuEl.className = 'world-pie-overlay';
    this.menuEl.style.cssText = `
      position: absolute;
      pointer-events: none;
      z-index: 999;
      display: none;
      width: 0;
      height: 0;
    `;

    this.container.appendChild(this.menuEl);

    // Close on escape or clicking outside
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Opens the radial World Pie Menu at given screen coordinates
   */
  public open(
    options: WorldPieOption[],
    screenPos: { x: number; y: number },
    targetTitle: string,
    targetIcon: string = '✨'
  ): void {
    if (!this.menuEl) return;
    if (options.length === 0) return;

    this.isOpen = true;
    this.soundManager.playUIClick();

    const sanitizedTitle = Sanitizer.sanitizeText(targetTitle, 28);
    const radius = Math.min(130, Math.max(95, 75 + options.length * 7));

    // Clamp coordinates within screen bounds
    const clampedX = Math.max(radius + 20, Math.min(window.innerWidth - radius - 20, screenPos.x));
    const clampedY = Math.max(radius + 20, Math.min(window.innerHeight - radius - 20, screenPos.y));

    let optionsHTML = '';
    const total = options.length;
    const angleStep = (2 * Math.PI) / total;
    // Start at top (-PI/2)
    const startAngle = -Math.PI / 2;

    options.forEach((opt, idx) => {
      const angle = startAngle + idx * angleStep;
      const posX = Math.round(Math.cos(angle) * radius);
      const posY = Math.round(Math.sin(angle) * radius);

      const color = opt.color || (opt.category === 'group' ? '#a855f7' : opt.category === 'social' ? '#38bdf8' : '#0284c7');

      optionsHTML += `
        <div class="pie-slice-btn" data-idx="${idx}" style="
          position: absolute;
          left: ${posX}px;
          top: ${posY}px;
          transform: translate(-50%, -50%);
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.92);
          border: 2px solid ${color};
          color: #fff;
          border-radius: 24px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 12px ${color}55;
          backdrop-filter: blur(8px);
          font-family: var(--font-heading, sans-serif);
          font-size: 13px;
          font-weight: 600;
          transition: all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
        ">
          <span style="font-size: 18px;">${opt.icon}</span>
          <span>${Sanitizer.sanitizeText(opt.label, 24)}</span>
          ${opt.badge ? `<span style="background: rgba(56, 189, 248, 0.25); color: #38bdf8; font-size: 10px; padding: 2px 6px; border-radius: 6px; font-weight: bold;">${opt.badge}</span>` : ''}
        </div>
      `;
    });

    this.menuEl.style.left = `${clampedX}px`;
    this.menuEl.style.top = `${clampedY}px`;
    this.menuEl.style.display = 'block';

    this.menuEl.innerHTML = `
      <!-- Center Anchor Badge & Close Ring -->
      <div id="pie-center-hub" style="
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: auto;
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
        border: 2px solid rgba(56, 189, 248, 0.6);
        border-radius: 50%;
        width: 58px;
        height: 58px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.7), 0 0 16px rgba(56, 189, 248, 0.4);
        z-index: 2;
        transition: transform 0.2s;
      " title="Klicken zum Schließen (oder ESC)">
        <span style="font-size: 22px;">${targetIcon}</span>
      </div>

      <!-- Target Name Floating Banner -->
      <div style="
        position: absolute;
        left: 0;
        top: 36px;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 2px 10px;
        color: #94a3b8;
        font-size: 11px;
        font-weight: bold;
        white-space: nowrap;
        pointer-events: none;
      ">
        ${sanitizedTitle}
      </div>

      <!-- Slices -->
      ${optionsHTML}
    `;

    // Center close button
    this.menuEl.querySelector('#pie-center-hub')?.addEventListener('click', () => {
      this.close();
    });

    // Slice interaction handlers
    this.menuEl.querySelectorAll('.pie-slice-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        (btn as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.1)';
        (btn as HTMLElement).style.background = 'rgba(30, 58, 138, 0.95)';
        this.soundManager.playUIClick();
      });
      btn.addEventListener('mouseleave', () => {
        (btn as HTMLElement).style.transform = 'translate(-50%, -50%) scale(1.0)';
        (btn as HTMLElement).style.background = 'rgba(15, 23, 42, 0.92)';
      });
      btn.addEventListener('click', (e) => {
        const idx = parseInt((e.currentTarget as HTMLElement).getAttribute('data-idx') || '0', 10);
        const selected = options[idx];
        if (selected) {
          this.close();
          selected.onExecute();
        }
      });
    });
  }

  public close(): void {
    if (this.menuEl) {
      this.menuEl.style.display = 'none';
      this.menuEl.innerHTML = '';
    }
    this.isOpen = false;
  }
}
