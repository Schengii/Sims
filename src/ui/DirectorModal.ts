/**
 * Hollywood Film Studio & Director Modal
 * Direct movie blockbusters, manage budgets, and win Oscars.
 */

import { FilmStudioSystem } from '../systems/FilmStudioSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class DirectorModal {
  private container: HTMLDivElement | null = null;

  public open(studioSystem: FilmStudioSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.renderContent(studioSystem, sim, toastManager, soundManager);
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
    content.id = 'director-modal-content';
    content.style.cssText = `
      width: 540px;
      max-height: 85vh;
      overflow-y: auto;
      padding: 24px;
      border-radius: 20px;
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

  private renderContent(studioSystem: FilmStudioSystem, sim: Sim, toastManager: ToastManager, soundManager: SoundManager): void {
    const content = this.container?.querySelector('#director-modal-content');
    if (!content) return;

    const movies = studioSystem.getMovies();
    const activeMovie = studioSystem.getActiveMovie();
    const rank = studioSystem.getDirectorRank();
    const oscars = studioSystem.getTotalOscarsWon();

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
        <h2 style="margin:0; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
          🎬 Hollywood Filmstudio & Regie
        </h2>
        <button id="director-close-btn" style="background:none; border:none; color:#aaa; font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 10px; font-size: 0.85rem; display:flex; justify-content:space-between;">
        <span>Regisseur-Rang: <strong style="color: #facc15;">⭐ Rang ${rank}</strong></span>
        <span>Oscars Gewonnen: <strong style="color: #f59e0b;">🏆 ${oscars} Trophäen</strong></span>
      </div>

      ${activeMovie ? `
        <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 12px; padding: 14px;">
          <div style="font-weight: bold; color: #fbbf24; font-size: 1rem;">Film in Produktion: "${activeMovie.title}"</div>
          <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 2px;">Genre: ${activeMovie.genre} | Erwartete Einnahmen: §${activeMovie.expectedBoxOffice.toLocaleString()}</div>
          <div style="margin-top: 10px;">
            <button id="finish-movie-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%;">
              🎬 Kinofilm Veröffentlichen & Premiere Feiern
            </button>
          </div>
        </div>
      ` : ''}

      <div style="font-weight: bold; font-size: 0.95rem; margin-top: 4px;">Verfügbare Drehbuch-Projekte:</div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${movies.map(m => `
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: bold; font-size: 0.95rem;">${m.title}</div>
              <div style="font-size: 0.8rem; color: #94a3b8;">
                Genre: ${m.genre} | Budget: §${m.budget.toLocaleString()} | Ziel: §${m.expectedBoxOffice.toLocaleString()}
              </div>
            </div>
            <div>
              <button class="start-movie-btn" data-id="${m.id}" ${activeMovie ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : 'style="background:#2563eb; color:white; border:none; padding:6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;"'}>
                Drehen (§${m.budget.toLocaleString()})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    content.querySelector('#director-close-btn')?.addEventListener('click', () => this.close());

    content.querySelector('#finish-movie-btn')?.addEventListener('click', () => {
      const res = studioSystem.finishProduction();
      if (res.success) {
        sim.simoleons += res.earnings;
        soundManager.playLevelUp();
        toastManager.showToast(res.message, 'success');
        this.renderContent(studioSystem, sim, toastManager, soundManager);
      }
    });

    content.querySelectorAll('.start-movie-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-id');
        if (id) {
          const res = studioSystem.startProduction(id, sim.simoleons);
          if (res.success) {
            sim.simoleons -= res.cost;
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'success');
            this.renderContent(studioSystem, sim, toastManager, soundManager);
          } else {
            soundManager.playUIClick();
            toastManager.showToast(res.message, 'error');
          }
        }
      });
    });
  }
}
