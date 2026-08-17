/**
 * Sims Emotion & Mood Engine
 * Determines current Sim mood based on satisfaction, active traits, and recent actions.
 * Updates the iconic Plumbob color!
 * v18: Added 'angry' and 'bored' mood types.
 */

export type MoodType = 'happy' | 'energized' | 'inspired' | 'focused' | 'flirty' | 'tense' | 'sad' | 'exhausted' | 'angry' | 'bored';

export interface MoodInfo {
  type: MoodType;
  label: string;
  color: string;       // Plumbob & UI glow color
  plumbobColor: string;
  description: string;
}

export class Moods {
  public static getMoodInfo(type: MoodType): MoodInfo {
    switch (type) {
      case 'energized':
        return {
          type: 'energized',
          label: 'Energetisch',
          color: '#2ecc71',
          plumbobColor: '#00ff66',
          description: 'Voller Energie und Bewegungsdrang!'
        };
      case 'inspired':
        return {
          type: 'inspired',
          label: 'Inspiriert',
          color: '#9b59b6',
          plumbobColor: '#b059b6',
          description: 'Voller neuer Ideen für Kunst, Musik & Code!'
        };
      case 'focused':
        return {
          type: 'focused',
          label: 'Fokussiert',
          color: '#3498db',
          plumbobColor: '#2980b9',
          description: 'Konzentriert sich voll auf Logik & Aufgaben.'
        };
      case 'flirty':
        return {
          type: 'flirty',
          label: 'Kokett',
          color: '#e84393',
          plumbobColor: '#fd79a8',
          description: 'Sucht Nähe, Romantik und Komplimente!'
        };
      case 'tense':
        return {
          type: 'tense',
          label: 'Angespannt',
          color: '#e67e22',
          plumbobColor: '#e67e22',
          description: 'Bedürfnisse sind unerfüllt oder Überlastung.'
        };
      case 'exhausted':
        return {
          type: 'exhausted',
          label: 'Erschöpft',
          color: '#e74c3c',
          plumbobColor: '#e74c3c',
          description: 'Dieser Sim braucht dringend Schlaf!'
        };
      case 'sad':
        return {
          type: 'sad',
          label: 'Traurig',
          color: '#3498db',
          plumbobColor: '#6c8ebf',
          description: 'Fühlt sich niedergeschlagen und leer.'
        };
      case 'angry':
        return {
          type: 'angry',
          label: 'Wütend',
          color: '#c0392b',
          plumbobColor: '#e74c3c',
          description: 'Hochgradig verärgert – droht mit negativen Aktionen!'
        };
      case 'bored':
        return {
          type: 'bored',
          label: 'Gelangweilt',
          color: '#95a5a6',
          plumbobColor: '#bdc3c7',
          description: 'Braucht dringend Unterhaltung oder soziale Interaktion.'
        };
      case 'happy':
      default:
        return {
          type: 'happy',
          label: 'Glücklich',
          color: '#27ae60',
          plumbobColor: '#2ecc71',
          description: 'Gut gelaunt und zufrieden mit dem Alltag.'
        };
    }
  }

  public static getMood(overallSatisfaction: number, lowestNeedVal: number, lowestNeedName: string, dominantMoodlet?: MoodType | null): MoodInfo {
    if (lowestNeedVal < 15) {
      if (lowestNeedName === 'energy') {
        return this.getMoodInfo('exhausted');
      }
      if (lowestNeedName === 'social') {
        return this.getMoodInfo('sad');
      }
      if (lowestNeedName === 'fun') {
        return this.getMoodInfo('bored');
      }
      return {
        ...this.getMoodInfo('tense'),
        description: `Dringendes Bedürfnis unerfüllt: ${lowestNeedName.toUpperCase()}`
      };
    }

    // Angry mood triggers from very low social + moderate satisfaction
    if (lowestNeedName === 'social' && lowestNeedVal < 25 && overallSatisfaction < 40) {
      return this.getMoodInfo('angry');
    }

    // Bored mood triggers when fun is the lowest and below 20
    if (lowestNeedName === 'fun' && lowestNeedVal < 20) {
      return this.getMoodInfo('bored');
    }

    if (dominantMoodlet) {
      return this.getMoodInfo(dominantMoodlet);
    }

    if (overallSatisfaction >= 80) {
      return this.getMoodInfo('energized');
    }

    if (overallSatisfaction >= 50) {
      return this.getMoodInfo('happy');
    }

    if (overallSatisfaction >= 30) {
      return this.getMoodInfo('sad');
    }

    return this.getMoodInfo('tense');
  }
}
