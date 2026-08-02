/**
 * Main Game Controller & Execution Loop
 * Connects Canvas rendering, pathfinding, entity state, action execution,
 * HUD updates, and system events.
 */

import { Sim } from '../entity/Sim';
import { House } from '../world/House';
import { Camera } from './Camera';
import { IsometricRenderer } from './IsometricRenderer';
import { InputHandler } from './Input';
import { SoundManager } from '../audio/SoundManager';
import { TimeSystem } from '../systems/TimeSystem';
import { CareerManager } from '../systems/CareerSystem';
import { QuestManager } from '../systems/QuestSystem';
import { SaveManager } from '../systems/SaveManager';
import { Pathfinding } from '../world/Pathfinding';
import { FURNITURE_CATALOG } from '../world/Furniture';

import { HUDManager } from '../ui/HUD';
import { CASModal } from '../ui/CASModal';
import { BuildBuyCatalog } from '../ui/BuildBuyCatalog';
import { CareerPanel } from '../ui/CareerPanel';
import { PrivacyModal } from '../ui/PrivacyModal';

export class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private renderer: IsometricRenderer;
  private soundManager: SoundManager;
  private inputHandler: InputHandler;

  public house: House;
  public sim: Sim;
  public timeSystem: TimeSystem;
  public careerManager: CareerManager;
  public questManager: QuestManager;

  public hud: HUDManager;
  public casModal: CASModal;
  public buildCatalog: BuildBuyCatalog;
  public careerPanel: CareerPanel;
  public privacyModal: PrivacyModal;

  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement, uiContainer: HTMLElement) {
    this.canvas = canvas;
    this.camera = new Camera();
    this.renderer = IsometricRenderer ? new IsometricRenderer(canvas) : null as any;
    this.soundManager = new SoundManager();

    this.house = new House();
    this.sim = new Sim();
    this.timeSystem = new TimeSystem();
    this.careerManager = new CareerManager();
    this.questManager = new QuestManager();

    // UI Modules
    this.hud = new HUDManager(uiContainer, this.soundManager);
    this.casModal = new CASModal(uiContainer, this.soundManager);
    this.buildCatalog = new BuildBuyCatalog(uiContainer, this.soundManager);
    this.careerPanel = new CareerPanel(uiContainer, this.soundManager);
    this.privacyModal = new PrivacyModal(uiContainer, this.soundManager);

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
    // Canvas Tile Clicks
    this.inputHandler.onTileClick = (gridX, gridY) => {
      const furniture = this.house.getFurnitureAt(gridX, gridY);

      if (furniture) {
        // Clicked on furniture -> trigger interaction
        const def = FURNITURE_CATALOG[furniture.furnitureId];
        if (!def || def.interactions.length === 0) return;
        const interaction = def.interactions[0];

        // Find path to furniture
        const path = Pathfinding.findPath(
          this.sim.gridPos,
          { x: furniture.gridX, y: furniture.gridY },
          this.house.width,
          this.house.height,
          (x, y) => this.house.isWalkable(x, y)
        );

        this.sim.setPath(path);

        // Queue action
        this.sim.actionQueue.enqueue({
          id: `act_${Date.now()}`,
          name: `${interaction.label} (${def.name})`,
          icon: interaction.icon,
          durationSeconds: interaction.duration,
          elapsedSeconds: 0,
          onExecuteTick: () => {
            // Play Simlish chatter sound occasionally
            if (Math.random() < 0.05) {
              this.soundManager.playSimlish(1.0, 'happy');
            }
          },
          onComplete: () => {
            // Apply need effects
            Object.entries(interaction.needEffects).forEach(([need, val]) => {
              this.sim.needs.modify(need as any, val!);
            });

            // Apply skill gains
            if (interaction.skillGain) {
              const leveledUp = this.sim.addSkillXP(interaction.skillGain.skill, interaction.skillGain.amount);
              if (leveledUp) {
                this.soundManager.playLevelUp();
                alert(`✨ LEVEL UP! ${this.sim.customization.name} hat Stufe ${Math.floor(this.sim.skills[interaction.skillGain.skill])} in ${interaction.skillGain.skill.toUpperCase()} erreicht!`);
              }
            }

            // Trigger Quest progress
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

    // HUD Handlers
    this.hud.onOpenCAS = () => this.casModal.open(this.sim);
    this.hud.onOpenBuildBuy = () => this.buildCatalog.open(this.sim, this.house);
    this.hud.onOpenCareer = () => this.careerPanel.open(this.sim, this.careerManager, this.questManager);
    this.hud.onOpenPrivacy = () => this.privacyModal.open();

    this.hud.onSaveGame = () => {
      SaveManager.saveGame(this.sim, this.house, this.careerManager);
      this.soundManager.playLevelUp();
      alert('💾 Spielstand erfolgreich lokal gespeichert!');
    };

    this.hud.onSpeedChange = (speed) => this.timeSystem.setSpeed(speed);
    this.hud.onTogglePause = () => this.timeSystem.togglePause();

    this.inputHandler.onKeyboardSpeedToggle = (speed) => this.timeSystem.setSpeed(speed);
    this.inputHandler.onKeyboardPauseToggle = () => this.timeSystem.togglePause();
  }

  private attemptLoadSave(): void {
    const loaded = SaveManager.loadGame(this.sim, this.house, this.careerManager);
    if (loaded) {
      console.log('[Game Engine] Save file loaded successfully.');
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

    // 2. Sim Update
    this.sim.update(deltaSec, timeResult.deltaMinutes);

    // 3. Camera Update
    this.camera.update();

    // 4. Render Scene
    this.renderer.render(this.house, this.sim, this.camera, this.timeSystem.hour);

    // 5. Update HUD
    this.hud.update(this.sim, this.timeSystem);

    requestAnimationFrame(this.loop.bind(this));
  }
}
