/**
 * Main HUD Overlay UI Manager
 * Handles top bar (Clock, Speed, Simoleons, Floor Switcher, Map, Aspirations, Calendar, Bills, Magic, Garage, Business, Camera),
 * Bottom Bar (Sim Profile, Needs, Actions), and WCAG ARIA accessibility labels.
 */

import { Sim } from '../entity/Sim';
import { TimeSystem } from '../systems/TimeSystem';
import { SoundManager } from '../audio/SoundManager';
import { Sanitizer } from '../security/Sanitizer';
import { LifeStage } from '../entity/LifeStage';

export class HUDManager {
  private container: HTMLElement;
  private soundManager: SoundManager;

  public onOpenCAS?: () => void;
  public onOpenBuildBuy?: () => void;
  public onOpenCareer?: () => void;
  public onOpenRelationships?: () => void;
  public onOpenFamilyTree?: () => void;
  public onOpenParty?: () => void;
  public onOpenPrivacy?: () => void;
  public onOpenInventory?: () => void;
  public onOpenAudioSettings?: () => void;
  public onOpenAspirations?: () => void;
  public onOpenWorldMap?: () => void;
  public onOpenCalendar?: () => void;
  public onOpenBills?: () => void;
  public onOpenMagic?: () => void;
  public onOpenVehicle?: () => void;
  public onOpenBusiness?: () => void;
  public onOpenPhoto?: () => void;
  public onOpenEducation?: () => void;
  public onOpenRenters?: () => void;
  public onOpenMemory?: () => void;
  public onOpenWardrobe?: () => void;
  public onOpenGallery?: () => void;
  public onOpenWedding?: () => void;
  public onOpenHobby?: () => void;
  public onOpenEvent?: () => void;
  public onChangeFloor?: (level: number) => void;

  public onToggleWeather?: () => void;
  public onToggleWallMode?: () => void;
  public onToggleRadio?: () => void;
  public onSpeedChange?: (speed: number) => void;
  public onTogglePause?: () => void;
  public onSaveGame?: () => void;

  public onSwitchSim?: (index: number) => void;
  public onAddSim?: () => void;
  public onAddPet?: () => void;

  public onOpenCheats?: () => void;
  public onOpenSmartphone?: () => void;
  public onOpenPetShow?: () => void;
  public onOpenRealEstate?: () => void;
  public onOpenJournal?: () => void;
  public onOpenFame?: () => void;
  public onOpenOccult?: () => void;
  public onOpenProm?: () => void;
  public onOpenRestaurant?: () => void;
  public onOpenResort?: () => void;
  public onOpenScienceLab?: () => void;
  public onOpenDecorator?: () => void;
  public onOpenPetShelter?: () => void;
  public onOpenFarm?: () => void;
  public onOpenDirector?: () => void;
  public onOpenCruise?: () => void;
  public onOpenHealth?: () => void;
  public onOpenFestival?: () => void;
  public onOpenVet?: () => void;
  public onOpenPolitics?: () => void;
  public onOpenArch?: () => void;
  public onOpenSchool?: () => void;
  public onOpenThemePark?: () => void;
  public onOpenSpace?: () => void;
  public onOpenBand?: () => void;
  public onOpenInheritance?: () => void;
  public onOpenTravel?: () => void;
  public onOpenDetective?: () => void;
  public onOpenEquestrian?: () => void;
  public onOpenScuba?: () => void;
  public onOpenPenthouse?: () => void;
  public onOpenPrivateChef?: () => void;
  public onOpenModding?: () => void;

  constructor(container: HTMLElement, soundManager: SoundManager) {
    this.container = container;
    this.soundManager = soundManager;
    this.renderBaseHTML();
    this.attachEvents();
  }

  private renderBaseHTML(): void {
    this.container.innerHTML = `
      <div class="hud-container">
        <!-- Top Bar -->
        <header class="top-bar glass-panel hud-interactive" role="banner">
          <div class="brand-title">
            <span>💎 SIMS 5</span>
          </div>

          <div class="time-controls" role="toolbar" aria-label="Zeitsteuerung">
            <span class="clock-display" id="hud-clock" aria-live="off">08:00 (Tag 1)</span>
            <button class="btn-speed" id="btn-pause" aria-label="Spiel pausieren (Leertaste)">⏸️</button>
            <button class="btn-speed active" id="btn-speed1" aria-label="Normale Geschwindigkeit (1)">▶</button>
            <button class="btn-speed" id="btn-speed2" aria-label="Doppelte Geschwindigkeit (2)">▶▶</button>
            <button class="btn-speed" id="btn-speed3" aria-label="Dreifache Geschwindigkeit (3)">▶▶▶</button>
          </div>

          <!-- Floor Switcher Bar -->
          <div style="display: flex; gap: 4px; background: rgba(0,0,0,0.3); padding: 3px 6px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <span style="font-size: 11px; font-weight: bold; color: #bdc3c7; margin-right: 4px; display: flex; align-items: center;">🏰 Etage:</span>
            <button class="btn-hud" id="btn-floor-keller" style="padding: 2px 6px; font-size: 11px;" title="Keller (-1)">⬇️ Keller</button>
            <button class="btn-hud active" id="btn-floor-eg" style="padding: 2px 6px; font-size: 11px;" title="Erdgeschoss (0)">0 EG</button>
            <button class="btn-hud" id="btn-floor-1og" style="padding: 2px 6px; font-size: 11px;" title="1. Obergeschoss (1)">1 OG</button>
            <button class="btn-hud" id="btn-floor-2og" style="padding: 2px 6px; font-size: 11px;" title="2. Obergeschoss (2)">2 OG</button>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="currency-badge" id="hud-simoleons" aria-label="Guthaben in Simoleons">
              § 2,500
            </div>
            <button class="btn-hud" id="btn-open-phone" title="SimPhone (Simstagram & LlamaEats)" style="background: rgba(56, 189, 248, 0.25); color: #38bdf8; font-weight: bold;">📱 Handy</button>
            <button class="btn-hud" id="btn-open-fame" title="Promi-Status & Ruhm" style="background: rgba(250, 204, 21, 0.2); color: #facc15; font-weight: bold;">🌟 Ruhm</button>
            <button class="btn-hud" id="btn-open-occult" title="Okkulte Verwandlungen">🔮 Okkult</button>
            <button class="btn-hud" id="btn-open-prom" title="Highschool Abschlussball">👑 Prom</button>
            <button class="btn-hud" id="btn-open-rest" title="Gourmet-Restaurant Manager">🍽️ Restaurant</button>
            <button class="btn-hud" id="btn-open-resort" title="Resort-Imperium & Insel-Hotels" style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-weight: bold;">🏝️ Resort</button>
            <button class="btn-hud" id="btn-open-science" title="Sci-Fi Labor & Erfinder-Werkbank" style="background: rgba(2, 132, 199, 0.2); color: #38bdf8; font-weight: bold;">🧪 Sci-Lab</button>
            <button class="btn-hud" id="btn-open-decorator" title="Raumausstatter & Designer Gigs" style="background: rgba(217, 119, 6, 0.2); color: #fef08a; font-weight: bold;">🎨 Designer</button>
            <button class="btn-hud" id="btn-open-petshelter" title="Tierheim & Haustier-Zucht" style="background: rgba(236, 72, 153, 0.2); color: #f472b6; font-weight: bold;">🐾 Tierheim</button>
            <button class="btn-hud" id="btn-open-farm" title="Bauernhof & Ranch-Imperium" style="background: rgba(133, 77, 14, 0.25); color: #fef08a; font-weight: bold;">🌾 Bauernhof</button>
            <button class="btn-hud" id="btn-open-director" title="Hollywood Filmstudio & Regie" style="background: rgba(245, 158, 11, 0.25); color: #fbbf24; font-weight: bold;">🎬 Filmstudio</button>
            <button class="btn-hud" id="btn-open-cruise" title="Mega-Yacht & Insel-Kreuzfahrt Flotte" style="background: rgba(14, 165, 233, 0.25); color: #7dd3fc; font-weight: bold;">⛵ Yachten</button>
            <button class="btn-hud" id="btn-open-realestate" title="Immobilien-Imperium & Rendite" style="background: rgba(74, 222, 128, 0.2); color: #4ade80; font-weight: bold;">🏢 Immobilien</button>
            <button class="btn-hud" id="btn-open-journal" title="Lebenschronik & Quests">📖 Chronik</button>
            <button class="btn-hud" id="btn-open-petshow" title="Pet Agility Contest & Training">🏆 Pet Show</button>
            <button class="btn-hud" id="btn-open-map" title="Nachbarschafts-Karte & Ausflüge">🗺️ Karte</button>
            <button class="btn-hud" id="btn-open-asp" title="Bestrebungen & Belohnungs-Shop">🎯 Bestrebungen</button>
            <button class="btn-hud" id="btn-open-edu" title="Bildung & Universität">🎓 Bildung</button>
            <button class="btn-hud" id="btn-open-rent" title="Vermietung & Mitbewohner">🏢 Vermietung</button>
            <button class="btn-hud" id="btn-open-mem" title="Lebenschronik & Erinnerungen">📖 Erinnerungen</button>
            <button class="btn-hud" id="btn-open-wardrobe" title="Kleiderschrank & Outfits">👗 Outfits</button>
            <button class="btn-hud" id="btn-open-gal" title="Sims Galerie & Import/Export">🌐 Galerie</button>
            <button class="btn-hud" id="btn-open-wed" title="Hochzeit & Familie">💒 Hochzeit</button>
            <button class="btn-hud" id="btn-open-hobby" title="Hobbys & Freelance">🎸 Hobbys</button>
            <button class="btn-hud" id="btn-open-event" title="Notfälle & Schicksal">⚡ Notfälle</button>
            <button class="btn-hud" id="btn-open-cal" title="Kalender & Feiertage">📅 Kalender</button>
            <button class="btn-hud" id="btn-open-bills" title="Rechnungen & Stromkonto">📮 Rechnungen</button>
            <button class="btn-hud" id="btn-open-magic" title="Zauberbuch & Alchemie">🪄 Magie</button>
            <button class="btn-hud" id="btn-open-veh" title="Garage & Fuhrpark">🚗 Garage</button>
            <button class="btn-hud" id="btn-open-equestrian" title="Reitsportzentrum & Turniere" style="background: rgba(139, 69, 19, 0.25); color: #f39c12; font-weight: bold;">🐎 Reiten</button>
            <button class="btn-hud" id="btn-open-scuba" title="Tiefsee-Tauchen & Schätze" style="background: rgba(41, 128, 185, 0.25); color: #38bdf8; font-weight: bold;">🤿 Tauchen</button>
            <button class="btn-hud" id="btn-open-penthouse" title="Luxus-Penthouses & High-Rise Living" style="background: rgba(241, 196, 15, 0.25); color: #f1c40f; font-weight: bold;">🏙️ Penthouse</button>
            <button class="btn-hud" id="btn-open-chef" title="Privatkoch & VIP-Catering" style="background: rgba(230, 126, 34, 0.25); color: #f39c12; font-weight: bold;">👨‍🍳 Privatkoch</button>
            <button class="btn-hud" id="btn-open-travel" title="Flughafen & Traumurlaube" style="background: rgba(56, 189, 248, 0.25); color: #38bdf8; font-weight: bold;">✈️ Urlaub</button>
            <button class="btn-hud" id="btn-open-detective" title="Polizeirevier & Detektiv-Fälle" style="background: rgba(52, 73, 94, 0.35); color: #93c5fd; font-weight: bold;">🕵️ Detektiv</button>
            <button class="btn-hud" id="btn-open-park" title="Sim-Wunderland Freizeitpark" style="background: rgba(243, 156, 18, 0.25); color: #f1c40f; font-weight: bold;">🎡 Freizeitpark</button>
            <button class="btn-hud" id="btn-open-space" title="Weltraum-Labor & Raketenstartrampe" style="background: rgba(142, 68, 173, 0.25); color: #9b59b6; font-weight: bold;">🚀 Weltraum</button>
            <button class="btn-hud" id="btn-open-band" title="Rockband & Live-Konzerte" style="background: rgba(231, 76, 60, 0.25); color: #e74c3c; font-weight: bold;">🎸 Band</button>
            <button class="btn-hud" id="btn-open-inher" title="Generationen-Erbe & Testament" style="background: rgba(241, 196, 15, 0.25); color: #f39c12; font-weight: bold;">📜 Erbschaft</button>
            <button class="btn-hud" id="btn-open-politics" title="Rathaus & Bürgermeister-Wahl" style="background: rgba(41, 128, 185, 0.25); color: #3498db; font-weight: bold;">🏛️ Rathaus</button>
            <button class="btn-hud" id="btn-open-arch" title="Archäologie & Antike Relikte" style="background: rgba(211, 84, 0, 0.25); color: #e67e22; font-weight: bold;">🏺 Archäologie</button>
            <button class="btn-hud" id="btn-open-school" title="Schule & Hausaufgaben" style="background: rgba(52, 152, 219, 0.25); color: #74b9ff; font-weight: bold;">🏫 Schule</button>
            <button class="btn-hud" id="btn-open-fest" title="Saisonale Feste & Marktstände" style="background: rgba(232, 67, 147, 0.25); color: #fd79a8; font-weight: bold;">🎡 Festival</button>
            <button class="btn-hud" id="btn-open-vet" title="Tierklinik & Haustier-Arzt" style="background: rgba(20, 184, 166, 0.25); color: #2dd4bf; font-weight: bold;">🐾 Tierklinik</button>
            <button class="btn-hud" id="btn-open-health" title="Gesundheit & Medizin-Zentrum" style="background: rgba(239, 68, 68, 0.2); color: #f87171; font-weight: bold;">🩺 Gesundheit</button>
            <button class="btn-hud" id="btn-open-modding" title="Custom Content (CC) & Baupläne" style="background: rgba(168, 85, 247, 0.25); color: #c084fc; font-weight: bold;">📦 CC / Mods</button>
            <button class="btn-hud" id="btn-open-cheats" title="Sims Cheat Konsole (Strg + Umschalt + C)" style="background: rgba(56, 189, 248, 0.2); border-color: rgba(56, 189, 248, 0.4); color: #38bdf8;">💻 Cheats</button>
            <button class="btn-hud" id="btn-audio-settings" aria-label="Audio Einstellungen">🔊 Audio</button>
            <button class="btn-hud" id="btn-save" aria-label="Spielstand speichern">💾 Speichern</button>
            <button class="btn-hud" id="btn-privacy" aria-label="Datenschutz & DSGVO">🛡️ DSGVO</button>
          </div>
        </header>

        <!-- Bottom Bar -->
        <footer class="bottom-bar hud-interactive" role="contentinfo">
          <!-- Household Sims Switcher & Sim Profile -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div class="glass-panel" id="hud-household-switcher" style="display: flex; gap: 6px; padding: 6px 10px; align-items: center;">
              <!-- Household Sim avatars dynamically populated -->
            </div>

            <div class="sim-profile-card glass-panel" id="hud-sim-profile">
              <div class="plumbob-icon" id="hud-plumbob-badge" style="color: #2ecc71; background: rgba(46,204,113,0.2)">
                💎
              </div>
              <div class="sim-info">
                <h3 id="hud-sim-name">Bella Goth</h3>
                <p id="hud-sim-mood">Stimmung: Glücklich</p>
                <div id="hud-moodlets-container" style="display: flex; gap: 4px; margin-top: 4px; flex-wrap: wrap;"></div>
              </div>
              <button class="btn-hud" id="btn-open-cas" aria-label="Create-A-Sim Editor öffnen">✏️ Edit</button>
            </div>
          </div>

          <!-- Action Queue Bar -->
          <div class="action-queue-bar glass-panel" id="hud-action-queue" aria-label="Aktionsschlange">
            <div class="action-item-chip">Bereit</div>
          </div>

          <!-- Needs Grid -->
          <div class="needs-grid glass-panel" id="hud-needs-grid" aria-label="Bedürfnisbalken">
            <!-- Dynamically populated -->
          </div>

          <!-- Main Mode Buttons -->
          <div class="hud-actions">
            <button class="btn-hud" id="btn-open-inventory" aria-label="Sim Inventar öffnen">🎒 Inventar</button>
            <button class="btn-hud" id="btn-open-build" aria-label="Bauen & Kaufen Modus">🛋️ Baumodus</button>
            <button class="btn-hud" id="btn-open-career" aria-label="Karriere & Aufgaben Panel">💼 Karriere</button>
            <button class="btn-hud" id="btn-open-rel" aria-label="Beziehungen & Nachbarn Panel">💕 Beziehungen</button>
            <button class="btn-hud" id="btn-open-family" aria-label="Familienstammbaum Panel">👨‍👩‍👧‍👦 Stammbaum</button>
            <button class="btn-hud" id="btn-open-party" aria-label="Hausparty Veranstalten">🎉 Party Host</button>
          </div>
        </footer>
      </div>
    `;
  }

  private attachEvents(): void {
    document.getElementById('btn-open-cas')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCAS) this.onOpenCAS();
    });

    document.getElementById('btn-open-build')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenBuildBuy) this.onOpenBuildBuy();
    });

    document.getElementById('btn-open-career')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCareer) this.onOpenCareer();
    });

    document.getElementById('btn-open-rel')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenRelationships) this.onOpenRelationships();
    });

    document.getElementById('btn-open-family')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenFamilyTree) this.onOpenFamilyTree();
    });

    document.getElementById('btn-open-party')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenParty) this.onOpenParty();
    });

    document.getElementById('btn-open-asp')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenAspirations) this.onOpenAspirations();
    });

    document.getElementById('btn-open-map')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenWorldMap) this.onOpenWorldMap();
    });

    document.getElementById('btn-open-cal')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCalendar) this.onOpenCalendar();
    });

    document.getElementById('btn-open-bills')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenBills) this.onOpenBills();
    });

    document.getElementById('btn-open-magic')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenMagic) this.onOpenMagic();
    });

    document.getElementById('btn-open-veh')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenVehicle) this.onOpenVehicle();
    });

    document.getElementById('btn-open-biz')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenBusiness) this.onOpenBusiness();
    });

    document.getElementById('btn-open-cam')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPhoto) this.onOpenPhoto();
    });

    document.getElementById('btn-open-edu')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenEducation) this.onOpenEducation();
    });

    document.getElementById('btn-open-resort')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenResort) this.onOpenResort();
    });

    document.getElementById('btn-open-science')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenScienceLab) this.onOpenScienceLab();
    });

    document.getElementById('btn-open-decorator')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenDecorator) this.onOpenDecorator();
    });

    document.getElementById('btn-open-petshelter')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPetShelter) this.onOpenPetShelter();
    });

    document.getElementById('btn-open-farm')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenFarm) this.onOpenFarm();
    });

    document.getElementById('btn-open-director')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenDirector) this.onOpenDirector();
    });

    document.getElementById('btn-open-health')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenHealth) this.onOpenHealth();
    });

    document.getElementById('btn-open-fest')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenFestival) this.onOpenFestival();
    });

    document.getElementById('btn-open-vet')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenVet) this.onOpenVet();
    });

    document.getElementById('btn-open-politics')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPolitics) this.onOpenPolitics();
    });

    document.getElementById('btn-open-arch')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenArch) this.onOpenArch();
    });

    document.getElementById('btn-open-school')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenSchool) this.onOpenSchool();
    });

    document.getElementById('btn-open-park')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenThemePark) this.onOpenThemePark();
    });

    document.getElementById('btn-open-space')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenSpace) this.onOpenSpace();
    });

    document.getElementById('btn-open-band')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenBand) this.onOpenBand();
    });

    document.getElementById('btn-open-inher')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenInheritance) this.onOpenInheritance();
    });

    document.getElementById('btn-open-travel')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenTravel) this.onOpenTravel();
    });

    document.getElementById('btn-open-detective')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenDetective) this.onOpenDetective();
    });

    document.getElementById('btn-open-equestrian')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenEquestrian) this.onOpenEquestrian();
    });

    document.getElementById('btn-open-scuba')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenScuba) this.onOpenScuba();
    });

    document.getElementById('btn-open-penthouse')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPenthouse) this.onOpenPenthouse();
    });

    document.getElementById('btn-open-chef')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPrivateChef) this.onOpenPrivateChef();
    });

    document.getElementById('btn-open-cruise')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCruise) this.onOpenCruise();
    });

    document.getElementById('btn-open-rent')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenRenters) this.onOpenRenters();
    });

    document.getElementById('btn-open-mem')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenMemory) this.onOpenMemory();
    });

    document.getElementById('btn-open-wardrobe')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenWardrobe) this.onOpenWardrobe();
    });

    document.getElementById('btn-open-gal')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenGallery) this.onOpenGallery();
    });

    document.getElementById('btn-open-wed')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenWedding) this.onOpenWedding();
    });

    document.getElementById('btn-open-hobby')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenHobby) this.onOpenHobby();
    });

    document.getElementById('btn-open-event')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenEvent) this.onOpenEvent();
    });

    document.getElementById('btn-open-modding')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenModding) this.onOpenModding();
    });

    // Floor Switcher Listeners
    const floorBtns = [
      { id: 'btn-floor-keller', level: -1 },
      { id: 'btn-floor-eg', level: 0 },
      { id: 'btn-floor-1og', level: 1 },
      { id: 'btn-floor-2og', level: 2 }
    ];

    floorBtns.forEach(b => {
      document.getElementById(b.id)?.addEventListener('click', () => {
        this.soundManager.playUIClick();
        floorBtns.forEach(other => document.getElementById(other.id)?.classList.remove('active'));
        document.getElementById(b.id)?.classList.add('active');
        if (this.onChangeFloor) this.onChangeFloor(b.level);
      });
    });

    document.getElementById('btn-privacy')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPrivacy) this.onOpenPrivacy();
    });

    document.getElementById('btn-save')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onSaveGame) this.onSaveGame();
    });

    document.getElementById('btn-open-inventory')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenInventory) this.onOpenInventory();
    });

    document.getElementById('btn-audio-settings')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenAudioSettings) this.onOpenAudioSettings();
    });

    document.getElementById('btn-weather-toggle')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onToggleWeather) this.onToggleWeather();
    });

    document.getElementById('btn-wall-toggle')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onToggleWallMode) this.onToggleWallMode();
    });

    document.getElementById('btn-open-cheats')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenCheats) this.onOpenCheats();
    });

    document.getElementById('btn-open-phone')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenSmartphone) this.onOpenSmartphone();
    });

    document.getElementById('btn-open-petshow')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenPetShow) this.onOpenPetShow();
    });

    document.getElementById('btn-open-realestate')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenRealEstate) this.onOpenRealEstate();
    });

    document.getElementById('btn-open-journal')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenJournal) this.onOpenJournal();
    });

    document.getElementById('btn-open-fame')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenFame) this.onOpenFame();
    });

    document.getElementById('btn-open-occult')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenOccult) this.onOpenOccult();
    });

    document.getElementById('btn-open-prom')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenProm) this.onOpenProm();
    });

    document.getElementById('btn-open-rest')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onOpenRestaurant) this.onOpenRestaurant();
    });

    document.getElementById('btn-radio-toggle')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onToggleRadio) this.onToggleRadio();
    });

    // Speed Controls
    document.getElementById('btn-pause')?.addEventListener('click', () => {
      this.soundManager.playUIClick();
      if (this.onTogglePause) this.onTogglePause();
    });

    const setSpeed = (spd: number) => {
      this.soundManager.playUIClick();
      if (this.onSpeedChange) this.onSpeedChange(spd);
    };

    document.getElementById('btn-speed1')?.addEventListener('click', () => setSpeed(1));
    document.getElementById('btn-speed2')?.addEventListener('click', () => setSpeed(2));
    document.getElementById('btn-speed3')?.addEventListener('click', () => setSpeed(3));
  }

  public update(
    sim: Sim,
    timeSystem: TimeSystem,
    household?: import('../entity/Household').Household,
    petManager?: import('../entity/PetManager').PetManager
  ): void {
    // 0. Household Switcher Chips
    const switcherEl = document.getElementById('hud-household-switcher');
    if (switcherEl && household) {
      switcherEl.innerHTML = `
        <span style="font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.7); margin-right: 4px;">👨‍👩‍👧‍👦 Haushalt:</span>
        ${household.sims.map((s, idx) => {
          const isActive = idx === household.activeSimIndex;
          const sMood = s.getCurrentMood();
          return `
            <button class="btn-hud sim-avatar-btn" data-idx="${idx}" style="padding: 4px 10px; font-size: 0.8rem; border-color: ${isActive ? '#00e5ff' : 'rgba(255,255,255,0.1)'}; background: ${isActive ? 'rgba(0,229,255,0.2)' : 'rgba(0,0,0,0.3)'};">
              <span style="color: ${sMood.plumbobColor};">💎</span>
              <span>${Sanitizer.sanitizeText(s.customization.name.split(' ')[0], 10)}</span>
            </button>
          `;
        }).join('')}
        ${petManager ? petManager.pets.map(p => `
          <div class="glass-panel" style="padding: 3px 8px; font-size: 0.75rem; display: flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.3);">
            <span>${p.species === 'dog' ? '🐕' : '🐈'}</span>
            <span>${p.name}</span>
          </div>
        `).join('') : ''}
        <button class="btn-hud" id="btn-add-sim" style="padding: 4px 8px; font-size: 0.8rem; background: #27ae60;" title="Neues Haushaltsmitglied erstellen">+ Sim</button>
        <button class="btn-hud" id="btn-add-pet" style="padding: 4px 8px; font-size: 0.8rem; background: #e67e22;" title="Haustier adoptieren">+ Pet</button>
      `;

      switcherEl.querySelectorAll('.sim-avatar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const target = e.currentTarget as HTMLElement;
          const idx = parseInt(target.getAttribute('data-idx') || '0', 10);
          this.soundManager.playUIClick();
          if (this.onSwitchSim) this.onSwitchSim(idx);
        });
      });

      document.getElementById('btn-add-sim')?.addEventListener('click', () => {
        this.soundManager.playUIClick();
        if (this.onAddSim) this.onAddSim();
      });

      document.getElementById('btn-add-pet')?.addEventListener('click', () => {
        this.soundManager.playUIClick();
        if (this.onAddPet) this.onAddPet();
      });
    }

    // 1. Clock & Simoleons
    const clockEl = document.getElementById('hud-clock');
    if (clockEl) {
      clockEl.innerText = `${timeSystem.getTimeString()} (Tag ${timeSystem.day})`;
    }

    const simoleonEl = document.getElementById('hud-simoleons');
    if (simoleonEl) {
      simoleonEl.innerText = `§ ${sim.simoleons.toLocaleString()}`;
    }

    // 2. Sim Profile, Mood & Active Moodlets
    const mood = sim.getCurrentMood();
    const stageInfo = LifeStage.getInfo(sim.lifeStage);
    const nameEl = document.getElementById('hud-sim-name');
    if (nameEl) nameEl.innerText = `${stageInfo.icon} ${Sanitizer.sanitizeText(sim.customization.name, 24)}`;

    const moodEl = document.getElementById('hud-sim-mood');
    if (moodEl) moodEl.innerText = `Stimmung: ${mood.label}`;

    const plumbobEl = document.getElementById('hud-plumbob-badge');
    if (plumbobEl) {
      plumbobEl.style.color = mood.plumbobColor;
      plumbobEl.style.background = `${mood.plumbobColor}22`;
    }

    const moodletsEl = document.getElementById('hud-moodlets-container');
    if (moodletsEl) {
      const active = sim.moodletManager.getActiveMoodlets();
      moodletsEl.innerHTML = active.map(m => `
        <div title="${m.name}: ${m.description} (${Math.ceil(m.remainingSec)}s)" style="display: flex; align-items: center; gap: 3px; background: rgba(255,255,255,0.15); border-radius: 6px; padding: 2px 6px; font-size: 11px; color: #fff;">
          <span>${m.icon}</span>
          <span style="font-weight: 600;">+${m.weight}</span>
        </div>
      `).join('');
    }

    // 3. Needs Grid
    const needsGrid = document.getElementById('hud-needs-grid');
    if (needsGrid) {
      const values = sim.needs.getValues();
      const labels: Record<string, string> = {
        hunger: 'Hunger',
        energy: 'Energie',
        hygiene: 'Hygiene',
        bladder: 'Blase',
        fun: 'Spaß',
        social: 'Sozial'
      };

      needsGrid.innerHTML = Object.entries(values).map(([key, val]) => `
        <div class="need-bar-item">
          <div class="need-label">
            <span>${labels[key] || key}</span>
            <span>${Math.round(val)}%</span>
          </div>
          <div class="need-progress-bg">
            <div class="need-progress-fill" style="width: ${val}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // 4. Action Queue Chips with Cancel support
    const actionQueueEl = document.getElementById('hud-action-queue');
    if (actionQueueEl) {
      const queue = sim.actionQueue.getQueue();
      if (queue.length === 0) {
        actionQueueEl.innerHTML = `<div class="action-item-chip">Bereit</div>`;
      } else {
        actionQueueEl.innerHTML = queue.map(a => `
          <div class="action-item-chip" style="display: flex; align-items: center; gap: 6px;">
            <span>${a.icon}</span>
            <span>${Sanitizer.sanitizeText(a.name, 16)}</span>
            <button class="btn-cancel-action" data-id="${a.id}" style="background: none; border: none; color: #ff4757; cursor: pointer; padding: 0 2px; font-weight: bold;">✕</button>
          </div>
        `).join('');

        actionQueueEl.querySelectorAll('.btn-cancel-action').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const actionId = target.getAttribute('data-id');
            if (actionId) {
              sim.actionQueue.cancelAction(actionId);
              this.soundManager.playUIClick();
            }
          });
        });
      }
    }
  }
}
