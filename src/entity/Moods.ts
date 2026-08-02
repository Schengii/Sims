/**
 * Sims Emotion & Mood Engine
 * Determines current Sim mood based on satisfaction, active traits, and recent actions.
 * Updates the iconic Plumbob color!
 */

export type MoodType = 'happy' | 'energized' | 'inspired' | 'focused' | 'flirty' | 'tense' | 'sad' | 'exhausted';

export interface MoodInfo {
  type: MoodType;
  label: string;
  color: string;       // Plumbob & UI glow color
  plumbobColor: string;
  description: string;
}

export class Moods {
  public static getMood(overallSatisfaction: number, lowestNeedVal: number, lowestNeedName: string): MoodInfo {
    if (lowestNeedVal < 15) {
      if (lowestNeedName === 'energy') {
        return {
          type: 'exhausted',
          label: 'Erschöpft',
          color: '#e74c3c',
          plumbobColor: '#e74c3c', // Red
          description: 'Dieser Sim braucht dringend Schlaf!'
        };
      }
      return {
        type: 'tense',
        label: 'Angespannt',
        color: '#e67e22',
        plumbobColor: '#e67e22', // Orange
        description: `Dringendes Bedürfnis unerfüllt: ${lowestNeedName.toUpperCase()}`
      };
    }

    if (overallSatisfaction >= 80) {
      return {
        type: 'energized',
        label: 'Energetisch & Glücklich',
        color: '#2ecc71',
        plumbobColor: '#00ff66', // Bright Green
        description: 'Fühlt sich fantastisch und ist bereit für große Taten!'
      };
    }

    if (overallSatisfaction >= 50) {
      return {
        type: 'happy',
        label: 'Glücklich',
        color: '#27ae60',
        plumbobColor: '#2ecc71', // Standard Green
        description: 'Gut gelaunt und zufrieden mit dem Alltag.'
      };
    }

    return {
      type: 'sad',
      label: 'Unzufrieden',
      color: '#3498db',
      plumbobColor: '#f1c40f', // Yellow
      description: 'Etwas fehlt zum vollkommenen Glück.'
    };
  }
}
