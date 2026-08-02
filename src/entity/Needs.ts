/**
 * Sim Needs Engine
 * Manages the 6 core Sims needs: Hunger, Energy, Hygiene, Bladder, Fun, Social.
 * Decays over time and triggers automatic warnings / mood shifts.
 */

export interface NeedsState {
  hunger: number;   // 0 - 100
  energy: number;   // 0 - 100
  hygiene: number;  // 0 - 100
  bladder: number;  // 0 - 100
  fun: number;      // 0 - 100
  social: number;   // 0 - 100
}

export class Needs {
  private values: NeedsState;

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

  public update(deltaMinutes: number): void {
    // Standard decay rate per game minute
    const decayRate = deltaMinutes * 0.05;

    this.values.hunger = Math.max(0, this.values.hunger - decayRate * 1.2);
    this.values.energy = Math.max(0, this.values.energy - decayRate * 0.8);
    this.values.hygiene = Math.max(0, this.values.hygiene - decayRate * 0.9);
    this.values.bladder = Math.max(0, this.values.bladder - decayRate * 1.3);
    this.values.fun = Math.max(0, this.values.fun - decayRate * 1.0);
    this.values.social = Math.max(0, this.values.social - decayRate * 0.7);
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

  public getOverallSatisfaction(): number {
    const sum = Object.values(this.values).reduce((a, b) => a + b, 0);
    return Math.round(sum / 6);
  }
}
