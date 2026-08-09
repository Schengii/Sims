/**
 * Sims 5 Smartphone & Simstagram Modal
 * Includes Simstagram social media, Messages/Text Chat, and LlamaEats delivery app.
 */

import { Sim } from '../entity/Sim';
import { DeliverySystem, DELIVERY_CATALOG } from '../systems/DeliverySystem';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class SmartphoneModal {
  private container: HTMLDivElement | null = null;
  private sim: Sim;
  private deliverySystem: DeliverySystem;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  public followersCount: number = 420;
  public totalPosts: number = 12;

  constructor(sim: Sim, deliverySystem: DeliverySystem, toastManager: ToastManager, soundManager: SoundManager) {
    this.sim = sim;
    this.deliverySystem = deliverySystem;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.updateUI();
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
    content.style.cssText = `
      width: 420px;
      max-height: 85vh;
      border-radius: 28px;
      background: rgba(15, 23, 42, 0.95);
      border: 3px solid rgba(56, 189, 248, 0.4);
      color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
    `;

    content.innerHTML = `
      <!-- Phone Header Bar -->
      <div style="background: rgba(30, 41, 59, 0.8); padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; color: #38bdf8;">
          <span>📱</span>
          <span>SimPhone 15 Pro</span>
        </div>
        <button id="phone-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
      </div>

      <!-- App Switcher Tabs -->
      <div style="display: flex; background: rgba(0,0,0,0.3); border-bottom: 1px solid rgba(255,255,255,0.1);">
        <button class="phone-tab-btn active" data-tab="simstagram" style="flex: 1; padding: 12px; background: none; border: none; color: #38bdf8; font-weight: bold; cursor: pointer; border-bottom: 2px solid #38bdf8;">
          📸 Simstagram
        </button>
        <button class="phone-tab-btn" data-tab="delivery" style="flex: 1; padding: 12px; background: none; border: none; color: #94a3b8; font-weight: bold; cursor: pointer;">
          🛵 LlamaEats
        </button>
        <button class="phone-tab-btn" data-tab="messages" style="flex: 1; padding: 12px; background: none; border: none; color: #94a3b8; font-weight: bold; cursor: pointer;">
          💬 Chat
        </button>
      </div>

      <!-- Tab Content Area -->
      <div id="phone-tab-content" style="padding: 16px; flex: 1; overflow-y: auto;">
        <!-- Dynamically rendered -->
      </div>
    `;

    this.container.appendChild(content);
    document.body.appendChild(this.container);

    content.querySelector('#phone-close-btn')?.addEventListener('click', () => this.close());

    content.querySelectorAll('.phone-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.getAttribute('data-tab') || 'simstagram';

        content.querySelectorAll('.phone-tab-btn').forEach(b => {
          (b as HTMLElement).style.color = '#94a3b8';
          (b as HTMLElement).style.borderBottom = 'none';
        });
        target.style.color = '#38bdf8';
        target.style.borderBottom = '2px solid #38bdf8';

        this.renderTab(tab);
      });
    });

    this.renderTab('simstagram');
  }

  public updateUI(): void {
    this.renderTab('simstagram');
  }

  private renderTab(tabName: string): void {
    const tabEl = this.container?.querySelector('#phone-tab-content');
    if (!tabEl) return;

    if (tabName === 'simstagram') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Profile Card -->
          <div style="display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #0284c7; display: flex; align-items: center; justify-content: center; font-size: 24px;">
              💎
            </div>
            <div style="flex: 1;">
              <div style="font-weight: bold; font-size: 15px;">@${this.sim.customization.name.replace(/\s+/g, '_').toLowerCase()}</div>
              <div style="font-size: 12px; color: #94a3b8;">${this.followersCount} Follower • ${this.totalPosts} Beiträge</div>
            </div>
          </div>

          <!-- Post Button -->
          <button id="btn-simstagram-post" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #e84393, #0984e3); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px;">
            ✨ Foto & Story Posten!
          </button>

          <div style="font-size: 13px; color: #94a3b8; font-weight: bold; margin-top: 8px;">Letzte Beiträge:</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 10px; font-size: 13px;">
              <div>📸 <strong>Poolparty Vibe</strong> #SimsLife #PartyTime</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 4px;">❤️ 142 Likes • 18 Kommentare</div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 10px; font-size: 13px;">
              <div>🍝 <strong>Gourmet Dinner</strong> von Meisterkoch!</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 4px;">❤️ 289 Likes • 34 Kommentare</div>
            </div>
          </div>
        </div>
      `;

      tabEl.querySelector('#btn-simstagram-post')?.addEventListener('click', () => {
        const gained = 15 + Math.floor(Math.random() * 35);
        const reward = gained * 4;
        this.followersCount += gained;
        this.totalPosts += 1;
        this.sim.simoleons += reward;
        this.soundManager.playLevelUp();
        this.toastManager.showToast('📸 Simstagram Post!', `+${gained} neue Follower & § ${reward} Werbeeinnahmen!`, '❤️', 'success');
        this.renderTab('simstagram');
      });
    } else if (tabName === 'delivery') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="font-weight: bold; color: #38bdf8; font-size: 14px;">🛵 LlamaEats Lieferservice</div>
          ${DELIVERY_CATALOG.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 28px;">${item.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
                  <div style="font-size: 11px; color: #94a3b8;">${item.description}</div>
                  <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-top: 2px;">+${item.hungerBoost}% Hunger</div>
                </div>
              </div>
              <button class="btn-order-food" data-id="${item.id}" style="padding: 8px 12px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px;">
                § ${item.price}
              </button>
            </div>
          `).join('')}
        </div>
      `;

      tabEl.querySelectorAll('.btn-order-food').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget as HTMLElement;
          const id = target.getAttribute('data-id');
          const item = DELIVERY_CATALOG.find(i => i.id === id);
          if (item) {
            this.deliverySystem.orderItem(item, this.sim, this.toastManager);
          }
        });
      });
    } else if (tabName === 'messages') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
            <div style="font-weight: bold; color: #38bdf8; font-size: 13px;">👨 Mortimer Goth</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">"Hey! Lust auf ein Schachturnier im Park nachher?"</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px;">
            <div style="font-weight: bold; color: #e84393; font-size: 13px;">👩 Penny Pizazz</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">"Die Party im VIP Club Velvet war absolut legendär! 🎉"</div>
          </div>
        </div>
      `;
    }
  }
}
