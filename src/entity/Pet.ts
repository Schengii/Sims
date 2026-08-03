/**
 * Pet Entity Class
 * Represents a Dog or Cat in the household with needs, movement, and behavior.
 */

import type { Point } from '../world/Pathfinding';
import { Sanitizer } from '../security/Sanitizer';

export type PetSpecies = 'dog' | 'cat';

export interface PetNeedsValues {
  hunger: number;    // 0 to 100
  affection: number; // 0 to 100
  energy: number;    // 0 to 100
  play: number;      // 0 to 100
}

export class PetNeeds {
  public hunger: number = 80;
  public affection: number = 80;
  public energy: number = 80;
  public play: number = 80;

  public update(deltaMinutes: number): void {
    // Needs decay over time
    this.hunger = Math.max(0, this.hunger - deltaMinutes * 0.12);
    this.affection = Math.max(0, this.affection - deltaMinutes * 0.10);
    this.energy = Math.max(0, this.energy - deltaMinutes * 0.08);
    this.play = Math.max(0, this.play - deltaMinutes * 0.15);
  }

  public modify(need: keyof PetNeedsValues, amount: number): void {
    if (this[need] !== undefined) {
      this[need] = Math.min(100, Math.max(0, this[need] + amount));
    }
  }

  public getLowestNeed(): { need: keyof PetNeedsValues; value: number } {
    const list: Array<{ need: keyof PetNeedsValues; value: number }> = [
      { need: 'hunger', value: this.hunger },
      { need: 'affection', value: this.affection },
      { need: 'energy', value: this.energy },
      { need: 'play', value: this.play }
    ];
    list.sort((a, b) => a.value - b.value);
    return list[0];
  }
}

export class Pet {
  public id: string;
  public name: string;
  public species: PetSpecies;
  public color: string;
  public gridPos: Point = { x: 7, y: 7 };
  public renderPos: { x: number; y: number } = { x: 7, y: 7 };
  public currentPath: Point[] = [];
  public animState: 'idle' | 'walking' | 'acting' = 'idle';
  public needs: PetNeeds;
  public activeEmote?: { symbol: string; expiresAt: number };

  constructor(name: string, species: PetSpecies = 'dog', color?: string) {
    this.id = `pet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.name = Sanitizer.sanitizeText(name, 20);
    this.species = species;
    this.color = color || (species === 'dog' ? '#d35400' : '#f39c12');
    this.needs = new PetNeeds();
  }

  public update(deltaSec: number, deltaMinutes: number): void {
    this.needs.update(deltaMinutes);

    // Movement along path
    if (this.currentPath.length > 0) {
      this.animState = 'walking';
      const targetPoint = this.currentPath[0];
      const speed = 2.8 * deltaSec;

      const dx = targetPoint.x - this.renderPos.x;
      const dy = targetPoint.y - this.renderPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= speed) {
        this.renderPos.x = targetPoint.x;
        this.renderPos.y = targetPoint.y;
        this.gridPos = { x: targetPoint.x, y: targetPoint.y };
        this.currentPath.shift();
      } else {
        this.renderPos.x += (dx / dist) * speed;
        this.renderPos.y += (dy / dist) * speed;
      }
    } else {
      this.animState = 'idle';
    }

    if (this.activeEmote && Date.now() > this.activeEmote.expiresAt) {
      this.activeEmote = undefined;
    }
  }

  public setPath(path: Point[]): void {
    if (path.length > 0) {
      if (path[0].x === this.gridPos.x && path[0].y === this.gridPos.y) {
        path.shift();
      }
      this.currentPath = path;
    }
  }

  public triggerEmote(symbol: string, durationMs: number = 3000): void {
    this.activeEmote = {
      symbol,
      expiresAt: Date.now() + durationMs
    };
  }
}
