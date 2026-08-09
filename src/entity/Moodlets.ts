/**
 * Sims 4 Style Moodlet & Buff System
 * Represents active emotional modifiers with durations, strength weights, icons, and descriptions.
 */

import type { MoodType } from './Moods';

export interface Moodlet {
  id: string;
  name: string;
  emotion: MoodType;
  weight: number;          // Emotion boost strength (+1, +2, +3)
  durationSec: number;     // Total duration in game seconds
  remainingSec: number;    // Remaining time
  icon: string;            // Emoji or icon
  description: string;
}

export class MoodletManager {
  private moodlets: Moodlet[] = [];

  public addMoodlet(moodlet: Omit<Moodlet, 'remainingSec'>): void {
    // If moodlet with same ID already exists, refresh duration
    const existing = this.moodlets.find(m => m.id === moodlet.id);
    if (existing) {
      existing.remainingSec = moodlet.durationSec;
      existing.weight = moodlet.weight;
      return;
    }

    this.moodlets.push({
      ...moodlet,
      remainingSec: moodlet.durationSec
    });
  }

  public removeMoodlet(id: string): void {
    this.moodlets = this.moodlets.filter(m => m.id !== id);
  }

  public update(deltaSec: number): void {
    for (let i = this.moodlets.length - 1; i >= 0; i--) {
      this.moodlets[i].remainingSec -= deltaSec;
      if (this.moodlets[i].remainingSec <= 0) {
        this.moodlets.splice(i, 1);
      }
    }
  }

  public getActiveMoodlets(): Moodlet[] {
    return [...this.moodlets];
  }

  public getDominantEmotion(): { emotion: MoodType; totalWeight: number } | null {
    if (this.moodlets.length === 0) return null;

    const tally: Record<string, number> = {};
    for (const m of this.moodlets) {
      tally[m.emotion] = (tally[m.emotion] || 0) + m.weight;
    }

    let topEmotion: MoodType = 'happy';
    let maxWeight = 0;

    for (const [emotion, weight] of Object.entries(tally)) {
      if (weight > maxWeight) {
        maxWeight = weight;
        topEmotion = emotion as MoodType;
      }
    }

    return { emotion: topEmotion, totalWeight: maxWeight };
  }

  public clearAll(): void {
    this.moodlets = [];
  }
}
