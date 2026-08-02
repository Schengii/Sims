/**
 * Main Game Controller & Execution Loop
 * Connects Canvas rendering, pathfinding, entities, NPC Townies, Social Pie Wheel,
 * HUD updates, and system events.
 */

import { Sim } from '../entity/Sim';
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

export class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private renderer: IsometricRenderer;
  private soundManager: SoundManager;
  public radioManager: RadioManager;
  private inputHandler: InputHandler;

  public house: House;
  public sim: Sim;
  public npcManager: NPCManager;
  public timeSystem: TimeSystem;
  public careerManager: CareerManager;
  public questManager: QuestManager;
  public partyManager: PartyManager;

  public hud: HUDManager;
  public casModal: CASModal;
  public buildCatalog: BuildBuyCatalog;
  public careerPanel: CareerPanel;
  public privacyModal: PrivacyModal;
  public socialWheel: SocialWheel;
  public relationshipsPanel: RelationshipsPanel;
  public familyTreePanel: FamilyTreePanel;
  public partyModal: PartyModal;

  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, uiContainer: HTMLElement) {
    this.canvas = canvas;
    this.camera = new Camera();
    this.renderer = new IsometricRenderer(canvas);
    this.soundManager = new SoundManager();
    this.radioManager = new RadioManager();

    this.house = new House();
    this.sim = new Sim();
    this.npcManager = new NPCManager();
    this.timeSystem = new TimeSystem();
    this.careerManager = new CareerManager();
    this.questManager = new QuestManager();
    this.partyManager = new PartyManager();

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

    this.inputHandler = new InputHandler(this.canvas, this.camera, this.renderer, this.soundManager);

    this.initCanvasSize();
    this.setupEventHandlers();
    this.attemptLoadSave();
  }

  private initCanvasSize(): void {
    const resize = () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resize);
    resize();
  }

  private setupEventHandlers(): void {
    // Canvas Tile & NPC Clicks
    this.inputHandler.onTileClick = (gridX, gridY) => {
      // 0. Check if an active Build Tool is selected
      const toolMode = this.buildCatalog.activeToolMode;
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
        }
        // Reset tool mode after placement
        this.buildCatalog.activeToolMode = 'select';
        return;
      }

      // 1. Check if clicked an NPC Townie
      const npc = this.npcManager.getNPCAt(gridX, gridY);
      if (npc) {
        // Walk towards NPC
        const path = Pathfinding.findPath(
          this.sim.gridPos,
          { x: Math.floor(npc.gridPos.x), y: Math.floor(npc.gridPos.y) },
          this.house.width,
          this.house.height,
          (x, y) => this.house.isWalkable(x, y)
        );
        this.sim.setPath(path);

        // Open Social Pie Wheel
        this.socialWheel.open(this.sim, npc);
        return;
      }

      // 2. Check if clicked furniture
      const furniture = this.house.getFurnitureAt(gridX, gridY);
      if (furniture) {
        const def = FURNITURE_CATALOG[furniture.furnitureId];
        if (!def || def.interactions.length === 0) return;
        const interaction = def.interactions[0];

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

            if (interaction.id === 'toggle_radio') {
              const playing = this.radioManager.toggleRadio();
              const info = this.radioManager.getActiveStationInfo();
              this.updateRadioHUD();
              alert(`📻 Radio ${playing ? 'Eingeschaltet' : 'Ausgeschaltet'} (${info.name})`);
            } else if (interaction.id === 'cycle_station') {
              const next = this.radioManager.cycleNextStation();
              this.updateRadioHUD();
              alert(`🎛️ Radiosender gewechselt zu: ${next.icon} ${next.name}`);
            } else if (interaction.id === 'dance_solo') {
              if (!this.radioManager.getIsPlaying()) {
                this.radioManager.playStation('pop');
                this.updateRadioHUD();
              }
              this.soundManager.playSimlish(1.2, 'happy');
            } else if (interaction.id === 'dance_couple') {
              if (!this.radioManager.getIsPlaying()) {
                this.radioManager.playStation('retro');
                this.updateRadioHUD();
              }
              this.soundManager.playSimlish(1.1, 'flirty');
              // Trigger dance emote on nearby NPC
              if (this.npcManager.npcs.length > 0) {
                this.npcManager.triggerEmote(this.npcManager.npcs[0].id, '💃', 5000);
              }
            }

            if (interaction.id === 'serve_buffet') {
              this.partyManager.triggerGoal('p_buffet');
              this.partyManager.triggerGoal('p_snack');
            } else if (interaction.id === 'blow_candles') {
              this.partyManager.triggerGoal('p_candles');
              const newStage = this.sim.ageUp();
              this.soundManager.playLevelUp();
              alert(`🎉 GEBURTSTAG! ${this.sim.customization.name} ist in die Lebensphase "${newStage.toUpperCase()}" aufgestiegen!`);
            } else if (interaction.id === 'dance_solo' || interaction.id === 'dance_couple') {
              this.partyManager.triggerGoal('p_dance');
            } else if (interaction.id === 'swim') {
              this.partyManager.triggerGoal('p_swim');
            }

            if (interaction.skillGain) {
              const leveledUp = this.sim.addSkillXP(interaction.skillGain.skill, interaction.skillGain.amount);
              if (leveledUp) {
                this.soundManager.playLevelUp();
                alert(`✨ LEVEL UP! ${this.sim.customization.name} hat Stufe ${Math.floor(this.sim.skills[interaction.skillGain.skill])} in ${interaction.skillGain.skill.toUpperCase()} erreicht!`);
              }
            }

            if (interaction.id === 'cook_gourmet' || interaction.id === 'snack') {
              this.questManager.triggerQuestProgress('q_cook');
            } else if (interaction.id === 'code') {
              this.questManager.triggerQuestProgress('q_code');
            } else if (interaction.id === 'sleep') {
              this.questManager.triggerQuestProgress('q_sleep');
            }
          }
        });
      } else {
        // Walk to tile
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

    // Social Wheel Interaction Callback
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
        this.soundManager.playLevelUp();
        alert(`👶 GLÜCKWUNSCH! Ein baby namens "${babyName}" wurde geboren und der Familie hinzugefügt!`);
      }
    };

    // HUD Handlers
    this.hud.onOpenCAS = () => this.casModal.open(this.sim);
    this.hud.onOpenBuildBuy = () => this.buildCatalog.open(this.sim, this.house);
    this.hud.onOpenCareer = () => this.careerPanel.open(this.sim, this.careerManager, this.questManager);
    this.hud.onOpenRelationships = () => this.relationshipsPanel.open(this.npcManager);
    this.hud.onOpenFamilyTree = () => this.familyTreePanel.open(this.sim);
    this.hud.onOpenParty = () => this.partyModal.open(this.partyManager);
    this.hud.onOpenPrivacy = () => this.privacyModal.open();

    this.partyModal.onPartyStarted = (typeId) => {
      const party = this.partyManager.startParty(typeId);
      // Spawn extra party townies with party emotes
      this.npcManager.npcs.forEach(n => {
        this.npcManager.triggerEmote(n.id, '🥳', 10000);
      });
      alert(`🎉 PARTY GESTARTET! Willkommen zur ${party.title}. Absolviere Party-Ziele für 5 Sterne ⭐!`);
    };

    this.hud.onToggleRadio = () => {
      const next = this.radioManager.cycleNextStation();
      this.updateRadioHUD();
      alert(`📻 Sender gewechselt: ${next.icon} ${next.name}`);
    };

    this.hud.onSaveGame = () => {
      SaveManager.saveGame(this.sim, this.house, this.careerManager, this.npcManager, this.partyManager);
      this.soundManager.playLevelUp();
      alert('💾 Spielstand (inklusive Party-Trophäen & Fortschritten) gespeichert!');
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
    const loaded = SaveManager.loadGame(this.sim, this.house, this.careerManager, this.npcManager, this.partyManager);
    if (loaded) {
      console.log('[Game Engine] Save file & party progress loaded successfully.');
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

    // 2. Party Update Tick
    const partyResult = this.partyManager.update(timeResult.deltaMinutes);
    if (partyResult.partyEnded) {
      this.sim.simoleons += partyResult.rewardSimoleons || 0;
      this.soundManager.playLevelUp();
      alert(`🎉 PARTY BEENDET! Du hast ${partyResult.finalStars} ⭐ Sterne erzielt und § ${partyResult.rewardSimoleons} verdient! ${partyResult.trophyAwarded ? `\n\n🏆 Freigeschaltet: ${partyResult.trophyAwarded}` : ''}`);
    }

    // 3. Sim Update
    this.sim.update(deltaSec, timeResult.deltaMinutes);

    // 4. NPC Update
    this.npcManager.update(deltaSec);

    // 5. Camera Update
    this.camera.update();

    // 6. Render Scene
    this.renderer.render(this.house, this.sim, this.npcManager, this.camera, this.timeSystem.hour);

    // 7. Update HUD
    this.hud.update(this.sim, this.timeSystem);

    requestAnimationFrame(this.loop.bind(this));
  }
}
