/**
 * Sim Needs Engine
 * Manages the 6 core Sims needs: Hunger, Energy, Hygiene, Bladder, Fun, Social.
 * Decays over time with trait-based multipliers and triggers automatic warnings / mood shifts.
 */

export interface NeedsState {
  hunger: number;   // 0 - 100
  energy: number;   // 0 - 100
  hygiene: number;  // 0 - 100
  bladder: number;  // 0 - 100
  fun: number;      // 0 - 100
  social: number;   // 0 - 100
}

/** Trait-based multipliers for need decay (values < 1 slow decay, values > 1 speed it up) */
export interface NeedsDecayMultipliers {
  hunger?: number;
  energy?: number;
  hygiene?: number;
  bladder?: number;
  fun?: number;
  social?: number;
}

export class Needs {
  private values: NeedsState;
  /** Tracks consecutive minutes all needs were critically low (for faint logic) */
  public criticalMinutes: number = 0;

  constructor(initialValues?: Partial<NeedsState>) {
    this.values = {
      hunger: initialValues?.hunger ?? 85,
      energy: initialValues?.energy ?? 90,
      hygiene: initialValues?.hygiene ?? 80,
      bladder: initialValues?.bladder ?? 85,
      fun: initialValues?.fun ?? 75,
      social: initialValues?.social ?? 70,
    };
  }

  public getValues(): NeedsState {
    return { ...this.values };
  }

  /**
   * Update all needs with optional trait-based multipliers.
   * @param deltaMinutes - Game minutes elapsed
   * @param traitMultipliers - Per-need multipliers from TraitSystem (e.g. { energy: 0.75 })
   */
  public update(deltaMinutes: number, traitMultipliers?: NeedsDecayMultipliers): void {
    // Standard decay rate per game minute
    const decayRate = deltaMinutes * 0.05;

    // Apply trait multipliers to each need (default multiplier = 1 if not provided)
    const m = traitMultipliers ?? {};
    this.values.hunger  = Math.max(0, this.values.hunger  - decayRate * 1.2 * (m.hunger  ?? 1));
    this.values.energy  = Math.max(0, this.values.energy  - decayRate * 0.8 * (m.energy  ?? 1));
    this.values.hygiene = Math.max(0, this.values.hygiene - decayRate * 0.9 * (m.hygiene ?? 1));
    this.values.bladder = Math.max(0, this.values.bladder - decayRate * 1.3 * (m.bladder ?? 1));
    this.values.fun     = Math.max(0, this.values.fun     - decayRate * 1.0 * (m.fun     ?? 1));
    this.values.social  = Math.max(0, this.values.social  - decayRate * 0.7 * (m.social  ?? 1));

    // Track critical state (hunger + energy both below 10)
    if (this.values.hunger < 10 && this.values.energy < 10) {
      this.criticalMinutes += deltaMinutes;
    } else {
      this.criticalMinutes = 0;
    }
  }

  public modify(need: keyof NeedsState, amount: number): void {
    if (this.values[need] !== undefined) {
      this.values[need] = Math.min(100, Math.max(0, this.values[need] + amount));
    }
  }

  public getLowestNeed(): { need: keyof NeedsState; value: number } {
    let lowestKey: keyof NeedsState = 'hunger';
    let lowestVal = 100;

    (Object.keys(this.values) as Array<keyof NeedsState>).forEach((key) => {
      if (this.values[key] < lowestVal) {
        lowestVal = this.values[key];
        lowestKey = key;
      }
    });

    return { need: lowestKey, value: lowestVal };
  }

  public fillAll(): void {
    this.values = {
      hunger: 100,
      energy: 100,
      hygiene: 100,
      bladder: 100,
      fun: 100,
      social: 100
    };
    this.criticalMinutes = 0;
  }

  public getOverallSatisfaction(): number {
    const sum = Object.values(this.values).reduce((a, b) => a + b, 0);
    return Math.round(sum / 6);
  }

  /** Returns true if any single need is critically low (< 10) */
  public hasCriticalNeed(): boolean {
    return Object.values(this.values).some(v => v < 10);
  }
}
