/**
 * Sim Character Entity
 * Represents an active Sim in the game world, including customization options,
 * real-time movement, needs decay (with trait multipliers), skills, aspirations, and action queue execution.
 */

import { Needs } from './Needs';
import { Moods, type MoodInfo } from './Moods';
import { ActionQueue } from './ActionQueue';
import type { Point } from '../world/Pathfinding';
import { Sanitizer } from '../security/Sanitizer';
import { LifeStage, type LifeStageType } from './LifeStage';
import { Inventory } from './Inventory';
import { MoodletManager } from './Moodlets';
import { TRAIT_CATALOG } from '../systems/TraitSystem';

export interface SimCustomization {
  name: string;
  gender: 'female' | 'male' | 'non-binary';
  skinColor: string;
  hairColor: string;
  outfitColor: string;
  /** Primary trait ID/name (kept for backward compatibility) */
  trait: string;
  aspiration: string;
  /** Up to 3 active trait IDs (takes priority over single trait if populated) */
  traits?: string[];
  /** Voice Pitch multiplier (0.7 - 1.6) */
  voicePitch?: number;
  glasses?: 'none' | 'glasses_modern' | 'sunglasses_aviator' | 'retro_round';
  hat?: 'none' | 'beanie' | 'fedora' | 'baseball_cap' | 'party_hat';
  accessory?: 'none' | 'smartwatch' | 'gold_necklace';
}

export interface SimSkills {
  cooking: number;
  programming: number;
  painting: number;
  fitness: number;
  charisma: number;
  // Extended skills (v18.0.0)
  music: number;
  gardening: number;
  logic: number;
  handiness: number;
  fishing: number;
  riding: number;
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
  public inventory: Inventory;
  public moodletManager: MoodletManager;
  public simoleons: number = 2500;

  public aspirationPoints: number = 250;
  public aspirationId: string = 'gourmet_chef';
  public completedMilestones: string[] = [];

  public skills: SimSkills = {
    cooking: 1,
    programming: 1,
    painting: 1,
    fitness: 1,
    charisma: 1,
    music: 0,
    gardening: 0,
    logic: 0,
    handiness: 0,
    fishing: 0,
    riding: 0
  };

  public currentPath: Point[] = [];
  public animState: 'idle' | 'walking' | 'acting' | 'fainting' = 'idle';
  public onStep?: (gridPos: { x: number; y: number }) => void;
  public facing: 'south' | 'east' | 'north' | 'west' = 'south';
  /** Set to true when sim has critically low needs for 5+ game minutes */
  public isFainting: boolean = false;
  /** Cooldown timer between autonomous decisions for this specific Sim */
  public autonomyCooldownSec: number = 0;

  constructor(customization?: Partial<SimCustomization>) {
    this.id = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.customization = {
      name: Sanitizer.sanitizeText(customization?.name || 'Bella Goth', 24),
      gender: customization?.gender || 'female',
      skinColor: customization?.skinColor || '#f1c27d',
      hairColor: customization?.hairColor || '#2c3e50',
      outfitColor: customization?.outfitColor || '#e74c3c',
      trait: customization?.trait || 'Genial',
      aspiration: customization?.aspiration || 'Meisterköchin',
      traits: customization?.traits || []
    };

    this.needs = new Needs();
    this.actionQueue = new ActionQueue();
    this.inventory = new Inventory();
    this.moodletManager = new MoodletManager();
    this.renderPos = { x: this.gridPos.x, y: this.gridPos.y };
  }

  public getCurrentMood(): MoodInfo {
    const satisfaction = this.needs.getOverallSatisfaction();
    const lowest = this.needs.getLowestNeed();
    const dominant = this.moodletManager.getDominantEmotion();
    return Moods.getMood(satisfaction, lowest.value, lowest.need, dominant?.emotion);
  }

  public activeEmote: { symbol: string; expiresAt: number } | null = null;

  public triggerEmote(symbol: string, durationMs: number = 3500): void {
    this.activeEmote = {
      symbol,
      expiresAt: Date.now() + durationMs
    };
  }

  /**
   * Resolve all active trait IDs for this Sim.
   * Returns traits array if populated, falls back to single trait field.
   */
  public getActiveTraitIds(): string[] {
    const traitsArr = this.customization.traits;
    if (traitsArr && traitsArr.length > 0) return traitsArr;
    // Map legacy name -> id by searching catalog
    const legacyName = this.customization.trait;
    const found = Object.values(TRAIT_CATALOG).find(t => t.name === legacyName || t.id === legacyName);
    return found ? [found.id] : [];
  }

  /**
   * Build combined decay multipliers from all active traits.
   * Multiple traits stack multiplicatively per need.
   */
  private resolveTraitMultipliers() {
    const ids = this.getActiveTraitIds();
    const combined: Record<string, number> = {};
    for (const id of ids) {
      const def = TRAIT_CATALOG[id];
      if (!def) continue;
      for (const [need, mult] of Object.entries(def.needDecayMultipliers)) {
        combined[need] = (combined[need] ?? 1) * (mult ?? 1);
      }
    }
    return combined;
  }

  public update(deltaSec: number, deltaMinutes: number): void {
    // 0. Check active emote expiry
    if (this.activeEmote && Date.now() > this.activeEmote.expiresAt) {
      this.activeEmote = null;
    }

    // 1. Needs & Moodlets decay — now with trait-based multipliers!
    const traitMultipliers = this.resolveTraitMultipliers();
    this.needs.update(deltaMinutes, traitMultipliers);
    this.moodletManager.update(deltaSec);

    // 1b. Faint check: critically low for 5+ game minutes
    if (this.needs.criticalMinutes >= 5 && !this.isFainting) {
      this.isFainting = true;
    } else if (this.needs.getOverallSatisfaction() > 20) {
      this.isFainting = false;
    }

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
        if (this.onStep) {
          this.onStep(this.gridPos);
        }
      } else {
        this.renderPos.x += (dx / dist) * speed;
        this.renderPos.y += (dy / dist) * speed;
      }
    } else {
      if (this.isFainting) {
        this.animState = 'fainting';
      } else if (this.actionQueue.getCurrentAction()) {
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
      // Cap skills at level 10
      this.skills[skill] = Math.min(this.skills[skill], 10);
      const newLevel = Math.floor(this.skills[skill]);
      return newLevel > oldLevel; // Returns true if leveled up!
    }
    return false;
  }
}
