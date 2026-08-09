/**
 * Dynamic Weather & Seasons System
 * Manages weather conditions (Sunny, Rain, Snow, Thunderstorm), weather transitions,
 * lighting modifiers, and particle parameters.
 */

export type WeatherType = 'sunny' | 'rain' | 'snow' | 'thunderstorm';

export interface RainPuddle {
  id: string;
  gridX: number;
  gridY: number;
  size: number;
}

export class WeatherSystem {
  public currentWeather: WeatherType = 'sunny';
  public puddles: RainPuddle[] = [];
  private timerMinutes: number = 0;
  private readonly weatherDurationMinutes: number = 180; // 3 in-game hours per weather cycle

  public setWeather(weather: WeatherType): void {
    this.currentWeather = weather;
    this.timerMinutes = 0;
  }

  public cycleNextWeather(): WeatherType {
    const list: WeatherType[] = ['sunny', 'rain', 'snow', 'thunderstorm'];
    const nextIdx = (list.indexOf(this.currentWeather) + 1) % list.length;
    this.setWeather(list[nextIdx]);
    return this.currentWeather;
  }

  public removePuddle(id: string): void {
    this.puddles = this.puddles.filter(p => p.id !== id);
  }

  public update(deltaMinutes: number): void {
    this.timerMinutes += deltaMinutes;

    // Spawn puddles during rain or thunderstorm
    if ((this.currentWeather === 'rain' || this.currentWeather === 'thunderstorm') && Math.random() < 0.05 && this.puddles.length < 8) {
      const rx = Math.floor(Math.random() * 12);
      const ry = Math.floor(Math.random() * 12);
      if (!this.puddles.some(p => p.gridX === rx && p.gridY === ry)) {
        this.puddles.push({
          id: `puddle_${Date.now()}_${Math.random()}`,
          gridX: rx,
          gridY: ry,
          size: 1 + Math.random() * 0.5
        });
      }
    }

    if (this.timerMinutes >= this.weatherDurationMinutes) {
      this.timerMinutes = 0;
      // Randomly change weather
      const roll = Math.random();
      if (roll < 0.5) this.currentWeather = 'sunny';
      else if (roll < 0.75) this.currentWeather = 'rain';
      else if (roll < 0.9) this.currentWeather = 'snow';
      else this.currentWeather = 'thunderstorm';
    }
  }

  public getWeatherInfo(): { name: string; icon: string; overlayColor?: string } {
    switch (this.currentWeather) {
      case 'sunny':
        return { name: 'Sonnig', icon: '☀️' };
      case 'rain':
        return { name: 'Regen', icon: '🌧️', overlayColor: 'rgba(20, 40, 70, 0.15)' };
      case 'snow':
        return { name: 'Schneefall', icon: '❄️', overlayColor: 'rgba(220, 240, 255, 0.1)' };
      case 'thunderstorm':
        return { name: 'Gewitter', icon: '⛈️', overlayColor: 'rgba(10, 15, 30, 0.25)' };
    }
  }
}
