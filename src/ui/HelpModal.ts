/**
 * HelpModal UI Component
 * Accessible hotkey reference and game manual dialog (WCAG compliant).
 */

export class HelpModal {
  private container: HTMLElement;
  private modalElement: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public open(): void {
    this.close();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Steuerung & Tastaturkürzel');

    modal.innerHTML = `
      <div class="modal-content glass-card help-modal">
        <div class="modal-header">
          <h2>⌨️ Steuerung & Tastaturkürzel (WCAG)</h2>
          <button class="modal-close" aria-label="Schließen">&times;</button>
        </div>
        <div class="modal-body">
          <div class="help-grid">
            <div class="help-category">
              <h3>🎥 Kamera & Navigieren</h3>
              <ul>
                <li><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>Pfeile</kbd>: Kamera verschieben</li>
                <li><kbd>Mausrad</kbd>: Kamera Zoomen</li>
                <li><kbd>Leertaste</kbd>: Spiel Pausieren / Fortsetzen</li>
                <li><kbd>1</kbd> / <kbd>2</kbd> / <kbd>3</kbd>: Spielgeschwindigkeit (1x, 2x, 3x)</li>
              </ul>
            </div>

            <div class="help-category">
              <h3>🏗️ Baumodus & Editing</h3>
              <ul>
                <li><kbd>Strg</kbd> + <kbd>Z</kbd>: Bauaktion rückgängig machen (Undo)</li>
                <li><kbd>Strg</kbd> + <kbd>Y</kbd>: Bauaktion wiederholen (Redo)</li>
                <li><kbd>Esc</kbd>: Modals / Menüs schließen</li>
              </ul>
            </div>

            <div class="help-category">
              <h3>🎉 Partys & Events</h3>
              <ul>
                <li>Klicke im HUD auf <kbd>🎉 Party Host</kbd>, um eine Hausparty zu veranstalten.</li>
                <li>Serviere Party-Buffet, tanze zu den Prozedural-Beats und erfülle Live-Ziele.</li>
              </ul>
            </div>

            <div class="help-category">
              <h3>🛡️ Barrierefreiheit & DSGVO</h3>
              <ul>
                <li>Fokus-Rahmen für Screenreader aktiviert.</li>
                <li>Systemeinstellung für reduzierte Animationen (prefers-reduced-motion) unterstützt.</li>
                <li>DSGVO: Alle Spieldaten verbleiben lokal im Browser.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(modal);
    this.modalElement = modal;

    modal.querySelector('.modal-close')?.addEventListener('click', () => this.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });
  }

  public close(): void {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
  }
}
