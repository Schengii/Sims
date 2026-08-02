/**
 * Privacy & GDPR (DSGVO) Management
 * Ensures privacy-by-design: 100% local storage, zero telemetry/external tracking,
 * clear user consent, and right-to-erasure options.
 */

export class PrivacyManager {
  private static readonly PRIVACY_KEY = 'sims_gdpr_consent_v1';

  /**
   * Checks if user has accepted the privacy information banner
   */
  public static hasConsented(): boolean {
    return localStorage.getItem(this.PRIVACY_KEY) === 'true';
  }

  /**
   * Records user consent in LocalStorage
   */
  public static setConsent(): void {
    localStorage.setItem(this.PRIVACY_KEY, 'true');
  }

  /**
   * Right to erasure / Data Purge (DSGVO Art. 17)
   * Clears all Sims application data from LocalStorage.
   */
  public static purgeAllUserData(): void {
    const consent = localStorage.getItem(this.PRIVACY_KEY);
    localStorage.clear();
    if (consent) {
      localStorage.setItem(this.PRIVACY_KEY, consent);
    }
  }

  /**
   * Returns a DSGVO Privacy Statement text for disclosure in the app.
   */
  public static getPrivacyNoticeText(): { title: string; body: string; rights: string } {
    return {
      title: 'Datenschutz & Lokale Speicherung (DSGVO Konformität)',
      body: 'Dieses Spiel verarbeitet deine Spieldaten (Sims-Charaktere, Hausbau, Punkte & Einstellungen) ausschließlich LOKAL in deinem Browser (LocalStorage). Es werden KEINE personenbezogenen Daten an externe Server, Drittanbieter oder Analytics-Dienste übertragen.',
      rights: 'Du hast jederzeit die volle Kontrolle über deine Daten. Über das Einstellungsmenü kannst du alle gespeicherten Daten sofort und unwiderruflich löschen (Recht auf Löschung nach DSGVO Art. 17).'
    };
  }
}
