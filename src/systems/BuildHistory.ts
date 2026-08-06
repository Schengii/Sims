/**
 * BuildHistory Undo / Redo System
 * Tracks architectural actions (wall placing, floor tiling, furniture placement/deletion)
 * allowing full Ctrl+Z and Ctrl+Y functionality in Build Mode.
 */

import { House } from '../world/House';

export interface BuildAction {
  type: 'wall' | 'floor' | 'furniture_add' | 'furniture_remove' | 'pool';
  x: number;
  y: number;
  previousValue: any;
  newValue: any;
}

export class BuildHistoryManager {
  private undoStack: BuildAction[] = [];
  private redoStack: BuildAction[] = [];
  private maxHistory: number = 50;

  public pushAction(action: BuildAction): void {
    this.undoStack.push(action);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo on new action
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  public undo(house: House): boolean {
    if (!this.canUndo()) return false;
    const action = this.undoStack.pop()!;
    this.redoStack.push(action);

    this.applyAction(house, action, true);
    return true;
  }

  public redo(house: House): boolean {
    if (!this.canRedo()) return false;
    const action = this.redoStack.pop()!;
    this.undoStack.push(action);

    this.applyAction(house, action, false);
    return true;
  }

  private applyAction(house: House, action: BuildAction, isUndo: boolean): void {
    const val = isUndo ? action.previousValue : action.newValue;

    switch (action.type) {
      case 'wall':
        house.toggleWallNorth(action.x, action.y);
        break;
      case 'floor':
      case 'pool':
        if (val) {
          house.setFloorStyle(action.x, action.y, val.type || 'wood', val.color || '#8d5524');
        }
        break;
      case 'furniture_add':
        if (isUndo && action.newValue) {
          house.removeFurniture(action.newValue.instanceId);
        } else if (action.newValue) {
          house.addPlacedFurniture(action.newValue);
        }
        break;
      case 'furniture_remove':
        if (isUndo && action.previousValue) {
          house.addPlacedFurniture(action.previousValue);
        } else if (action.previousValue) {
          house.removeFurniture(action.previousValue.instanceId);
        }
        break;
    }
  }
}
