/**
 * Web Audio API Sound & Speech Synthesizer
 * Provides Simlish vocalizations, procedural sound effects, and UI audio feedback
 * without requiring external media assets.
 */

export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture (WCAG & browser policy requirement)
  }

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
      this.masterGain.connect(this.ctx.destination);
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
    }
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a UI button click sound effect
   */
  public playUIClick(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /**
   * Simlish Vocal Synthesizer
   * Synthesizes randomized vocal babble simulating Sims talking (Simlish)
   */
  public playSimlish(pitchMod: number = 1.0, emotion: 'happy' | 'flirty' | 'angry' | 'tired' = 'happy'): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const syllables = Math.floor(Math.random() * 3) + 2; // 2 to 4 syllables
    let timeOffset = 0;

    let baseFreq = 220 * pitchMod;
    if (emotion === 'happy') baseFreq *= 1.2;
    if (emotion === 'flirty') baseFreq *= 1.1;
    if (emotion === 'angry') baseFreq *= 0.8;
    if (emotion === 'tired') baseFreq *= 0.7;

    for (let i = 0; i < syllables; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const duration = 0.08 + Math.random() * 0.08;

      const freqShift = (Math.random() * 80 - 40);
      osc.type = i % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq + freqShift, now + timeOffset);
      osc.frequency.linearRampToValueAtTime(baseFreq + freqShift + (Math.random() * 60 - 30), now + timeOffset + duration);

      gain.gain.setValueAtTime(0.25, now + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + duration);

      timeOffset += duration + 0.03;
    }
  }

  /**
   * Plays a level up fanfare sound
   */
  public playLevelUp(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = now + idx * 0.1;
      const duration = idx === notes.length - 1 ? 0.4 : 0.12;

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  /**
   * Plays cash register sound when buying furniture (§ Simoleons spent)
   */
  public playBuySound(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }
}
