/**
 * MarketModal UI
 * Commodity Exchange & SimCity Stock Investment Terminal
 */

import { BaseModal } from './BaseModal';
import { EconomyMarketSystem } from '../systems/EconomyMarketSystem';
import { Sim } from '../entity/Sim';
import { ToastManager } from './ToastManager';
import { SoundManager } from '../audio/SoundManager';

export class MarketModal extends BaseModal {
  private marketSystem: EconomyMarketSystem;
  private sim: Sim;
  private toastManager: ToastManager;
  private soundManager: SoundManager;

  constructor(
    container: HTMLElement,
    marketSystem: EconomyMarketSystem,
    sim: Sim,
    toastManager: ToastManager,
    soundManager: SoundManager
  ) {
    super(container, { className: 'market-modal-overlay', ariaLabel: 'Warenbörse & Aktienmarkt' });
    this.marketSystem = marketSystem;
    this.sim = sim;
    this.toastManager = toastManager;
    this.soundManager = soundManager;
  }

  protected renderHTML(): string {
    const commodities = Object.values(this.marketSystem.commodities);
    const stocks = Object.values(this.marketSystem.stocks);

    return `
      <div class="modal-header">
        <h2>📈 SimCity Finanzbörse & Handelsmarkt</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div style="display: flex; gap: 12px; margin-bottom: 14px;">
          <button class="btn btn-primary" id="btn-tab-stocks">📊 Aktien & Dividenden</button>
          <button class="btn btn-secondary" id="btn-tab-commodities">🌽 Waren- & Erntebörse</button>
        </div>

        <div id="section-stocks" class="tab-content">
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; color: #94a3b8;">
            Kaufe Firmen-Anteile für wöchentliche Dividenden-Auszahlungen an jedem 7. Tag!
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${stocks.map(stk => `
              <div class="stock-row glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);">
                <div>
                  <div style="font-weight: bold; color: #38bdf8; font-size: 14px;">${stk.icon} ${stk.name} (${stk.symbol})</div>
                  <div style="font-size: 11px; color: #cbd5e1;">Kurs: <strong>§ ${stk.pricePerShare}</strong> / Anteil | Dividende: <strong>§ ${stk.weeklyDividend}</strong>/Woche</div>
                  <div style="font-size: 11px; color: #a78bfa; margin-top: 2px;">Im Depot: <strong>${stk.ownedShares} Anteile</strong></div>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn btn-primary btn-sm btn-buy-stock" data-sym="${stk.symbol}" style="padding: 4px 10px; font-size: 12px;">+1 Kaufen (§ ${stk.pricePerShare})</button>
                  ${stk.ownedShares > 0 ? `<button class="btn btn-secondary btn-sm btn-sell-stock" data-sym="${stk.symbol}" style="padding: 4px 10px; font-size: 12px;">-1 Verkaufen</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div id="section-commodities" class="tab-content" style="display: none;">
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 12px; font-size: 13px; color: #94a3b8;">
            Tagesaktuelle Marktpreise für Gartenbau-Erzeugnisse, Handwerk & Kunst.
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${commodities.map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;">
                <div>
                  <strong>${c.icon} ${c.name}</strong>
                  <span style="font-size: 11px; color: #94a3b8; margin-left: 8px;">Basispreis: § ${c.basePrice}</span>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                  <span style="font-size: 12px; color: ${c.demand === 'Hoch' ? '#4ade80' : c.demand === 'Niedrig' ? '#f87171' : '#facc15'};">
                    Nachfrage: ${c.demand} (${c.trend})
                  </span>
                  <span style="font-weight: bold; color: #38bdf8; font-size: 14px;">§ ${c.currentPrice}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  protected onMount(): void {
    const tabStocks = this.$('#btn-tab-stocks');
    const tabComm = this.$('#btn-tab-commodities');
    const secStocks = this.$('#section-stocks');
    const secComm = this.$('#section-commodities');

    if (tabStocks && tabComm && secStocks && secComm) {
      this.listen(tabStocks, 'click', () => {
        tabStocks.className = 'btn btn-primary';
        tabComm.className = 'btn btn-secondary';
        secStocks.style.display = 'block';
        secComm.style.display = 'none';
      });

      this.listen(tabComm, 'click', () => {
        tabComm.className = 'btn btn-primary';
        tabStocks.className = 'btn btn-secondary';
        secComm.style.display = 'block';
        secStocks.style.display = 'none';
      });
    }

    // Buy stock
    this.$$('.btn-buy-stock').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const sym = (e.currentTarget as HTMLElement).dataset.sym;
        if (sym) {
          const res = this.marketSystem.buyStock(sym, 1, this.sim.simoleons);
          if (res.success) {
            this.sim.simoleons -= res.cost;
            this.soundManager.playBuySound();
            this.toastManager.show(res.message, 'success');
            this.open();
          } else {
            this.toastManager.show(res.message, 'warning');
          }
        }
      });
    });

    // Sell stock
    this.$$('.btn-sell-stock').forEach(btn => {
      this.listen(btn, 'click', (e: Event) => {
        const sym = (e.currentTarget as HTMLElement).dataset.sym;
        if (sym) {
          const res = this.marketSystem.sellStock(sym, 1);
          if (res.success) {
            this.sim.simoleons += res.revenue;
            this.soundManager.playBuySound();
            this.toastManager.show(res.message, 'success');
            this.open();
          } else {
            this.toastManager.show(res.message, 'warning');
          }
        }
      });
    });
  }
}
