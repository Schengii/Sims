/**
 * Sim Character Entity
 * Represents an active Sim in the game world, including customization options,
 * real-time movement, needs decay, skills, and action queue execution.
 */

import { Needs } from './Needs';
import { Moods, type MoodInfo } from './Moods';
import { ActionQueue } from './ActionQueue';
import type { Point } from '../world/Pathfinding';
import { Sanitizer } from '../security/Sanitizer';
import { LifeStage, type LifeStageType } from './LifeStage';

export interface SimCustomization {
  name: string;
  gender: 'female' | 'male' | 'non-binary';
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  trait: string;
  aspiration: string;
}

export interface SimSkills {
  cooking: number;
  programming: number;
  painting: number;
  fitness: number;
  charisma: number;
}

export class Sim {
  public id: string;
  public customization: SimCustomization;
  public gridPos: Point = { x: 5, y: 5 };
  public renderPos: { x: number; y: number } = { x: 5, y: 5 };
  
  public lifeStage: LifeStageType = 'adult';
  public ageDays: number = 0;
  public partnerName?: string;
  public childrenNames: string[] = [];

  public needs: Needs;
  public actionQueue: ActionQueue;
  public simoleons: number = 2500;
  
  public skills: SimSkills = {
    cooking: 1,
    programming: 1,
    painting: 1,
    fitness: 1,
    charisma: 1
  };

  public currentPath: Point[] = [];
  public animState: 'idle' | 'walking' | 'acting' = 'idle';
  public facing: 'south' | 'east' | 'north' | 'west' = 'south';

  constructor(customization?: Partial<SimCustomization>) {
    this.id = `sim_${Date.now()}`;
    this.customization = {
      name: Sanitizer.sanitizeText(customization?.name || 'Bella Goth', 24),
      gender: customization?.gender || 'female',
      skinColor: customization?.skinColor || '#f1c27d',
      hairColor: customization?.hairColor || '#2c3e50',
      outfitColor: customization?.outfitColor || '#e74c3c',
      trait: customization?.trait || 'Genial',
      aspiration: customization?.aspiration || 'Meisterköchin'
    };

    this.needs = new Needs();
    this.actionQueue = new ActionQueue();
    this.renderPos = { x: this.gridPos.x, y: this.gridPos.y };
  }

  public getCurrentMood(): MoodInfo {
    const satisfaction = this.needs.getOverallSatisfaction();
    const lowest = this.needs.getLowestNeed();
    return Moods.getMood(satisfaction, lowest.value, lowest.need);
  }

  public update(deltaSec: number, deltaMinutes: number): void {
    // 1. Needs decay
    this.needs.update(deltaMinutes);

    // 2. Movement along path
    if (this.currentPath.length > 0) {
      this.animState = 'walking';
      const targetPoint = this.currentPath[0];
      const speed = 3.5 * deltaSec; // Walking speed

      const dx = targetPoint.x - this.renderPos.x;
      const dy = targetPoint.y - this.renderPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= speed) {
        this.renderPos.x = targetPoint.x;
        this.renderPos.y = targetPoint.y;
        this.gridPos = { x: targetPoint.x, y: targetPoint.y };
        this.currentPath.shift(); // Reached waypoint
      } else {
        this.renderPos.x += (dx / dist) * speed;
        this.renderPos.y += (dy / dist) * speed;
      }
    } else {
      if (this.actionQueue.getCurrentAction()) {
        this.animState = 'acting';
      } else {
        this.animState = 'idle';
      }
    }

    // 3. Action Queue execution
    this.actionQueue.update(deltaSec);
  }

  public setPath(path: Point[]): void {
    if (path.length > 0) {
      // Omit first point if it's current position
      if (path[0].x === this.gridPos.x && path[0].y === this.gridPos.y) {
        path.shift();
      }
      this.currentPath = path;
    }
  }

  public ageUp(): LifeStageType {
    const nextStage = LifeStage.getNextStage(this.lifeStage);
    this.lifeStage = nextStage;
    this.ageDays = 0;
    
    // Change hair to grey if senior
    if (nextStage === 'senior') {
      this.customization.hairColor = '#bdc3c7';
    }
    return nextStage;
  }

  public addSkillXP(skill: keyof SimSkills, amount: number): boolean {
    if (this.skills[skill] !== undefined) {
      const oldLevel = Math.floor(this.skills[skill]);
      this.skills[skill] += amount / 100;
      const newLevel = Math.floor(this.skills[skill]);
      return newLevel > oldLevel; // Returns true if leveled up!
    }
    return false;
  }
}
