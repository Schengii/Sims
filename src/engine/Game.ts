/**
 * Main Game Controller & Execution Loop
 * Connects Canvas rendering, pathfinding, entities, NPC Townies, Household Multi-Sims,
 * Pet Manager & Autonomy, Social Pie Wheel, Furniture Modal, Inventory Panel, Weather,
 * Garden, Toast Notifications, HUD updates, and system events.
 */

import { Sim } from '../entity/Sim';
import { Household } from '../entity/Household';
import { PetManager } from '../entity/PetManager';
import { PetAutonomy } from '../entity/PetAutonomy';
import { House } from '../world/House';
import { Camera } from './Camera';
import { IsometricRenderer } from './IsometricRenderer';
import { InputHandler } from './Input';
import { SoundManager } from '../audio/SoundManager';
import { RadioManager } from '../audio/RadioManager';
import { TimeSystem } from '../systems/TimeSystem';
import { CareerManager } from '../systems/CareerSystem';
import { QuestManager } from '../systems/QuestSystem';
import { SaveManager } from '../systems/SaveManager';
import { Pathfinding } from '../world/Pathfinding';
import { FURNITURE_CATALOG } from '../world/Furniture';

import { NPCManager } from '../entity/NPCManager';
import { HUDManager } from '../ui/HUD';
import { CASModal } from '../ui/CASModal';
import { BuildBuyCatalog } from '../ui/BuildBuyCatalog';
import { CareerPanel } from '../ui/CareerPanel';
import { PrivacyModal } from '../ui/PrivacyModal';
import { SocialWheel } from '../ui/SocialWheel';
import { RelationshipsPanel } from '../ui/RelationshipsPanel';
import { FamilyTreePanel } from '../ui/FamilyTreePanel';
import { PartyManager } from '../systems/PartyManager';
import { PartyModal } from '../ui/PartyModal';

import { WeatherSystem } from '../systems/WeatherSystem';
import { GardenSystem } from '../world/GardenSystem';
import { SimAutonomy } from '../entity/SimAutonomy';
import { ToastManager } from '../ui/ToastManager';
import { FurnitureModal } from '../ui/FurnitureModal';
import { InventoryPanel } from '../ui/InventoryPanel';
import { AudioSettingsModal } from '../ui/AudioSettingsModal';

export class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private renderer: IsometricRenderer;
  private soundManager: SoundManager;
  public radioManager: RadioManager;
  private inputHandler: InputHandler;

  public house: House;
  public household: Household;
  public sim: Sim; // Active controlled Sim
  public petManager: PetManager;
  public npcManager: NPCManager;
  public timeSystem: TimeSystem;
  public careerManager: CareerManager;
  public questManager: QuestManager;
  public partyManager: PartyManager;
  public weatherSystem: WeatherSystem;
  public gardenSystem: GardenSystem;

  public hud: HUDManager;
  public casModal: CASModal;
  public buildCatalog: BuildBuyCatalog;
  public careerPanel: CareerPanel;
  public privacyModal: PrivacyModal;
  public socialWheel: SocialWheel;
  public relationshipsPanel: RelationshipsPanel;
  public familyTreePanel: FamilyTreePanel;
  public partyModal: PartyModal;

  public toastManager: ToastManager;
  public furnitureModal: FurnitureModal;
  public inventoryPanel: InventoryPanel;
  public audioSettingsModal: AudioSettingsModal;

  private movingFurnitureInstanceId: string | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, uiContainer: HTMLElement) {
    this.canvas = canvas;
    this.camera = new Camera();
    this.renderer = new IsometricRenderer(canvas);
    this.soundManager = new SoundManager();
    this.radioManager = new RadioManager();

    this.house = new House();
    this.household = new Household();
    this.sim = this.household.getActiveSim();
    this.petManager = new PetManager();
    this.npcManager = new NPCManager();
    this.timeSystem = new TimeSystem();
    this.careerManager = new CareerManager();
    this.questManager = new QuestManager();
    this.partyManager = new PartyManager();
    this.weatherSystem = new WeatherSystem();
    this.gardenSystem = new GardenSystem();

    // UI Modules
    this.hud = new HUDManager(uiContainer, this.soundManager);
    this.casModal = new CASModal(uiContainer, this.soundManager);
    this.buildCatalog = new BuildBuyCatalog(uiContainer, this.soundManager);
    this.careerPanel = new CareerPanel(uiContainer, this.soundManager);
    this.privacyModal = new PrivacyModal(uiContainer, this.soundManager);
    this.socialWheel = new SocialWheel(uiContainer, this.soundManager);
    this.relationshipsPanel = new RelationshipsPanel(uiContainer);
    this.familyTreePanel = new FamilyTreePanel(uiContainer);
    this.partyModal = new PartyModal(uiContainer, this.soundManager);

    this.toastManager = new ToastManager(uiContainer);
    this.furnitureModal = new FurnitureModal(uiContainer, this.soundManager);
    this.inventoryPanel = new InventoryPanel(uiContainer, this.soundManager);
    this.audioSettingsModal = new AudioSettingsModal(uiContainer, this.soundManager, this.radioManager);

    this.inputHandler = new InputHandler(this.canvas, this.camera, this.renderer, this.soundManager);

    this.initCanvasSize();
    this.setupEventHandlers();
    this.attemptLoadSave();

    this.toastManager.showToast('Willkommen bei Sims 5 (v2.5)', 'Mehrpersonen-Haushalt & Pets-System sind jetzt aktiv!', '🐕', 'info');
  }

  private initCanvasSize(): void {
    const resize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);
    resize();
  }

  private setupEventHandlers(): void {
    // Canvas Tile Clicks & Entity Interactions
    this.inputHandler.onTileClick = (gridX, gridY) => {
      const toolMode = this.buildCatalog.activeToolMode;

      // Handle Moving furniture target tile
      if (this.movingFurnitureInstanceId) {
        const success = this.house.moveFurniture(this.movingFurnitureInstanceId, gridX, gridY);
        if (success) {
          this.soundManager.playBuySound();
          this.toastManager.showToast('Möbel verschoben', 'Möbelstück an neuer Position platziert!', '🚚', 'success');
        } else {
          alert('Platzierung hier nicht möglich!');
        }
        this.movingFurnitureInstanceId = null;
        this.buildCatalog.activeToolMode = 'select';
        return;
      }

      // Handle active Build Tools
      if (toolMode !== 'select') {
        if (toolMode === 'wall') {
          if (this.sim.simoleons >= 100) {
            this.sim.simoleons -= 100;
            this.house.toggleWallNorth(gridX, gridY, '#2c3e50');
            this.soundManager.playBuySound();
          } else {
            alert('Nicht genügend Simoleons (§ 100 benötigt)!');
          }
        } else if (toolMode === 'door') {
          if (this.sim.simoleons >= 200) {
            this.sim.simoleons -= 200;
            this.house.setOpeningNorth(gridX, gridY, 'door');
            this.soundManager.playBuySound();
          }
        } else if (toolMode === 'window') {
          if (this.sim.simoleons >= 250) {
            this.sim.simoleons -= 250;
            this.house.setOpeningNorth(gridX, gridY, 'window');
            this.soundManager.playBuySound();
          }
        } else if (toolMode === 'floor') {
          if (this.sim.simoleons >= 50) {
            this.sim.simoleons -= 50;
            this.house.setFloorStyle(gridX, gridY, this.buildCatalog.activeFloorType, this.buildCatalog.activeFloorColor);
            this.soundManager.playBuySound();
          }
        } else if (toolMode === 'pool') {
          if (this.sim.simoleons >= 300) {
            this.sim.simoleons -= 300;
            this.house.setFloorStyle(gridX, gridY, 'pool', '#00e5ff');
            this.soundManager.playBuySound();
          }
        } else if (toolMode === 'garden') {
          if (this.sim.simoleons >= 100) {
            this.sim.simoleons -= 100;
            this.gardenSystem.addPlot(gridX, gridY);
            this.soundManager.playBuySound();
            this.toastManager.showToast('Gartenbeet angelegt', 'Pflanzbeet auf dem Rasen erstellt!', '🌱', 'success');
          } else {
            alert('Nicht genügend Simoleons (§ 100 benötigt)!');
          }
        } else if (toolMode === 'rotate') {
          const furn = this.house.getFurnitureAt(gridX, gridY);
          if (furn) {
            this.house.rotateFurniture(furn.instanceId);
            this.soundManager.playUIClick();
            this.toastManager.showToast('Möbel gedreht', 'Ausrichtung des Möbelstücks geändert!', '🔄', 'info');
          }
        } else if (toolMode === 'sell') {
          const furn = this.house.getFurnitureAt(gridX, gridY);
          if (furn) {
            const refund = this.house.sellFurniture(furn.instanceId);
            this.sim.simoleons += refund;
            this.soundManager.playBuySound();
            this.toastManager.showToast('Möbel verkauft', `Möbelstück für § ${refund} verkauft!`, '💰', 'success');
          }
        } else if (toolMode === 'move') {
          const furn = this.house.getFurnitureAt(gridX, gridY);
          if (furn) {
            this.movingFurnitureInstanceId = furn.instanceId;
            this.toastManager.showToast('Verschieben', 'Klicke jetzt auf das Ziel-Feld!', '🚚', 'info');
            return;
          }
        }
        this.buildCatalog.activeToolMode = 'select';
        return;
      }

      // 1. Check if clicked a Pet (Dog / Cat)
      const pet = this.petManager.getPetAt(gridX, gridY);
      if (pet) {
        const path = Pathfinding.findPath(
          this.sim.gridPos,
          { x: Math.floor(pet.gridPos.x), y: Math.floor(pet.gridPos.y) },
          this.house.width,
          this.house.height,
          (x, y) => this.house.isWalkable(x, y)
        );
        this.sim.setPath(path);

        pet.needs.modify('affection', 25);
        pet.needs.modify('hunger', 15);
        pet.triggerEmote('❤️', 3000);
        this.soundManager.playSimlish(1.3, 'happy');
        this.toastManager.showToast(`Haustier Interaktion`, `Du hast ${pet.name} geknuddelt & gefüttert! ❤️`, pet.species === 'dog' ? '🐕' : '🐈', 'success');
        return;
      }

      // 2. Check if clicked an NPC Townie
      const npc = this.npcManager.getNPCAt(gridX, gridY);
      if (npc) {
        const path = Pathfinding.findPath(
          this.sim.gridPos,
          { x: Math.floor(npc.gridPos.x), y: Math.floor(npc.gridPos.y) },
          this.house.width,
          this.house.height,
          (x, y) => this.house.isWalkable(x, y)
        );
        this.sim.setPath(path);
        this.socialWheel.open(this.sim, npc);
        return;
      }

      // 3. Check if clicked a Garden Plot
      const gardenPlot = this.gardenSystem.plots.find(p => p.gridX === gridX && p.gridY === gridY);
      if (gardenPlot) {
        if (gardenPlot.isHarvestable) {
          const crop = this.gardenSystem.harvestCrop(gridX, gridY);
          if (crop) {
            this.sim.inventory.addItem({
              name: crop.name,
              type: 'crop',
              icon: crop.icon,
              value: crop.value,
              description: 'Frisch geerntetes Bio-Gemüse aus deinem Garten.'
            });
            this.soundManager.playLevelUp();
            this.toastManager.showToast('Ernte erfolgreich!', `${crop.name} wurde deinem Inventar hinzugefügt!`, crop.icon, 'success');
          }
        } else if (!gardenPlot.cropType) {
          this.gardenSystem.plantSeed(gridX, gridY, 'tomatoes');
          this.soundManager.playUIClick();
          this.toastManager.showToast('Samen gepflanzt', 'Tomatensamen ins Beet gesät!', '🍅', 'info');
        } else {
          this.gardenSystem.waterPlot(gridX, gridY);
          this.soundManager.playUIClick();
          this.toastManager.showToast('Beet gegossen', 'Pflanzen wurden gegossen!', '💧', 'info');
        }
        return;
      }

      // 4. Check if clicked furniture
      const furniture = this.house.getFurnitureAt(gridX, gridY);
      if (furniture) {
        const def = FURNITURE_CATALOG[furniture.furnitureId];
        if (!def || def.interactions.length === 0) return;

        this.furnitureModal.open(def, furniture.instanceId);
        this.furnitureModal.onSelectInteraction = (interactionId) => {
          const interaction = def.interactions.find(i => i.id === interactionId) || def.interactions[0];

          const path = Pathfinding.findPath(
            this.sim.gridPos,
            { x: furniture.gridX, y: furniture.gridY },
            this.house.width,
            this.house.height,
            (x, y) => this.house.isWalkable(x, y)
          );
          this.sim.setPath(path);

          this.sim.actionQueue.enqueue({
            id: `act_${Date.now()}`,
            name: `${interaction.label} (${def.name})`,
            icon: interaction.icon,
            durationSeconds: interaction.duration,
            elapsedSeconds: 0,
            onExecuteTick: () => {
              if (Math.random() < 0.05) {
                this.soundManager.playSimlish(1.0, 'happy');
              }
            },
            onComplete: () => {
              Object.entries(interaction.needEffects).forEach(([need, val]) => {
                this.sim.needs.modify(need as any, val!);
              });

              if (interaction.id === 'paint') {
                const paintingValue = 150 + Math.floor(this.sim.skills.painting * 50);
                this.sim.inventory.addItem({
                  name: 'Künstlerisches Gemälde',
                  type: 'painting',
                  icon: '🎨',
                  value: paintingValue,
                  description: 'Ein an der Staffelei erschaffenes Kunstwerk.'
                });
                this.toastManager.showToast('Gemälde fertig!', `Gemälde für § ${paintingValue} im Inventar abgelegt!`, '🎨', 'success');
              }

              if (interaction.id === 'toggle_radio') {
                const playing = this.radioManager.toggleRadio();
                const info = this.radioManager.getActiveStationInfo();
                this.updateRadioHUD();
                this.toastManager.showToast('Radio Status', `Radio ${playing ? 'Eingeschaltet' : 'Ausgeschaltet'} (${info.name})`, '📻', 'info');
              } else if (interaction.id === 'cycle_station') {
                const next = this.radioManager.cycleNextStation();
                this.updateRadioHUD();
                this.toastManager.showToast('Radiosender', `Gewechselt zu: ${next.icon} ${next.name}`, '🎛️', 'info');
              }

              if (interaction.id === 'serve_buffet') {
                this.partyManager.triggerGoal('p_buffet');
                this.partyManager.triggerGoal('p_snack');
              } else if (interaction.id === 'blow_candles') {
                this.partyManager.triggerGoal('p_candles');
                const newStage = this.sim.ageUp();
                this.soundManager.playLevelUp();
                this.toastManager.showToast('🎉 GEBURTSTAG!', `${this.sim.customization.name} ist in die Lebensphase "${newStage.toUpperCase()}" aufgestiegen!`, '🎂', 'levelUp');
              }

              if (interaction.skillGain) {
                const leveledUp = this.sim.addSkillXP(interaction.skillGain.skill, interaction.skillGain.amount);
                if (leveledUp) {
                  this.soundManager.playLevelUp();
                  this.toastManager.showToast('✨ LEVEL UP!', `Stufe ${Math.floor(this.sim.skills[interaction.skillGain.skill])} in ${interaction.skillGain.skill.toUpperCase()} erreicht!`, '⭐', 'levelUp');
                }
              }
            }
          });
        };
      } else {
        // Walk active Sim to clicked tile
        const path = Pathfinding.findPath(
          this.sim.gridPos,
          { x: gridX, y: gridY },
          this.house.width,
          this.house.height,
          (x, y) => this.house.isWalkable(x, y)
        );
        this.sim.setPath(path);
      }
    };

    // Social Wheel Callback
    this.socialWheel.onInteractionExecuted = (npc, option) => {
      this.npcManager.triggerEmote(npc.id, option.emoteSymbol, 3000);
      this.partyManager.triggerGoal('p_talk');

      if (option.id === 'party_toast') {
        this.partyManager.triggerGoal('p_toast');
      }

      if (option.id === 'make_baby') {
        const babyName = `${this.sim.customization.name.split(' ')[0]} Jr.`;
        this.sim.childrenNames.push(babyName);
        this.sim.partnerName = npc.name;

        // Add child as a new household Sim!
        const childSim = new Sim({ name: babyName, skinColor: this.sim.customization.skinColor });
        childSim.lifeStage = 'baby';
        this.household.addSim(childSim);

        this.soundManager.playLevelUp();
        this.toastManager.showToast('👶 GLÜCKWUNSCH!', `Baby "${babyName}" wurde geboren und dem Haushalt hinzugefügt!`, '🍼', 'levelUp');
      }
    };

    // Household Sim Switcher Handlers
    this.hud.onSwitchSim = (index) => {
      this.sim = this.household.setActiveSim(index);
      this.toastManager.showToast('Sim gewechselt', `Du steuerst jetzt ${this.sim.customization.name}`, '💎', 'info');
    };

    this.hud.onAddSim = () => {
      const names = ['Alexander Goth', 'Mortimer Jr.', 'Cassandra Goth', 'Penny Pizazz', 'Bob Pancakes'];
      const randName = names[Math.floor(Math.random() * names.length)];
      const newSim = new Sim({ name: randName });
      this.household.addSim(newSim);
      this.soundManager.playLevelUp();
      this.toastManager.showToast('Neues Haushaltsmitglied', `${newSim.customization.name} zieht im Haushalt ein!`, '👨‍👩‍👧‍👦', 'success');
    };

    this.hud.onAddPet = () => {
      const isDog = Math.random() < 0.5;
      const petNames = isDog ? ['Rocky', 'Barnaby', 'Charlie', 'Max'] : ['Mimi', 'Cleo', 'Felix', 'Nala'];
      const randName = petNames[Math.floor(Math.random() * petNames.length)];
      const pet = this.petManager.addPet(randName, isDog ? 'dog' : 'cat');
      this.soundManager.playLevelUp();
      this.toastManager.showToast('Haustier adoptiert', `${pet.name} (${isDog ? 'Hund 🐕' : 'Katze 🐈'}) zieht bei euch ein!`, isDog ? '🐕' : '🐈', 'success');
    };

    // HUD Handlers
    this.hud.onOpenCAS = () => this.casModal.open(this.sim);
    this.hud.onOpenBuildBuy = () => this.buildCatalog.open(this.sim, this.house);
    this.hud.onOpenCareer = () => this.careerPanel.open(this.sim, this.careerManager, this.questManager);
    this.hud.onOpenRelationships = () => this.relationshipsPanel.open(this.npcManager);
    this.hud.onOpenFamilyTree = () => this.familyTreePanel.open(this.sim);
    this.hud.onOpenParty = () => this.partyModal.open(this.partyManager);
    this.hud.onOpenPrivacy = () => this.privacyModal.open();
    this.hud.onOpenInventory = () => this.inventoryPanel.open(this.sim, this.toastManager);
    this.hud.onOpenAudioSettings = () => this.audioSettingsModal.open();

    this.hud.onToggleWeather = () => {
      this.weatherSystem.cycleNextWeather();
      const info = this.weatherSystem.getWeatherInfo();
      const btn = document.getElementById('btn-weather-toggle');
      if (btn) btn.innerText = `${info.icon} ${info.name}`;
      this.toastManager.showToast('Wetter geändert', `Aktuelles Wetter: ${info.icon} ${info.name}`, info.icon, 'info');
    };

    this.hud.onToggleWallMode = () => {
      const modes: Array<'full' | 'cutaway' | 'hidden'> = ['full', 'cutaway', 'hidden'];
      const nextIdx = (modes.indexOf(this.house.wallDisplayMode) + 1) % modes.length;
      this.house.wallDisplayMode = modes[nextIdx];
      const btn = document.getElementById('btn-wall-toggle');
      const labels = { full: '🧱 Wände: Voll', cutaway: '🧱 Wände: Cutaway', hidden: '🧱 Wände: Aus' };
      if (btn) btn.innerText = labels[this.house.wallDisplayMode];
      this.toastManager.showToast('Wandansicht', labels[this.house.wallDisplayMode], '🧱', 'info');
    };

    this.partyModal.onPartyStarted = (typeId) => {
      const party = this.partyManager.startParty(typeId);
      this.npcManager.npcs.forEach(n => {
        this.npcManager.triggerEmote(n.id, '🥳', 10000);
      });
      this.toastManager.showToast('🎉 PARTY GESTARTET!', `Willkommen zur ${party.title}! Absolviere Party-Ziele für 5 Sterne ⭐`, '🥳', 'success');
    };

    this.hud.onToggleRadio = () => {
      const next = this.radioManager.cycleNextStation();
      this.updateRadioHUD();
      this.toastManager.showToast('Radiosender', `${next.icon} ${next.name}`, '📻', 'info');
    };

    this.hud.onSaveGame = () => {
      SaveManager.saveGame(
        this.sim,
        this.house,
        this.careerManager,
        this.npcManager,
        this.partyManager,
        this.gardenSystem,
        this.weatherSystem,
        this.household,
        this.petManager
      );
      this.soundManager.playLevelUp();
      this.toastManager.showToast('Speicherstand gesichert', 'Spielstand inklusive Haushalt, Pets, Inventar & Garten gespeichert!', '💾', 'success');
    };

    this.hud.onSpeedChange = (speed) => this.timeSystem.setSpeed(speed);
    this.hud.onTogglePause = () => this.timeSystem.togglePause();

    this.inputHandler.onKeyboardSpeedToggle = (speed) => this.timeSystem.setSpeed(speed);
    this.inputHandler.onKeyboardPauseToggle = () => this.timeSystem.togglePause();
  }

  private updateRadioHUD(): void {
    const radioBtn = document.getElementById('btn-radio-toggle');
    if (radioBtn) {
      const playing = this.radioManager.getIsPlaying();
      const info = this.radioManager.getActiveStationInfo();
      radioBtn.innerText = playing ? `📻 ${info.icon} ${info.name}` : `📻 Radio: Aus`;
    }
  }

  private attemptLoadSave(): void {
    const loaded = SaveManager.loadGame(
      this.sim,
      this.house,
      this.careerManager,
      this.npcManager,
      this.partyManager,
      this.gardenSystem,
      this.weatherSystem,
      this.household,
      this.petManager
    );
    if (loaded) {
      this.sim = this.household.getActiveSim();
      console.log('[Game Engine] Save file, household sims & pets loaded successfully.');
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  private loop(now: number): void {
    if (!this.isRunning) return;

    const deltaSec = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // 1. Time Update
    const timeResult = this.timeSystem.update(deltaSec);

    // 2. Weather & Garden Updates
    this.weatherSystem.update(timeResult.deltaMinutes);
    this.gardenSystem.update(timeResult.deltaMinutes);

    if (this.weatherSystem.currentWeather === 'sunny' && Math.random() < 0.002) {
      this.soundManager.playBirdChirp();
    }

    // 3. Autonomy Update for all Household Sims (active & inactive)
    this.household.sims.forEach(hSim => {
      hSim.update(deltaSec, timeResult.deltaMinutes);
      SimAutonomy.update(hSim, this.house, deltaSec);
    });

    // 4. Pet Manager & Autonomy Update
    this.petManager.update(deltaSec, timeResult.deltaMinutes);
    this.petManager.pets.forEach(pet => {
      PetAutonomy.update(pet, this.house, deltaSec);
    });

    // 5. Party & NPC Updates
    const partyResult = this.partyManager.update(timeResult.deltaMinutes);
    if (partyResult.partyEnded) {
      this.sim.simoleons += partyResult.rewardSimoleons || 0;
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🎉 PARTY BEENDET!', `${partyResult.finalStars} ⭐ Sterne erzielt! Gewinn: § ${partyResult.rewardSimoleons}`, '🏆', 'levelUp');
    }
    this.npcManager.update(deltaSec);

    // 6. Camera Update
    this.camera.update();

    // 7. Render Scene
    this.renderer.render(
      this.house,
      this.sim,
      this.npcManager,
      this.camera,
      this.timeSystem.hour,
      this.weatherSystem,
      this.gardenSystem,
      this.household.sims,
      this.petManager
    );

    // 8. Update HUD
    this.hud.update(this.sim, this.timeSystem, this.household, this.petManager);

    requestAnimationFrame(this.loop.bind(this));
  }
}
