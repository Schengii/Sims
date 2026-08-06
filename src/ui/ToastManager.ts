/**
 * UI Toast Notification System
 * Renders sleek glassmorphism notifications in the top-right corner of the HUD
 * for quest updates, skill gains, need warnings, and sales.
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

  constructor(parentContainer: HTMLElement) {
    let existing = document.getElementById('toast-container');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'toast-container';
      existing.className = 'toast-container';
      parentContainer.appendChild(existing);
    }
    this.container = existing;
  }

  public show(message: string, type: 'info' | 'success' | 'warning' | 'levelUp' | 'error' = 'info'): void {
    const toastType = type === 'error' ? 'warning' : type;
    this.showToast('Hinweis', message, '🔔', toastType);
  }

  public showToast(title: string, message: string, icon: string = '🔔', type: 'info' | 'success' | 'warning' | 'levelUp' = 'info'): void {

    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
      </div>
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
          container.removeChild(toast);
        }
      }, 400);
    }, 4500);
  }
}
