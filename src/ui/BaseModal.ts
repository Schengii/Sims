/**
 * BaseModal - Universal abstract base class for game modals.
 * Provides standardized lifecycle (render, onMount, destroy), auto-cleanup
 * for DOM event listeners, ARIA dialog accessibility, and ModalManager registration.
 */

import { ModalManager } from './ModalManager';

export interface BaseModalOptions {
  className?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  role?: string;
  ariaLabel?: string;
}

export abstract class BaseModal {
  protected container: HTMLElement;
  protected modalElement: HTMLElement | null = null;
  protected options: BaseModalOptions;
  private eventCleanupList: Array<() => void> = [];

  constructor(container: HTMLElement, options: BaseModalOptions = {}) {
    this.container = container;
    this.options = {
      className: 'glass-modal-container',
      closeOnBackdrop: true,
      closeOnEscape: true,
      role: 'dialog',
      ...options
    };
  }

  /**
   * Must return the inner HTML for the modal-content container.
   */
  protected abstract renderHTML(): string;

  /**
   * Lifecycle hook triggered right after modal HTML is inserted into DOM.
   * Attach event listeners here using `this.listen()`.
   */
  protected abstract onMount(): void;

  /**
   * Optional lifecycle hook triggered right before modal element is removed from DOM.
   */
  protected onDestroy(): void {}

  public open(): void {
    if (this.isOpen()) {
      this.close();
    }

    const modal = document.createElement('div');
    modal.className = `modal-overlay active ${this.options.className || ''}`;
    modal.setAttribute('role', this.options.role || 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (this.options.ariaLabel) {
      modal.setAttribute('aria-label', this.options.ariaLabel);
    }

    modal.innerHTML = `
      <div class="modal-content glass-card">
        ${this.renderHTML()}
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    // Automatic close button binding
    const closeBtn = modal.querySelector('.modal-close, .btn-close-modal');
    if (closeBtn) {
      this.listen(closeBtn as HTMLElement, 'click', () => this.close());
    }

    // Backdrop click
    if (this.options.closeOnBackdrop) {
      this.listen(modal, 'click', (e: Event) => {
        if (e.target === modal) {
          this.close();
        }
      });
    }

    // Call subclass mount hook
    this.onMount();

    // Register to ModalManager
    ModalManager.getInstance().registerActive(this);
  }

  public close(): void {
    if (!this.modalElement) return;

    this.onDestroy();

    // Clean up all attached event listeners
    this.eventCleanupList.forEach(cleanup => cleanup());
    this.eventCleanupList = [];

    if (this.modalElement.parentElement) {
      this.modalElement.parentElement.removeChild(this.modalElement);
    }
    this.modalElement = null;

    ModalManager.getInstance().unregisterActive(this);
  }

  public isOpen(): boolean {
    return this.modalElement !== null && document.body.contains(this.modalElement);
  }

  /**
   * Helper to attach event listeners and automatically track them for disposal.
   */
  protected listen<K extends keyof HTMLElementEventMap>(
    target: HTMLElement | Window | Document,
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    const fn = listener as EventListener;
    target.addEventListener(type, fn, options);
    this.eventCleanupList.push(() => {
      target.removeEventListener(type, fn, options);
    });
  }

  /**
   * Query selector helper on the current modal content
   */
  protected $<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return this.modalElement ? this.modalElement.querySelector<T>(selector) : null;
  }

  /**
   * Query selector all helper on the current modal content
   */
  protected $$<T extends HTMLElement = HTMLElement>(selector: string): NodeListOf<T> {
    return this.modalElement ? this.modalElement.querySelectorAll<T>(selector) : ([] as unknown as NodeListOf<T>);
  }
}
