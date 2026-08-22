import { describe, it, expect, beforeEach } from 'vitest';
import { ModalManager, type IModal } from './ModalManager';

describe('ModalManager', () => {
  beforeEach(() => {
    ModalManager.resetInstance();
  });

  it('tracks registered active modals and handles closeAll', () => {
    const manager = ModalManager.getInstance();
    let closed = false;
    const mockModal: IModal = {
      open: () => {},
      close: () => { closed = true; },
      isOpen: () => !closed
    };

    manager.registerActive(mockModal);
    expect(manager.hasActiveModal()).toBe(true);
    expect(manager.getActiveCount()).toBe(1);

    manager.closeAll();
    expect(closed).toBe(true);
    expect(manager.hasActiveModal()).toBe(false);
  });
});
