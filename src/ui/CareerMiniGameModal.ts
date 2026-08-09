/**
 * Career & Hobby Interactive Mini-Game Modal
 * Provides interactive timing & puzzle tasks to boost promotion progress and earn extra Simoleons.
 */

import { Game } from '../engine/Game';

export class CareerMiniGameModal {
  private container: HTMLDivElement | null = null;
  private game: Game;
  private timerId: number | null = null;
  private targetVal: number = 50;
  private currentVal: number = 0;
  private speed: number = 2;
  private direction: number = 1;
  private activeCareerName: string = 'Tech Guru';

  constructor(game: Game) {
    this.game = game;
  }

  public open(careerName: string): void {
    this.activeCareerName = careerName;
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      const titleEl = this.container.querySelector('#minigame-career-title');
      if (titleEl) titleEl.textContent = `🎯 ${this.activeCareerName} Shift Mini-Game`;
      this.container.style.display = 'flex';
      this.startMiniGameLoop();
    }
  }

  public close(): void {
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.className = 'glass-modal-overlay';
    this.container.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.style.cssText = `
      width: 440px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    content.innerHTML = `
      <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">🎯 Karriere-Shift Mini-Game</h3>
      <p style="margin: 0; font-size: 14px; color: #94a3b8; text-align: center;">
        Stoppe den Zeiger in der grünen Zielzone, um einen exzellenten Arbeitsschicht-Bonus zu erzielen!
      </p>
      
      <div style="position: relative; width: 100%; height: 32px; background: rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; margin: 12px 0;">
        <div id="minigame-target-zone" style="position: absolute; left: 40%; width: 20%; height: 100%; background: rgba(74, 222, 128, 0.4); border-left: 2px solid #4ade80; border-right: 2px solid #4ade80;"></div>
        <div id="minigame-pointer" style="position: absolute; left: 0%; width: 6px; height: 100%; background: #38bdf8; box-shadow: 0 0 10px #38bdf8; transition: none;"></div>
      </div>

      <div style="display: flex; gap: 12px; width: 100%;">
        <button id="minigame-stop-btn" style="flex: 1; padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 15px;">
          ⚡ jetzt Stoppen!
        </button>
        <button id="minigame-close-btn" style="padding: 12px 18px; background: rgba(255, 255, 255, 0.1); color: white; border: none; border-radius: 10px; cursor: pointer;">
          Abbrechen
        </button>
      </div>
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);

    content.querySelector('#minigame-stop-btn')?.addEventListener('click', () => this.evaluateResult());
    content.querySelector('#minigame-close-btn')?.addEventListener('click', () => this.close());
  }

  private startMiniGameLoop(): void {
    this.currentVal = 0;
    this.direction = 1;
    this.speed = 1.5 + Math.random() * 1.5;
    
    // Set random target zone between 30% and 70%
    const targetStart = 30 + Math.random() * 30;
    this.targetVal = targetStart + 10; // Center of target zone

    const targetZoneEl = this.container?.querySelector('#minigame-target-zone') as HTMLDivElement;
    if (targetZoneEl) {
      targetZoneEl.style.left = `${targetStart}%`;
      targetZoneEl.style.width = '20%';
    }

    const animate = () => {
      this.currentVal += this.speed * this.direction;
      if (this.currentVal >= 100) {
        this.currentVal = 100;
        this.direction = -1;
      } else if (this.currentVal <= 0) {
        this.currentVal = 0;
        this.direction = 1;
      }

      const pointerEl = this.container?.querySelector('#minigame-pointer') as HTMLDivElement;
      if (pointerEl) {
        pointerEl.style.left = `${this.currentVal}%`;
      }

      this.timerId = requestAnimationFrame(animate);
    };

    this.timerId = requestAnimationFrame(animate);
  }

  private evaluateResult(): void {
    if (this.timerId !== null) {
      cancelAnimationFrame(this.timerId);
      this.timerId = null;
    }

    const diff = Math.abs(this.currentVal - this.targetVal);
    if (diff <= 10) {
      // Perfect hit
      const bonus = 400;
      this.game.sim.simoleons += bonus;
      this.game.sim.aspirationPoints += 50;
      this.game.sim.moodletManager.addMoodlet({
        id: 'career_success',
        name: 'Perfekte Schicht',
        emotion: 'inspired',
        weight: 3,
        durationSec: 180,
        icon: '🏆',
        description: 'Exzellente Arbeit abgeliefert!'
      });
      this.game.toastManager?.showToast(`🎉 Perfekt! + § ${bonus} & Moodlet: Perfekte Schicht!`, 'success');
    } else if (diff <= 22) {
      // Good hit
      const bonus = 150;
      this.game.sim.simoleons += bonus;
      this.game.toastManager?.showToast(`👍 Gute Schicht! + § ${bonus} Simoleons!`, 'info');
    } else {
      // Missed
      this.game.toastManager?.showToast(`😅 Knapp vorbei! Nächstes Mal klappt es besser.`, 'warning');
    }

    this.close();
  }
}
