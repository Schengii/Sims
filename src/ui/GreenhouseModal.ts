/**
 * Greenhouse & Botany Crossbreeding Modal
 * Allows players to crossbreed plants (grafting/splicing), apply bio-fertilizers, and discover legendary seeds.
 */

import { BotanyGreenhouseSystem, HYBRID_RECIPES } from '../systems/BotanyGreenhouseSystem';
import { GardenSystem } from '../world/GardenSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class GreenhouseModal {
  private container: HTMLElement;
  private botanySystem: BotanyGreenhouseSystem;
  private gardenSystem: GardenSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    botanySystem: BotanyGreenhouseSystem,
    gardenSystem: GardenSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.botanySystem = botanySystem;
    this.gardenSystem = gardenSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-greenhouse';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 720px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(20, 40, 30, 0.96); border: 1px solid rgba(74, 222, 128, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.75);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🌿</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #4ade80;">Gewächshaus & Botanik-Kreuzung</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #a7f3d0;">Pflanzen veredeln, seltene Hybriden züchten & Bio-Dünger nutzen</p>
            </div>
          </div>
          <button id="close-greenhouse-modal" style="background: transparent; border: none; font-size: 26px; color: #a7f3d0; cursor: pointer;">&times;</button>
        </div>

        <!-- Crossbreeding Section -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #86efac;">🧬 Pflanzen-Pfropfen & Kreuzungs-Rezepturen</h3>
          
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${HYBRID_RECIPES.map(recipe => {
              const discovered = this.botanySystem.discoveredHybrids.includes(recipe.resultCrop);
              return `
                <div style="
                  background: rgba(15, 23, 42, 0.6); border: 1px solid ${discovered ? 'rgba(74, 222, 128, 0.6)' : 'rgba(255,255,255,0.1)'};
                  border-radius: 10px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
                ">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <span style="font-size: 28px;">${recipe.resultIcon}</span>
                    <div>
                      <div style="font-weight: bold; font-size: 14px; color: #f8fafc;">
                        ${recipe.resultName}
                        ${discovered ? '<span style="background: rgba(74, 222, 128, 0.25); color: #4ade80; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 6px;">ENTDECKT</span>' : ''}
                      </div>
                      <p style="margin: 3px 0; font-size: 12px; color: #cbd5e1;">${recipe.description}</p>
                      <span style="font-size: 11px; color: #34d399; font-weight: 600;">Rezeptur: ${recipe.parentA} + ${recipe.parentB} | Marktwert: § ${recipe.resultValue}</span>
                    </div>
                  </div>

                  <button class="splice-btn" data-crop="${recipe.resultCrop}" style="
                    background: linear-gradient(135deg, #15803d, #166534); border: 1px solid #4ade80;
                    color: white; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
                  ">Pfropfen & Säen</button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Fertilizer Boosts -->
        <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #f8fafc;">🧪 Bio-Dünger & Wachstums-Beschleuniger</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <span style="font-size: 24px;">🍂</span>
              <h4 style="margin: 4px 0; font-size: 13px;">Bio-Kompost</h4>
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">+50% Wachstums-Speed</p>
              <div style="font-size: 11px; color: #4ade80; margin-bottom: 6px;">Vorrat: ${this.botanySystem.fertilizerInventory.compost}x</div>
              <button class="use-fertilizer-btn" data-type="compost" style="width: 100%; background: #0284c7; border: none; color: white; padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">Ausbringen</button>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <span style="font-size: 24px;">🐟</span>
              <h4 style="margin: 4px 0; font-size: 13px;">Fisch-Dünger</h4>
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">+80% Speed & +60% Wert</p>
              <div style="font-size: 11px; color: #4ade80; margin-bottom: 6px;">Vorrat: ${this.botanySystem.fertilizerInventory.fish_fertilizer}x</div>
              <button class="use-fertilizer-btn" data-type="fish_fertilizer" style="width: 100%; background: #0284c7; border: none; color: white; padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">Ausbringen</button>
            </div>

            <div style="background: rgba(15, 23, 42, 0.7); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
              <span style="font-size: 24px;">💎</span>
              <h4 style="margin: 4px 0; font-size: 13px;">Kristall-Pulver</h4>
              <p style="font-size: 11px; color: #94a3b8; margin: 0 0 8px 0;">Instant-Wachstum & 2x Ertrag</p>
              <div style="font-size: 11px; color: #4ade80; margin-bottom: 6px;">Vorrat: ${this.botanySystem.fertilizerInventory.crystal_powder}x</div>
              <button class="use-fertilizer-btn" data-type="crystal_powder" style="width: 100%; background: #0284c7; border: none; color: white; padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer;">Ausbringen</button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-greenhouse-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelectorAll('.splice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const crop = (e.currentTarget as HTMLElement).getAttribute('data-crop') as any;
        const emptyPlot = this.gardenSystem.plots.find(p => !p.cropType);
        if (emptyPlot) {
          this.gardenSystem.plantSeed(emptyPlot.gridX, emptyPlot.gridY, crop);
          if (!this.botanySystem.discoveredHybrids.includes(crop)) {
            this.botanySystem.discoveredHybrids.push(crop);
          }
          this.sim.addSkillXP('gardening', 30);
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🌱 Hybrid gepflanzt', `Du hast ${crop} im Gewächshaus-Beet eingepflanzt (+30 Garten-XP)!`, '✨', 'success');
          this.open();
        } else {
          this.toastManager.showToast('⚠️ Kein freies Beet', 'Lege zuerst ein neues Gartenbeet an!', '🌱', 'warning');
        }
      });
    });

    backdrop.querySelectorAll('.use-fertilizer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).getAttribute('data-type') as any;
        const boost = this.botanySystem.applyFertilizer(type);
        if (boost) {
          this.gardenSystem.plots.forEach(plot => {
            if (plot.cropType && !plot.isHarvestable) {
              plot.growthProgress = Math.min(100, plot.growthProgress + (type === 'crystal_powder' ? 90 : 30));
              if (plot.growthProgress >= 100) plot.isHarvestable = true;
            }
          });
          this.soundManager.playLevelUp();
          this.toastManager.showToast('🧪 Dünger ausgebracht', 'Alle Beete wurden mit Spezialdünger genährt!', '🌿', 'success');
          this.open();
        } else {
          this.toastManager.showToast('⚠️ Düngervorrat leer', 'Kaufe neuen Dünger oder kompostiere Pflanzenreste!', '🍂', 'warning');
        }
      });
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-greenhouse');
    if (existing) existing.remove();
  }
}
