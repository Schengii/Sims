/**
 * Game Time & Speed Controller
 * Manages in-game hours, days, speed multipliers (0x Pause, 1x, 2x, 3x) and day/night clock.
 */

export class TimeSystem {
  public hour: number = 8;
  public minute: number = 0;
  public day: number = 1;
  
  public speedMultiplier: number = 1; // 0 = Paused, 1 = Normal, 2 = Fast, 3 = Ultra
  private isPaused: boolean = false;

  public update(realDeltaSec: number): { deltaMinutes: number; timeString: string; dayString: string } {
    if (this.isPaused || this.speedMultiplier === 0) {
      return { deltaMinutes: 0, timeString: this.getTimeString(), dayString: `Tag ${this.day}` };
    }

    // 1 real second = 1 game minute at 1x speed
    const deltaMinutes = realDeltaSec * this.speedMultiplier * 1.0;
    this.minute += deltaMinutes;

    if (this.minute >= 60) {
      this.hour += Math.floor(this.minute / 60);
      this.minute = this.minute % 60;
    }

    if (this.hour >= 24) {
      this.day += Math.floor(this.hour / 24);
      this.hour = this.hour % 24;
    }

    return {
      deltaMinutes,
      timeString: this.getTimeString(),
      dayString: `Tag ${this.day}`
    };
  }

  public setSpeed(speed: number): void {
    if (speed === 0) {
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.speedMultiplier = Math.min(3, Math.max(1, speed));
    }
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  public getTimeString(): string {
    const hh = Math.floor(this.hour).toString().padStart(2, '0');
    const mm = Math.floor(this.minute).toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }

  public getPausedState(): boolean {
    return this.isPaused;
  }
}
