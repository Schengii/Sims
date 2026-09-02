import { describe, it, expect } from 'vitest';
import { SoundManager } from './SoundManager';

describe('SoundManager Synthesizer', () => {
  it('instantiates and provides volume controls without crashing', () => {
    const sound = new SoundManager();
    expect(sound.masterVolume).toBe(0.8);
    sound.setMasterVolume(0.5);
    expect(sound.masterVolume).toBe(0.5);

    expect(sound.toggleMute()).toBe(true);
    expect(sound.toggleMute()).toBe(false);
  });

  it('safely handles procedural furniture sound calls', () => {
    const sound = new SoundManager();
    expect(() => {
      sound.playCookingSizzle();
      sound.playWaterSplash();
      sound.playTypingSound();
      sound.playFireplaceCrackling();
      sound.playPhoneRing();
      sound.playFootstep('wood');
      sound.playBuildTool();
    }).not.toThrow();
  });
});
