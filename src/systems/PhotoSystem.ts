/**
 * Smartphone Photo Camera & Memory Album System for Sims 5
 * Takes snapshot photos, logs lifetime memories, and manages photo albums.
 */

export interface PhotoItem {
  id: string;
  title: string;
  timestamp: string;
  mood: string;
  icon: string;
}

export interface MemoryEntry {
  id: string;
  title: string;
  category: 'social' | 'career' | 'family' | 'party' | 'travel';
  dateStr: string;
  description: string;
  icon: string;
}

export class PhotoManager {
  public photos: PhotoItem[] = [];
  public memories: MemoryEntry[] = [
    {
      id: 'mem_start',
      title: 'Einzug ins neue Anwesen',
      category: 'family',
      dateStr: 'Tag 1',
      description: 'Der Grundstein für dein Traumhaus in Sims 5 wurde gelegt.',
      icon: '🏡'
    }
  ];

  public takeSnapshot(sim: import('../entity/Sim').Sim, timeStr: string, title?: string): PhotoItem {
    const mood = sim.getCurrentMood().label;
    const photoTitle = title || `Erinnerungsfoto (${sim.customization.name.split(' ')[0]})`;
    const photo: PhotoItem = {
      id: `photo_${Date.now()}`,
      title: photoTitle,
      timestamp: timeStr,
      mood,
      icon: '📸'
    };

    this.photos.push(photo);

    // Add framed photo item to Sim inventory!
    sim.inventory.addItem({
      name: photoTitle,
      type: 'painting',
      icon: '🖼️',
      value: 120,
      description: `Ein gerahmtes Foto aufgenommen mit dem Smartphone 📱 (Stimmung: ${mood}).`
    });

    // Also log memory entry
    this.addMemory(photoTitle, 'social', `Foto aufgenommen am ${timeStr} in Stimmung "${mood}".`, '📸');

    return photo;
  }

  public addMemory(title: string, category: MemoryEntry['category'], description: string, icon: string = '⭐'): MemoryEntry {
    const memory: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      category,
      dateStr: `Tag ${Date.now()}`,
      description,
      icon
    };
    this.memories.push(memory);
    return memory;
  }
}
