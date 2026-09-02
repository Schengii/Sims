/**
 * Magic Duel Arena Modal UI
 * Allows spellcasters to challenge rivals to real-time magical duels, select offensive/defensive spells, and win championship prizes.
 */

import { MagicDuelSystem, type DuelOpponent } from '../systems/MagicDuelSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class MagicDuelModal {
  private container: HTMLElement;
  private duelSystem: MagicDuelSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;
  private currentOpponent: DuelOpponent | null = null;
  private playerHp: number = 100;

  constructor(
    container: HTMLElement,
    duelSystem: MagicDuelSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.duelSystem = duelSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();
    if (!this.currentOpponent) {
      this.currentOpponent = { ...this.duelSystem.opponents[2] };
      this.playerHp = 100;
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-magic-duel';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 20, 50, 0.96); border: 1px solid rgba(192, 132, 252, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🪄</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #c084fc;">Magier-Duellarena & Turniere</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #e9d5ff;">Rang: <b>${this.duelSystem.rank}</b> | Siege: ${this.duelSystem.duelsWon}</p>
            </div>
          </div>
          <button id="close-duel-modal" style="background: transparent; border: none; font-size: 26px; color: #e9d5ff; cursor: pointer;">&times;</button>
        </div>

        <!-- Combat Arena Overview -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 14px; text-align: center;">
            <span style="font-size: 30px;">🧙</span>
            <div style="font-weight: bold; font-size: 14px; color: #38bdf8;">${this.sim.customization.name}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">Spieler-HP: ${this.playerHp}/100</div>
            <div style="background: rgba(0,0,0,0.4); border-radius: 6px; height: 10px; overflow: hidden;">
              <div style="background: #38bdf8; height: 100%; width: ${this.playerHp}%;"></div>
            </div>
          </div>

          <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 12px; padding: 14px; text-align: center;">
            <span style="font-size: 30px;">${this.currentOpponent.icon}</span>
            <div style="font-weight: bold; font-size: 14px; color: #f43f5e;">${this.currentOpponent.name} (${this.currentOpponent.rank})</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">Gegner-HP: ${this.currentOpponent.hp}/${this.currentOpponent.maxHp}</div>
            <div style="background: rgba(0,0,0,0.4); border-radius: 6px; height: 10px; overflow: hidden;">
              <div style="background: #f43f5e; height: 100%; width: ${(this.currentOpponent.hp / this.currentOpponent.maxHp) * 100}%;"></div>
            </div>
          </div>
        </div>

        <!-- Spell Action Grid -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">⚡ Zauberspruch für diese Runde wählen:</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <button class="duel-spell-btn" data-spell="lightning" style="background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span style="font-size: 22px; display: block;">⚡</span>
            <span style="font-size: 12px;">Blitzschlag (35 DMG)</span>
          </button>
          <button class="duel-spell-btn" data-spell="shield" style="background: linear-gradient(135deg, #7c3aed, #6d28d9); border: 1px solid #c084fc; color: white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span style="font-size: 22px; display: block;">🛡️</span>
            <span style="font-size: 12px;">Prisma-Schild</span>
          </button>
          <button class="duel-spell-btn" data-spell="frost" style="background: linear-gradient(135deg, #0d9488, #0f766e); border: 1px solid #2dd4bf; color: white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span style="font-size: 22px; display: block;">❄️</span>
            <span style="font-size: 12px;">Frostnova (25 DMG)</span>
          </button>
          <button class="duel-spell-btn" data-spell="pyro" style="background: linear-gradient(135deg, #ea580c, #c2410c); border: 1px solid #fb923c; color: white; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span style="font-size: 22px; display: block;">💥</span>
            <span style="font-size: 12px;">Pyroschlag (50 DMG)</span>
          </button>
        </div>

        <!-- Opponent Picker -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: #cbd5e1;">Anderen Duellanten herausfordern:</span>
          <div style="display: flex; gap: 8px;">
            ${this.duelSystem.opponents.map(opp => `
              <button class="pick-opp-btn" data-id="${opp.id}" style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 6px; font-size: 11px; cursor: pointer;">${opp.icon} ${opp.name}</button>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-duel-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.pick-opp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const match = this.duelSystem.opponents.find(o => o.id === id);
        if (match) {
          this.currentOpponent = { ...match };
          this.playerHp = 100;
          this.soundManager.playUIClick();
          this.open();
        }
      });
    });

    backdrop.querySelectorAll('.duel-spell-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const spell = (e.currentTarget as HTMLElement).getAttribute('data-spell') as any;
        if (!this.currentOpponent) return;

        const res = this.duelSystem.executeRound(spell, this.sim, this.currentOpponent);
        this.playerHp = Math.max(0, this.playerHp - res.oppDmg);

        this.soundManager.playLevelUp();
        this.toastManager.showToast('🪄 Duell-Runde', res.log, '⚡', 'info');

        if (res.battleOver) {
          this.toastManager.showToast('🏆 DUELL-SIEG!', `Du hast ${this.currentOpponent.name} besiegt! (+§ 1.500, Rang: ${this.duelSystem.rank})`, '🌟', 'levelUp');
          this.currentOpponent = null;
          this.close();
        } else if (this.playerHp <= 0) {
          this.toastManager.showToast('💀 Duell verloren', 'Du wurdest überwältigt. Regeneriere dein Mana und versuche es erneut!', '💔', 'warning');
          this.currentOpponent = null;
          this.close();
        } else {
          this.open();
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-magic-duel');
    if (existing) existing.remove();
  }
}
