/**
 * Home Cinema & Movie Experience Modal UI
 * Allows household Sims to screen films, make popcorn, and trigger multi-Sim cinematic reactions.
 */

import { HomeCinemaSystem, MOVIE_GENRES } from '../systems/HomeCinemaSystem';
import { Household } from '../entity/Household';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class HomeCinemaModal {
  private container: HTMLElement;
  private cinemaSystem: HomeCinemaSystem;
  private household: Household;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    cinemaSystem: HomeCinemaSystem,
    household: Household,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.cinemaSystem = cinemaSystem;
    this.household = household;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-home-cinema';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 700px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(20, 20, 35, 0.96); border: 1px solid rgba(236, 72, 153, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🎬</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #ec4899;">Heimkino-Saal & Projektor</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fbcfe8;">Popcorn naschen, Blockbuster schauen & gemeinsame Filmabende genießen</p>
            </div>
          </div>
          <button id="close-cinema-modal" style="background: transparent; border: none; font-size: 26px; color: #fbcfe8; cursor: pointer;">&times;</button>
        </div>

        <!-- Popcorn & Status Bar -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 28px;">🍿</span>
            <div>
              <div style="font-size: 14px; font-weight: bold; color: #fbcfe8;">Popcorn-Vorrat: ${this.cinemaSystem.popcornStock} Portionen</div>
              <div style="font-size: 11px; color: #94a3b8;">Gesehene Filme: ${this.cinemaSystem.totalMoviesWatched}</div>
            </div>
          </div>
          <button id="make-popcorn-btn" style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">
            🍿 Frisches Popcorn machen (+3)
          </button>
        </div>

        <!-- Movie Genres Grid -->
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f8fafc;">🎥 Film auswählen & Vorführung starten:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          ${MOVIE_GENRES.map(movie => `
            <div style="
              background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1);
              border-radius: 10px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;
            ">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 28px;">${movie.icon}</span>
                <div>
                  <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">${movie.title}</div>
                  <div style="font-size: 11px; color: #ec4899;">Effekte: +${movie.funGain} Spaß, +${movie.socialGain} Sozial</div>
                </div>
              </div>
              <p style="margin: 0 0 12px 0; font-size: 12px; color: #cbd5e1;">${movie.description}</p>

              <button class="play-movie-btn" data-genre="${movie.id}" style="
                width: 100%; background: linear-gradient(135deg, #ec4899, #db2777); border: 1px solid #f472b6;
                color: white; padding: 8px; border-radius: 6px; font-weight: bold; cursor: pointer;
              ">▶️ Film abspielen</button>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-cinema-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#make-popcorn-btn')?.addEventListener('click', () => {
      this.cinemaSystem.popFreshPopcorn();
      this.soundManager.playCookingSizzle();
      this.toastManager.showToast('🍿 Popcorn bereit', 'Frisches Butter-Popcorn wurde in die Schalen gefüllt!', '✨', 'success');
      this.open();
    });

    backdrop.querySelectorAll('.play-movie-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const genre = (e.currentTarget as HTMLElement).getAttribute('data-genre') as any;
        const res = this.cinemaSystem.playMovie(genre, this.household, this.sim);
        this.soundManager.playLevelUp();
        this.toastManager.showToast('🎬 Filmvorführung', `"${res.movie.title}" läuft jetzt im Heimkino! Alle Haushaltsmitglieder schauen mit!`, '🍿', 'levelUp');
        this.close();
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-home-cinema');
    if (existing) existing.remove();
  }
}
