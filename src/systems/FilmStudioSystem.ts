/**
 * Hollywood Film Studio & Director System
 * Allows Sims to direct movie blockbusters, act in lead roles,
 * manage production budgets, and win Starlight Oscar Trophies.
 */

export interface MovieProject {
  id: string;
  title: string;
  genre: 'Action 💥' | 'Sci-Fi 🚀' | 'Rom-Com 💕' | 'Horror 👻';
  budget: number;
  expectedBoxOffice: number;
  requiredFameLevel: number;
  status: 'available' | 'in_production' | 'released';
  boxOfficeEarnings: number;
  isOscarWinner: boolean;
}

export class FilmStudioSystem {
  private movies: MovieProject[] = [];
  private activeMovie: MovieProject | null = null;
  private directorRank: number = 1; // 1 to 5
  private totalOscarsWon: number = 0;

  constructor() {
    this.initDefaultMovies();
  }

  private initDefaultMovies() {
    this.movies = [
      {
        id: 'movie_action_1',
        title: 'Mission Plumbob: Agent 00-Sim 💥',
        genre: 'Action 💥',
        budget: 8000,
        expectedBoxOffice: 24000,
        requiredFameLevel: 1,
        status: 'available',
        boxOfficeEarnings: 0,
        isOscarWinner: false
      },
      {
        id: 'movie_scifi_1',
        title: 'Interstellar Oasis: Planet Sulani 🚀',
        genre: 'Sci-Fi 🚀',
        budget: 14000,
        expectedBoxOffice: 45000,
        requiredFameLevel: 2,
        status: 'available',
        boxOfficeEarnings: 0,
        isOscarWinner: false
      },
      {
        id: 'movie_romcom_1',
        title: 'Liebe in Willow Creek 💕',
        genre: 'Rom-Com 💕',
        budget: 5000,
        expectedBoxOffice: 16000,
        requiredFameLevel: 1,
        status: 'available',
        boxOfficeEarnings: 0,
        isOscarWinner: false
      },
      {
        id: 'movie_horror_1',
        title: 'Das Geheimnis von Voron-Manor 👻',
        genre: 'Horror 👻',
        budget: 10000,
        expectedBoxOffice: 32000,
        requiredFameLevel: 3,
        status: 'available',
        boxOfficeEarnings: 0,
        isOscarWinner: false
      }
    ];
  }

  public getMovies(): MovieProject[] {
    return this.movies;
  }

  public getActiveMovie(): MovieProject | null {
    return this.activeMovie;
  }

  public getDirectorRank(): number {
    return this.directorRank;
  }

  public getTotalOscarsWon(): number {
    return this.totalOscarsWon;
  }

  public startProduction(movieId: string, currentSimoleons: number): { success: boolean; message: string; cost: number } {
    if (this.activeMovie) {
      return { success: false, message: 'Du drehst bereits einen aktiven Kinofilm!', cost: 0 };
    }

    const movie = this.movies.find(m => m.id === movieId);
    if (!movie || movie.status !== 'available') {
      return { success: false, message: 'Filmprojekt nicht verfügbar.', cost: 0 };
    }

    if (currentSimoleons < movie.budget) {
      return { success: false, message: `Nicht genug Produktions-Budget (§${movie.budget.toLocaleString()})!`, cost: 0 };
    }

    movie.status = 'in_production';
    this.activeMovie = movie;

    return {
      success: true,
      message: `🎬 Klappe ab! Die Drehkreuzarbeiten für "${movie.title}" haben begonnen!`,
      cost: movie.budget
    };
  }

  public finishProduction(): { success: boolean; message: string; earnings: number; oscarWon: boolean } {
    if (!this.activeMovie) {
      return { success: false, message: 'Kein aktiver Dreh vorhanden.', earnings: 0, oscarWon: false };
    }

    const movie = this.activeMovie;
    const ratingMultiplier = 0.8 + Math.random() * 0.8; // 0.8x to 1.6x return
    const totalEarnings = Math.round(movie.expectedBoxOffice * ratingMultiplier);

    movie.boxOfficeEarnings = totalEarnings;
    movie.status = 'released';

    const oscarWon = ratingMultiplier > 1.3;
    if (oscarWon) {
      movie.isOscarWinner = true;
      this.totalOscarsWon++;
    }

    if (this.directorRank < 5 && Math.random() < 0.5) {
      this.directorRank++;
    }

    this.activeMovie = null;

    setTimeout(() => {
      movie.status = 'available';
    }, 15000);

    const oscarStr = oscarWon ? '🏆 OSCAR GEWONNEN für Beste Regie!' : '';
    return {
      success: true,
      message: `🎉 KINO-PREMIERE! "${movie.title}" hat §${totalEarnings.toLocaleString()} an den Kinokassen eingespielt! ${oscarStr}`,
      earnings: totalEarnings,
      oscarWon
    };
  }

  public exportData(): any {
    return {
      movies: this.movies,
      activeMovie: this.activeMovie,
      directorRank: this.directorRank,
      totalOscarsWon: this.totalOscarsWon
    };
  }

  public importData(data: any): void {
    if (data) {
      if (Array.isArray(data.movies)) this.movies = data.movies;
      this.activeMovie = data.activeMovie || null;
      this.directorRank = data.directorRank || 1;
      this.totalOscarsWon = data.totalOscarsWon || 0;
    }
  }
}
