/**
 * Memory & Milestone Log System
 * Records life milestones (First Kiss, Marriage, University Degree, Promotion, Pet Adoption).
 */

export interface MemoryEntry {
  id: string;
  title: string;
  icon: string;
  description: string;
  timestamp: string;
  emotion: 'happy' | 'romantic' | 'proud' | 'sad';
}

export class MemoryManager {
  public memories: MemoryEntry[] = [];

  public addMemory(title: string, icon: string, description: string, emotion: 'happy' | 'romantic' | 'proud' | 'sad' = 'happy'): void {
    const entry: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title,
      icon,
      description,
      timestamp: new Date().toLocaleDateString('de-DE'),
      emotion
    };
    this.memories.unshift(entry); // Newest first
  }
}
