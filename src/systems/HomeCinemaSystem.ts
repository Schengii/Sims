/**
 * Home Cinema & Movie Experience System
 * Allows household Sims to screen films across genres (Horror, Romance, Comedy, Sci-Fi) with popcorn and group reactions.
 */

import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';

export interface MovieGenreDef {
  id: 'horror' | 'romance' | 'comedy' | 'scifi';
  title: string;
  icon: string;
  emote: string;
  funGain: number;
  socialGain: number;
  durationSeconds: number;
  description: string;
}

export const MOVIE_GENRES: MovieGenreDef[] = [
  {
    id: 'horror',
    title: 'Mitternachts-Spuk',
    icon: '🧟',
    emote: '😱',
    funGain: 35,
    socialGain: 20,
    durationSeconds: 5,
    description: 'Nervenaufreibender Horrorfilm mit Jumpscares und Gruselstimmung.'
  },
  {
    id: 'romance',
    title: 'Liebe unter Sternen',
    icon: '💖',
    emote: '😍',
    funGain: 30,
    socialGain: 35,
    durationSeconds: 5,
    description: 'Herzerwärmende Romanze, die Sims näher zusammenbringt.'
  },
  {
    id: 'comedy',
    title: 'Die Lachnummer',
    icon: '😂',
    emote: '🤣',
    funGain: 50,
    socialGain: 25,
    durationSeconds: 5,
    description: 'Brüllend komische Komödie – sorgt für beste Laune im gesamten Haushalt.'
  },
  {
    id: 'scifi',
    title: 'Interstellarer Warp',
    icon: '🚀',
    emote: '🛸',
    funGain: 40,
    socialGain: 15,
    durationSeconds: 5,
    description: 'Episches Science-Fiction-Abenteuer mit spektakulären Weltraum-Effekten.'
  }
];

export class HomeCinemaSystem {
  public totalMoviesWatched: number = 0;
  public popcornStock: number = 5;

  public popFreshPopcorn(): number {
    this.popcornStock += 3;
    return this.popcornStock;
  }

  public playMovie(genreId: 'horror' | 'romance' | 'comedy' | 'scifi', household: Household, _activeSim?: Sim): { movie: MovieGenreDef; popcornUsed: boolean } {
    const movie = MOVIE_GENRES.find(m => m.id === genreId) || MOVIE_GENRES[0];
    this.totalMoviesWatched += 1;

    let popcornUsed = false;
    if (this.popcornStock > 0) {
      this.popcornStock -= 1;
      popcornUsed = true;
    }

    household.sims.forEach(sim => {
      sim.needs.modify('fun', movie.funGain + (popcornUsed ? 15 : 0));
      sim.needs.modify('social', movie.socialGain);
      sim.triggerEmote(movie.emote, 4000);
      if (popcornUsed) sim.needs.modify('hunger', 15);
    });

    return { movie, popcornUsed };
  }

  public exportData(): Record<string, any> {
    return {
      totalMoviesWatched: this.totalMoviesWatched,
      popcornStock: this.popcornStock
    };
  }

  public importData(data: Record<string, any>): void {
    if (!data) return;
    if (data.totalMoviesWatched !== undefined) this.totalMoviesWatched = data.totalMoviesWatched;
    if (data.popcornStock !== undefined) this.popcornStock = data.popcornStock;
  }
}
