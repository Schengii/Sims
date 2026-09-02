/**
 * UI Toast Notification System
 * Renders sleek glassmorphism notifications in the top-right corner of the HUD
 * for quest updates, skill gains, need warnings, and sales.
 * v18: Toast stacking limited to MAX_TOASTS (4) — oldest are removed when limit is reached.
 *      Added deduplication to prevent same-message spam.
 */

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  icon: string;
  type: 'info' | 'success' | 'warning' | 'levelUp';
}

export class ToastManager {
  private container: HTMLElement;
  private static readonly MAX_TOASTS = 4;
  /** Track last toast title+type to deduplicate rapid-fire duplicates */
  private lastToastKey: string = '';
  private lastToastTime: number = 0;
  private static readonly DEDUP_MS = 800;

  constructor(parentContainer?: HTMLElement) {
    if (typeof document !== 'undefined') {
      let existing = document.getElementById('toast-container');
      if (!existing) {
        existing = document.createElement('div');
        existing.id = 'toast-container';
        existing.className = 'toast-container';
        if (parentContainer) parentContainer.appendChild(existing);
        else document.body.appendChild(existing);
      }
      this.container = existing;
    } else {
      this.container = {} as any;
    }
  }

  public show(message: string, type: 'info' | 'success' | 'warning' | 'levelUp' | 'error' = 'info'): void {
    const toastType = type === 'error' ? 'warning' : type;
    this.showToast('Hinweis', message, '🔔', toastType);
  }

  public showToast(title: string, message: string, icon: string = '🔔', type: 'info' | 'success' | 'warning' | 'levelUp' = 'info'): void {
    // Deduplication: skip identical toasts within DEDUP_MS
    const key = `${title}|${type}`;
    const now = Date.now();
    if (key === this.lastToastKey && now - this.lastToastTime < ToastManager.DEDUP_MS) {
      return;
    }
    this.lastToastKey = key;
    this.lastToastTime = now;

    // Enforce max stack — remove oldest toast if at limit
    const existing = this.container.querySelectorAll('.toast-card');
    if (existing.length >= ToastManager.MAX_TOASTS) {
      const oldest = existing[0];
      if (oldest.parentNode === this.container) {
        (oldest as HTMLElement).classList.add('toast-fade-out');
        setTimeout(() => {
          if (oldest.parentNode === this.container) {
            this.container.removeChild(oldest);
          }
        }, 300);
      }
    }

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
      </div>
      <button class="toast-close" aria-label="Schließen" onclick="this.closest('.toast-card').remove()">×</button>
    `;

    this.container.appendChild(toast);

    // Auto-remove after 4.5s
    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode === this.container) {
          this.container.removeChild(toast);
        }
      }, 400);
    }, 4500);
  }

  public static showToast(title: string, message: string, icon: string = '🔔', type: 'info' | 'success' | 'warning' | 'levelUp' = 'info'): void {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Enforce max stack on static version too
    const existingToasts = container.querySelectorAll('.toast-card');
    if (existingToasts.length >= ToastManager.MAX_TOASTS) {
      const oldest = existingToasts[0];
      if (oldest.parentNode === container) container.removeChild(oldest);
    }

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fade-out');
      setTimeout(() => {
        if (toast.parentNode === container) {
          container!.removeChild(toast);
        }
      }, 400);
    }, 4500);
  }
}
