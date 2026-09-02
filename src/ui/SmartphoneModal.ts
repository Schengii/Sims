/**
 * Sims 5 Smartphone & SimOS 15 Pro Modal
 * Centralized Smart Hub featuring:
 * - SimOS App Grid (Finance, Travel, Smart Home, Leisure, Family & Health)
 * - Simstagram Influencer Feed & Story Creator
 * - LlamaEats On-Demand Delivery App
 * - SMS & Townie Chat Network
 */

import { Sim } from '../entity/Sim';
import { DeliverySystem, DELIVERY_CATALOG } from '../systems/DeliverySystem';
import { ToastManager } from '../ui/ToastManager';
import { SoundManager } from '../audio/SoundManager';

export interface PhoneAppItem {
  id: string;
  name: string;
  category: 'finance' | 'travel' | 'home' | 'culture' | 'family';
  icon: string;
  badge?: string;
  color: string;
  description: string;
}

export class SmartphoneModal {
  private container: HTMLDivElement | null = null;
  private sim: Sim;
  private deliverySystem: DeliverySystem;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  public followersCount: number = 420;
  public totalPosts: number = 12;
  public selectedCategory: string = 'all';

  // App Launcher callbacks dispatched to Game Engine
  public onLaunchApp?: (appId: string) => void;

  public readonly apps: PhoneAppItem[] = [
    // Finanzen & Wirtschaft
    { id: 'bank_vault', name: 'Banktresor', category: 'finance', icon: '🏦', badge: 'NEU', color: '#fbbf24', description: '5% Zinsen, Goldbarren & Brillanten' },
    { id: 'market', name: 'Börsenmarkt', category: 'finance', icon: '📈', badge: 'NEU', color: '#10b981', description: 'Aktien handeln & Dividenden kassieren' },
    { id: 'bills', name: 'Rechnungen', category: 'finance', icon: '📑', color: '#f59e0b', description: 'Strom, Wasser & Steuern verwalten' },
    { id: 'business', name: 'Mein Laden', category: 'finance', icon: '🏢', color: '#06b6d4', description: 'Eigene Boutique & Mitarbeiter leiten' },
    { id: 'real_estate', name: 'Immobilien', category: 'finance', icon: '🏡', color: '#3b82f6', description: 'Villen & Grundstücke kaufen' },
    { id: 'penthouse', name: 'Penthouse', category: 'finance', icon: '🏙️', color: '#8b5cf6', description: 'Luxus-Dachgeschosse & Pools' },

    // Reisen & Abenteuer
    { id: 'world_map', name: 'Weltkarte', category: 'travel', icon: '🗺️', color: '#0284c7', description: 'Reise zu Nachbarschaften & Lots' },
    { id: 'cruise', name: 'Luxuskreuzfahrt', category: 'travel', icon: '🚢', badge: 'VIP', color: '#0ea5e9', description: 'Yachtreisen & Ozean-Abenteuer' },
    { id: 'space', name: 'Weltraum', category: 'travel', icon: '🚀', color: '#6366f1', description: 'Raketenstarts & Alien-Erkundung' },
    { id: 'archaeology', name: 'Archäologie', category: 'travel', icon: '🏺', color: '#d97706', description: 'Antike Relikte & Ausgrabungen' },
    { id: 'scuba', name: 'Scuba-Diving', category: 'travel', icon: '🤿', color: '#06b6d4', description: 'Korallenriffe & Meeresschätze' },
    { id: 'travel', name: 'Urlaubswelten', category: 'travel', icon: '✈️', color: '#ec4899', description: 'Tropenstrände & Bergresorts' },

    // Smart Home & Lifestyle
    { id: 'wall_designer', name: 'Wand-Designer', category: 'home', icon: '🧱', badge: 'NEU', color: '#0284c7', description: 'Tapeten, Klinker & Marmor-Muster' },
    { id: 'greenhouse', name: 'Gewächshaus', category: 'home', icon: '🌿', badge: 'NEU', color: '#4ade80', description: 'Botanik-Kreuzung & Veredelung' },
    { id: 'city_council', name: 'Stadt-Rat & Öko', category: 'home', icon: '🏛️', badge: 'NEU', color: '#0284c7', description: 'Viertel-Ökologie & Stadtverordnungen' },
    { id: 'smart_garden', name: 'Smart Garden', category: 'home', icon: '🌱', color: '#22c55e', description: 'Smarte Sprinkler & Bodenfeuchte' },
    { id: 'decorator', name: 'Design-Büro', category: 'home', icon: '🎨', color: '#a855f7', description: 'Innenarchitektur-Kundenaufträge' },
    { id: 'renters', name: 'Mietverwaltung', category: 'home', icon: '🚪', color: '#f97316', description: 'Mieter betreuen & Mieten kassieren' },
    { id: 'pet_shelter', name: 'Tierheim & Zucht', category: 'home', icon: '🐾', color: '#f43f5e', description: 'Welpen adoptieren & Stammbaum' },

    // Kultur, Freizeit & Social
    { id: 'alchemy', name: 'Alchemie-Kessel', category: 'culture', icon: '🔮', badge: 'NEU', color: '#c084fc', description: 'Tränke brauen & Elixiere alchemieren' },
    { id: 'invite_guest', name: 'Freunde einladen', category: 'culture', icon: '💌', badge: 'NEU', color: '#ec4899', description: 'Dinner, Gaming & Pool-Besuche' },
    { id: 'band', name: 'Band-Studio', category: 'culture', icon: '🎸', color: '#ef4444', description: 'Songs aufnehmen & Konzerte geben' },
    { id: 'director', name: 'Filmstudio', category: 'culture', icon: '🎬', color: '#e11d48', description: 'Regie führen & Blockbuster drehen' },
    { id: 'politics', name: 'Politik-Büro', category: 'culture', icon: '🗳️', color: '#2563eb', description: 'Bürgermeister-Wahlkampf führen' },
    { id: 'theme_park', name: 'Freizeitpark', category: 'culture', icon: '🎡', color: '#eab308', description: 'Achterbahnen & Fahrgeschäfte' },
    { id: 'festival', name: 'Stadtfestival', category: 'culture', icon: '🎪', color: '#84cc16', description: 'Wettbewerbe & Straßenstände' },
    { id: 'pet_show', name: 'Haustier-Show', category: 'culture', icon: '🏆', color: '#f59e0b', description: 'Dressur & Schönheitswettbewerbe' },
    { id: 'magic', name: 'Magie & Alchemie', category: 'culture', icon: '🔮', color: '#c084fc', description: 'Zaubersprüche lernen & Tränke brauen' },
    { id: 'modding', name: 'Mod-Center', category: 'culture', icon: '📦', color: '#38bdf8', description: 'Custom Content & Erweiterungen' },
    { id: 'cloud_gallery', name: 'Cloud-Galerie', category: 'culture', icon: '☁️', color: '#38bdf8', description: 'Häuser der Community teilen' },

    // Gesundheit, Familie & Skills
    { id: 'pet_nursery', name: 'Welpen-Kinderstube', category: 'family', icon: '🍼', badge: 'NEU', color: '#f43f5e', description: 'Haustiere verpaaren & Welpen aufziehen' },
    { id: 'health', name: 'Gesundheit', category: 'family', icon: '🏥', color: '#10b981', description: 'Krankheiten heilen & Vorsorge' },
    { id: 'vet', name: 'Tierklinik', category: 'family', icon: '🩺', color: '#14b8a6', description: 'Haustiere untersuchen & impfen' },
    { id: 'school', name: 'Bildungs-Portal', category: 'family', icon: '🎓', color: '#4f46e5', description: 'Noten, Hausaufgaben & Abschlüsse' },
    { id: 'journal', name: 'Lebensjournal', category: 'family', icon: '📖', color: '#9333ea', description: 'Meilensteine, Merkmale & Biografie' },
    { id: 'fame', name: 'Promi-Radar', category: 'family', icon: '👑', color: '#fbbf24', description: 'Ruhmstufen, Paparazzi & Glamour' },
    { id: 'occult', name: 'Okkulte Kräfte', category: 'family', icon: '🧛', color: '#7c3aed', description: 'Vampire, Hexen & Werwölfe' },
    { id: 'aspirations', name: 'Bestreben', category: 'family', icon: '🎯', color: '#f43f5e', description: 'Lebensziele & Belohnungsstore' },
    { id: 'calendar', name: 'Kalender', category: 'family', icon: '📅', color: '#0284c7', description: 'Feiertage, Jahreszeiten & Events' }
  ];

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
      this.soundManager.playPhoneRing();
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
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    const content = document.createElement('div');
    content.className = 'glass-panel';
    content.style.cssText = `
      width: 480px;
      max-height: 88vh;
      border-radius: 32px;
      background: rgba(15, 23, 42, 0.96);
      border: 3px solid rgba(56, 189, 248, 0.4);
      color: #fff;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
    `;

    content.innerHTML = `
      <!-- Phone Header Bar -->
      <div style="background: rgba(30, 41, 59, 0.85); padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; color: #38bdf8;">
          <span style="font-size: 18px;">📱</span>
          <span style="letter-spacing: 0.5px;">SimOS 15 Pro Max</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 12px; color: #94a3b8;">5G 📶 100% 🔋</span>
          <button id="phone-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 2px 6px;">✕</button>
        </div>
      </div>

      <!-- App Switcher Tabs -->
      <div style="display: flex; background: rgba(0,0,0,0.35); border-bottom: 1px solid rgba(255,255,255,0.1); overflow-x: auto;">
        <button class="phone-tab-btn active" data-tab="apps" style="flex: 1; min-width: 90px; padding: 12px 8px; background: none; border: none; color: #38bdf8; font-weight: bold; cursor: pointer; border-bottom: 2px solid #38bdf8; font-size: 13px;">
          📱 Apps
        </button>
        <button class="phone-tab-btn" data-tab="simstagram" style="flex: 1; min-width: 100px; padding: 12px 8px; background: none; border: none; color: #94a3b8; font-weight: bold; cursor: pointer; font-size: 13px;">
          📸 Simstagram
        </button>
        <button class="phone-tab-btn" data-tab="delivery" style="flex: 1; min-width: 100px; padding: 12px 8px; background: none; border: none; color: #94a3b8; font-weight: bold; cursor: pointer; font-size: 13px;">
          🛵 LlamaEats
        </button>
        <button class="phone-tab-btn" data-tab="messages" style="flex: 1; min-width: 80px; padding: 12px 8px; background: none; border: none; color: #94a3b8; font-weight: bold; cursor: pointer; font-size: 13px;">
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

    content.querySelector('#phone-close-btn')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      this.close();
    });

    content.querySelectorAll('.phone-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.getAttribute('data-tab') || 'apps';

        content.querySelectorAll('.phone-tab-btn').forEach(b => {
          (b as HTMLElement).style.color = '#94a3b8';
          (b as HTMLElement).style.borderBottom = 'none';
        });
        target.style.color = '#38bdf8';
        target.style.borderBottom = '2px solid #38bdf8';

        this.soundManager.playUIClick();
        this.renderTab(tab);
      });
    });

    this.renderTab('apps');
  }

  public updateUI(): void {
    this.renderTab('apps');
  }

  private renderTab(tabName: string): void {
    const tabEl = this.container?.querySelector('#phone-tab-content');
    if (!tabEl) return;

    if (tabName === 'apps') {
      const filteredApps = this.selectedCategory === 'all'
        ? this.apps
        : this.apps.filter(a => a.category === this.selectedCategory);

      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Category Filter Bar -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
            ${[
              { id: 'all', label: 'Alle' },
              { id: 'finance', label: '💼 Finanzen' },
              { id: 'travel', label: '🌴 Reisen' },
              { id: 'home', label: '🏡 Home' },
              { id: 'culture', label: '🎭 Freizeit' },
              { id: 'family', label: '🩺 Familie' }
            ].map(cat => `
              <button class="phone-cat-pill ${this.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}" style="
                padding: 6px 12px;
                border-radius: 20px;
                background: ${this.selectedCategory === cat.id ? '#0284c7' : 'rgba(255,255,255,0.08)'};
                color: ${this.selectedCategory === cat.id ? '#fff' : '#94a3b8'};
                border: 1px solid ${this.selectedCategory === cat.id ? '#38bdf8' : 'rgba(255,255,255,0.1)'};
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.2s;
              ">${cat.label}</button>
            `).join('')}
          </div>

          <!-- App Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            ${filteredApps.map(app => `
              <div class="simos-app-card" data-appid="${app.id}" style="
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 16px;
                padding: 12px 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                cursor: pointer;
                position: relative;
                transition: transform 0.15s, background 0.15s;
              ">
                ${app.badge ? `<span style="position: absolute; top: 6px; right: 6px; background: #ef4444; color: white; font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 6px;">${app.badge}</span>` : ''}
                <div style="
                  width: 48px;
                  height: 48px;
                  border-radius: 14px;
                  background: ${app.color};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 24px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  margin-bottom: 6px;
                ">
                  ${app.icon}
                </div>
                <div style="font-size: 12px; font-weight: bold; color: #f1f5f9; line-height: 1.2;">${app.name}</div>
                <div style="font-size: 10px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%;">${app.description}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Category Pill handlers
      tabEl.querySelectorAll('.phone-cat-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat') || 'all';
          this.selectedCategory = cat;
          this.soundManager.playUIClick();
          this.renderTab('apps');
        });
      });

      // App Card Launch handlers
      tabEl.querySelectorAll('.simos-app-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          (card as HTMLElement).style.transform = 'translateY(-3px)';
          (card as HTMLElement).style.background = 'rgba(56, 189, 248, 0.12)';
        });
        card.addEventListener('mouseleave', () => {
          (card as HTMLElement).style.transform = 'translateY(0)';
          (card as HTMLElement).style.background = 'rgba(255, 255, 255, 0.04)';
        });
        card.addEventListener('click', (e) => {
          const appId = (e.currentTarget as HTMLElement).getAttribute('data-appid');
          if (appId) {
            this.soundManager.playUIClick();
            this.close();
            if (this.onLaunchApp) {
              this.onLaunchApp(appId);
            }
          }
        });
      });

    } else if (tabName === 'simstagram') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Profile Card -->
          <div style="display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.05); padding: 14px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #0284c7, #38bdf8); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              💎
            </div>
            <div style="flex: 1;">
              <div style="font-weight: bold; font-size: 15px; display: flex; align-items: center; gap: 6px;">
                @${this.sim.customization.name.replace(/\s+/g, '_').toLowerCase()}
                <span style="color: #38bdf8; font-size: 14px;">✓</span>
              </div>
              <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">${this.followersCount} Follower • ${this.totalPosts} Beiträge</div>
            </div>
          </div>

          <!-- Post Button -->
          <button id="btn-simstagram-post" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #e84393, #0984e3); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 14px rgba(232, 67, 147, 0.4); transition: transform 0.15s;">
            ✨ Foto & Story Posten!
          </button>

          <div style="font-size: 13px; color: #94a3b8; font-weight: bold; margin-top: 4px;">Aktueller Feed:</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); font-size: 13px;">
              <div>📸 <strong>Poolparty & Sonnenbad</strong> #SimsLife #VIP</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 6px;">❤️ 142 Likes • 18 Kommentare</div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); font-size: 13px;">
              <div>🍝 <strong>Gourmet-Dinner kreiert!</strong> #ChefSkill #Delicious</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 6px;">❤️ 289 Likes • 34 Kommentare</div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); font-size: 13px;">
              <div>🎸 <strong>Neuer Song im Studio aufgenommen!</strong> #Rockstar #Music</div>
              <div style="font-size: 11px; color: #38bdf8; margin-top: 6px;">❤️ 412 Likes • 56 Kommentare</div>
            </div>
          </div>
        </div>
      `;

      tabEl.querySelector('#btn-simstagram-post')?.addEventListener('click', () => {
        const gained = 20 + Math.floor(Math.random() * 45);
        const reward = gained * 5;
        this.followersCount += gained;
        this.totalPosts += 1;
        this.sim.simoleons += reward;
        this.soundManager.playLevelUp();
        this.toastManager.showToast('📸 Simstagram Viral!', `+${gained} neue Follower & § ${reward} Werbeeinnahmen!`, '❤️', 'success');
        this.renderTab('simstagram');
      });
    } else if (tabName === 'delivery') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="font-weight: bold; color: #38bdf8; font-size: 14px; display: flex; align-items: center; gap: 6px;">
            <span>🛵</span>
            <span>LlamaEats Express-Lieferdienst</span>
          </div>
          ${DELIVERY_CATALOG.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 28px;">${item.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px;">${item.name}</div>
                  <div style="font-size: 11px; color: #94a3b8;">${item.description}</div>
                  <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-top: 2px;">+${item.hungerBoost}% Hunger</div>
                </div>
              </div>
              <button class="btn-order-food" data-id="${item.id}" style="padding: 8px 14px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
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
            this.soundManager.playTypingSound();
            this.deliverySystem.orderItem(item, this.sim, this.toastManager);
          }
        });
      });
    } else if (tabName === 'messages') {
      tabEl.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="font-weight: bold; color: #38bdf8; font-size: 14px; margin-bottom: 2px;">💬 Stadtgespräche & SMS</div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-weight: bold; color: #38bdf8; font-size: 13px;">👨 Mortimer Goth</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">"Hey! Lust auf ein Schachturnier im Park nachher?"</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Vor 12 Min.</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-weight: bold; color: #e84393; font-size: 13px;">👩 Penny Pizazz</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">"Die Party im VIP Club Velvet war absolut legendär! 🎉"</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Vor 35 Min.</div>
          </div>
          <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
            <div style="font-weight: bold; color: #10b981; font-size: 13px;">🥞 Bob Pancakes</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">"Ich habe ein neues Pfannkuchen-Rezept erfunden. Du MUSST probieren!"</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 6px;">Heute 10:15</div>
          </div>
        </div>
      `;
    }
  }
}
