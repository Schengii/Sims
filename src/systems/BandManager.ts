/**
 * Band & Rockstar Career System
 * Create music bands, practice instruments, write songs, play live gigs, and release hit albums.
 */

import type { Sim } from '../entity/Sim';
import { EventBus } from './EventBus';

export type InstrumentType = 'electric_guitar' | 'drums' | 'bass' | 'vocals';

export interface BandMember {
  name: string;
  instrument: InstrumentType;
  skill: number;
}

export class BandManager {
  public bandName: string = 'The Plumbob Rebels';
  public genre: string = 'Rock / Pop';
  public bandMembers: BandMember[] = [
    { name: 'Lead Sim', instrument: 'electric_guitar', skill: 4 },
    { name: 'Bella Goth', instrument: 'vocals', skill: 5 },
    { name: 'Bob Pancakes', instrument: 'drums', skill: 3 },
    { name: 'Mortimer Goth', instrument: 'bass', skill: 4 }
  ];
  public fanBase: number = 150;
  public releasedAlbums: number = 0;

  public practiceBandRehearsal(sim: Sim): { success: boolean; message: string } {
    if (sim.needs.getValues().energy < 20) {
      return { success: false, message: 'Zu erschöpft für eine schweißtreibende Band-Probe!' };
    }

    sim.needs.modify('energy', -20);
    sim.needs.modify('fun', 30);
    sim.needs.modify('social', 20);

    const fanGain = Math.floor(10 + Math.random() * 15);
    this.fanBase += fanGain;
    sim.triggerEmote('🎸', 3500);

    return {
      success: true,
      message: `Tolle Bandprobe im Proberaum absolviert! Neue Fans gewonnen: +${fanGain} (Gesamt: ${this.fanBase})`
    };
  }

  public playLiveGig(sim: Sim): { success: boolean; earnings: number; message: string } {
    if (this.fanBase < 50) {
      return { success: false, earnings: 0, message: 'Ihr benötigt mindestens 50 Fans für einen Club-Gig!' };
    }

    const earnings = Math.floor(this.fanBase * 3.5 + Math.random() * 200);
    sim.simoleons += earnings;
    this.fanBase += Math.floor(30 + Math.random() * 40);

    sim.triggerEmote('🎤', 4000);
    sim.moodletManager.addMoodlet({
      id: 'rockstar_gig',
      name: 'Rockstar-Hype',
      emotion: 'inspired',
      weight: 3,
      durationSec: 240,
      icon: '🎸',
      description: 'Ausverkauftes Konzert und tosender Applaus der Fans!'
    });

    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '🎸 LIVE-KONZERT AUSVERKAUFT!',
      message: `Die Menge tobt! Gig-Einnahmen: +§ ${earnings}!`,
      icon: '⚡',
      type: 'levelUp'
    });

    return { success: true, earnings, message: `Legendärer Auftritt! Gagen-Gewinn: § ${earnings}!` };
  }

  public releaseAlbum(sim: Sim, albumTitle: string): { success: boolean; royalties: number; message: string } {
    if (this.fanBase < 200) {
      return { success: false, royalties: 0, message: 'Mindestens 200 Fans für ein erfolgreiches Studioalbum benötigt!' };
    }

    this.releasedAlbums++;
    const royalties = Math.floor(this.fanBase * 6 + 1000);
    sim.simoleons += royalties;

    sim.triggerEmote('💿', 4000);
    EventBus.getInstance().emit('TOAST_TRIGGER', {
      title: '💿 ALBUM-RELEASE!',
      message: `"${albumTitle}" stürmt die Simlish-Charts! Tantiemen: +§ ${royalties}`,
      icon: '🌟',
      type: 'success'
    });

    return { success: true, royalties, message: `Studio-Album "${albumTitle}" veröffentlicht! Erlös: § ${royalties}` };
  }

  public exportData(): any {
    return {
      bandName: (this as any).bandName ?? '',
      bandLevel: (this as any).bandLevel ?? 1,
      fanbase: (this as any).fanbase ?? 0,
      members: (this as any).members ?? [],
      completedGigs: (this as any).completedGigs ?? 0,
      albumsReleased: (this as any).albumsReleased ?? []
    };
  }

  public importData(data: any): void {
    if (!data) return;
    if (data.bandName) (this as any).bandName = data.bandName;
    if (typeof data.bandLevel === 'number') (this as any).bandLevel = data.bandLevel;
    if (typeof data.fanbase === 'number') (this as any).fanbase = data.fanbase;
    if (Array.isArray(data.members)) (this as any).members = data.members;
    if (typeof data.completedGigs === 'number') (this as any).completedGigs = data.completedGigs;
    if (Array.isArray(data.albumsReleased)) (this as any).albumsReleased = data.albumsReleased;
  }
}

