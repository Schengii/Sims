# 💎 Sims 5 - Next-Gen Sims Web Experience (Sims 4 & Sims Mobile Hybrid)

Willkommen zum nächsten Kapitel des Sims-Universums! Dieses Projekt kombiniert die Tiefe von **Sims 4 (PC)** mit dem dynamischen Quest- & Karrieresystem von **Sims Mobile (Handy)** – verpackt in ein modernes **"Sims 5" Visual- & Design-System** mit Glasmorphismus, 2.5D Isometrischer Canvas-Engine und prozeduralem Audio-Synthesizer.

---

## 📌 Inhaltsverzeichnis
1. [Über das Projekt](#-über-das-projekt)
2. [Sicherheit, DSGVO & Barrierefreiheit (WCAG)](#-sicherheit-dsgvo--barrierefreiheit-wcag)
3. [Features & Highlights](#-features--highlights)
4. [Ordner- & Projektstruktur](#-ordner--und-projektstruktur)
5. [Anleitung & Steuerung](#-anleitung--steuerung)
6. [Installation & Lokales Starten](#-installation--lokales-starten)
7. [Changelog & Historie](#-changelog--historie)

---

## 🎮 Über das Projekt

Dieses Spiel wurde als moderne Web-Applikation entwickelt. Es basiert auf **HTML5 Canvas**, **TypeScript** und **Vanilla CSS Custom Tokens**. Es verwendet keine schweren externen 3D-Frameworks, um maximale 60-FPS-Performance, blitzschnelle Ladezeiten und volle Kontrolle über alle Spielmechaniken zu gewährleisten.

### Core Gameplay Loop
- **Create-A-Sim (CAS)**: Gestalte deinen Wunsch-Sim (Name, Aussehen, Kleidung, Merkmale).
- **Bedürfnis- & Stimmungsmanagement**: Halte die 6 Hauptbedürfnisse im grünen Bereich.
- **Sims Mobile Hauspartys & Events**: Veranstalte Hauspartys (Einweihungsparty, Sommer-Poolparty, Geburtstags-Gala), erfülle Live-Ziele, sammle bis zu 5 Sterne ⭐ und gewinne Simoleons (§) & Trophäen!
- **Stereoanlage & Radio-Synthesizer**: Höre 4 prozedural erzeugte Simlish-Radiosender (Pop, Retro Synthwave, Lo-Fi, Electro Dance) und tanze allein oder im Paar zu den Beats!
- **Lebensphasen & Alterungssystem**: Durchlaufe 6 Lebensphasen (🍼 Baby, 🧸 Kleinkind, 🎒 Kind, 🎧 Teenager, 💼 Erwachsener, 👵 Senior). Feiere Geburtstage mit Kerzenauspusten oder gründe eine Familie mit Stammbaum-Übersicht.
- **Interaktive 2.5D Welt**: Bewege deinen Sim frei im Haus, benutze Möbel (Bett, Dusche, PC, Staffelei, Torte, Wiege, Stereoanlage, Party-Buffet).
- **Architekt & Baumodus**: Baue individuelle 3D-Wände, setze Türen & Fenster ein, verlege Parkett, Marmor oder Teppich und hebe kühle Swimmingpools aus!
- **NPC-Nachbarn & Beziehungs-System**: Interagiere mit Nachbarn über das **Sims 4 Pie-Dialograd** und baue Freundschaften oder Romantik auf.
- **Aktions-Schlange (Action Queue)**: Staple bis zu 5 Aktionen nacheinander (wie in Sims 4).
- **Karriere & Sims Mobile Quests**: Steigere Fähigkeiten (Programmieren, Kochen, Malen, Fitness, Charisma), schließe tägliche Quests ab und steige auf.

---

## 🛡️ Sicherheit, DSGVO & Barrierefreiheit (WCAG)

> [!IMPORTANT]
> **Production-Ready & Compliance-Vorgaben**: Das Projekt wurde von Grund auf nach höchsten Sicherheits- und Barrierefreiheitsstandards entwickelt.

### 1. IT-Sicherheit & Data Hygiene (`src/security/Sanitizer.ts`)
- **XSS Protection**: Alle Texteingaben (z. B. Sim-Namen, NPC-Eigenschaften) werden vor der Verarbeitung strikt maskiert.
- **Safe JSON Parsing**: Schutz gegen Prototype Pollution (`__proto__`, `constructor`) beim Importieren/Laden von Spielständen.
- **Boundary Checks**: Numerische Werte werden auf gültige Bereiche begrenzt.

### 2. DSGVO / GDPR Konformität (`src/security/PrivacyManager.ts`)
- **100% Lokale Datenverarbeitung**: Sämtliche Spieldaten verbleiben ausschließlich im LocalStorage deines Browsers. Es gibt **kein externes Telemetrie-Tracking** und keine Drittanbieter-Analytics.
- **Recht auf Löschung (Art. 17 DSGVO)**: Über das DSGVO-Panel (`🛡️ DSGVO` im HUD) kann der Nutzer jederzeit per Klick alle gespeicherten Daten unwiderruflich löschen.

### 3. WCAG 2.1 Barrierefreiheit (`src/styles/accessibility.css`)
- **Tastatur-Navigation**: Vollständige Spiel- & Kamera-Steuerung ohne Maus (Pfeiltasten / WASD für Kamera, `Leertaste` für Pause, `1`/`2`/`3` für Spielgeschwindigkeit, `Esc` für Dialoge).
- **High-Contrast Focus Rings**: Deutliche visuelle Fokussierungsrahmen für Screenreader & Tastatur-User.
- **Barrierefreie Semantic Tags & ARIA**: Verwenden von `<main>`, `<header>`, `role="toolbar"`, `role="dialog"` und `aria-live`.
- **Reduced Motion Support**: Respektiert Systemeinstellungen für reduzierte Animationen (`prefers-reduced-motion`).

---

## ✨ Features & Highlights

- 🎉 **Sims Mobile Party-System**: 3 Party-Typen (Einweihungsparty, Sommer-Poolparty, Geburtstags-Gala) mit Ansturm von Partygästen, Live-Ziel-Checkliste, 5-Sterne-Wertung (⭐⭐⭐⭐⭐) und Trophäen-Belohnungen.
- 🍇 **Party-Buffet & Party-Toast**: Party-Snacks am Buffet servieren & Anstoßen mit Gästen (🥂).
- 📻 **Prozeduraler Radio-Synthesizer**: 4 Simlish-Musiksender (Pop Hits, 80s Synthwave, Lo-Fi Chillbeats, Electro Dance) erzeugt via Web Audio API.
- 🕺 **Tanz-System & Paartanzen**: Rhythmische Tanz-Animationen & Musik-Sprechblasen (🎵, 🎶, 🕺, 💃).
- 🍼 **Lebensphasen & Alterungs-System**: 6 Lebensphasen (Baby bis Senior) mit Größen-Skalierung & Stammbaum.
- 🎂 **Geburtstagstorte & Kerzen ausblasen**: Kerzen ausblasen für Lebensphasen-Aufstieg.
- 🧱 **Erweiterter Baumodus & Raum-Editor**: 5 Architektur-Tabs (Möbel, Wände, Türen/Fenster, Bodenbeläge, Pool & Outdoor).
- 🏊 **Swimmingpool & Schwimm-System**: Ausheben von Pools mit animierter Wasser-Textur & Schwimmen.
- 💬 **Sims 4 Pie-Dialograd & Emote-Bubbles**: Interaktions-Rad (Freundlich, Lustig, Romantisch, Gemein) mit Emote-Bubbles (🎉, 🥂, 🎈, ⭐, 🥳).
- 💕 **Beziehungs-Engine**: Freundschafts- und Romantikbalken mit dynamischen Beziehungs-Titeln.
- 🟢 **Symbolisches Plumbob-System**: Der schwebende Plumbob-Kristall reagiert dynamisch auf die Stimmung.
- 🗣️ **Simlish Vocal Synthesizer**: Prozedural generierte Stimmen (Simlish) & UI-Soundeffekte.
- 💾 **Automatischer Speicherstand**: Automatisches Speichern & Laden im LocalStorage (inklusive Party-Trophäen).

---

## 📂 Ordner- und Projektstruktur

```
Sims/
├── index.html                   # Haupt-Einstiegspunkt mit Semantic Tags & HUD Container
├── package.json                 # Project Scripts & Dependencies
├── README.md                    # Dokumentation, Handbuch & Changelog
├── public/                      # Static Assets (Favicon, Web Icons)
└── src/
    ├── main.ts                  # Application Bootstrapper
    ├── security/                # IT-Security & DSGVO Layer
    │   ├── Sanitizer.ts         # XSS Maskierung, Text Clean & Prototype-Pollution Guard
    │   └── PrivacyManager.ts    # DSGVO Consent, LocalStorage Manager & Right-to-Erasure
    ├── audio/
    │   ├── SoundManager.ts      # Web Audio API Simlish Chatter, UI & Level-Up Synthesizer
    │   └── RadioManager.ts      # Web Audio API Prozeduraler Radio-Synthesizer (4 Sender)
    ├── engine/                  # Core 2.5D Game Engine
    │   ├── Game.ts              # Haupt-Gameschleife & Party-Event Controller
    │   ├── IsometricRenderer.ts # 2.5D Canvas Grid, Walls, Pools, Dance Animations & Party Emotes
    │   ├── Camera.ts            # Panning, Zooming & Smooth Interpolation
    │   └── Input.ts             # Maus-, Touch- & Tastatur-Eingabeverarbeitung
    ├── entity/                  # Sim Entitäten & Verhalten
    │   ├── Sim.ts               # Player Sim State (Lebensphase, Alterstage, Kinder, Partner, Skills)
    │   ├── LifeStage.ts         # 6 Lebensphasen (Baby bis Senior), Render-Skalierung
    │   ├── NPCManager.ts        # Besuchende Nachbarn & Party-Gäste (Mortimer Goth, Penny Pizazz, Bob Pancakes)
    │   ├── Relationship.ts      # Beziehungs-Klasse (Freundschaft, Romantik & Status)
    │   ├── ActionQueue.ts       # Sims 4 Aktions-Stapelsystem (max. 5 Aktionen)
    │   ├── Needs.ts             # 6 Hauptbedürfnisse (Hunger, Energie, Hygiene, Blase, Spaß, Sozial)
    │   └── Moods.ts             # Stimmungs-Zustände (Glücklich, Energetisch, Angespannt, Erschöpft)
    ├── world/                   # Spielwelt & Möbel
    │   ├── House.ts             # Raster-Layout, Wände, Türen, Fenster, Böden & Pool-Raster
    │   ├── Furniture.ts         # Möbel-Katalog (Bett, Dusche, PC, Stereo, Torte, Wiege, Party-Buffet)
    │   └── Pathfinding.ts       # A* Pfadfindungs-Algorithmus auf dem Raster
    ├── systems/                 # Spiel-Mechaniken
    │   ├── TimeSystem.ts        # Uhrzeit, Tag/Nacht-Licht & Geschwindigkeits-Regelung
    │   ├── PartyManager.ts      # Sims Mobile Party-Engine (3 Party-Typen, Ziele, 5 Sterne & Trophäen)
    │   ├── CareerSystem.ts      # Berufe (Tech Guru, Gourmet Chef, Künstler) & Skills
    │   ├── QuestSystem.ts       # Sims Mobile Style Aufgaben & Belohnungen
    │   └── SaveManager.ts       # Sichere JSON-Speicherung von Sims, Wänden, Böden & Party-Trophäen
    ├── ui/                      # Responsive UI Modals & HUD Views
    │   ├── HUD.ts               # Oberer & unterer UI-Balken, Radio-Widget, Party-Button & Aktionschips
    │   ├── PartyModal.ts        # Hausparty-Host Dialog (Party-Art, Sterne & Freigeschaltete Trophäen)
    │   ├── FamilyTreePanel.ts   # Stammbaum-Panel (Generationen, Partner, Kinder & Alter)
    │   ├── BuildBuyCatalog.ts   # 5-Tab Architekt-Katalog (Möbel, Wände, Türen, Böden, Pool)
    │   ├── SocialWheel.ts       # Sims 4 Pie-Dialograd für freundliche, lustige, romantische Aktionen
    │   ├── RelationshipsPanel.ts# Beziehungs-Übersicht (Freundschaft & Romantik Meter)
    │   ├── CASModal.ts          # Create-A-Sim Editor Dialog
    │   ├── CareerPanel.ts       # Karriere-Übersicht, Skill-Meter & Quests
    │   └── PrivacyModal.ts      # DSGVO Datenschutz-Statement & Daten löschen
    └── styles/                  # Sims 5 Design System
        ├── main.css             # Glassmorphism Tokens, Farben & Typografie (Outfit / Inter)
        ├── ui.css               # HUD Layouts, Dialoge, Need-Bars & Buttons
        └── accessibility.css    # WCAG Focus Rings, Sr-only & Reduced Motion Rules
```

---

## ⌨️ Anleitung & Steuerung

### Steuerung für Hauspartys (Sims Mobile Mode)
- **Party starten**: Klicke im HUD auf `🎉 Party Host` und wähle den Party-Typ (Einweihungsparty, Sommer-Poolparty, Geburtstags-Gala).
- **Party-Ziele erfüllen**: Reiche Party-Snacks am Buffet, stoße mit Gästen an (🥂), tanze am Radio oder schwimme im Pool.
- **Sterne sammeln**: Fülle die Leiste bis auf 5 Sterne ⭐, um hohe Simoleon-Prämien und Gold-Trophäen freizuschalten.

### Tastatur-Hotkeys (WCAG Barrierefreiheit)
- `W / A / S / D` oder `Pfeiltasten`: Kamera verschieben.
- `Leertaste`: Spiel Pausieren / Fortsetzen.
- `1`: Normale Geschwindigkeit (1x).
- `2`: Doppelte Geschwindigkeit (2x).
- `3`: Dreifache Geschwindigkeit (3x).
- `Escape`: Geöffnete Dialoge / Modals schließen.

---

## 🚀 Installation & Lokales Starten

### Voraussetzungen
- **Node.js** (Version 18 oder höher empfohlen)
- **npm** (oder yarn / pnpm)

### Befehle

1. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten**:
   ```bash
   npm run dev
   ```
   Öffne anschließend die im Terminal angezeigte URL (z. B. `http://localhost:5173`) in deinem Browser.

3. **Production-Build erstellen**:
   ```bash
   npm run build
   ```

---

## 📝 Changelog & Historie

### Version 24.0.0 (Glass Pavilion Architecture, Magic Duels & Photo Studio Wall Art)
- **[Architektur & Pavillons] Glaspavillons, Schiebetüren & Glasböden (`House.ts`, `IsometricRenderer.ts`, `SaveManager.ts`)**:
  - Neuer Bodentyp `glass_floor` (transluzenter Glasboden mit Mullion-Gittern).
  - Neuer Wand-Muster-Typ `glass_curtain_wall` (Aluminiumgerahmte Glas-Vorhangfassade) und neue Wandöffnung `sliding_patio_door` (moderne Terrassen-Glasschiebetür).
  - Perfekt geeignet für den Bau wetterfester Wintergärten und transparenter Terrassenpavillons.
- **[Magie & Duelle] Zauberspruch-Duellarena & Magier-Turniere (`MagicDuelSystem.ts`, `MagicDuelModal.ts`, `Game.ts`)**:
  - Turn-based Magier-Duelle gegen rivalisierende NPC-Zauberer (*Morgyn Ember*, *Darrel Charm*, *L. Faba*).
  - Taktische Zaubersprüche: *Blitzschlag* (35 DMG), *Prisma-Schild* (Reflexion & Schadensabwehr), *Frostnova* (25 DMG) und *Pyroschlag* (50 DMG).
  - Aufstieg in Zauberer-Rängen (Novize ➔ Adept ➔ Meister ➔ Erzmagier) mit § 1.500 Siegprämien und Logik/Magie-XP.
  - SimOS-App *"Magier-Duellarena"* (`magic_duel`).
- **[Fotografie & Alben] Stativ-Fotostudio, Kulissen & Leinwände (`PhotoStudioSystem.ts`, `PhotoStudioModal.ts`, `Furniture.ts`)**:
  - Neue Studio-Möbel: **Stativ-Studiokamera** (`studio_camera`, § 850) und **Foto-Studioleinwand** (`photo_backdrop`, § 400).
  - Thematische Studio-Shootings (*Familienporträt*, *Haustier-Shooting*, *Romantisches Paarfoto*, *Glamour-Passbild*) mit automatischem Rahmen und Aufhängen an den Hauswänden (`house.wallMountedArt`).
  - SimOS-App *"Fotostudio & Album"* (`photo_studio`) mit digitalem Familienalbum.
- **[Testing & Persistenz] 48 Testsuiten & 109 Tests (100% grün)**:
  - Vollständige Persistenz aller Duell- und Fotostudio-Daten im `SaveManager.ts`.

### Version 23.0.0 (Magical Alchemy Cauldron, Wallpaper Pattern Designer & Pet Nursery Litters)
- **[Magie & Alchemie] Magischer Alchemie-Kessel & Elixiere (`AlchemyBrewingSystem.ts`, `AlchemyModal.ts`, `Furniture.ts`)**:
  - Alchemie-Kessel (`alchemy_cauldron`, § 1.200) und Apothekerschrank (`potion_cabinet`, § 650) zum Brauen von Elixieren aus Botanik-Hybridfrüchten, Honig und Edelmetallen.
  - 4 mächtige Elixiere: *Elixier der ewigen Jugend* (🧪 Vitalitäts-Boost & Verjüngung), *Glückseligkeits-Nektar* (✨ Füllt alle 6 Bedürfnisse sofort auf 100%), *Midas-Goldelixier* (🪙 +§ 2.500 Barauszahlung & Reichtum-Aura), *Amor Liebes-Philter* (💖 +50% Romantik-Erfolgsquote).
  - Trank-Verwaltung & direktes Trinken mit Emote- und Partikel-Animationen.
- **[Architektur & Bauen] Wand-Tapeten & Muster-Designer (`WallPatternModal.ts`, `House.ts`, `IsometricRenderer.ts`)**:
  - SimOS-App *"Wand-Designer"* (`wall_designer`) zum Auswählen und Anwenden von individuellen Wand-Texturen: *Backstein-Mauerwerk* (🧱), *Skandinavische Holzvertäfelung* (🪵), *Vintage Blumen-Tapete* (🌸) und *Carrara Marmor-Fliesen* (🏛️).
  - Integrierter Farbwähler für Grundtönungen mit Batch-Applikation auf alle Wandsegmente des Hauses.
- **[Haustiere & Familie] Haustier-Kinderstube & Welpen-Zucht (`PetNurserySystem.ts`, `PetNurseryModal.ts`, `Furniture.ts`)**:
  - Haustier-Wärmenest (`pet_nursery_nest`, § 450) für Verpaarung kompatibler Haustiere und Trächtigkeit.
  - Geburt von Welpen & Kätzchen mit vererbbaren Fellfarben, Charaktereigenschaften und Zucht-Stammbaum.
  - Automatische Registrierung des Nachwuchses im `PetManager` mit direktem 100% Zuneigungs-Startwert.
- **[Testing & Persistenz] 46 Testsuiten & 106 Tests (100% grün)**:
  - Vollständige Persistenz aller Alchemie- und Haustier-Kinderstube-Daten im `SaveManager.ts`.

### Version 22.0.0 (Botany Greenhouse & Splicing, Guest Invitations & Bank Vault Savings System)
- **[Botanik & Gewächshaus] Seltene Kreuzungen & Bio-Dünger (`BotanyGreenhouseSystem.ts`, `GreenhouseModal.ts`, `GardenSystem.ts`)**:
  - Pflanzen-Veredelung & Pfropfen (*Grafting & Splicing*): Tomaten + Erdbeeren zu exotischer Drachenfrucht (🐉 § 350), Drachenfrucht + Blumen zu legendärem Geldbaum (💸 § 500), Blumen + Erdbeeren zu Edelorchideen (🌺 § 280).
  - Bio-Dünger-Inventar: Kompost (+50% Speed), Fisch-Dünger (+80% Speed & +60% Marktwert) und Kristall-Pulver (Sofort-Wachstum & Doppelertrag).
  - Direktes Säen und Veredeln über die Gewächshaus-Werkbank mit Belohnung von Gärtnern-Skill-XP.
- **[Social & Townies] Freunde-Einladungen & Spontane Nachbarschafts-Besuche (`GuestInvitationSystem.ts`, `GuestInviteModal.ts`, `Game.ts`)**:
  - SimOS-App *"Freunde einladen"* (`invite_guest`): Einladen von bekannten Townies (Mortimer Goth, Bella Goth, Summer Holiday, Bob Pancakes, Travis Scott) mit thematischem Aktivitätsfokus (🍳 *Dinner*, 🎮 *Gaming-Session*, 🏊 *Pool-Party*, ☕ *Kaffeeklatsch*).
  - Eingeladene Gäste spawnen am Hauseingang mit Telefon-Klingeln (`playPhoneRing`), Begrüßungs-Emotes und Boost für Freundschaft & Sozialbedürfnis (+25).
- **[Finanzen & Luxus] Titan Banktresor & Sparkonto-Zinsen (`BankingVaultSystem.ts`, `VaultModal.ts`, `Furniture.ts`, `Game.ts`)**:
  - Neue Luxus-Möbelstücke im Katalog: **Titan Banktresor** (`safe_vault`, § 1.500) und **Gold-Schauvitrine** (`gold_display_case`, § 800).
  - High-Yield Sparkonto mit **5% wöchentlicher Zinsgutschrift** auf eingelagerte Simoleons.
  - Physischer Handel & Einlagerung von 999 Feingoldbarren (🪙 § 1.000) und Brillanten (💎 § 2.500) im Panzertresor.
  - Interaktives "Goldbarren bewundern" (+30 Spaß, Reichtum-Aura).
- **[Testing & Persistenz] 44 Testsuiten & 102 Tests (100% grün)**:
  - Vollständige Persistenz aller Botanik-, Gast- und Banktresor-Daten im `SaveManager.ts`.

### Version 21.0.0 (City Ecosystem & Council, Wall Art Gallery & Create-A-Sim 2.0 Upgrade)
- **[Ökosystem & Stadtverwaltung] Nachbarschafts-Ökologie & Ratsbeschlüsse (`CityEcoSystem.ts`, `CityCouncilModal.ts`)**:
  - 3 individuelle Stadtbezirke (*Willow Creek*, *Oasis Springs*, *Newcrest Heights*) mit dynamischen Kennzahlen für Öko-Fußabdruck (Grün 🌱 vs. Industriell 🏭), Sicherheits-Index (🛡️), Bürger-Zufriedenheit (⭐) und Immobilienwert-Index (§).
  - Wöchentliche Bürgerabstimmungen & aktive Stadtverordnungen (*Ökostrom & Solarförderung*, *Nachbarschafts-Wache*, *Digital- & Startup-Förderprogramm*, *Mittelstands-Steuersenkung*, *Kulturstipendium*).
- **[Wanddekor & Fotostudio] Gerahmte Wandkunst & Inspirierende Wandgalerie (`House.ts`, `IsometricRenderer.ts`)**:
  - Hängende Wandkunstwerke (`wallMountedArt`) mit Holz-/Goldrahmen an Nord- und Westwänden im 2.5D-Isometrie-Renderer.
  - Interaktives "Wandkunst bewundern" im 2.5D World Pie Menü (+25 Spaß, +10 Sozial, Inspirations-Aura).
- **[CAS 2.0] Erweiterter Create-A-Sim Editor (`CASModal.ts`, `Sim.ts`, `IsometricRenderer.ts`)**:
  - Individuelle Simlish-Stimmhöhen-Regulierung (`voicePitch`: 0.7x Tief bis 1.6x Hoch) mit Live-Audio-Testbutton.
  - Modische Accessoires direkt im CAS wählbar: Brillen (👓 Moderne Brille, 🕶️ Piloten-Sonnenbrille, 🥽 Retro-Brille) und Kopfbedeckungen (🧢 Baseball Cap, 🧶 Beanie, 🎩 Fedora, 🎉 Partyhut) mit sichtbarem Rendering auf dem Sim-Kopf.
- **[Testing & Build] 41 Testsuiten mit 94 Tests**:
  - 100% grün durchlaufende Testsuite und verifizierte Save/Load-Persistenz.

### Version 20.0.0 (Interactive 2.5D World Pie Menu, Multi-Sim Group Dynamics & Glass Skylight Architecture)
- **[UI & Interaktion] Kontextuelles 2.5D World Pie Menu (`WorldPieMenu.ts`, `Game.ts`)**:
  - Dynamisches, kreisförmiges Radial-Menü (*Die Sims 4*-Stil), das sich direkt an der 2.5D-Weltkoordinate von angeklickten Möbeln, Sims, NPCs, Haustieren und Gartenbeeten öffnet.
  - Symmetrisch angeordnete Glassmorphismus-Aktions-Slices mit Icons, Need-Vorschau-Badges und Audio-Feedback.
  - Auto-Dismiss bei Klicks außerhalb oder per `Escape`-Taste.
- **[Haushalt & Gruppe] Multi-Sim Gruppen-Aktivitäten & Haushaltsdynamik (`Game.ts`, `Sim.ts`)**:
  - **Familien-Dinner zubereiten** (`group_cooking`): Kochen einer großen Mahlzeit am Herd/Kühlschrank mit Brutzel-SFX; alle hungrigen Haushaltsmitglieder versammeln sich autonom am Esstisch (`+45 Hunger`, `+20 Sozial`, `🍲` / `😋` Emotes).
  - **Gemeinsamer TV- & Filmabend** (`group_tv`): Haushaltsmitglieder setzen sich gemeinsam aufs Sofa (`+35 Spaß`, `+25 Sozial`, `🍿` / `📺` / `😄` Emotes).
  - **Haustier-Radialpflege**: Knuddeln (`+30 Liebe`), Gourmet-Leckerli füttern (`+25 Hunger`), Kunststücke trainieren (`+20 Spiel`), Fell bürsten.
- **[Architektur & Bauen] Glasdach, Skylights & Luxus-Böden (`House.ts`, `IsometricRenderer.ts`)**:
  - Neue Dach-Stile `skylight` und `glass_roof` mit transluzentem Glas-Shader (`rgba(56, 189, 248, 0.35)`), Stahl-Gittersprossen und Lichtdurchlässigkeit.
  - Neue Luxus-Bodentypen `parquet_herringbone` (Fischgrät-Parkett) und `terracotta` (Terracotta-Fliesen).
- **[Testing] 40 Testsuiten & 91 Tests**:
  - Vollständige Vitest-Unit-Tests für `WorldPieMenu.test.ts` und alle Subsysteme.

### Version 19.0.0 (SimOS 15 Pro Hub, Per-Sim Trait Autonomy, Multi-Touch Engine & Web Audio Soundfx)
- **[Feature] SimOS 15 Pro Smartphone Hub (`SmartphoneModal.ts`, `Game.ts`)**:
  - Zentrales smartes Betriebssystem im Glasmorphismus-Design mit 30+ integrierten Apps in 5 übersichtlichen Kategorien (Finanzen & Börse 📈, Reisen & Abenteuer 🌴, Smart Home & Design 🏡, Freizeit & Kultur 🎭, Familie & Gesundheit 🩺).
  - Simstagram-Influencer Feed, Follower-Wachstum & Werbeeinnahmen, LlamaEats Express-Lieferdienst und SMS/Stadtgespräche.
  - Nahtloses Direkt-Öffnen aller Subsysteme aus dem SimOS-App-Grid heraus mit dynamischem Audio-Feedback.
- **[Engine & Autonomie] Multi-Sim Trait-KI & Cooldown-Fix (`SimAutonomy.ts`, `Sim.ts`)**:
  - Unabhängige Cooldown-Timer (`autonomyCooldownSec`) pro Sim im Mehrpersonen-Haushalt, wodurch Multi-Sim Blockaden eliminiert wurden.
  - Merkmal-abhängige Schwellenwerte & Objekt-Präferenzen (z. B. "Faul" legt sich früher aufs Sofa, "Genie" bevorzugt den PC, "Kreativ" die Staffelei, "Vielfraß" den Kühlschrank).
- **[Audio] Prozedurale Möbel- & Interaktions-Synthesizer (`SoundManager.ts`)**:
  - Prozedural synthetisierte Soundeffekte via Web Audio API für Kochen & Brutzeln (`playCookingSizzle`), Wasser & Dusche (`playWaterSplash`), PC-Tippen (`playTypingSound`), Kaminfeuer-Knacken (`playFireplaceCrackling`) und Smartphone-Chimes (`playPhoneRing`).
  - SSR & Vitest geschützte AudioContext-Initialisierung mit Resilienz gegen Browser-Autoplay-Sperren.
- **[Input & Steuerung] Multi-Touch & Mobile Gesten-Engine (`Input.ts`)**:
  - 1-Finger Touch-Drag & Panning mit automatischer Drag-Threshold-Unterscheidung gegen versehentliche Klicks.
  - 2-Finger Pinch-to-Zoom zur stufenlosen Skalierung auf Tablets und Mobilgeräten.
- **[Persistenz & Stabilität] Lückenlose SaveManager-Erweiterung (`SaveManager.ts`, `EconomyMarketSystem.ts`, `SmartGardenSystem.ts`)**:
  - Vollständige Serialisierung & Wiederherstellung von Börsen-Aktienportfolios, Marktpreisen und smarten Garten-Bewässerungszuständen.
- **[Bugfixes] Unit-Test & Berechnungs-Reparaturen**:
  - `NPCManager.ts`: Implementierung von `spawnVisitingNPC(...)` für Besucher & Multiplayer-Gäste.
  - `TerrainElevation.ts`: Vorzeichen-Korrektur in `getYOffset(...)` zur Vermeidung von `-0` Fehlern.
  - 39 Vitest-Testsuiten mit 89 automatisierten Tests laufen zu 100% grün durch.

### Version 18.0.0 (Financial Market, Multiplayer Rooms, Cloud Gallery & Dynamic Environment Scoring)
- **[Feature] Bauernhof & Ranch-Imperium (`FarmSystem.ts`, `RanchModal.ts`)**: Haltung von Nutztieren (Rinder 🐄 für Milch, Schafe 🐑 für Wolle, Llamas 🦙), Feldbau & Ernte (Riesen-Kürbis 🎃, Wassermelone 🍉, Weizen 🌾) und Verkauf auf dem Erzeugermarkt.
- **[Feature] Hollywood Filmstudio & Regie (`FilmStudioSystem.ts`, `DirectorModal.ts`)**: Regieführung von Blockbustern in 4 Genres (Action 💥, Sci-Fi 🚀, Rom-Com 💕, Horror 👻), Einspielen hoher Kinokassen-Gewinne (§) & Gewinn von Starlight Oscar Trophäen 🏆.
- **[Feature] Mega-Yacht & Insel-Kreuzfahrt Flotte (`YachtManager.ts`, `CruiseModal.ts`)**: Kauf luxuriöser Yachten (Sunseeker Express 🚤, Royal Ocean Liner 🛳️, Imperial Sovereign Mega-Yacht ⛵), Ausbau von Helipads, VIP-Casinos & Jacuzzi-Decks sowie Kassieren täglicher Charter-Einnahmen.
- **[Feature] Neue Interaktive Möbel (`Furniture.ts`)**: Ranch Kuh-Stall (`cow_pasture_barn`), Hollywood Kamera-Rig (`movie_camera_rig`), Mega-Yacht Steuerrad (`yacht_helm_wheel`) & Traktor-Werkbank (`tractor_workbench`).

### Version 12.0.0 (Resort Empire, Sci-Fi Inventions, Interior Decorator & Pet Breeding Expansion)
- **[Feature] Resort-Imperium & Insel-Hotels (`ResortManager.ts`, `ResortModal.ts`)**: Erwerb & Führung luxuriöser Insel-Resorts (Sunbreeze Resort, Coral Reef Hotel, Alpine Spa), Ausbau von Amenities (Pool-Bar, Spa, Feuer-Show), Zimmerpreis-Steuerung & tägliche Gewinnauszahlung (§).
- **[Feature] Sci-Fi Labor & Erfinder-Werkbank (`InventionSystem.ts`, `ScienceLabModal.ts`)**: Tüfteln an Hightech-Erfindungen (Hoverboard Pro 🛹, Sim-Ray 🔫, Wetter-Manipulator 🌩️, Klon-Kapsel 🧬) & Brauen wirkungsvoller Chemieserume (Instant-Energie, Midas-Gold, Verjüngung).
- **[Feature] Raumausstatter & Designer-Karriere (`InteriorDecoratorSystem.ts`, `DecoratorModal.ts`)**: Raumausstatter-Aufträge für NPC-Nachbarn annehmen, Kundenwünsche (Stil, Farbe, Budget) berücksichtigen, Umgestaltungen präsentieren & Star-Bewertungen erhalten.
- **[Feature] Tierheim & Haustier-Zucht (`PetBreedingSystem.ts`, `PetShelterModal.ts`)**: Veranlassen von Haustier-Zucht im Haushalt, Vererbung genetischer Fellmerkmale & Rassen, Pflege von Tierbabys im Welpen- & Kätzchen-Nest sowie Tierheim-Adoptionen.
- **[Feature] Neue Interaktive Möbel (`Furniture.ts`)**: Sci-Fi Erfinder-Werkbank (`invention_workbench`), Welpen- & Kätzchen-Nest (`pet_nursery_bed`), Resort Empfangs-Tresen (`resort_reception`) & Architekten Zeichentisch (`decorator_drafting_table`).

### Version 17.0.0 (Equestrian Center, Scuba Diving, Penthouse Living & Private Chef Expansion)
- **[Feature] Reitsportzentrum & Pferdeturniere (`EquestrianManager.ts`, `EquestrianModal.ts`)**: Eigene edle Pferde pflegen, Tempo- & Sprungtraining absolvieren und an Meisterschafts-Turnieren um Goldmedaillen & Preisgelder (§ 2.500+) teilnehmen.
- **[Feature] Tiefsee-Tauchen & Meeres-Schätze (`ScubaDivingSystem.ts`, `ScubaModal.ts`)**: Tauchgänge auf den Meeresgrund wagen, schillernde Riesenperlen, Tiefseekorallen und versunkene Piraten-Goldtruhen bergen.
- **[Feature] Luxus-Penthouses & High-Rise Living (`PenthouseManager.ts`, `PenthouseModal.ts`)**: Wolkenkratzer-Penthouses ersteigern (Skyline Tower, Starlight Crown Suite) und wöchentliche Luxus-Mietdividenden (§ 2.200 - § 3.800) kassieren.
- **[Feature] Privatkoch & VIP-Catering Business (`PrivateChefManager.ts`, `PrivateChefModal.ts`)**: Exklusive Gourmet-Aufträge für Schloss-Hochzeiten und VIP-Filmgala-Buffets annehmen, 5-Sterne-Menüs zaubern & Starkoch-Honorare kassieren.

### Version 16.0.0 (World Vacations, Magic Familiars, Detective Career & Smart Garden Expansion)
- **[Feature] Weltreisen, Flughafen & Traumurlaube (`TravelManager.ts`, `TravelModal.ts`)**: Flugbuchungen zu weltberühmten Ferienzielen (Sulani Tropeninsel 🏝️, Mt. Komorebi Ski & Onsen 🏔️, Oasis Springs 🏜️), 100% Bedürfnis-Revitalisierung, Souvenirs & Tiefenentspannungs-Moodlet.
- **[Feature] Magische Zauber-Vertraute (`FamiliarManager.ts`, `MagicModal.ts`)**: Beschwörung magischer Schutzgeister & Begleiter (Schnee-Eule 🦉, Glühender Phönix 🐦‍🔥, Sternen-Katze 🐱, Mini-Glutdrache 🐉) für permanente passive Mana-Regeneration.
- **[Feature] Detektiv-Karriere & Kriminalfälle (`DetectiveManager.ts`, `DetectiveModal.ts`)**: Tatorte untersuchen 🔍, Fingerabdrücke sichern, Beweise sammeln, Verdächtige verhaften & Fangprämien (§ 1.200+) kassieren.
- **[Feature] Smarte Rasensprenger & Garten-Automatisierung (`SmartGardenSystem.ts`, `BuildBuyCatalog.ts`)**: Automatische Bewässerungsanlage für den Garten (§ 450), die vertrocknete Beete automatisch auf 100% Feuchtigkeit hält.

### Version 15.0.0 (Theme Park, Space Exploration, Rockstar Band & Inheritance Expansion)
- **[Feature] Freizeitpark & Jahrmarkt (`ThemeParkManager.ts`, `ThemeParkModal.ts`)**: Besuch spektakulärer Fahrgeschäfte (Riesenrad 🎡, Looping-Achterbahn 🎢, Autoscooter 🏎️, Geisterbahn 👻, Zuckerwatte-Stand 🍭) mit Adrenalin-Moodlets & Spaß-Boosts.
- **[Feature] Weltraum-Erkundung & Raketenbau (`SpaceManager.ts`, `SpaceModal.ts`)**: Raketenstufen schrittweise montieren (0-100%), Weltraummissionen starten (Erd-Orbit 🛰️, Mond-Landung 🌕, Alien-Tiefenraum 👽) & kosmische Artefakte sammeln.
- **[Feature] Band-Gründung & Live-Konzerte (`BandManager.ts`, `BandModal.ts`)**: Bandmitglieder verwalten (Gitarre, Drums, Bass, Gesang), Proben abhalten, Fanbase aufbauen, ausverkaufte Gigs spielen & Chart-Alben veröffentlichen (💿).
- **[Feature] Generationen-Erbe & Testament (`InheritanceManager.ts`, `InheritanceModal.ts`)**: Notariell beglaubigtes Testament für Haupterben aufsetzen, Familienmotto festlegen, Prestige steigern & Generationen-Auszahlungen (§ 5.000+) erhalten.

### Version 14.0.0 (City Politics, Archaeology, Potion Cauldron & School Expansion)
- **[Feature] Bürgermeister-Wahl & Rathaus-Verordnungen (`PoliticsManager.ts`, `PoliticsModal.ts`)**: Kandidatur für das Bürgermeisteramt (5 politische Ränge), Halten mitreißender Wahlkampfreden (📢), Steigerung der Wählerzustimmung & Erlass von Stadtverordnungen (Öko-Förderung 🌱, Nachtruhe 🌙, Kunst-Förderung 🎨, Steuersenkung 🪙).
- **[Feature] Archäologie & Relikte-Ausgrabung (`ArchaeologySystem.ts`, `ArchaeologyModal.ts`)**: Graben im Erdreich nach antiken Fossilien, Tonamphoren, Kristallschädeln und der legendären Goldenen Lama-Statue (🦙, § 1.800).
- **[Feature] Zaubertrank-Kessel & Alchemie (`MagicSystem.ts`, `MagicModal.ts`)**: Kessel-Brausystem für Zaubertränke wie das *Elixier der ewigen Jugend* (🧪, 100% Bedürfnis-Refill) und *Amors Liebeszauber-Trank* (💖, kokettes Moodlet).
- **[Feature] Schule, Hausaufgaben & Noten-Zeugnisse (`SchoolSystem.ts`, `SchoolModal.ts`)**: Hausaufgabenheft am Schreibtisch lösen, Notendurchschnitt verbessern (1.0 bis 5.0), Schultag absolvieren & Ehren-Stipendien (§ 250) erhalten.

### Version 13.0.0 (Seasons Festivals, Veterinary Clinic, Roof Architecture & Disco Lighting Expansion)
- **[Feature] Saisonale Feste & Marktstände (`FestivalManager.ts`, `FestivalModal.ts`)**: 4 saisonale Feste (🌸 Frühlingsblüten-Fest mit Ostereiersuche, ☀️ Sommer-Beachparty mit Wasserballon-Schlachten, 🎃 Herbst-Kürbisfest mit Kürbisschnitzen, ❄️ Winter-Wunderland mit Schneemannbauen & Eislaufen) samt exklusiven Belohnungen & Moodlets.
- **[Feature] Tierklinik & Haustier-Gesundheit (`VetClinicManager.ts`, `VetClinicModal.ts`)**: Diagnose & Heilung von Haustier-Leiden (Flöhe 🪲, Schnupfennase 🤧, Haarballen 🐱, Pfotenverletzung 🐾), Durchführung von Anti-Floh-Spezialbädern & Tierarzt-Behandlungen.
- **[Feature] Dächer, Fassaden-Design & Party-Disco-Shader (`House.ts`, `BuildBuyCatalog.ts`, `IsometricRenderer.ts`)**: Konfigurierbare Dach-Formen (Giebeldach, Walmdach, Flachdach) mit 3D-Dachfirst-Rendering, Außenfassaden-Muster (§ 300) und dynamische RGB-Discolicht-Shader bei eingeschalteter HiFi-Anlage.

### Version 12.0.0 (Live Community Lots, Health & Wellness, Emergency Responders & Medical System)
- **[Feature] Aktive Gemeinschaftsgrundstücke (`WorldMap.ts`, `WorldMapModal.ts`)**: Nahtloses Reisen auf voll bespielbare Live-Venues (Fit & Flex Gym 🏋️, La Bella Sim Restaurant 🍽️, Club Velvet Lounge 🍸, Plumbob Park 🌳, Café Simlish ☕) mit spawnden Nachbarn & spezifischen Interaktions-Objekten.
- **[Feature] Gesundheit, Krankheiten & Wellness (`HealthSystem.ts`, `HealthModal.ts`)**: 4 Krankheiten (Erkältung 🤧, Grippe 🤒, Stress-Burnout 🤯, Pollen-Allergie 🌸) mit Symptomen, Bio-Kräutertee brauen 🍵 und Arzt-Hausbesuchen 🚑.
- **[Feature] Live-Einsatzkräfte & Notfall-Visualisierung (`IsometricRenderer.ts`, `EventSystem.ts`)**: Animierte Flammen-Partikel bei Bränden sowie sichtbare Einsatzkräfte (Feuerwehr 🚒 & Polizei 🚓) auf dem Grundstück.

### Version 11.0.0 (Fame, Occult & Restaurant Empire Expansion)
- **[Feature] Ruhm & Promi-Status (`FameSystem.ts`, `FameModal.ts`)**: Star-Reputation (1-5 Sterne ⭐️), Fame XP, Autogrammstunden für Fans & Paparazzi-Fotoshootings.
- **[Feature] Okkulte Lebensformen & Zauberkraft (`OccultSystem.ts`, `OccultModal.ts`)**: Verwandlung in Vampir 🦇, Werwolf 🐺 oder Alien 👽 mit Dunkler Form & okkulten Buffs.
- **[Feature] Highschool & Prom-Event (`HighSchoolSystem.ts`, `PromModal.ts`)**: Abschluss-Prüfungen ablegen, Notendurchschnitt verbessern & Abschlussball-König(in) 👑 werden.
- **[Feature] Gourmet-Restaurant Management (`RestaurantSystem.ts`, `RestaurantModal.ts`)**: Kauf eigener Restaurants (§ 12.000), Speisekarten-Gestaltung & Kassieren täglicher Restaurant-Gewinne.

### Version 10.0.0 (Event-Bus Architecture, Dynamic Conversations, Room-Building & Testing Suite)
- **[Feature] Visual Conversation Bubbles & Couple Interactions (`IsometricRenderer.ts`, `SocialWheel.ts`, `Sim.ts`)**: Dynamische Sprechblasen mit Piktogrammen über den Köpfen sprechender Sims, neue Sozialaktionen (Paartanz 💃, Schultermassage 💆, Geschenke überreichen 🎁, tiefgründige Gespräche 💭).
- **[Feature] Quick Room-Draw Tool & 3D Staircase Step-Rendering (`House.ts`, `BuildBuyCatalog.ts`, `IsometricRenderer.ts`)**: 2-Klick-Raumerstellung (Wände + Böden per Mausklick über 2 Diagonalpunkte) & verfeinertes 3D-Stufenrendering für Treppen auf 4 Etagen samt Möbelrotation (0°/90°/180°/270°).
- **[Architektur] Global Event-Bus & Message Broker (`EventBus.ts`)**: Vollständig typisiertes Publish-Subscribe-System zur Entkopplung von Gameplay-Systemen und Entitäten.
- **[Testing] Automated Vitest Suite (`npm test`, `*.test.ts`)**: Automatisierte Unit- und Integrationstests für Hausbau, Möbelrotation, Sim-Lebenszyklus, Emotes und EventBus.

### Version 9.5.0 (Resort, Farm & Science Lab Expansion)
- **[Feature] Trait-Quests & Chronik-Tagebuch (`TraitQuestSystem.ts`, `LifeJournalModal.ts`)**: Merkmals-spezifische Quests & illustriertes Lebens-Tagebuch.
- **[Feature] Notfall-Einsatzkräfte (`EmergencyRescueModal.ts`)**: Interaktive Brand-Bekämpfung & Einbrecher-Stellen für Helden-Medaillen & Simoleon-Boni.

### Version 9.0.0 (Smartphone, Simstagram, Pet Tricks & Public Lots Expansion)
- **[Feature] Smartphone & LlamaEats (`SmartphoneModal.ts`, `DeliverySystem.ts`)**: SimPhone 15 Pro mit Simstagram (Posten, Follower, Werbeeinnahmen) & LlamaEats Lieferservice (Pizza, Sushi, Burger, Bubble Tea).
- **[Feature] Pet-Tricks & Agility Shows (`Pet.ts`, `PetCompetitionModal.ts`)**: Kunststücke-Training (Stufe 1-5) & Teilnahme an Agility Shows für Goldpokale & Preisgelder.
- **[Feature] Public-Lot Activities (`PublicLotMinigamesModal.ts`)**: Laufband-Challenge im Gym, DJ-Beatmixing im VIP Club Velvet & Schnell-Recherche in der Bibliothek.

### Version 8.0.0 (Ultimate Life & Emotions Expansion)
- **[Feature] Moodlet- & Buff-Engine (`Moodlets.ts`, `Moods.ts`, `HUD.ts`)**: Zeitbasierte emotionale Buffs mit Live-Countdown & HUD-Badge Anzeige.
- **[Feature] Sims-Cheat-Konsole (`CheatConsoleModal.ts`)**: Retro-Konsole via `Strg + Umschalt + C` oder HUD-Button (`motherlode`, `kaching`, `fillmotive`, `bb.moveobjects`, `fps`, `help`).
- **[Feature] Shift Mini-Game (`CareerMiniGameModal.ts`)**: Timing-Mini-Spiel zur Beschleunigung von Beförderungen & Simoleon-Prämien.
- **[Feature] Canvas Shader Upgrades (`IsometricRenderer.ts`, `WeatherSystem.ts`)**: Sonnenstrahlen (God Rays) bei Tageslicht & Regenpfützen.
- **[Feature] Action Queue QoL & Auto-Zeitraffer (`HUD.ts`, `Game.ts`)**: Einzel-Abbruch per `✕` in der Aktionsschlange & automatischer 3x Zeitraffer bei Schlaf.

### Version 7.0.0 (Genetics, Whims, Recipe Book, Multi-Save & Build Undo Expansion)
- **[Feature] Genetik & Vererbung (`Genetics.ts`)**: Prozedurales Blending von Hautton, Haarfarbe, Outfit & Vererbung von Charaktermerkmalen für Kinder.
- **[Feature] Wünsche & Ängste System (`WhimSystem.ts`, `WhimPanel.ts`)**: Dynamisches Wünsche-Panel im HUD mit 3 aktiven Wünschen, Ängsten & Belohnungspunkten (💎).
- **[Feature] Rezeptbuch & Gourmet-Kochen (`CookingSystem.ts`, `RecipeModal.ts`)**: 8 freischaltbare Gerichte mit Garten-Zutaten-Rabatt (-50%) für Einzel- & Familienmahlzeiten.
- **[Feature] Öffentliche Ausflugs-Lots (`CommunityLotManager.ts`)**: Fit & Flex Studio, Sunset Lounge & Bar, Plumbob Zentralpark & Willow Creek Bibliothek.
- **[Feature] Dynamische Nachtlicht-Shaders (`IsometricRenderer.ts`)**: Radiale Lichtquellen bei Nacht für Lampen, TV, Stereoanlagen & Kamine.
- **[Feature] Requisiten & Hand-Props (`IsometricRenderer.ts`)**: Visuelle Gegenstände in den Händen der Sims bei Interaktionen (☕ Kaffeetasse, 🎨 Pinsel, 📖 Buch, 🍳 Pfanne, 🎸 Gitarre, 🪄 Zauberstab).
- **[Feature] Prozedurale Ambient Soundscapes (`AmbientAudio.ts`)**: Web Audio API Soundscapes (Vogelgezwitscher, Grillenzirpen, Regengeplätscher & Gewitter).
- **[Feature] Multi-Save-Slot & JSON Export/Import (`SaveSlotModal.ts`)**: 3 Speicherplätze & Export/Import von Spielständen als `.json`-Datei.
- **[Feature] Undo / Redo im Baumodus (`BuildHistory.ts`)**: Strg+Z & Strg+Y für rückgängig machen & wiederholen von Bauaktionen.
- **[Feature] PWA & Offline Support (`manifest.json`, `sw.js`)**: Progressive Web App Konfiguration & Offline-Service-Worker.
- **[Feature] Barrierefreiheits-Overlay (`HelpModal.ts`)**: WCAG Tastatur-Steuerungsübersicht erreichbar mit `?` oder `F1`.

### Version 6.0.0 (Weddings, Hobbies, Disasters & Thought FX Expansion)
- **[Feature] Hochzeit & Verlobung (`WeddingSystem.ts`, `WeddingModal.ts`)**: Antrag machen mit Verlobungsring (💍 § 500), Platzieren des Blumen-Hochzeitsbogens (`wedding_arch`) & unvergessliche Ja-Wort Zeremonie.
- **[Feature] Hobbys, Handwerken & Freelance-Karrieren (`HobbySystem.ts`, `HobbyModal.ts`)**: Akustik-Gitarre (`guitar_acoustic`), Großmeister Schach-Tisch (`chess_table`), Handwerker-Werkbank (`wood_bench`) & Ausführen von Freelance-Aufträgen.
- **[Feature] Notfälle, Schicksal & Geister-Spuk (`EventSystem.ts`, `EventModal.ts`)**: Küchenbrände (🔥), Einbrecher (🥷) & Geister-Spuk um Grabsteine (`gravestone`). Notfall-Eingreifen & Polizei-Belohnungen.
- **[Feature] Gedankenblasen & Emote FX Engine (`ThoughtBubbleSystem.ts`, `IsometricRenderer.ts`)**: Dynamische Gedankenblasen (🍕 Hunger, 💤 Energie, 🎮 Spaß, 🪙 Simoleons, 💖 Romantik) über den Köpfen der Sims.

### Version 20.0.0 (Procedural Pose Renderer, Community Cloud Hub, Multi-Gen Genetics & Dynamic Market Economy)
- **[Grafik & Animation] Prozeduraler Skelett- & Posen-Renderer (`IsometricRenderer.ts`)**:
  - Dynamische Schrittzyklen mit schwingenden Armen und Beinen beim Laufen (`animState === 'walking'`).
  - 4-Richtungs-Blickwinkel (`facing: south / north / east / west`) mit Augen- und Haar-Rundung.
  - Kontextsensitive Posen: Sitzen auf Stühlen/Sofas (abgewinkelte Knie), Liegen im Bett (horizontale Drehung mit Bettdecken-Overlay `Zzz`), und konzentrische Wasserwellen beim Schwimmen im Pool.
- **[Community] Cloud-Galerie & Lot-Showcase Hub (`CloudGallerySystem.ts`, `CloudGalleryModal.ts`)**:
  - Galerie-Browser mit kuratierten Luxus-Villen (Villa Bella Vista, Landhaus) und legendären Familien (Goth-Dynastie).
  - Like-System (❤️ Upvotes), Download-Zähler und 1-Klick-Direktplatzierung auf dem Grundstück.
- **[Genetik] Multi-Generations-Vererbung & Stammbaum-Allele (`Genetics.ts`)**:
  - Mendel'sche Genetik mit dominanten und rezessiven Allelen für Haarfarben (Schwarz/Braun dominant, Blond/Rot rezessiv) und Augenfarben (Braun dominant, Blau/Grün rezessiv).
  - Generationen-Zähler (Gen 1 bis Gen 5+) und Vorfahren-Aufzeichnung.
- **[Wirtschaft] Dynamische Warenbörse & Aktien-Investments (`EconomyMarketSystem.ts`, `MarketModal.ts`)**:
  - Täglich schwankende Marktpreise für Gartenbau-Ernte, Honig, Gemälde und Tränke mit Nachfrage-Indizes (Hoch, Normal, Niedrig).
  - SimCity Aktienmarkt (LlamaTech AI `LLMA`, Plumbob Green Energy `PGRN`, Goth Real Estate `GOTH`) mit Kauf/Verkauf von Anteilen und wöchentlichen Dividenden-Auszahlungen an jedem 7. Tag!

### Version 19.0.0 (Pro-Engine, GOAP Autonomy, Dynamic Lighting, CC Modding & PWA Offline Upgrade)
- **[Architektur & UI-Framework] BaseModal & ModalManager (`BaseModal.ts`, `ModalManager.ts`)**:
  - Standardisiertes Lifecycle-Management (`renderHTML()`, `onMount()`, `onDestroy()`, `listen()`) mit automatischer Entsorgung von Event-Listenern gegen Memory-Leaks.
  - Zentraler `ModalManager` für ESC-Steuerung, Dialog-Stacking und Tastatur-Fokustrapping.
- **[Grafik & Canvas-Engine] Dynamische Point-Lights & Occlusion Culling (`IsometricRenderer.ts`)**:
  - Echte 2.5D Punktlicht-Kegel und Glow-Halos für platzierte Lampen, Kamine, Fernseher und Computer bei Nacht & im Keller mit `globalCompositeOperation = 'screen'`.
  - Intelligentes **Wall Occlusion Culling**: Wände werden automatisch transparent (Alpha 0.32), wenn ein Sim oder der Mauszeiger sich dahinter befindet.
  - Animierte Möbel-Partikel: Kaminfeuer 🔥, Herd-/Kaffee-Dampf ♨️ und schwebende Musiknoten 🎵.
- **[Gameplay & KI] GOAP-Autonomie & Raum-Atmosphäre (`GOAPAutonomy.ts`, `EnvironmentScoring.ts`)**:
  - Goal-Oriented Action Planning (GOAP) für mehrstufige Aktionsketten (*Hunger* -> Kühlschrank -> Zubereitung -> Tisch -> Essen).
  - NPC Townie Tagesabläufe (Morgen-Fitness 🏃, Büro/Uni 💼, Abend-Socializing 🎉, Schlafen 💤).
  - Dynamische Raum-Bewertung (*Environment Scoring*): Marmorböden, Pflanzen und Luxusmöbel vergeben Stimmungs-Moodlets wie *💎 Luxuriöse Umgebung (+2 Glücklich)*.
- **[Audio] Oberflächen-Trittschall & Stimm-Profile (`SoundManager.ts`)**:
  - Prozeduraler Schritt-Synthesizer mit differenzierten Tönen für Holz, Fliesen, Marmor, Teppich, Gras und Wasser.
  - Alters- und emotionsabhängige Simlish-Sprachmodulation (Babys, Kinder, Erwachsene, Senioren).
- **[Modding & Blueprints] Custom Content (CC) & Bauplan-Export (`ModdingSystem.ts`, `BlueprintSystem.ts`, `ModdingModal.ts`)**:
  - JSON-Mod-Schnittstelle zur Installation externer Möbelpakete und Karrieren.
  - 1-Klick-Export und -Import von Haus-Bauplänen inklusive Wänden, Böden und Möbeln als JSON-Text/Zwischenablage.
- **[PWA & Offline-Support] Service Worker & Web App Manifest (`manifest.json`, `sw.js`)**:
  - Offline-Cache aller Assets und vollständige Installierbarkeit als eigenständige Desktop-/Mobile-App.
- **[Feature] Schule & Universitäts-System (`EducationSystem.ts`, `EducationModal.ts`)**: Schulnoten-Verwaltung (1.0 bis 6.0), Hausaufgaben machen sowie Einschreiben in Studiengänge (Informatik, Gourmet-Kochkunst, Bildende Kunst) mit Karrierestufe-3-Bonus.
- **[Feature] Vermietung & Mitbewohner (`RentersSystem.ts`, `RentersModal.ts`)**: Vermietung von Räumen/Etagen an NPC-Untermieter (Mortimer Goth, Summer Holiday), wöchentliche Mieteinnahmen & Mieter-Kündigung.
- **[Feature] Charakter-Merkmale & Persönlichkeit (`TraitSystem.ts`)**: 10 Merkmale (Genial, Romantisch, Aktiv, Partylöwe, Kreativ, Perfektionist, Chaot, Einsamer Wolf, Tech-Geek, Tierliebhaber) mit Auswirkungen auf Bedürfnissenkung & Skill-Geschwindigkeiten.
- **[Feature] Lebenschronik & Erinnerungslog (`MemorySystem.ts`, `MemoryModal.ts`)**: Automatische Erfassung von Lebens-Meilensteinen (Erster Einzug, Uni-Abschluss, Hochzeit, Job-Beförderung) & in Erinnerungen schwelgen für Stimmungsboni.
- **[Feature] Architekt Blaupausen-Räume (`BlueprintSystem.ts`, `BuildBuyCatalog.ts`)**: 1-Klick-Platzierung vorgefertigter Zimmer-Templates (Starter-Schlafzimmer, Wellness-Badezimmer, High-Tech Büro) im Baumodus.
- **[Feature] Kleiderschrank & Outfits (`WardrobeSystem.ts`, `WardrobeModal.ts`)**: 5 Outfit-Kategorien (Alltag, Abendgarderobe, Schlafanzug, Party, Swimwear) mit instant visuellem Canvas-Kleidungs-Farbwechsel.
- **[Feature] Sims Galerie & Import/Export (`GallerySystem.ts`, `GalleryModal.ts`)**: Exportieren und Importieren von Häusern und Haushalten als kompakte Base64-Codes zum einfachen Teilen mit Freunden.
- **[Feature] Viehzucht & Bauernhof-Erweiterung (`Furniture.ts`, `Game.ts`)**: Hühnerstall (`chicken_coop`) zum Eier einsammeln (🥚) & Bio-Bienenstock (`beehive`) zur Honigernte (🍯).

### Version 4.0.0 (Vehicles, Retail Store & Smartphone Camera Upgrade)
- **[Feature] Fahrzeuge, Garagen & Spritzfahrten (`VehicleSystem.ts`, `VehicleModal.ts`)**: Fuhrpark mit Fahrrädern 🚲, E-Rollern 🛵, Familienkombis 🚗 & Supersportwagen 🏎️ für Ausflüge & Spritzfahrten mit Spaß- & Komfort-Bonus.
- **[Feature] Eigenes Geschäft & Laden-Management (`BusinessSystem.ts`, `BusinessModal.ts`)**: Eröffnung eigener Bäckereien 🥐, Kunstgalerien 🎨 oder Pet-Shops 🐕 mit Preisaufschlag-Margen (Fair, Premium, Luxus) & Tagesgewinn-Auszahlung.
- **[Feature] Smartphone-Kamera & Erinnerungs-Tagebuch (`PhotoSystem.ts`, `PhotoModal.ts`)**: Knipsen von Schnappschuss-Fotos 📱 für gerahmte Wandbilder im Inventar & automatisches Führen einer Meilenstein-Lebenschronik.

### Version 3.5.0 (Calendar, Bills & Magic Supernatural Upgrade)
- **[Feature] Feiertage, Kalender & Saisonale Events (`CalendarSystem.ts`, `CalendarModal.ts`)**: 4 Jahreszeiten-Feiertage (Winterfest ❄️, Tag der Liebe 💘, Sommerfest ☀️, Gruselnacht 🎃) mit Traditionen-Checklisten & Simoleon-Belohnungen.
- **[Feature] Rechnungen, Solarenergie & Stromkonto (`BillsSystem.ts`, `BillsModal.ts`)**: Wöchentliche Nebenkosten-Abrechnung mit Grundsteuer, Möbelsteuer, Rabatten für Solarpanels & Windräder sowie Stromsperren-Warnungen bei Nichtzahlung.
- **[Feature] Magie, Zauberei & Alchemie (`MagicSystem.ts`, `MagicModal.ts`)**: Zauberbuch mit Magie-Level 1-5, Mana-Auffüllung, Zaubersprüchen (Blitzsauber 🧹, Gourmet-Food 🍕, Midas-Glanz 🪙, Glitzer-Segen 🔮).
- **[Feature] Neue Eco- & Magie-Objekte (`Furniture.ts`)**: Solarpanels (`solar_panel`), Windräder (`wind_turbine`), Zauberkessel (`magic_cauldron`), Zauberbuch-Pult (`spell_book`).

### Version 3.0.0 (Aspirations, World Map & Multi-Floor Upgrade)
- **[Feature] Bestrebungen, Meilensteine & Belohnungs-Shop (`AspirationSystem.ts`, `AspirationModal.ts`)**: 6 Lebensziele (Meisterkoch, Party-Löwe, Computer-Genie, Reich & Berühmt, Pflanzendoktor, Tierfreund) mit 4 Etappen-Meilensteinen & Punkte-Shop für Elixiere & Tränke.
- **[Feature] Nachbarschafts-Karte & Ausflüge (`WorldMap.ts`, `WorldMapModal.ts`)**: Interaktive Stadtkarte zum Reisen zwischen Wohngrundstück, VIP Club Velvet (DJ-Pult & Bar), Plumbob Fitnesspark & Café Simlish.
- **[Feature] Mehrstöckiges Bauen & Keller (`House.ts`, `IsometricRenderer.ts`)**: Bauen & Gestalten auf 4 Etagen (-1 Keller, 0 EG, 1. OG, 2. OG) mit platzierten Holz- & Glas-Treppen und Etagen-Umschalter im HUD.
- **[Feature] Neue Möbel & Katalog-Items (`Furniture.ts`)**: Treppen (`stairs_wood`, `stairs_modern`), DJ-Pult (`dj_booth`), Bar (`bar_counter`), Laufband (`treadmill`) & Espresso-Bar (`coffee_bar`).

### Version 2.5.0 (Pets & Household Multi-Sim Expansion Upgrade)
- **[Feature] Pets & Haustier-System**: Hunde 🐕 & Katzen 🐈 als Haushaltsmitglieder mit eigenen Bedürfnissen (Hunger 🦴, Zuneigung ❤️, Energie 💤, Spieltrieb 🎾).
- **[Feature] Pet-Möbel & Katalog**: Haustierbett (`pet_bed`), Futternapf (`pet_bowl`), Kratzbaum (`cat_tree`) und Spielzeugkiste (`pet_toy`).
- **[Feature] Pet-Interaktionen & Autonomie**: Füttern, Streicheln, Stöckchen werfen & Kunststücke beibringen. Freie Pet-KI (`PetAutonomy.ts`) sucht Napf & Bett selbstständig.
- **[Feature] Mehrpersonen-Haushalt (`Household.ts`)**: Steuerung mehrerer Familienmitglieder im selben Haushalt mit unabhängigen Bedürfnissen, Inventaren & Skills.
- **[Feature] Sim-Avatar Switcher Bar**: Interaktive Sim-Porträtleiste unten links im HUD zum nahtlosen Wechseln des aktiven Sims per Klick oder `Tab`.
- **[Feature] Haushalts-Erweiterung (`+ Sim` & `+ Pet`)**: Buttons zum Erstellen neuer Haushaltsmitglieder oder Adoptieren neuer Pets direkt im laufenden Spiel.
- **[Feature] Vollständige Persistenz**: Automatische Speicherung aller Haushalts-Sims und Pets inklusive Bedürfnissen im `SaveManager.ts`.

### Version 2.0.0 (Sims 5 Gameplay & World Expansion Upgrade)
- **[Feature] Sim-Autonomie & KI-Selbstständigkeit**: Untätige Sims suchen sich bei sinkenden Bedürfnissen selbstständig Möbel im Haus (Schlafen, Essen, Sanitär, Unterhaltung).
- **[Feature] Möbel-Interaktions-Modal**: Auswahl-Modal beim Klick auf Möbelstücke für spezifische Interaktionen (Bett: Schlafen/Nickerchen, PC: Programmieren/Zocken, Kühlschrank: Snack/Gourmet).
- **[Feature] Sim-Inventar & Staffelei-Gemälde**: Inventar-Panel (🎒) zum Aufbewahren & Verkaufen von gemalten Bildern, Ernteerträgen und Trophäen für Simoleons (§).
- **[Feature] Möbel Drehen, Verschieben & Verkaufen**: Werkzeuge im Baumodus zum Rotieren (0°/90°/180°/270°), Umstellen oder Verkaufen (80% Simoleon-Rückerstattung).
- **[Feature] Wand-Ausblendungs-Modus (Cutaway)**: Umschalter (`🧱 Wände`) für Vollwand, Cutaway (abgesenkte Vorderwände) und Wände ausblenden.
- **[Feature] Wetter- & Jahreszeiten-System**: Dynamisches Wetter (☀️ Sonnig, 🌧️ Regen, ❄️ Schnee, ⛈️ Gewitter) mit 60 FPS Canvas-Partikeleffekten & Umweltlicht.
- **[Feature] Gartenbau-System**: Beete platzieren, Samen säen (Tomaten, Erdbeeren, Blumen), gießen, ernten & Produkte verkaufen oder nutzen.
- **[Feature] Prozedurales Ambient-Audio & Sound-Modal**: Vogelgezwitscher, Regenprasseln, Lautstärkeregler für Master, SFX & Radio in neuem Audio-Modal (🔊).
- **[Feature] Toast-Benachrichtigungssystem**: Animierte Benachrichtigungskarten oben rechts für Ereignisse, Level-Ups, Quests & Bedürfnis-Warnungen.

### Version 1.5.0 (Sims Mobile Party & Event Engine Upgrade)
- **[Feature] Hauspartys & Events**: 3 Party-Typen (Einweihungsparty, Sommer-Poolparty, Geburtstags-Gala) mit Ansturm von Party-Gästen.
- **[Feature] Live 5-Sterne-Wertung**: Live-Punkteberechnung (1-5 ⭐) durch Absolvieren dynamischer Party-Ziele.
- **[Feature] Gourmet Party-Buffet**: Neues Möbelstück `party_buffet` zum Servieren von Party-Snacks.
- **[Feature] Trophäen & Prämien**: Freischaltbare Gold- & Silber-Party-Trophäen sowie bis zu § 2.200 Simoleon-Gewinn.
- **[Feature] Party Modal & HUD Button**: Neuer Dialog zur Ausrichtung von Events & Trophäen-Inspektion.

