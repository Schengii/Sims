/**
 * Web Audio API Procedural Radio Synthesizer Engine
 * Generates procedural Simlish radio music channels: Pop Hits, 80s Synthwave, Lo-Fi Chillbeats, Electronic Dance.
 */

export type RadioStationId = 'pop' | 'retro' | 'lofi' | 'electro';

export interface RadioStationInfo {
  id: RadioStationId;
  name: string;
  genre: string;
  icon: string;
  bpm: number;
}

export class RadioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlayingRadio: boolean = false;
  private activeStation: RadioStationId = 'pop';
  private timerId: number | null = null;

  public static readonly STATIONS: Record<RadioStationId, RadioStationInfo> = {
    pop: { id: 'pop', name: 'Simlish Pop Hits', genre: 'Pop', icon: '🎷', bpm: 120 },
    retro: { id: 'retro', name: '80s Synthwave Radio', genre: 'Synthwave', icon: '📻', bpm: 110 },
    lofi: { id: 'lofi', name: 'Lo-Fi Chillbeats', genre: 'Chillout', icon: '🎧', bpm: 75 },
    electro: { id: 'electro', name: 'Electro & Dance Zone', genre: 'Electronic', icon: '⚡', bpm: 135 }
  };

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.2;
      this.masterGain.connect(this.ctx.destination);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playStation(stationId: RadioStationId): void {
    this.initContext();
    this.activeStation = stationId;
    this.isPlayingRadio = true;

    if (this.timerId) {
      window.clearInterval(this.timerId);
    }

    const info = RadioManager.STATIONS[stationId];
    const intervalMs = (60 / info.bpm) * 500; // 8th note interval

    let step = 0;
    this.timerId = window.setInterval(() => {
      this.synthesizeBeatStep(stationId, step);
      step = (step + 1) % 16;
    }, intervalMs);
  }

  public stopRadio(): void {
    this.isPlayingRadio = false;
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public toggleRadio(): boolean {
    if (this.isPlayingRadio) {
      this.stopRadio();
      return false;
    } else {
      this.playStation(this.activeStation);
      return true;
    }
  }

  public cycleNextStation(): RadioStationInfo {
    const ids: RadioStationId[] = ['pop', 'retro', 'lofi', 'electro'];
    const idx = ids.indexOf(this.activeStation);
    const nextId = ids[(idx + 1) % ids.length];
    if (this.isPlayingRadio) {
      this.playStation(nextId);
    } else {
      this.activeStation = nextId;
    }
    return RadioManager.STATIONS[nextId];
  }

  public getActiveStationInfo(): RadioStationInfo {
    return RadioManager.STATIONS[this.activeStation];
  }

  public getIsPlaying(): boolean {
    return this.isPlayingRadio;
  }

  private synthesizeBeatStep(station: RadioStationId, step: number): void {
    if (!this.ctx || !this.masterGain || !this.isPlayingRadio) return;
    const now = this.ctx.currentTime;

    // Bass note
    if (step % 4 === 0 || (station === 'electro' && step % 2 === 0)) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = station === 'retro' ? 'sawtooth' : 'sine';
      let freq = 110; // A2
      if (step === 4) freq = 130.81; // C3
      if (step === 8) freq = 146.83; // D3
      if (step === 12) freq = 98.00;  // G2

      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    }

    // Melody synth note
    if (step % 2 === 0 || station === 'pop' || station === 'electro') {
      const melodyFreqs = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23];
      const freq = melodyFreqs[(step * 3 + station.length) % melodyFreqs.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = station === 'lofi' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }
}
