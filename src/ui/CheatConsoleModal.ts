/**
 * Retro Sims Cheat Console (Ctrl + Shift + C)
 * Accepts classic cheats: motherlode, kaching, rosebud, fillmotive, bb.moveobjects, fps, help
 */

import { Game } from '../engine/Game';

export class CheatConsoleModal {
  private container: HTMLDivElement | null = null;
  private inputEl: HTMLInputElement | null = null;
  private historyEl: HTMLDivElement | null = null;
  private isOpen: boolean = false;
  private game: Game;
  public moveObjectsEnabled: boolean = false;
  public showFpsCounter: boolean = false;

  constructor(game: Game) {
    this.game = game;
    this.initKeyboardShortcut();
  }

  private initKeyboardShortcut(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl + Shift + C or Cmd + Shift + C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public open(): void {
    if (!this.container) {
      this.createDOM();
    }
    if (this.container) {
      this.container.style.display = 'flex';
      this.isOpen = true;
      if (this.inputEl) {
        this.inputEl.focus();
        this.inputEl.value = '';
      }
    }
  }

  public close(): void {
    if (this.container) {
      this.container.style.display = 'none';
      this.isOpen = false;
    }
  }

  private createDOM(): void {
    this.container = document.createElement('div');
    this.container.id = 'cheat-console-modal';
    this.container.className = 'glass-panel cheat-console';
    this.container.style.cssText = `
      position: fixed;
      top: 15px;
      left: 15px;
      width: 480px;
      max-width: 90vw;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: none;
      flex-direction: column;
      padding: 12px;
      font-family: 'Consolas', 'Courier New', monospace;
      color: #38bdf8;
    `;

    this.historyEl = document.createElement('div');
    this.historyEl.style.cssText = `
      max-height: 120px;
      overflow-y: auto;
      font-size: 13px;
      margin-bottom: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    `;
    this.appendLog('Sims 5 Cheat Console v8.0 ready. Type "help" for cheats list.', '#94a3b8');

    const inputRow = document.createElement('div');
    inputRow.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;

    const promptSymbol = document.createElement('span');
    promptSymbol.innerText = '>';
    promptSymbol.style.fontWeight = 'bold';
    promptSymbol.style.color = '#38bdf8';

    this.inputEl = document.createElement('input');
    this.inputEl.type = 'text';
    this.inputEl.placeholder = 'Enter cheat command...';
    this.inputEl.style.cssText = `
      flex: 1;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      padding: 6px 10px;
      color: #f8fafc;
      font-family: inherit;
      font-size: 13px;
      outline: none;
    `;

    this.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl?.value.trim() || '';
        if (cmd) {
          this.executeCheat(cmd);
          if (this.inputEl) this.inputEl.value = '';
        }
      }
    });

    inputRow.appendChild(promptSymbol);
    inputRow.appendChild(this.inputEl);

    this.container.appendChild(this.historyEl);
    this.container.appendChild(inputRow);
    document.body.appendChild(this.container);
  }

  private appendLog(text: string, color: string = '#38bdf8'): void {
    if (!this.historyEl) return;
    const line = document.createElement('div');
    line.style.color = color;
    line.innerText = text;
    this.historyEl.appendChild(line);
    this.historyEl.scrollTop = this.historyEl.scrollHeight;
  }

  private executeCheat(commandStr: string): void {
    const cmd = commandStr.toLowerCase().trim();
    this.appendLog(`> ${commandStr}`, '#cbd5e1');

    switch (cmd) {
      case 'motherlode':
        this.game.sim.simoleons += 50000;
        this.appendLog('Cheat Executed: + § 50.000 Simoleons added!', '#4ade80');
        this.game.toastManager?.showToast('💎 Cheat: + § 50.000 Simoleons!', 'success');
        break;
      case 'kaching':
      case 'rosebud':
        this.game.sim.simoleons += 1000;
        this.appendLog('Cheat Executed: + § 1.000 Simoleons added!', '#4ade80');
        this.game.toastManager?.showToast('🪙 Cheat: + § 1.000 Simoleons!', 'success');
        break;
      case 'fillmotive':
      case 'stats.fill_commodities':
        this.game.sim.needs.fillAll();
        this.appendLog('Cheat Executed: All needs maxed out (100%)!', '#4ade80');
        this.game.toastManager?.showToast('✨ Cheat: Alle Bedürfnisse auf 100%!', 'success');
        break;
      case 'bb.moveobjects':
      case 'moveobjects':
        this.moveObjectsEnabled = !this.moveObjectsEnabled;
        const state = this.moveObjectsEnabled ? 'ENABLED' : 'DISABLED';
        this.appendLog(`Cheat Executed: MoveObjects on grid is now ${state}!`, '#facc15');
        this.game.toastManager?.showToast(`🏗️ Cheat MoveObjects: ${state}`, 'info');
        break;
      case 'fps':
        this.showFpsCounter = !this.showFpsCounter;
        this.appendLog(`FPS Counter Display: ${this.showFpsCounter ? 'ON' : 'OFF'}`, '#38bdf8');
        break;
      case 'help':
        this.appendLog('Available Cheats:', '#f8fafc');
        this.appendLog('  motherlode          - Add § 50,000 Simoleons', '#94a3b8');
        this.appendLog('  kaching / rosebud   - Add § 1,000 Simoleons', '#94a3b8');
        this.appendLog('  fillmotive          - Set all needs to 100%', '#94a3b8');
        this.appendLog('  bb.moveobjects      - Toggle grid collision checks', '#94a3b8');
        this.appendLog('  fps                 - Toggle FPS Overlay', '#94a3b8');
        break;
      default:
        this.appendLog(`Unknown cheat command: "${cmd}". Type "help" for list.`, '#f87171');
        break;
    }
  }
}
