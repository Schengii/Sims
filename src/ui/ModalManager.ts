/**
 * ModalManager - Central coordination for active UI modals.
 * Handles ESC key dispatching, modal stack tracking, modal exclusivity,
 * and game input inhibition when dialogs are open.
 */

export interface IModal {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
}

export class ModalManager {
  private static instance: ModalManager | null = null;
  private activeModals: Set<IModal> = new Set();
  private isEscListenerAttached = false;

  private constructor() {
    this.attachGlobalKeyListener();
  }

  public static getInstance(): ModalManager {
    if (!ModalManager.instance) {
      ModalManager.instance = new ModalManager();
    }
    return ModalManager.instance;
  }

  public static resetInstance(): void {
    if (ModalManager.instance) {
      ModalManager.instance.closeAll();
    }
    ModalManager.instance = null;
  }

  public registerActive(modal: IModal): void {
    this.activeModals.add(modal);
  }

  public unregisterActive(modal: IModal): void {
    this.activeModals.delete(modal);
  }

  public hasActiveModal(): boolean {
    return this.activeModals.size > 0;
  }

  public getActiveCount(): number {
    return this.activeModals.size;
  }

  public closeTop(): boolean {
    if (this.activeModals.size === 0) return false;
    const lastModal = Array.from(this.activeModals).pop();
    if (lastModal) {
      lastModal.close();
      return true;
    }
    return false;
  }

  public closeAll(): void {
    const list = Array.from(this.activeModals);
    list.forEach(m => {
      try {
        m.close();
      } catch (e) {
        console.warn('[ModalManager] Error closing modal:', e);
      }
    });
    this.activeModals.clear();
  }

  private attachGlobalKeyListener(): void {
    if (typeof window === 'undefined' || this.isEscListenerAttached) return;
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (this.hasActiveModal()) {
          this.closeTop();
        }
      }
    });
    this.isEscListenerAttached = true;
  }
}
