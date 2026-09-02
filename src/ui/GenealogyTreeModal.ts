/**
 * Genealogy Tree 3.0 Modal UI
 * Visualizes ancestry, grandparents, active generations, children, and dynasty titles.
 */

import { GenealogyTreeSystem } from '../systems/GenealogyTreeSystem';
import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class GenealogyTreeModal {
  private container: HTMLElement;
  private treeSystem: GenealogyTreeSystem;
  private sim: Sim;
  private household: Household;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    treeSystem: GenealogyTreeSystem,
    sim: Sim,
    household: Household,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.treeSystem = treeSystem;
    this.sim = sim;
    this.household = household;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const nodes = this.treeSystem.buildTree(this.sim, this.household);
    const gen1 = nodes.filter(n => n.generation === 1);
    const gen2 = nodes.filter(n => n.generation === 2);
    const gen3 = nodes.filter(n => n.generation === 3);

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-genealogy-tree';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 760px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 25, 45, 0.96); border: 1px solid rgba(168, 85, 247, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🌳</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #c084fc;">Familienstammbaum 3.0 & Ahnengalerie</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #e9d5ff;">Dynastie: <b>${this.treeSystem.dynastyName}</b> | Generationen: ${this.treeSystem.generationCount}</p>
            </div>
          </div>
          <button id="close-tree-modal" style="background: transparent; border: none; font-size: 26px; color: #e9d5ff; cursor: pointer;">&times;</button>
        </div>

        <!-- Tree Canvas Visualization -->
        <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 20px;">
          
          <!-- Generation 1 (Ancestors) -->
          <div style="text-align: center; width: 100%;">
            <div style="font-size: 11px; color: #a855f7; font-weight: bold; margin-bottom: 8px;">🏛️ GENERATION I (Ahnen & Großeltern)</div>
            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              ${gen1.map(node => `
                <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 8px 14px; text-align: center;">
                  <span style="font-size: 22px;">${node.icon}</span>
                  <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">${node.name}</div>
                  <div style="font-size: 10px; color: #94a3b8;">${node.relation}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="color: #a855f7; font-size: 18px;">⬇️</div>

          <!-- Generation 2 (Active Sim & Partner) -->
          <div style="text-align: center; width: 100%;">
            <div style="font-size: 11px; color: #38bdf8; font-weight: bold; margin-bottom: 8px;">👑 GENERATION II (Aktuelle Generation)</div>
            <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
              ${gen2.map(node => `
                <div style="background: rgba(15, 23, 42, 0.8); border: 2px solid #38bdf8; border-radius: 8px; padding: 10px 16px; text-align: center;">
                  <span style="font-size: 26px;">${node.icon}</span>
                  <div style="font-size: 13px; font-weight: bold; color: #38bdf8;">${node.name}</div>
                  <div style="font-size: 10px; color: #cbd5e1;">${node.relation} (${node.lifeStage.toUpperCase()})</div>
                </div>
              `).join('')}
            </div>
          </div>

          ${gen3.length > 0 ? `
            <div style="color: #a855f7; font-size: 18px;">⬇️</div>
            <!-- Generation 3 (Children) -->
            <div style="text-align: center; width: 100%;">
              <div style="font-size: 11px; color: #34d399; font-weight: bold; margin-bottom: 8px;">🌱 GENERATION III (Nachkommen & Erben)</div>
              <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
                ${gen3.map(node => `
                  <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 8px; padding: 8px 14px; text-align: center;">
                    <span style="font-size: 22px;">${node.icon}</span>
                    <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">${node.name}</div>
                    <div style="font-size: 10px; color: #94a3b8;">${node.relation}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    this.soundManager.playUIClick();
    this.toastManager.showToast('🌳 Dynastie-Stammbaum', `Familienstammbaum von "${this.sim.customization.name}" geladen!`, '📜', 'info');

    backdrop.querySelector('#close-tree-modal')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      this.close();
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-genealogy-tree');
    if (existing) existing.remove();
  }
}
