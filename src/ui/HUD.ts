/**
 * Main HUD Overlay UI Manager
 * Handles top bar (Clock, Speed, Simoleons, Privacy, Mute), Bottom Bar (Sim Profile, Needs, Actions),
 * and ARIA accessibility labels.
 */

import { Sim } from '../entity/Sim';
import { TimeSystem } from '../systems/TimeSystem';
import { SoundManager } from '../audio/SoundManager';
import { Sanitizer } from '../security/Sanitizer';
import { LifeStage } from '../entity/LifeStage';

export class HUDManager {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onOpenCAS?: () => void;
  public onOpenBuildBuy?: () => void;
  public onOpenCareer?: () => void;
  public onOpenRelationships?: () => void;
  public onOpenFamilyTree?: () => void;
  public onOpenParty?: () => void;
  public onOpenPrivacy?: () => void;
  public onToggleRadio?: () => void;
  public onSpeedChange?: (speed: number) => void;
  public onTogglePause?: () => void;
  public onSaveGame?: () => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
    this.attachEvents();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="hud-container">
        <!-- Top Bar -->
        <header class="top-bar glass-panel hud-interactive" role="banner">
          <div class="brand-title">
            <span>💎 SIMS 5</span>
          </div>

          <div class="time-controls" role="toolbar" aria-label="Zeitsteuerung">
            <span class="clock-display" id="hud-clock" aria-live="off">08:00 (Tag 1)</span>
            <button class="btn-speed" id="btn-pause" aria-label="Spiel pausieren (Leertaste)">⏸️</button>
            <button class="btn-speed active" id="btn-speed1" aria-label="Normale Geschwindigkeit (1)">▶</button>
            <button class="btn-speed" id="btn-speed2" aria-label="Doppelte Geschwindigkeit (2)">▶▶</button>
            <button class="btn-speed" id="btn-speed3" aria-label="Dreifache Geschwindigkeit (3)">▶▶▶</button>
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="currency-badge" id="hud-simoleons" aria-label="Guthaben in Simoleons">
              § 2,500
            </div>
            <button class="btn-hud" id="btn-radio-toggle" aria-label="Radio Sender umschalten">📻 Radio: Aus</button>
            <button class="btn-hud" id="btn-sound-toggle" aria-label="Ton umschalten">🔊 Sound</button>
            <button class="btn-hud" id="btn-save" aria-label="Spielstand speichern">💾 Speichern</button>
            <button class="btn-hud" id="btn-privacy" aria-label="Datenschutz & DSGVO">🛡️ DSGVO</button>
          </div>
        </header>

        <!-- Bottom Bar -->
        <footer class="bottom-bar hud-interactive" role="contentinfo">
          <!-- Sim Profile & Plumbob Mood -->
          <div class="sim-profile-card glass-panel" id="hud-sim-profile">
            <div class="plumbob-icon" id="hud-plumbob-badge" style="color: #2ecc71; background: rgba(46,204,113,0.2)">
              💎
            </div>
            <div class="sim-info">
              <h3 id="hud-sim-name">Bella Goth</h3>
              <p id="hud-sim-mood">Stimmung: Glücklich</p>
            </div>
            <button class="btn-hud" id="btn-open-cas" aria-label="Create-A-Sim Editor öffnen">✏️ Edit</button>
          </div>

          <!-- Action Queue Bar -->
          <div class="action-queue-bar glass-panel" id="hud-action-queue" aria-label="Aktionsschlange">
            <div class="action-item-chip">Bereit</div>
          </div>

          <!-- Needs Grid -->
          <div class="needs-grid glass-panel" id="hud-needs-grid" aria-label="Bedürfnisbalken">
            <!-- Dynamically populated -->
          </div>

          <!-- Main Mode Buttons -->
          <div class="hud-actions">
            <button class="btn-hud" id="btn-open-build" aria-label="Bauen & Kaufen Modus">🛋️ Baumodus</button>
            <button class="btn-hud" id="btn-open-career" aria-label="Karriere & Aufgaben Panel">💼 Karriere</button>
            <button class="btn-hud" id="btn-open-rel" aria-label="Beziehungen & Nachbarn Panel">💕 Beziehungen</button>
            <button class="btn-hud" id="btn-open-family" aria-label="Familienstammbaum Panel">👨‍👩‍👧‍👦 Stammbaum</button>
            <button class="btn-hud" id="btn-open-party" aria-label="Hausparty Veranstalten">🎉 Party Host</button>
          </div>
        </footer>
      </div>
    `;
  }

  private attachEvents(): void {
    document.getElementById('btn-open-cas')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCAS) this.onOpenCAS();
    });

    document.getElementById('btn-open-build')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenBuildBuy) this.onOpenBuildBuy();
    });

    document.getElementById('btn-open-career')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCareer) this.onOpenCareer();
    });

    document.getElementById('btn-open-rel')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenRelationships) this.onOpenRelationships();
    });

    document.getElementById('btn-open-family')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenFamilyTree) this.onOpenFamilyTree();
    });

    document.getElementById('btn-open-party')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenParty) this.onOpenParty();
    });

    document.getElementById('btn-privacy')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPrivacy) this.onOpenPrivacy();
    });

    document.getElementById('btn-save')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onSaveGame) this.onSaveGame();
    });

    document.getElementById('btn-radio-toggle')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onToggleRadio) this.onToggleRadio();
    });

    document.getElementById('btn-sound-toggle')?.addEventListener('click', (e) => {
      const isMuted = this.soundManager.toggleMute();
      (e.currentTarget as HTMLElement).innerText = isMuted ? '🔇 Stumm' : '🔊 Sound';
    });

    // Speed Controls
    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onTogglePause) this.onTogglePause();
    });

    const setSpeed = (spd: number) => {
      this.soundManager.playUIClick();
      if (this.onSpeedChange) this.onSpeedChange(spd);
    };

    document.getElementById('btn-speed1')?.addEventListener('click', () => setSpeed(1));
    document.getElementById('btn-speed2')?.addEventListener('click', () => setSpeed(2));
    document.getElementById('btn-speed3')?.addEventListener('click', () => setSpeed(3));
  }

  public update(sim: Sim, timeSystem: TimeSystem): void {
    // 1. Clock & Simoleons
    const clockEl = document.getElementById('hud-clock');
    if (clockEl) {
      clockEl.innerText = `${timeSystem.getTimeString()} (Tag ${timeSystem.day})`;
    }

    const simoleonEl = document.getElementById('hud-simoleons');
    if (simoleonEl) {
      simoleonEl.innerText = `§ ${sim.simoleons.toLocaleString()}`;
    }

    // 2. Sim Profile & Mood
    const mood = sim.getCurrentMood();
    const stageInfo = LifeStage.getInfo(sim.lifeStage);
    const nameEl = document.getElementById('hud-sim-name');
    if (nameEl) nameEl.innerText = `${stageInfo.icon} ${Sanitizer.sanitizeText(sim.customization.name, 24)}`;

    const moodEl = document.getElementById('hud-sim-mood');
    if (moodEl) moodEl.innerText = `Stimmung: ${mood.label}`;

    const plumbobEl = document.getElementById('hud-plumbob-badge');
    if (plumbobEl) {
      plumbobEl.style.color = mood.plumbobColor;
      plumbobEl.style.background = `${mood.plumbobColor}22`;
    }

    // 3. Needs Grid
    const needsGrid = document.getElementById('hud-needs-grid');
    if (needsGrid) {
      const values = sim.needs.getValues();
      const labels: Record<string, string> = {
        hunger: 'Hunger',
        energy: 'Energie',
        hygiene: 'Hygiene',
        bladder: 'Blase',
        fun: 'Spaß',
        social: 'Sozial'
      };

      needsGrid.innerHTML = Object.entries(values).map(([key, val]) => `
        <div class="need-bar-item">
          <div class="need-label">
            <span>${labels[key] || key}</span>
            <span>${Math.round(val)}%</span>
          </div>
          <div class="need-progress-bg">
            <div class="need-progress-fill" style="width: ${val}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // 4. Action Queue Chips
    const actionQueueEl = document.getElementById('hud-action-queue');
    if (actionQueueEl) {
      const queue = sim.actionQueue.getQueue();
      if (queue.length === 0) {
        actionQueueEl.innerHTML = `<div class="action-item-chip">Bereit</div>`;
      } else {
        actionQueueEl.innerHTML = queue.map(a => `
          <div class="action-item-chip">
            <span>${a.icon}</span>
            <span>${Sanitizer.sanitizeText(a.name, 16)}</span>
          </div>
        `).join('');
      }
    }
  }
}
