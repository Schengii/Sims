/**
 * Sims 4 Style Action Queue Engine
 * Allows queuing, reordering, and executing sequential actions with progress tracking.
 */

export interface SimAction {
  id: string;
  name: string;
  icon: string;
  targetObjectId?: string;
  targetGridPos?: { x: number; y: number };
  durationSeconds: number;
  elapsedSeconds: number;
  onExecuteTick?: (deltaSec: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export class ActionQueue {
  private queue: SimAction[] = [];
  private maxQueueLength: number = 5;

  public enqueue(action: SimAction): boolean {
    if (this.queue.length >= this.maxQueueLength) {
      return false; // Queue full
    }
    this.queue.push({
      ...action,
      elapsedSeconds: 0
    });
    return true;
  }

  public getCurrentAction(): SimAction | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  public getQueue(): SimAction[] {
    return [...this.queue];
  }

  public cancelAction(actionId: string): void {
    const idx = this.queue.findIndex(a => a.id === actionId);
    if (idx !== -1) {
      const canceled = this.queue.splice(idx, 1)[0];
      if (canceled.onCancel) {
        canceled.onCancel();
      }
    }
  }

  public clearQueue(): void {
    this.queue.forEach(action => {
      if (action.onCancel) action.onCancel();
    });
    this.queue = [];
  }

  public update(deltaSec: number): void {
    const current = this.getCurrentAction();
    if (!current) return;

    current.elapsedSeconds += deltaSec;

    if (current.onExecuteTick) {
      current.onExecuteTick(deltaSec);
    }

    if (current.elapsedSeconds >= current.durationSeconds) {
      if (current.onComplete) {
        current.onComplete();
      }
      this.queue.shift(); // Remove finished action
    }
  }
}
