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
- **Interaktive 2.5D Welt**: Bewege deinen Sim frei im Haus, benutze Möbel (Bett, Dusche, Kühlschrank, PC, Staffelei, Sofa, Smart-TV).
- **Architekt & Baumodus**: Baue individuelle 3D-Wände, setze Türen & Fenster ein, verlege Parkett, Marmor oder Teppich und hebe kühle Swimmingpools aus!
- **NPC-Nachbarn & Beziehungs-System**: Interagiere mit Nachbarn (Mortimer Goth, Penny Pizazz, Bob Pancakes, Eliza Pancakes) über das **Sims 4 Pie-Dialograd** und baue Freundschaften oder Romantik auf.
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

- 🧱 **Erweiterter Baumodus & Raum-Editor**: 5 Architektur-Tabs (Möbel, Wände, Türen/Fenster, Bodenbeläge, Pool & Outdoor).
- 🏊 **Swimmingpool & Schwimm-System**: Ausheben von Swimmingpools mit transparent animierter Wasser-Textur & Schwimm-Interaktion zur Steigerung des Fitness-Skills.
- 💬 **Sims 4 Pie-Dialograd & Emote-Bubbles**: Interaktions-Rad mit Kategorien (Freundlich, Lustig, Romantisch, Gemein). Animierte Sprechblasen (❤️, 😀, 💬, 💔, 😡) schweben bei Gesprächen über den Sims.
- 💕 **Beziehungs-Engine**: Freundschafts- (0-100%) und Romantikbalken (0-100%) mit dynamischen Beziehungs-Titeln ("Bekannter", "Guter Freund", "Schwarm", "Partner", "Erzfeind").
- 🟢 **Symbolisches Plumbob-System**: Der schwebende Plumbob-Kristall über dem Sim reagiert dynamisch mit leuchtenden Farben auf die aktuelle Stimmung.
- 🗣️ **Simlish Vocal Synthesizer**: Prozedural generierte Stimmen (Simlish) und Soundeffekte via Web Audio API ohne externe Sounddateien.
- ⏱️ **Zeit- & Tag/Nacht-Zyklus**: Einstellbare Spielgeschwindigkeit (Pause 0x, 1x, 2x, 3x) mit dynamischem Umgebungslicht.
- 💾 **Automatischer Speicherstand**: Automatisches Speichern & Laden im LocalStorage (inklusive Raum-Wände, Böden & Pool-Kacheln).

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
    │   └── SoundManager.ts      # Web Audio API Simlish Chatter, UI & Level-Up Synthesizer
    ├── engine/                  # Core 2.5D Game Engine
    │   ├── Game.ts              # Haupt-Gameschleife (requestAnimationFrame)
    │   ├── IsometricRenderer.ts # 2.5D Isometric Canvas Grid, Walls, Doors, Pools & Emote Bubble Renderer
    │   ├── Camera.ts            # Panning, Zooming & Smooth Interpolation
    │   └── Input.ts             # Maus-, Touch- & Tastatur-Eingabeverarbeitung
    ├── entity/                  # Sim Entitäten & Verhalten
    │   ├── Sim.ts               # Player Sim State (Merkmale, Position, Skills, Kleidung)
    │   ├── NPCManager.ts        # Besuchende Nachbarn (Mortimer Goth, Penny Pizazz, Bob Pancakes) & Emotes
    │   ├── Relationship.ts      # Beziehungs-Klasse (Freundschaft, Romantik & Status)
    │   ├── ActionQueue.ts       # Sims 4 Aktions-Stapelsystem (max. 5 Aktionen)
    │   ├── Needs.ts             # 6 Hauptbedürfnisse (Hunger, Energie, Hygiene, Blase, Spaß, Sozial)
    │   └── Moods.ts             # Stimmungs-Zustände (Glücklich, Energetisch, Angespannt, Erschöpft)
    ├── world/                   # Spielwelt & Möbel
    │   ├── House.ts             # Raster-Layout, Wände, Türen, Fenster, Böden & Pool-Raster
    │   ├── Furniture.ts         # Möbel-Katalog (Bett, Dusche, Kühlschrank, PC, Staffelei, TV, Pool-Leiter)
    │   └── Pathfinding.ts       # A* Pfadfindungs-Algorithmus auf dem Raster
    ├── systems/                 # Spiel-Mechaniken
    │   ├── TimeSystem.ts        # Uhrzeit, Tag/Nacht-Licht & Geschwindigkeits-Regelung
    │   ├── CareerSystem.ts      # Berufe (Tech Guru, Gourmet Chef, Künstler) & Skills
    │   ├── QuestSystem.ts       # Sims Mobile Style Aufgaben & Belohnungen
    │   └── SaveManager.ts       # Sichere JSON-Speicherung von Haus-Layout, Wänden, Böden & Pool
    ├── ui/                      # Responsive UI Modals & HUD Views
    │   ├── HUD.ts               # Oberer & unterer UI-Balken, Bedürfnisse & Aktionschips
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

### Steuerung im Baumodus
- **Tab 🛋️ Möbel**: Möbel kaufen & platzieren.
- **Tab 🧱 Wände**: Wand-Werkzeug aktivieren & per Klick 3D-Wände auf Rastergrenzen ziehen.
- **Tab 🚪 Türen & Fenster**: Türen oder Fenster auswählen & in bestehende Wände einsetzen.
- **Tab 🎨 Bodenbeläge**: Parkett, Edelmarmor, Fliesen oder Teppich wählen & Kacheln anstreichen.
- **Tab 🏊 Pool & Outdoor**: Pool-Werkzeug aktivieren & kühle Wasser-Kacheln auf Rasenfeldern ausheben.

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

### Version 1.2.0 (Advanced Build Mode & Swimming Pool Upgrade)
- **[Feature] 3D Wandkonstruktion**: Freies Bauen und Abreisen von Wänden auf Grid-Grenzen.
- **[Feature] Türen & Fenster**: Einsetzen von Türen und Fenstern in bestehende Wände mit visuellen Ausschnitten.
- **[Feature] Boden-Anstrich**: 5 Bodenbelags-Typen (Parkett, Edelmarmor, Fliesen, Teppich, Rasen).
- **[Feature] Swimmingpool System**: Ausheben von Pools mit animierter Wasser-Textur & Schwimmen-Interaktion (Fitness-Skill Gain).
- **[Feature] 5-Tab Baumodus Catalog**: Übersichtlich gegliederter Architekten-Katalog.

### Version 1.1.0 (Social & Relationship Upgrade)
- **[Feature] Beziehungs-System**: Implementierung von Freundschafts- und Romantikbalken mit dynamischen Beziehungs-Titeln.
- **[Feature] Sims 4 Pie-Dialograd**: Interaktions-Menü mit 4 Hauptkategorien (Freundlich, Lustig, Romantisch, Gemein).
- **[Feature] NPC-Townies**: Spawnen besuchender Nachbarn (Mortimer Goth, Penny Pizazz, Bob Pancakes, Eliza Pancakes).
- **[Feature] Emote Speech Bubbles**: Animierte Sprechblasen über Sims bei sozialen Interaktionen.

### Version 1.0.0 (Initial Release - Sims 4 / Sims Mobile Hybrid)
- **[Feature] Create-A-Sim (CAS)**: Vollständige Erstellung von Sims mit Name, Geschlecht, Hauttönen, Haarfarben, Outfit-Styling, Merkmalen und Zielen.
- **[Feature] 2.5D Isometric Engine**: Hochperformante Canvas-Render-Engine mit dynamischem Kamerasystem (Pan & Zoom) und A* Pfadfindung.
- **[Feature] Sims 4 Action Queue**: Stapeln von bis zu 5 Aktionen nacheinander.
- **[Feature] Sims Mobile Quests**: Tägliche Aufgaben mit Simoleon-Belohnung (§).
- **[Security & DSGVO]**: Maskierung von Benutzereingaben (XSS Protection), DSGVO-Panel (Art. 17) & WCAG 2.1 Accessibility.
