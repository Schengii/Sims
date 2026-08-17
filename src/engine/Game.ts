/**
 * Main Game Controller & Execution Loop
 * Connects Canvas rendering, pathfinding, entities, NPC Townies, Household Multi-Sims,
 * Pet Manager & Autonomy, Social Pie Wheel, Furniture Modal, Inventory Panel, Weather,
 * Garden, Toast Notifications, Aspirations, World Map, Multi-Floor House, Calendar & Holidays,
 * Bills & Utility, Magic & Alchemie, Vehicles & Garage, Retail Business, Photos & Memories,
 * HUD updates, and system events.
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
import { EventBus } from '../systems/EventBus';

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
import { AspirationModal } from '../ui/AspirationModal';
import { WorldMapModal } from '../ui/WorldMapModal';
import { WorldMap } from '../world/WorldMap';
import { AspirationManager } from '../systems/AspirationSystem';
import { CalendarManager } from '../systems/CalendarSystem';
import { CalendarModal } from '../ui/CalendarModal';
import { BillsManager } from '../systems/BillsSystem';
import { BillsModal } from '../ui/BillsModal';
import { MagicManager } from '../systems/MagicSystem';
import { MagicModal } from '../ui/MagicModal';

import { VehicleManager } from '../systems/VehicleSystem';
import { VehicleModal } from '../ui/VehicleModal';
import { BusinessManager } from '../systems/BusinessSystem';
import { BusinessModal } from '../ui/BusinessModal';
import { PhotoManager } from '../systems/PhotoSystem';
import { PhotoModal } from '../ui/PhotoModal';
import { EducationManager } from '../systems/EducationSystem';
import { EducationModal } from '../ui/EducationModal';
import { RentersManager } from '../systems/RentersSystem';
import { RentersModal } from '../ui/RentersModal';
import { MemoryManager } from '../systems/MemorySystem';
import { MemoryModal } from '../ui/MemoryModal';
import { WardrobeManager } from '../systems/WardrobeSystem';
import { WardrobeModal } from '../ui/WardrobeModal';
import { GalleryModal } from '../ui/GalleryModal';
import { WeddingManager } from '../systems/WeddingSystem';
import { WeddingModal } from '../ui/WeddingModal';
import { HobbyManager } from '../systems/HobbySystem';
import { HobbyModal } from '../ui/HobbyModal';
import { EventManager } from '../systems/EventSystem';
import { EventModal } from '../ui/EventModal';

import { WhimManager } from '../systems/WhimSystem';
import { WhimPanel } from '../ui/WhimPanel';
import { RecipeModal } from '../ui/RecipeModal';
import { AmbientAudioEngine } from '../audio/AmbientAudio';
import { BuildHistoryManager } from '../systems/BuildHistory';
import { SaveSlotModal } from '../ui/SaveSlotModal';
import { HelpModal } from '../ui/HelpModal';
import { GeneticsEngine } from '../entity/Genetics';
import { CheatConsoleModal } from '../ui/CheatConsoleModal';
import { CareerMiniGameModal } from '../ui/CareerMiniGameModal';
import { DeliverySystem } from '../systems/DeliverySystem';
import { SmartphoneModal } from '../ui/SmartphoneModal';
import { PetCompetitionModal } from '../ui/PetCompetitionModal';
import { PublicLotMinigamesModal } from '../ui/PublicLotMinigamesModal';
import { NeighborhoodProgression } from '../systems/NeighborhoodProgression';
import { RealEstateManager } from '../systems/RealEstateManager';
import { RealEstateModal } from '../ui/RealEstateModal';
import { TraitQuestSystem } from '../systems/TraitQuestSystem';
import { LifeJournalModal } from '../ui/LifeJournalModal';
import { EmergencyRescueModal } from '../ui/EmergencyRescueModal';
import { FameSystem } from '../systems/FameSystem';
import { FameModal } from '../ui/FameModal';
import { OccultSystem } from '../systems/OccultSystem';
import { OccultModal } from '../ui/OccultModal';
import { HighSchoolSystem } from '../systems/HighSchoolSystem';
import { PromModal } from '../ui/PromModal';
import { RestaurantSystem } from '../systems/RestaurantSystem';
import { RestaurantModal } from '../ui/RestaurantModal';
import { ResortManager } from '../systems/ResortManager';
import { ResortModal } from '../ui/ResortModal';
import { InventionSystem } from '../systems/InventionSystem';
import { ScienceLabModal } from '../ui/ScienceLabModal';
import { InteriorDecoratorSystem } from '../systems/InteriorDecoratorSystem';
import { DecoratorModal } from '../ui/DecoratorModal';
import { PetBreedingSystem } from '../systems/PetBreedingSystem';
import { PetShelterModal } from '../ui/PetShelterModal';
import { FarmSystem } from '../systems/FarmSystem';
import { RanchModal } from '../ui/RanchModal';
import { FilmStudioSystem } from '../systems/FilmStudioSystem';
import { DirectorModal } from '../ui/DirectorModal';
import { YachtManager } from '../systems/YachtManager';
import { CruiseModal } from '../ui/CruiseModal';
import { HealthSystem } from '../systems/HealthSystem';
import { HealthModal } from '../ui/HealthModal';
import { FestivalModal } from '../ui/FestivalModal';
import { VetClinicManager } from '../systems/VetClinicManager';
import { VetClinicModal } from '../ui/VetClinicModal';
import { PoliticsManager } from '../systems/PoliticsManager';
import { PoliticsModal } from '../ui/PoliticsModal';
import { ArchaeologySystem } from '../systems/ArchaeologySystem';
import { ArchaeologyModal } from '../ui/ArchaeologyModal';
import { SchoolSystem } from '../systems/SchoolSystem';
import { SchoolModal } from '../ui/SchoolModal';
import { ThemeParkManager } from '../systems/ThemeParkManager';
import { ThemeParkModal } from '../ui/ThemeParkModal';
import { SpaceManager } from '../systems/SpaceManager';
import { SpaceModal } from '../ui/SpaceModal';
import { BandManager } from '../systems/BandManager';
import { BandModal } from '../ui/BandModal';
import { InheritanceManager } from '../systems/InheritanceManager';
import { InheritanceModal } from '../ui/InheritanceModal';
import { TravelManager } from '../systems/TravelManager';
import { TravelModal } from '../ui/TravelModal';
import { FamiliarManager } from '../systems/FamiliarManager';
import { DetectiveManager } from '../systems/DetectiveManager';
import { DetectiveModal } from '../ui/DetectiveModal';
import { SmartGardenSystem } from '../systems/SmartGardenSystem';
import { EquestrianManager } from '../systems/EquestrianManager';
import { EquestrianModal } from '../ui/EquestrianModal';
import { ScubaDivingSystem } from '../systems/ScubaDivingSystem';
import { ScubaModal } from '../ui/ScubaModal';
import { PenthouseManager } from '../systems/PenthouseManager';
import { PenthouseModal } from '../ui/PenthouseModal';
import { PrivateChefManager } from '../systems/PrivateChefManager';
import { PrivateChefModal } from '../ui/PrivateChefModal';
import { Minimap } from '../ui/Minimap';

export class Game {
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private renderer: IsometricRenderer;
  private soundManager: SoundManager;
  public radioManager: RadioManager;
  public ambientAudio: AmbientAudioEngine;
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
  public worldMap: WorldMap;
  public calendarManager: CalendarManager;
  public billsManager: BillsManager;
  public magicManager: MagicManager;
  public vehicleManager: VehicleManager;
  public businessManager: BusinessManager;
  public photoManager: PhotoManager;
  public educationManager: EducationManager;
  public rentersManager: RentersManager;
  public memoryManager: MemoryManager;
  public wardrobeManager: WardrobeManager;
  public weddingManager: WeddingManager;
  public hobbyManager: HobbyManager;
  public eventManager: EventManager;
  public whimManager: WhimManager;
  public buildHistory: BuildHistoryManager;

  public hud: HUDManager;
  public whimPanel: WhimPanel;
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
  public aspirationModal: AspirationModal;
  public worldMapModal: WorldMapModal;
  public calendarModal: CalendarModal;
  public billsModal: BillsModal;
  public magicModal: MagicModal;
  public vehicleModal: VehicleModal;
  public businessModal: BusinessModal;
  public photoModal: PhotoModal;
  public educationModal: EducationModal;
  public rentersModal: RentersModal;
  public memoryModal: MemoryModal;
  public wardrobeModal: WardrobeModal;
  public galleryModal: GalleryModal;
  public weddingModal: WeddingModal;
  public hobbyModal: HobbyModal;
  public eventModal: EventModal;
  public recipeModal: RecipeModal;
  public saveSlotModal: SaveSlotModal;
  public helpModal: HelpModal;
  public cheatConsole: CheatConsoleModal;
  public careerMiniGameModal: CareerMiniGameModal;
  public deliverySystem: DeliverySystem;
  public smartphoneModal: SmartphoneModal;
  public petCompetitionModal: PetCompetitionModal;
  public publicLotMinigamesModal: PublicLotMinigamesModal;
  public neighborhoodProgression: NeighborhoodProgression;
  public realEstateManager: RealEstateManager;
  public realEstateModal: RealEstateModal;
  public traitQuestSystem: TraitQuestSystem;
  public lifeJournalModal: LifeJournalModal;
  public emergencyRescueModal: EmergencyRescueModal;
  public fameSystem: FameSystem;
  public fameModal: FameModal;
  public occultSystem: OccultSystem;
  public occultModal: OccultModal;
  public highSchoolSystem: HighSchoolSystem;
  public promModal: PromModal;
  public restaurantSystem: RestaurantSystem;
  public restaurantModal: RestaurantModal;

  public resortManager: ResortManager;
  public resortModal: ResortModal;
  public inventionSystem: InventionSystem;
  public scienceLabModal: ScienceLabModal;
  public decoratorSystem: InteriorDecoratorSystem;
  public decoratorModal: DecoratorModal;
  public petBreedingSystem: PetBreedingSystem;
  public petShelterModal: PetShelterModal;

  public farmSystem: FarmSystem;
  public ranchModal: RanchModal;
  public filmStudioSystem: FilmStudioSystem;
  public directorModal: DirectorModal;
  public yachtManager: YachtManager;
  public cruiseModal: CruiseModal;
  public healthSystem: HealthSystem;
  public healthModal: HealthModal;
  public festivalModal: FestivalModal;
  public vetClinicManager: VetClinicManager;
  public vetClinicModal: VetClinicModal;
  public politicsManager: PoliticsManager;
  public politicsModal: PoliticsModal;
  public archaeologySystem: ArchaeologySystem;
  public archaeologyModal: ArchaeologyModal;
  public schoolSystem: SchoolSystem;
  public schoolModal: SchoolModal;
  public themeParkManager: ThemeParkManager;
  public themeParkModal: ThemeParkModal;
  public spaceManager: SpaceManager;
  public spaceModal: SpaceModal;
  public bandManager: BandManager;
  public bandModal: BandModal;
  public inheritanceManager: InheritanceManager;
  public inheritanceModal: InheritanceModal;
  public travelManager: TravelManager;
  public travelModal: TravelModal;
  public familiarManager: FamiliarManager;
  public detectiveManager: DetectiveManager;
  public detectiveModal: DetectiveModal;
  public smartGarden: SmartGardenSystem;
  public equestrianManager: EquestrianManager;
  public equestrianModal: EquestrianModal;
  public scubaSystem: ScubaDivingSystem;
  public scubaModal: ScubaModal;
  public penthouseManager: PenthouseManager;
  public penthouseModal: PenthouseModal;
  public privateChefManager: PrivateChefManager;
  public privateChefModal: PrivateChefModal;

  private movingFurnitureInstanceId: string | null = null;
  private roomStartGrid: { x: number; y: number } | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private minimap!: Minimap;
  private faintWarningCooldown: number = 0;


  constructor(canvas: HTMLCanvasElement, uiContainer: HTMLElement) {
    this.canvas = canvas;
    this.camera = new Camera();
    this.renderer = new IsometricRenderer(canvas);
    this.soundManager = new SoundManager();
    this.radioManager = new RadioManager();

    this.ambientAudio = new AmbientAudioEngine();
    this.whimManager = new WhimManager();
    this.buildHistory = new BuildHistoryManager();

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
    this.worldMap = new WorldMap();
    this.calendarManager = new CalendarManager();
    this.billsManager = new BillsManager();
    this.magicManager = new MagicManager();
    this.vehicleManager = new VehicleManager();
    this.businessManager = new BusinessManager();
    this.photoManager = new PhotoManager();
    this.educationManager = new EducationManager();
    this.rentersManager = new RentersManager();
    this.memoryManager = new MemoryManager();
    this.wardrobeManager = new WardrobeManager();
    this.weddingManager = new WeddingManager();
    this.hobbyManager = new HobbyManager();
    this.eventManager = new EventManager();

    // UI Modules
    this.hud = new HUDManager(uiContainer, this.soundManager);
    this.toastManager = new ToastManager(uiContainer);

    this.whimPanel = new WhimPanel(uiContainer, this.whimManager, this.sim, this.toastManager);
    this.casModal = new CASModal(uiContainer, this.soundManager);
    this.buildCatalog = new BuildBuyCatalog(uiContainer, this.soundManager);
    this.careerPanel = new CareerPanel(uiContainer, this.soundManager);
    this.privacyModal = new PrivacyModal(uiContainer, this.soundManager);
    this.socialWheel = new SocialWheel(uiContainer, this.soundManager);
    this.relationshipsPanel = new RelationshipsPanel(uiContainer);
    this.familyTreePanel = new FamilyTreePanel(uiContainer);
    this.partyModal = new PartyModal(uiContainer, this.soundManager);

    this.furnitureModal = new FurnitureModal(uiContainer, this.soundManager);
    this.inventoryPanel = new InventoryPanel(uiContainer, this.soundManager);
    this.audioSettingsModal = new AudioSettingsModal(uiContainer, this.soundManager, this.radioManager);
    this.aspirationModal = new AspirationModal(uiContainer, this.soundManager);
    this.worldMapModal = new WorldMapModal(uiContainer, this.soundManager);
    this.calendarModal = new CalendarModal(uiContainer, this.soundManager);
    this.billsModal = new BillsModal(uiContainer, this.soundManager);
    this.magicModal = new MagicModal(uiContainer, this.soundManager);
    this.vehicleModal = new VehicleModal(uiContainer, this.soundManager);
    this.businessModal = new BusinessModal(uiContainer, this.soundManager);
    this.photoModal = new PhotoModal(uiContainer, this.soundManager);
    this.educationModal = new EducationModal(uiContainer, this.soundManager);
    this.rentersModal = new RentersModal(uiContainer, this.soundManager);
    this.memoryModal = new MemoryModal(uiContainer, this.soundManager);
    this.wardrobeModal = new WardrobeModal(uiContainer, this.soundManager);
    this.galleryModal = new GalleryModal(uiContainer, this.soundManager);
    this.weddingModal = new WeddingModal(uiContainer, this.soundManager);
    this.hobbyModal = new HobbyModal(uiContainer, this.soundManager);
    this.eventModal = new EventModal(uiContainer, this.soundManager);

    this.recipeModal = new RecipeModal(uiContainer, this.sim, this.toastManager, this.soundManager, (hungerBoost, mealName) => {
      this.sim.needs.modify('hunger', hungerBoost);
      this.toastManager.showToast('🍳 Mahlzeit serviert!', `${mealName} hat den Hunger gestillt.`, '😋', 'success');
      this.whimManager.checkWhimFulfillment(this.sim, 'cooking');
    });

    this.saveSlotModal = new SaveSlotModal(uiContainer, this, this.toastManager);
    this.helpModal = new HelpModal(uiContainer);

    this.cheatConsole = new CheatConsoleModal(this);
    this.careerMiniGameModal = new CareerMiniGameModal(this);
    this.deliverySystem = new DeliverySystem();
    this.smartphoneModal = new SmartphoneModal(this.sim, this.deliverySystem, this.toastManager, this.soundManager);
    this.petCompetitionModal = new PetCompetitionModal();
    this.publicLotMinigamesModal = new PublicLotMinigamesModal();
    this.neighborhoodProgression = new NeighborhoodProgression();
    this.realEstateManager = new RealEstateManager();
    this.realEstateModal = new RealEstateModal();
    this.traitQuestSystem = new TraitQuestSystem();
    this.lifeJournalModal = new LifeJournalModal();
    this.emergencyRescueModal = new EmergencyRescueModal();
    this.fameSystem = new FameSystem();
    this.fameModal = new FameModal();
    this.occultSystem = new OccultSystem();
    this.occultModal = new OccultModal();
    this.highSchoolSystem = new HighSchoolSystem();
    this.promModal = new PromModal();
    this.restaurantSystem = new RestaurantSystem();
    this.restaurantModal = new RestaurantModal();

    this.resortManager = new ResortManager();
    this.resortModal = new ResortModal();
    this.inventionSystem = new InventionSystem();
    this.scienceLabModal = new ScienceLabModal();
    this.decoratorSystem = new InteriorDecoratorSystem();
    this.decoratorModal = new DecoratorModal();
    this.petBreedingSystem = new PetBreedingSystem();
    this.petShelterModal = new PetShelterModal();

    this.farmSystem = new FarmSystem();
    this.ranchModal = new RanchModal();
    this.filmStudioSystem = new FilmStudioSystem();
    this.directorModal = new DirectorModal();
    this.yachtManager = new YachtManager();
    this.cruiseModal = new CruiseModal();
    this.healthSystem = new HealthSystem();
    this.healthModal = new HealthModal(uiContainer, this.soundManager);
    this.festivalModal = new FestivalModal(uiContainer, this.soundManager);
    this.vetClinicManager = new VetClinicManager();
    this.vetClinicModal = new VetClinicModal(uiContainer, this.soundManager);
    this.politicsManager = new PoliticsManager();
    this.politicsModal = new PoliticsModal(uiContainer, this.soundManager);
    this.archaeologySystem = new ArchaeologySystem();
    this.archaeologyModal = new ArchaeologyModal(uiContainer, this.soundManager);
    this.schoolSystem = new SchoolSystem();
    this.schoolModal = new SchoolModal(uiContainer, this.soundManager);
    this.themeParkManager = new ThemeParkManager();
    this.themeParkModal = new ThemeParkModal(uiContainer, this.soundManager);
    this.spaceManager = new SpaceManager();
    this.spaceModal = new SpaceModal(uiContainer, this.soundManager);
    this.bandManager = new BandManager();
    this.bandModal = new BandModal(uiContainer, this.soundManager);
    this.inheritanceManager = new InheritanceManager();
    this.inheritanceModal = new InheritanceModal(uiContainer, this.soundManager);
    this.travelManager = new TravelManager();
    this.travelModal = new TravelModal(uiContainer, this.soundManager);
    this.familiarManager = new FamiliarManager();
    this.detectiveManager = new DetectiveManager();
    this.detectiveModal = new DetectiveModal(uiContainer, this.soundManager);
    this.smartGarden = new SmartGardenSystem();
    this.equestrianManager = new EquestrianManager();
    this.equestrianModal = new EquestrianModal(uiContainer, this.soundManager);
    this.scubaSystem = new ScubaDivingSystem();
    this.scubaModal = new ScubaModal(uiContainer, this.soundManager);
    this.penthouseManager = new PenthouseManager();
    this.penthouseModal = new PenthouseModal(uiContainer, this.soundManager);
    this.privateChefManager = new PrivateChefManager();
    this.privateChefModal = new PrivateChefModal(uiContainer, this.soundManager);

    this.inputHandler = new InputHandler(this.canvas, this.camera, this.renderer, this.soundManager);
    this.inputHandler.onUndoPressed = () => {
      if (this.buildHistory.undo(this.house)) {
        this.toastManager.showToast('Bau-Rückgängig', '↩️ Bauaktion rückgängig gemacht!', '↩️', 'info');
      }
    };
    this.inputHandler.onRedoPressed = () => {
      if (this.buildHistory.redo(this.house)) {
        this.toastManager.showToast('Bau-Wiederholen', '↪️ Bauaktion wiederholt!', '↪️', 'info');
      }
    };
    this.inputHandler.onHelpPressed = () => {
      this.helpModal.open();
    };


    this.initCanvasSize();
    this.setupEventHandlers();
    this.attemptLoadSave();

    // Wire NPC player reference for social AI (Verbesserung #7)
    this.npcManager.setPlayerReference(this.sim);

    // Initialize minimap (Verbesserung #16)
    this.minimap = new Minimap(uiContainer);

    this.toastManager.showToast('Willkommen bei Sims 5 (v18.0)', 'Bugfixes, Traits wirken jetzt, Quest-Rotation, Neue Skills & mehr!', '💎', 'info');
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
        } else if (toolMode === 'room') {
          if (!this.roomStartGrid) {
            this.roomStartGrid = { x: gridX, y: gridY };
            this.toastManager.showToast('Raum-Ecke 1 gewählt', `Ecke 1 bei (${gridX}, ${gridY}) fixiert. Klicke jetzt die gegenüberliegende Ecke!`, '📦', 'info');
            return; // Don't reset toolMode yet, wait for second corner click
          } else {
            const start = this.roomStartGrid;
            const end = { x: gridX, y: gridY };
            const width = Math.abs(end.x - start.x) + 1;
            const height = Math.abs(end.y - start.y) + 1;
            const cost = width * height * 40 + (width + height) * 2 * 50;

            if (this.sim.simoleons >= cost) {
              this.sim.simoleons -= cost;
              this.house.buildRoom(start.x, start.y, end.x, end.y, this.buildCatalog.activeFloorType, this.buildCatalog.activeFloorColor);
              this.soundManager.playBuySound();
              this.toastManager.showToast('📦 Raum fertiggestellt', `${width}x${height} Raum für § ${cost} errichtet!`, '🏠', 'success');
            } else {
              alert(`Nicht genügend Simoleons (§ ${cost} benötigt)!`);
            }
            this.roomStartGrid = null;
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

              if (interaction.id === 'climb_stairs_up') {
                const next = Math.min(2, this.house.activeFloor + 1);
                this.house.setFloor(next);
                this.soundManager.playLevelUp();
                this.toastManager.showToast('Treppe gestiegen', `Du hast Etage ${next} betreten!`, '🪜', 'info');
              } else if (interaction.id === 'climb_stairs_down') {
                const prev = Math.max(-1, this.house.activeFloor - 1);
                this.house.setFloor(prev);
                this.soundManager.playUIClick();
                this.toastManager.showToast('Treppe hinabgestiegen', `Du hast Etage ${prev} betreten!`, '🪜', 'info');
              }

              if (interaction.id === 'brew_potion' || interaction.id === 'study_spells') {
                const leveledUp = this.magicManager.addMagicXP(20);
                if (leveledUp) {
                  this.soundManager.playLevelUp();
                  this.toastManager.showToast('✨ MAGIE STUFE ERHÖHT!', `Du hast Magie-Stufe ${this.magicManager.magicLevel} erreicht & neue Zaubersprüche freigeschaltet!`, '🔮', 'levelUp');
                }
              }

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

              if (interaction.id === 'hold_wedding') {
                const res = this.weddingManager.holdCeremony(this.sim);
                if (res.success) {
                  this.soundManager.playLevelUp();
                  this.toastManager.showToast('💒 Hochzeit', res.message, '💒', 'levelUp');
                } else {
                  this.toastManager.showToast('⚠️ Hochzeit', res.message, '💍', 'warning');
                }
              } else if (interaction.id === 'play_guitar') {
                this.sim.simoleons += 80;
                this.soundManager.playSimlish(1.2, 'happy');
                this.toastManager.showToast('🎸 Gitarre', 'Gitarre gespielt & Straßenmusik-Trinkgeld kassiert: +§ 80', '🎵', 'success');
              } else if (interaction.id === 'play_chess') {
                this.sim.addSkillXP('programming', 15);
                this.soundManager.playUIClick();
                this.toastManager.showToast('♟️ Schach', 'Schachpartie gewonnen & Logik geschärft!', '🧠', 'info');
              } else if (interaction.id === 'carve_wood') {
                this.hobbyManager.addHandinessXP(30);
                this.sim.inventory.addItem({
                  name: 'Geschnitzte Holzfigur',
                  type: 'painting',
                  icon: '🪵',
                  value: 120,
                  description: 'Eine in Handarbeit gefertigte Skulptur.'
                });
                this.toastManager.showToast('🔨 Werkbank', 'Holzskulptur fertiggestellt! (+§ 120 Wert)', '🪚', 'success');
              } else if (interaction.id === 'mourn_ghost') {
                this.toastManager.showToast('🪦 Grabstein', 'Am Grabstein getrauert & Ahnen geehrt.', '👻', 'info');
              }

              if (interaction.id === 'collect_eggs') {
                this.sim.inventory.addItem({
                  name: 'Frische Landeier',
                  type: 'crop',
                  icon: '🥚',
                  value: 40,
                  description: 'Frisch von den Landhaus-Hühnern gelegte Eier.'
                });
                this.soundManager.playLevelUp();
                this.toastManager.showToast('Hühnerstall', 'Frische Landeier eingesammelt! (+§ 40 Wert)', '🥚', 'success');
              } else if (interaction.id === 'harvest_honey') {
                this.sim.inventory.addItem({
                  name: 'Süßer Bio-Honig',
                  type: 'crop',
                  icon: '🍯',
                  value: 60,
                  description: 'Reiner, biologischer Honig aus dem eigenen Bienenstock.'
                });
                this.soundManager.playLevelUp();
                this.toastManager.showToast('Bienenstock', 'Süßen Bio-Honig geerntet! (+§ 60 Wert)', '🍯', 'success');
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
      // Trigger visual conversation speech bubbles on both Sims
      this.npcManager.triggerEmote(npc.id, option.emoteSymbol, 3500);
      this.sim.triggerEmote(option.emoteSymbol, 3500);

      // EventBus emission for decoupled listeners
      EventBus.getInstance().emit('SIM_SOCIAL_INTERACTION', {
        simId: this.sim.id,
        targetNpcId: npc.id,
        interactionId: option.id,
        emote: option.emoteSymbol
      });

      this.partyManager.triggerGoal('p_talk');

      if (option.id === 'party_toast') {
        this.partyManager.triggerGoal('p_toast');
      }

      if (option.id === 'couple_dance') {
        this.sim.addSkillXP('fitness', 15);
        this.sim.addSkillXP('charisma', 20);
        this.soundManager.playSimlish(1.2, 'flirty');
        this.toastManager.showToast('💃 Paartanz', `Mit ${npc.name} über die Tanzfläche geschwebt!`, '💖', 'success');
      } else if (option.id === 'massage') {
        this.sim.needs.modify('fun', 30);
        this.soundManager.playSimlish(1.0, 'flirty');
        this.toastManager.showToast('💆 Schultermassage', `Romantische Massage mit ${npc.name} genossen!`, '✨', 'success');
      } else if (option.id === 'give_gift') {
        this.sim.simoleons = Math.max(0, this.sim.simoleons - 50);
        this.soundManager.playBuySound();
        this.toastManager.showToast('🎁 Geschenk überreicht', `${npc.name} hat sich riesig über das Präsent gefreut! (-§ 50)`, '🎀', 'success');
      }

      if (option.id === 'make_baby') {
        const babyName = `${this.sim.customization.name.split(' ')[0]} Jr.`;
        this.sim.childrenNames.push(babyName);
        this.sim.partnerName = npc.name;

        // Add child as a new household Sim with genetics inheritance!
        const dna = GeneticsEngine.createOffspringDNA(this.sim.customization, {
          name: npc.name,
          gender: 'female',
          skinColor: npc.skinColor,
          hairColor: npc.hairColor,
          outfitColor: npc.outfitColor,
          trait: 'Genial',
          aspiration: 'Familie'
        });

        const childSim = new Sim({
          name: babyName,
          skinColor: dna.skinColor,
          hairColor: dna.hairColor,
          outfitColor: dna.outfitColor,
          trait: dna.inheritedTraits[0]
        });
        childSim.lifeStage = 'baby';
        this.household.addSim(childSim);

        this.soundManager.playLevelUp();
        this.toastManager.showToast('👶 GLÜCKWUNSCH!', `Baby "${babyName}" (mit vererbter Genetik & Merkmal: ${dna.inheritedTraits[0]}) wurde geboren!`, '🍼', 'levelUp');
      }
    };

    // Household Sim Switcher Handlers
    this.hud.onSwitchSim = (index) => {
      this.sim = this.household.setActiveSim(index);
      this.whimPanel.setSim(this.sim);
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
    this.hud.onOpenAspirations = () => this.aspirationModal.open(this.sim, this.toastManager);
    this.hud.onOpenWorldMap = () => this.worldMapModal.open(this.worldMap, this, this.toastManager);
    this.hud.onOpenCalendar = () => this.calendarModal.open(this.calendarManager, this, this.toastManager);
    this.hud.onSaveGame = () => this.saveSlotModal.open();

    this.hud.onOpenBills = () => this.billsModal.open(this.billsManager, this.house, this, this.toastManager);
    this.hud.onOpenMagic = () => this.magicModal.open(this.magicManager, this, this.toastManager);
    this.hud.onOpenVehicle = () => this.vehicleModal.open(this.vehicleManager, this, this.toastManager);
    this.hud.onOpenBusiness = () => this.businessModal.open(this.businessManager, this, this.toastManager);
    this.hud.onOpenPhoto = () => this.photoModal.open(this.photoManager, this, this.toastManager);
    this.hud.onOpenEducation = () => this.educationModal.open(this.sim, this.educationManager, (amt) => this.sim.simoleons += amt);
    this.hud.onOpenRenters = () => this.rentersModal.open(this.sim, this.rentersManager, (amt) => this.sim.simoleons += amt);
    this.hud.onOpenMemory = () => this.memoryModal.open(this.sim, this.memoryManager);
    this.hud.onOpenWardrobe = () => this.wardrobeModal.open(this.sim, this.wardrobeManager);
    this.hud.onOpenGallery = () => this.galleryModal.open(this);
    this.hud.onOpenWedding = () => this.weddingModal.open(this.sim, this.weddingManager);
    this.hud.onOpenHobby = () => this.hobbyModal.open(this.sim, this.hobbyManager);
    this.hud.onOpenEvent = () => this.eventModal.open(this.sim, this.eventManager);
    this.hud.onOpenResort = () => this.resortModal.open(this.resortManager, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenScienceLab = () => this.scienceLabModal.open(this.inventionSystem, this.sim, this.toastManager, this.soundManager, this.weatherSystem);
    this.hud.onOpenDecorator = () => this.decoratorModal.open(this.decoratorSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenPetShelter = () => this.petShelterModal.open(this.petBreedingSystem, this.petManager, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenFarm = () => this.ranchModal.open(this.farmSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenDirector = () => this.directorModal.open(this.filmStudioSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenCruise = () => this.cruiseModal.open(this.yachtManager, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenHealth = () => this.healthModal.open(this.healthSystem, this.sim, this.toastManager);
    this.hud.onOpenFestival = () => this.festivalModal.open(this.sim, this.timeSystem.day, this.toastManager);
    this.hud.onOpenVet = () => this.vetClinicModal.open(this.vetClinicManager, this.petManager.pets, this.sim, this.toastManager);
    this.hud.onOpenPolitics = () => this.politicsModal.open(this.politicsManager, this.sim, this.toastManager);
    this.hud.onOpenArch = () => this.archaeologyModal.open(this.archaeologySystem, this.sim, this.toastManager);
    this.hud.onOpenSchool = () => this.schoolModal.open(this.schoolSystem, this.sim, this.toastManager);
    this.hud.onOpenThemePark = () => this.themeParkModal.open(this.themeParkManager, this.sim, this.toastManager);
    this.hud.onOpenSpace = () => this.spaceModal.open(this.spaceManager, this.sim, this.toastManager);
    this.hud.onOpenBand = () => this.bandModal.open(this.bandManager, this.sim, this.toastManager);
    this.hud.onOpenInheritance = () => this.inheritanceModal.open(this.inheritanceManager, this.sim, this.toastManager);
    this.hud.onOpenTravel = () => this.travelModal.open(this.travelManager, this.sim, this.toastManager);
    this.hud.onOpenDetective = () => this.detectiveModal.open(this.detectiveManager, this.sim, this.toastManager);
    this.hud.onOpenEquestrian = () => this.equestrianModal.open(this.equestrianManager, this.sim, this.toastManager);
    this.hud.onOpenScuba = () => this.scubaModal.open(this.scubaSystem, this.sim, this.toastManager);
    this.hud.onOpenPenthouse = () => this.penthouseModal.open(this.penthouseManager, this.sim, this.toastManager);
    this.hud.onOpenPrivateChef = () => this.privateChefModal.open(this.privateChefManager, this.sim, this.toastManager);
    this.hud.onOpenCheats = () => this.cheatConsole.open();
    this.hud.onOpenSmartphone = () => this.smartphoneModal.open();
    this.hud.onOpenPetShow = () => {
      const pet = this.petManager.pets[0];
      if (pet) {
        this.petCompetitionModal.open(pet, this.sim, this.toastManager, this.soundManager);
      } else {
        this.toastManager.showToast('🏆 Pet Show', 'Du benötigst ein Haustier im Haushalt für den Wettbewerb!', '🐕', 'info');
      }
    };
    this.hud.onOpenRealEstate = () => this.realEstateModal.open(this.realEstateManager, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenJournal = () => this.lifeJournalModal.open(this.sim, this.traitQuestSystem, this.soundManager);
    this.hud.onOpenFame = () => this.fameModal.open(this.fameSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenOccult = () => this.occultModal.open(this.occultSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenProm = () => this.promModal.open(this.highSchoolSystem, this.sim, this.toastManager, this.soundManager);
    this.hud.onOpenRestaurant = () => this.restaurantModal.open(this.restaurantSystem, this.sim, this.toastManager, this.soundManager);

    this.hud.onChangeFloor = (level) => {
      this.house.setFloor(level);
      this.toastManager.showToast('Etage gewechselt', `Du steuerst jetzt Etage ${level}`, '🏰', 'info');
    };

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
      const saved = SaveManager.saveFullGame(this);
      if (saved) {
        this.soundManager.playLevelUp();
        this.toastManager.showToast('Spielstand gespeichert', 'Alle Systeme (Farm, Karriere, Quests, Gesundheit, etc.) vollständig gespeichert!', '💾', 'success');
      } else {
        this.toastManager.showToast('⚠️ Speicherfehler', 'Spielstand konnte nicht gespeichert werden!', '⚠️', 'warning');
      }
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
    const loaded = SaveManager.loadFullGame(this);
    if (loaded) {
      this.sim = this.household.getActiveSim();
      console.log('[Game Engine] Full game state loaded successfully (v18 SaveManager).');
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

    // 2. Weather, Garden, Calendar, Bills, Magic, Delivery, Business & Ambient Audio Updates
    this.weatherSystem.update(timeResult.deltaMinutes);
    this.gardenSystem.update(timeResult.deltaMinutes);
    this.smartGarden.updateSprinklers(this.gardenSystem);
    this.healthSystem.update(timeResult.deltaMinutes, this.sim, this.weatherSystem.currentWeather);
    this.farmSystem.updateTick();
    this.deliverySystem.update(deltaSec, this.sim, this.toastManager, this.soundManager);
    this.calendarManager.updateTime(this.timeSystem.day);
    this.billsManager.updateTime(this.timeSystem.day, this.house);
    this.magicManager.updateTime(timeResult.deltaMinutes);
    this.neighborhoodProgression.update(timeResult.deltaMinutes, this.sim, this.toastManager, this.soundManager);
    this.ambientAudio.updateSoundscape(this.timeSystem.hour, this.weatherSystem.currentWeather as any);

    // Bug #3 fix: Daily quest reset check
    const questReset = this.questManager.checkDailyReset(this.timeSystem.day, this.sim.getActiveTraitIds()[0]);
    if (questReset) {
      this.toastManager.showToast('📋 Neue Tagesquests!', '5 frische Aufgaben warten auf dich. Viel Erfolg!', '📋', 'info');
    }

    // Simulate business sales tick
    if (Math.random() < 0.005) {
      this.businessManager.simulateCustomerTick();
    }

    if (this.weatherSystem.currentWeather === 'sunny' && Math.random() < 0.002) {
      this.soundManager.playBirdChirp();
    }

    // 3. Autonomy Update for all Household Sims (active & inactive)
    let allSleeping = true;
    this.household.sims.forEach(hSim => {
      hSim.update(deltaSec, timeResult.deltaMinutes);
      SimAutonomy.update(hSim, this.house, deltaSec);

      // Bug #9 fix: Faint warning when critically low needs
      if (hSim.isFainting) {
        this.sim.moodletManager.addMoodlet({
          id: 'fainting_critical',
          name: 'Kurz vor der Ohnmacht',
          emotion: 'exhausted',
          weight: 3,
          durationSec: 30,
          icon: '😵',
          description: 'Hunger & Energie auf kritischem Niveau!'
        });
        if (hSim === this.sim && this.faintWarningCooldown <= 0) {
          this.toastManager.showToast('⚠️ Notfall!', `${hSim.customization.name} droht ohnmächtig zu werden! Sofort essen und schlafen!`, '😵', 'warning');
          this.faintWarningCooldown = 15; // Only warn every 15 seconds
        }
      }

      const currentAct = hSim.actionQueue.getCurrentAction();
      if (!currentAct || (currentAct.id !== 'sleep' && currentAct.id !== 'nap')) {
        allSleeping = false;
      }
    });

    // Auto fast-forward if everyone is sleeping
    if (this.household.sims.length > 0 && allSleeping && this.timeSystem.speedMultiplier !== 3) {
      this.timeSystem.setSpeed(3);
    }

    // 4. Pet Manager, Autonomy & Health Checkup
    this.petManager.update(deltaSec, timeResult.deltaMinutes);
    this.vetClinicManager.update(this.petManager.pets);
    this.petManager.pets.forEach(pet => {
      PetAutonomy.update(pet, this.house, deltaSec);
    });

    if (Math.random() < 0.001) {
      const birthRes = this.petBreedingSystem.updateGestationTick();
      if (birthRes.birthed && birthRes.puppyName) {
        this.soundManager.playLevelUp();
        this.petManager.addPet(birthRes.puppyName, birthRes.species?.includes('Hund') ? 'dog' : 'cat', '#f472b6');
        this.toastManager.showToast('🐾 GEBURT IM HAUS!', `Ein neues Tierbaby (${birthRes.puppyName} - ${birthRes.species}) wurde geboren!`, '🍼', 'levelUp');
      }
    }

    // 5. Party & NPC Updates
    const partyResult = this.partyManager.update(timeResult.deltaMinutes);
    if (partyResult.partyEnded) {
      this.sim.simoleons += partyResult.rewardSimoleons || 0;
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🎉 PARTY BEENDET!', `${partyResult.finalStars} ⭐ Sterne erzielt! Gewinn: § ${partyResult.rewardSimoleons}`, '🏆', 'levelUp');
    }
    this.npcManager.update(deltaSec);

    // 6. Check Aspiration Milestones
    const newlyCompleted = AspirationManager.checkMilestones(this.sim, this);
    newlyCompleted.forEach(desc => {
      this.soundManager.playLevelUp();
      this.toastManager.showToast('🎯 MEILENSTEIN ERREICHT!', desc, '⭐', 'levelUp');
    });

    // 7. Camera Update
    this.camera.update();

    // 8. Render Scene
    this.renderer.render(
      this.house,
      this.sim,
      this.npcManager,
      this.camera,
      this.timeSystem.hour,
      this.weatherSystem,
      this.gardenSystem,
      this.household.sims,
      this.petManager,
      this.eventManager,
      this.radioManager
    );

    // 9. Update HUD & Whims
    this.hud.update(this.sim, this.timeSystem, this.household, this.petManager);
    this.whimPanel.update();

    // 10. Minimap render (Verbesserung #16)
    if (this.minimap) {
      this.minimap.render(this.house, this.sim, this.npcManager, this.petManager);
    }

    // Update faint warning cooldown
    if (this.faintWarningCooldown > 0) this.faintWarningCooldown -= deltaSec;

    requestAnimationFrame(this.loop.bind(this));
  }
}

