/**
 * Security & Data Hygiene Utility
 * Implements strict sanitization, XSS protection, and safe JSON handling for DSGVO & IT Security standards.
 */

export class Sanitizer {
  /**
   * Escapes HTML characters to prevent Cross-Site Scripting (XSS)
   */
  public static escapeHTML(str: string): string {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitizes input string for names, custom texts, and titles.
   * Limits max length and strips non-printable/control characters.
   */
  public static sanitizeText(str: string, maxLength: number = 32): string {
    if (typeof str !== 'string') return '';
    // Trim and remove dangerous script tags/protocols
    let clean = str.trim().replace(/[^\p{L}\p{N}\s\-_.]/gu, '');
    if (clean.length > maxLength) {
      clean = clean.substring(0, maxLength);
    }
    return this.escapeHTML(clean);
  }

  /**
   * Safely parses JSON string with protection against Prototype Pollution and unexpected payloads.
   */
  public static safeJSONParse<T>(jsonStr: string, fallback: T): T {
    try {
      if (!jsonStr || typeof jsonStr !== 'string') return fallback;
      
      // Guard against prototype pollution keys in raw string before parsing
      if (jsonStr.includes('__proto__') || jsonStr.includes('constructor') || jsonStr.includes('prototype')) {
        console.warn('[Security Guard] Potentially malicious JSON structure detected and blocked.');
        return fallback;
      }

      const parsed = JSON.parse(jsonStr);
      return (parsed && typeof parsed === 'object') ? parsed : fallback;
    } catch (e) {
      console.error('[Security Guard] Error parsing JSON data safely:', e);
      return fallback;
    }
  }

  /**
   * Validates numeric input bounds
   */
  public static clamp(val: number, min: number, max: number): number {
    if (typeof val !== 'number' || isNaN(val)) return min;
    return Math.min(Math.max(val, min), max);
  }
}
