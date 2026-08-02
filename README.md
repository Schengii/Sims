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
- **Stereoanlage & Radio-Synthesizer**: Höre 4 prozedural erzeugte Simlish-Radiosender (Pop, Retro Synthwave, Lo-Fi, Electro Dance) und tanze allein oder im Paar zu den Beats!
- **Lebensphasen & Alterungssystem**: Durchlaufe 6 Lebensphasen (🍼 Baby, 🧸 Kleinkind, 🎒 Kind, 🎧 Teenager, 💼 Erwachsener, 👵 Senior). Feiere Geburtstage mit Kerzenauspusten oder gründe eine Familie mit Stammbaum-Übersicht.
- **Interaktive 2.5D Welt**: Bewege deinen Sim frei im Haus, benutze Möbel (Bett, Dusche, PC, Staffelei, Torte, Wiege, Stereoanlage).
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

- 📻 **Prozeduraler Radio-Synthesizer**: 4 Simlish-Musiksender (Pop Hits, 80s Synthwave, Lo-Fi Chillbeats, Electro Dance) erzeugt via Web Audio API ohne MP3s.
- 🕺 **Tanz-System & Paartanzen**: Rhythmische Tanz-Animationen & Musik-Sprechblasen (🎵, 🎶, 🕺, <ctrl42>) beim alleinigen oder gemeinsamen Tanzen mit Nachbarn.
- 🍼 **Lebensphasen & Alterungs-System**: 6 Lebensphasen (Baby bis Senior) mit Größen-Skalierung & Stammbaum.
- 🎂 **Geburtstagstorte & Kerzen ausblasen**: Kerzen ausblasen für Lebensphasen-Aufstieg.
- 🧱 **Erweiterter Baumodus & Raum-Editor**: 5 Architektur-Tabs (Möbel, Wände, Türen/Fenster, Bodenbeläge, Pool & Outdoor).
- 🏊 **Swimmingpool & Schwimm-System**: Ausheben von Pools mit animierter Wasser-Textur & Schwimmen.
- 💬 **Sims 4 Pie-Dialograd & Emote-Bubbles**: Interaktions-Rad (Freundlich, Lustig, Romantisch, Gemein) mit Emote-Bubbles.
- 💕 **Beziehungs-Engine**: Freundschafts- und Romantikbalken mit dynamischen Beziehungs-Titeln.
- 🟢 **Symbolisches Plumbob-System**: Der schwebende Plumbob-Kristall reagiert dynamisch auf die Stimmung.
- 🗣️ **Simlish Vocal Synthesizer**: Prozedural generierte Stimmen (Simlish) & UI-Soundeffekte.
- 💾 **Automatischer Speicherstand**: Automatisches Speichern & Laden im LocalStorage.

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
    │   ├── Game.ts              # Haupt-Gameschleife & Event-Controller
    │   ├── IsometricRenderer.ts # 2.5D Canvas Grid, Walls, Pools, Dance Animations & Emotes
    │   ├── Camera.ts            # Panning, Zooming & Smooth Interpolation
    │   └── Input.ts             # Maus-, Touch- & Tastatur-Eingabeverarbeitung
    ├── entity/                  # Sim Entitäten & Verhalten
    │   ├── Sim.ts               # Player Sim State (Lebensphase, Alterstage, Kinder, Partner, Skills)
    │   ├── LifeStage.ts         # 6 Lebensphasen (Baby bis Senior), Render-Skalierung
    │   ├── NPCManager.ts        # Besuchende Nachbarn (Mortimer Goth, Penny Pizazz, Bob Pancakes)
    │   ├── Relationship.ts      # Beziehungs-Klasse (Freundschaft, Romantik & Status)
    │   ├── ActionQueue.ts       # Sims 4 Aktions-Stapelsystem (max. 5 Aktionen)
    │   ├── Needs.ts             # 6 Hauptbedürfnisse (Hunger, Energie, Hygiene, Blase, Spaß, Sozial)
    │   └── Moods.ts             # Stimmungs-Zustände (Glücklich, Energetisch, Angespannt, Erschöpft)
    ├── world/                   # Spielwelt & Möbel
    │   ├── House.ts             # Raster-Layout, Wände, Türen, Fenster, Böden & Pool-Raster
    │   ├── Furniture.ts         # Möbel-Katalog (Bett, Dusche, PC, Stereoanlage, Torte, Wiege, Pool-Leiter)
    │   └── Pathfinding.ts       # A* Pfadfindungs-Algorithmus auf dem Raster
    ├── systems/                 # Spiel-Mechaniken
    │   ├── TimeSystem.ts        # Uhrzeit, Tag/Nacht-Licht & Geschwindigkeits-Regelung
    │   ├── CareerSystem.ts      # Berufe (Tech Guru, Gourmet Chef, Künstler) & Skills
    │   ├── QuestSystem.ts       # Sims Mobile Style Aufgaben & Belohnungen
    │   └── SaveManager.ts       # Sichere JSON-Speicherung von Sims, Wänden, Böden & Radio-Status
    ├── ui/                      # Responsive UI Modals & HUD Views
    │   ├── HUD.ts               # Oberer & unterer UI-Balken, Radio-Widget, Bedürfnisse & Aktionschips
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

### Steuerung für Stereoanlage & Tanzen
- **Stereoanlage Pro kaufen**: Platziere die Stereoanlage aus dem Katalog (Tab 🛋️ Möbel) im Haus.
- **Radio einschalten**: Klicke auf die Stereoanlage oder den `📻 Radio`-Button im oberen HUD-Balken.
- **Sender wechseln**: Schalte zwischen *Simlish Pop*, *80s Synthwave*, *Lo-Fi Chillbeats* und *Electro Dance* um.
- **Tanzen**: Wähle *"Allein tanzen"* oder *"Paartanzen mit Nachbar"*, um Spaß, Fitness und Sozialpunkte aufzuladen.

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

### Version 1.4.0 (Stereo System & Radio Synthesizer Upgrade)
- **[Feature] Prozeduraler Radio Synthesizer**: 4 Simlish Radiosender (Pop Hits, 80s Synthwave, Lo-Fi Chillbeats, Electro Dance) erzeugt via Web Audio API.
- **[Feature] Tanz-System**: Rhythmische Wipp-Animationen und Musik-Sprechblasen beim Allein- oder Paartanzen mit Nachbarn.
- **[Feature] HiFi-Stereoanlage**: Neues Möbelstück mit Senderauswahl und Radio-Interaktionen.
- **[Feature] HUD Radio Widget**: Schnelles Umschalten des Radiosenders direkt im oberen HUD-Balken.

### Version 1.3.0 (Life Stages, Aging & Family Tree Upgrade)
- **[Feature] 6 Lebensphasen**: Baby, Kleinkind, Kind, Teenager, Erwachsener, Senior mit Render-Skalierung.
- **[Feature] Geburtstagstorte**: Kerzen ausblasen, um Alterungsevent auszulösen.
- **[Feature] Baby-Erzeugung & Wiege**: Romantische Interaktion "Baby planen (Whahoo)".
- **[Feature] Familienstammbaum Panel**: Visualisierung der Familie (Partner, Kinder, Generationen).
