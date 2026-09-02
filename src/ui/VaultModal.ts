/**
 * Bank Vault & Savings Modal UI
 * Allows players to deposit money into high-yield savings (5% interest), buy physical gold bars and diamonds, and inspect net worth.
 */

import { BankingVaultSystem } from '../systems/BankingVaultSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class VaultModal {
  private container: HTMLElement;
  private vaultSystem: BankingVaultSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    vaultSystem: BankingVaultSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    this.container = container;
    this.vaultSystem = vaultSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  public open(): void {
    this.close();

    const backdrop = document.createElement('div');
    backdrop.id = 'modal-banking-vault';
    backdrop.className = 'modal-backdrop';
    backdrop.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px);
      display: flex; align-items: center; justify-content: center; z-index: 1000;
    `;

    backdrop.innerHTML = `
      <div class="glass-panel" style="width: 680px; max-width: 95vw; max-height: 90vh; overflow-y: auto; padding: 24px; border-radius: 16px; background: rgba(30, 41, 59, 0.96); border: 1px solid rgba(234, 179, 8, 0.4); color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 32px;">🏦</span>
            <div>
              <h2 style="margin: 0; font-size: 20px; color: #fbbf24;">Simoleon Banktresor & Sparkonto</h2>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #fde68a;">5% wöchentliche Zinsen, physische Goldbarren & Diamanten</p>
            </div>
          </div>
          <button id="close-vault-modal" style="background: transparent; border: none; font-size: 26px; color: #fde68a; cursor: pointer;">&times;</button>
        </div>

        <!-- Balance Overview Cards -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px;">
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
            <div style="font-size: 11px; color: #94a3b8;">💰 Bargeld im Inventar</div>
            <div style="font-size: 18px; font-weight: bold; color: #34d399; margin-top: 4px;">§ ${this.sim.simoleons.toLocaleString()}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(234, 179, 8, 0.3); text-align: center;">
            <div style="font-size: 11px; color: #fde68a;">📈 Tresor-Sparkonto (5% p.W.)</div>
            <div style="font-size: 18px; font-weight: bold; color: #fbbf24; margin-top: 4px;">§ ${this.vaultSystem.savingsBalance.toLocaleString()}</div>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.3); text-align: center;">
            <div style="font-size: 11px; color: #38bdf8;">💎 Gesamtvermögen</div>
            <div style="font-size: 18px; font-weight: bold; color: #60a5fa; margin-top: 4px;">§ ${this.vaultSystem.getTotalNetWorth().toLocaleString()}</div>
          </div>
        </div>

        <!-- Savings Actions -->
        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">💵 Einzahlungen & Auszahlungen</h3>
          <div style="display: flex; gap: 10px;">
            <button id="deposit-1000-btn" style="flex: 1; background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: white; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
              + § 1.000 Einzahlen
            </button>
            <button id="deposit-all-btn" style="flex: 1; background: linear-gradient(135deg, #0284c7, #0369a1); border: 1px solid #38bdf8; color: white; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
              + Alles Einzahlen
            </button>
            <button id="withdraw-1000-btn" style="flex: 1; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer;">
              - § 1.000 Abheben
            </button>
          </div>
        </div>

        <!-- Gold & Diamond Safe Storage -->
        <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #f8fafc;">🪙 Physische Edelmetalle im Tresor</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 28px;">🪙</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #fbbf24;">Goldbarren (999 Feingold)</div>
                <div style="font-size: 11px; color: #94a3b8;">Im Tresor: ${this.vaultSystem.goldBars}x (Wert § ${this.vaultSystem.goldBars * 1050})</div>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="buy-gold-btn" style="background: #eab308; border: none; color: #1e293b; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">Kaufen (§ 1.000)</button>
              <button id="sell-gold-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">Verkaufen</button>
            </div>
          </div>

          <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 28px;">💎</span>
              <div>
                <div style="font-weight: bold; font-size: 14px; color: #60a5fa;">Brillanten & Diamanten</div>
                <div style="font-size: 11px; color: #94a3b8;">Im Tresor: ${this.vaultSystem.diamonds}x (Wert § ${this.vaultSystem.diamonds * 2650})</div>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="buy-diamond-btn" style="background: #38bdf8; border: none; color: #0f172a; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">Kaufen (§ 2.500)</button>
              <button id="sell-diamond-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">Verkaufen</button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.container.appendChild(backdrop);

    backdrop.querySelector('#close-vault-modal')?.addEventListener('click', () => this.close());

    backdrop.querySelector('#deposit-1000-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.depositSavings(this.sim, 1000)) {
        this.soundManager.playBuySound();
        this.toastManager.showToast('💵 Einzahlung', '§ 1.000 auf das Sparkonto eingezahlt!', '🏦', 'success');
        this.open();
      } else {
        this.toastManager.showToast('⚠️ Nicht genug Bargeld', 'Du hast nicht genug Simoleons!', '🪙', 'warning');
      }
    });

    backdrop.querySelector('#deposit-all-btn')?.addEventListener('click', () => {
      const amount = this.sim.simoleons;
      if (amount > 0 && this.vaultSystem.depositSavings(this.sim, amount)) {
        this.soundManager.playBuySound();
        this.toastManager.showToast('💵 Alles eingezahlt', `§ ${amount.toLocaleString()} sicher im Tresor verwahrt!`, '🏦', 'success');
        this.open();
      }
    });

    backdrop.querySelector('#withdraw-1000-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.withdrawSavings(this.sim, 1000)) {
        this.soundManager.playBuySound();
        this.toastManager.showToast('💵 Auszahlung', '§ 1.000 vom Sparkonto abgehoben!', '💰', 'success');
        this.open();
      } else {
        this.toastManager.showToast('⚠️ Sparbestand zu gering', 'Dein Sparkonto hat nicht genügend Guthaben!', 'ℹ️', 'info');
      }
    });

    backdrop.querySelector('#buy-gold-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.buyGoldBar(this.sim)) {
        this.soundManager.playLevelUp();
        this.toastManager.showToast('🪙 Goldbarren gekauft', '1x 999 Feingoldbarren im Tresor deponiert!', '✨', 'success');
        this.open();
      } else {
        this.toastManager.showToast('⚠️ Zu wenig Bargeld', '§ 1.000 benötigt!', '🪙', 'warning');
      }
    });

    backdrop.querySelector('#sell-gold-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.sellGoldBar(this.sim)) {
        this.soundManager.playBuySound();
        this.toastManager.showToast('🪙 Goldbarren verkauft', 'Goldbarren mit Gewinn für § 1.050 verkauft!', '💰', 'success');
        this.open();
      }
    });

    backdrop.querySelector('#buy-diamond-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.buyDiamond(this.sim)) {
        this.soundManager.playLevelUp();
        this.toastManager.showToast('💎 Diamant gekauft', '1x lupenreiner Brillant im Tresor deponiert!', '✨', 'success');
        this.open();
      } else {
        this.toastManager.showToast('⚠️ Zu wenig Bargeld', '§ 2.500 benötigt!', '💎', 'warning');
      }
    });

    backdrop.querySelector('#sell-diamond-btn')?.addEventListener('click', () => {
      if (this.vaultSystem.sellDiamond(this.sim)) {
        this.soundManager.playBuySound();
        this.toastManager.showToast('💎 Diamant verkauft', 'Diamant für § 2.650 verkauft!', '💰', 'success');
        this.open();
      }
    });
  }

  public close(): void {
    const existing = document.getElementById('modal-banking-vault');
    if (existing) existing.remove();
  }
}
