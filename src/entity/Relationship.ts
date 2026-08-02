/**
 * Relationship Model
 * Manages friendship (0..100) and romance (0..100) values between Sims,
 * and computes human-readable relationship titles.
 */

import { Sanitizer } from '../security/Sanitizer';

export type RelationshipStatus =
  | 'Unbekannt'
  | 'Bekannte(r)'
  | 'Gute(r) Freund(in)'
  | 'Beste(r) Freund(in)'
  | 'Schwarm'
  | 'Feste(r) Partner(in)'
  | 'Erzfeind';

export class Relationship {
  public targetSimId: string;
  public targetSimName: string;
  public friendship: number = 20; // 0..100
  public romance: number = 0;     // 0..100

  constructor(targetSimId: string, targetSimName: string, friendship: number = 25, romance: number = 0) {
    this.targetSimId = targetSimId;
    this.targetSimName = Sanitizer.sanitizeText(targetSimName, 24);
    this.friendship = Sanitizer.clamp(friendship, 0, 100);
    this.romance = Sanitizer.clamp(romance, 0, 100);
  }

  public modifyFriendship(amount: number): void {
    this.friendship = Sanitizer.clamp(this.friendship + amount, 0, 100);
  }

  public modifyRomance(amount: number): void {
    this.romance = Sanitizer.clamp(this.romance + amount, 0, 100);
  }

  public getStatusTitle(): RelationshipStatus {
    if (this.friendship <= 10) return 'Erzfeind';
    if (this.romance >= 75) return 'Feste(r) Partner(in)';
    if (this.romance >= 40) return 'Schwarm';
    if (this.friendship >= 80) return 'Beste(r) Freund(in)';
    if (this.friendship >= 50) return 'Gute(r) Freund(in)';
    if (this.friendship >= 20) return 'Bekannte(r)';
    return 'Unbekannt';
  }
}
