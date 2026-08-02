/**
 * Sims 4 Pie Menu Social Interaction Wheel
 * Radial modal popup allowing friendly, funny, romantic, and mean interactions with NPCs.
 */

import { Sim } from '../entity/Sim';
import type { NPCSim } from '../entity/NPCManager';
import { SoundManager } from '../audio/SoundManager';
import { Sanitizer } from '../security/Sanitizer';

export interface SocialOption {
  id: string;
  label: string;
  category: 'friendly' | 'funny' | 'romantic' | 'mean';
  icon: string;
  friendshipDelta: number;
  romanceDelta: number;
  emoteSymbol: string;
  minFriendshipRequired?: number;
}

export class SocialWheel {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onInteractionExecuted?: (npc: NPCSim, option: SocialOption) => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="modal-backdrop" id="modal-social-backdrop" role="dialog" aria-modal="true" aria-labelledby="social-title">
        <div class="modal-dialog glass-panel" style="max-width: 500px; text-align: center;">
          <div class="modal-header">
            <h2 id="social-title">💬 Interaktion</h2>
            <button class="btn-close" id="social-btn-close" aria-label="Schließen">&times;</button>
          </div>

          <div style="margin-bottom: 16px;">
            <h3 id="social-target-name" style="font-family: var(--font-heading); color: var(--primary-accent);">Mortimer Goth</h3>
            <p id="social-target-status" style="font-size: 0.85rem; color: var(--text-muted);">Status: Bekannte(r)</p>
          </div>

          <!-- Category Selection Buttons -->
          <div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 16px;">
            <button class="btn-hud social-cat-btn active" data-cat="friendly">💬 Freundlich</button>
            <button class="btn-hud social-cat-btn" data-cat="funny">🎭 Lustig</button>
            <button class="btn-hud social-cat-btn" data-cat="romantic">❤️ Romantisch</button>
            <button class="btn-hud social-cat-btn" data-cat="mean">😡 Gemein</button>
          </div>

          <!-- Options Grid -->
          <div id="social-options-list" style="display: flex; flex-direction: column; gap: 10px; max-height: 45vh; overflow-y: auto;">
            <!-- Populated dynamically -->
          </div>
        </div>
      </div>
    `;
  }

  public open(sim: Sim, npc: NPCSim): void {
    const backdrop = document.getElementById('modal-social-backdrop');
    if (!backdrop) return;

    const nameEl = document.getElementById('social-target-name');
    if (nameEl) nameEl.innerText = Sanitizer.sanitizeText(npc.name, 24);

    const statusEl = document.getElementById('social-target-status');
    if (statusEl) {
      statusEl.innerText = `Status: ${npc.relationship.getStatusTitle()} (Freundschaft: ${Math.round(npc.relationship.friendship)}% | Romantik: ${Math.round(npc.relationship.romance)}%)`;
    }

    backdrop.classList.add('active');

    // Category button clicks
    const catBtns = document.querySelectorAll('.social-cat-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        catBtns.forEach(b => b.classList.remove('active'));
        (e.currentTarget as HTMLElement).classList.add('active');
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') as any;
        this.renderOptions(sim, npc, cat);
      });
    });

    // Default to friendly category
    this.renderOptions(sim, npc, 'friendly');

    document.getElementById('social-btn-close')?.addEventListener('click', () => this.close());
  }

  private renderOptions(sim: Sim, npc: NPCSim, category: 'friendly' | 'funny' | 'romantic' | 'mean'): void {
    const listEl = document.getElementById('social-options-list');
    if (!listEl) return;

    const allOptions: SocialOption[] = [
      // Friendly
      { id: 'smalltalk', label: 'Smalltalk halten', category: 'friendly', icon: '💬', friendshipDelta: 8, romanceDelta: 0, emoteSymbol: '💬' },
      { id: 'compliment', label: 'Outfit loben', category: 'friendly', icon: '✨', friendshipDelta: 12, romanceDelta: 2, emoteSymbol: '😀' },
      { id: 'hobbies', label: 'Über Hobbys sprechen', category: 'friendly', icon: '🎨', friendshipDelta: 15, romanceDelta: 0, emoteSymbol: '🎨' },
      { id: 'party_toast', label: 'Party-Toast anstoßen (🥂)', category: 'friendly', icon: '🥂', friendshipDelta: 18, romanceDelta: 5, emoteSymbol: '🥂' },
      
      // Funny
      { id: 'tell_joke', label: 'Witz erzählen', category: 'funny', icon: '😂', friendshipDelta: 14, romanceDelta: 0, emoteSymbol: '😂' },
      { id: 'crazy_story', label: 'Verrückte Story erzählen', category: 'funny', icon: '🤪', friendshipDelta: 16, romanceDelta: 0, emoteSymbol: '🤪' },

      // Romantic
      { id: 'flirt', label: 'Anflirten', category: 'romantic', icon: '😉', friendshipDelta: 5, romanceDelta: 18, emoteSymbol: '💕' },
      { id: 'hold_hands', label: 'Hände halten', category: 'romantic', icon: '🤝', friendshipDelta: 8, romanceDelta: 25, emoteSymbol: '💖', minFriendshipRequired: 40 },
      { id: 'hug', label: 'Herzlich umarmen', category: 'romantic', icon: '🤗', friendshipDelta: 10, romanceDelta: 15, emoteSymbol: '🤗', minFriendshipRequired: 30 },
      { id: 'first_kiss', label: 'Erster Kuss', category: 'romantic', icon: '💋', friendshipDelta: 15, romanceDelta: 40, emoteSymbol: '💋', minFriendshipRequired: 60 },
      { id: 'make_baby', label: 'Baby planen (Whahoo)', category: 'romantic', icon: '👶', friendshipDelta: 20, romanceDelta: 45, emoteSymbol: '👶', minFriendshipRequired: 75 },

      // Mean
      { id: 'insult', label: 'Beleidigen', category: 'mean', icon: '😡', friendshipDelta: -25, romanceDelta: -20, emoteSymbol: '😡' },
      { id: 'argue', label: 'Streiten', category: 'mean', icon: '🤬', friendshipDelta: -30, romanceDelta: -25, emoteSymbol: '💔' }
    ];

    const filtered = allOptions.filter(o => o.category === category);

    listEl.innerHTML = filtered.map(opt => {
      const isLocked = opt.minFriendshipRequired && npc.relationship.friendship < opt.minFriendshipRequired;
      return `
        <button class="btn-hud social-option-btn" data-id="${opt.id}" ${isLocked ? 'disabled' : ''} style="justify-content: space-between; padding: 12px 18px;">
          <span>${opt.icon} ${opt.label}</span>
          <span style="font-size: 0.8rem; opacity: 0.8;">
            ${isLocked ? `Locked (Erfordert ${opt.minFriendshipRequired}% Freundschaft)` : `+${opt.friendshipDelta} Freundschaft`}
          </span>
        </button>
      `;
    }).join('');

    // Attach click listeners
    const optionBtns = listEl.querySelectorAll('.social-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        const selected = allOptions.find(o => o.id === id);
        if (!selected) return;

        // Execute interaction
        npc.relationship.modifyFriendship(selected.friendshipDelta);
        npc.relationship.modifyRomance(selected.romanceDelta);

        // Fulfill Social need & add Charisma XP
        sim.needs.modify('social', 25);
        sim.addSkillXP('charisma', 15);

        // Audio
        const emotionMap = { friendly: 'happy', funny: 'happy', romantic: 'flirty', mean: 'angry' } as const;
        this.soundManager.playSimlish(1.1, emotionMap[selected.category]);

        if (this.onInteractionExecuted) {
          this.onInteractionExecuted(npc, selected);
        }

        this.close();
      });
    });
  }

  public close(): void {
    const backdrop = document.getElementById('modal-social-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}
