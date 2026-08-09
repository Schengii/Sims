/**
 * Public Lot Minigames & Location Activities
 * Interactive mini-games for Gym, VIP Club Velvet, and Willow Creek Library.
 */

import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class PublicLotMinigamesModal {
  private container: HTMLDivElement | null = null;

  public open(lotId: string, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(lotId, sim, toastManager, soundManager);
      this.container.style.display = 'flex';
    }
  }

  public close(): void {
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
    content.id = 'public-lot-modal-content';
    content.style.cssText = `
      width: 440px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(30, 41, 59, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);
  }

  private renderContent(lotId: string, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#public-lot-modal-content');
    if (!content) return;

    let title = 'Öffentlicher Ort';
    let icon = '🏛️';
    let options: Array<{ label: string; action: () => void }> = [];

    if (lotId === 'lot_gym' || lotId.includes('gym')) {
      title = 'Fit & Flex Studio';
      icon = '🏋️';
      options = [
        {
          label: '⚡ Laufband-Sprint Challenge (+Fitness XP)',
          action: () => {
            sim.addSkillXP('fitness', 40);
            sim.needs.modify('energy', -15);
            sim.needs.modify('fun', 20);
            soundManager.playLevelUp();
            toastManager.showToast('🏋️ Gym Challenge', 'Laufband-Sprint absolviert! Fitness gesteigert & Kalorien verbrannt!', '⚡', 'success');
          }
        },
        {
          label: '🥤 Protein-Shake trinken (§ 12)',
          action: () => {
            if (sim.simoleons >= 12) {
              sim.simoleons -= 12;
              sim.needs.modify('energy', 30);
              soundManager.playUIClick();
              toastManager.showToast('🥤 Gym Bar', 'Protein-Shake getrunken (+30 Energie)!', '🥤', 'info');
            }
          }
        }
      ];
    } else if (lotId === 'lot_club' || lotId.includes('club')) {
      title = 'VIP Club Velvet';
      icon = '🪩';
      options = [
        {
          label: '🎛️ DJ-Pult Beat-Mixing Challenge',
          action: () => {
            sim.addSkillXP('charisma', 35);
            sim.needs.modify('fun', 40);
            soundManager.playLevelUp();
            toastManager.showToast('🪩 VIP Club', 'Menge eingeheizt & exzellentes DJ-Set aufgelegt!', '🎵', 'success');
          }
        },
        {
          label: '🍸 Signature Cocktail bestellen (§ 25)',
          action: () => {
            if (sim.simoleons >= 25) {
              sim.simoleons -= 25;
              sim.moodletManager.addMoodlet({
                id: 'vip_cocktail',
                name: 'VIP Drink',
                emotion: 'flirty',
                weight: 2,
                durationSec: 180,
                icon: '🍸',
                description: 'Köstlicher Club-Cocktail!'
              });
              toastManager.showToast('🍸 Club Bar', 'Signature Cocktail serviert (+2 Kokett)!', '🍸', 'success');
            }
          }
        }
      ];
    } else {
      title = 'Willow Creek Bibliothek';
      icon = '📚';
      options = [
        {
          label: '📖 Schnell-Recherche (Logik & Code XP)',
          action: () => {
            sim.addSkillXP('programming', 35);
            soundManager.playLevelUp();
            toastManager.showToast('📚 Bibliothek', 'Fachbuch studiert & Programmierwissen erweitert!', '🧠', 'success');
          }
        }
      ];
    }

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 700; color: #38bdf8;">${icon} ${title}</h3>
        <button id="lot-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${options.map((opt, idx) => `
          <button class="btn-lot-action" data-idx="${idx}" style="padding: 12px; background: #0284c7; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; text-align: left;">
            ${opt.label}
          </button>
        `).join('')}
      </div>
    `;

    content.querySelector('#lot-modal-close')?.addEventListener('click', () => this.close());

    content.querySelectorAll('.btn-lot-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const idx = parseInt(target.getAttribute('data-idx') || '0', 10);
        if (options[idx]) {
          options[idx].action();
          this.close();
        }
      });
    });
  }
}
