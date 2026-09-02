/**
 * Safe Persistence & LocalStorage Save Manager
 * Handles game state serialization, safe deserialization, and save file import/export.
 * v18: Extended to persist ALL game systems added in versions 10–17.
 */

import { Sim } from '../entity/Sim';
import { House } from '../world/House';
import { CareerManager } from './CareerSystem';
import { Sanitizer } from '../security/Sanitizer';
import { Pet } from '../entity/Pet';

export interface GameSaveData {
  version: string;
  timestamp: number;
  sim: {
    customization: Sim['customization'];
    gridPos: { x: number; y: number };
    needs: ReturnType<Sim['needs']['getValues']>;
    simoleons: number;
    skills: Sim['skills'];
    lifeStage?: import('../entity/LifeStage').LifeStageType;
    ageDays?: number;
    partnerName?: string;
    childrenNames?: string[];
    inventoryItems?: import('../entity/Inventory').InventoryItem[];
    aspirationPoints?: number;
    aspirationId?: string;
    completedMilestones?: string[];
  };
  householdSims?: Array<{
    customization: Sim['customization'];
    gridPos: { x: number; y: number };
    needs: ReturnType<Sim['needs']['getValues']>;
    simoleons: number;
    skills: Sim['skills'];
    lifeStage?: import('../entity/LifeStage').LifeStageType;
    ageDays?: number;
    partnerName?: string;
    childrenNames?: string[];
    inventoryItems?: import('../entity/Inventory').InventoryItem[];
    aspirationPoints?: number;
    aspirationId?: string;
    completedMilestones?: string[];
  }>;
  activeSimIndex?: number;
  petsData?: Array<{
    name: string;
    species: import('../entity/Pet').PetSpecies;
    color: string;
    gridPos: { x: number; y: number };
    needs: { hunger: number; affection: number; energy: number; play: number };
  }>;
  house: {
    placedFurniture: House['placedFurniture'];
    wallDisplayMode?: 'full' | 'cutaway' | 'hidden';
    activeFloor?: number;
    floorFurnitureMap?: Record<number, House['placedFurniture']>;
    tiles?: Array<Array<{
      type: import('../world/House').FloorType;
      color: string;
      hasWallNorth?: boolean;
      hasWallWest?: boolean;
      wallColor?: string;
      openingNorth?: 'door' | 'window' | 'sliding_patio_door';
      openingWest?: 'door' | 'window' | 'sliding_patio_door';
    }>>;
  };
  career?: {
    careerId: string;
    rank: number;
  };
  relationships?: Array<{
    targetSimId: string;
    targetSimName: string;
    friendship: number;
    romance: number;
  }>;
  calendarData?: {
    currentSeason: 'spring' | 'summer' | 'autumn' | 'winter';
    dayOfSeason: number;
    completedTraditions: string[];
  };
  billsData?: {
    dueDay: number;
    pendingBillAmount: number;
    isBillDue: boolean;
    isPowerCutoff: boolean;
  };
  magicData?: {
    magicLevel: number;
    magicXP: number;
    manaPoints: number;
    unlockedSpells: string[];
  };
  vehicleData?: {
    ownedVehicleIds: string[];
    activeVehicleId: string;
  };
  businessData?: {
    storeId: string;
    isStoreOpen: boolean;
    marginSetting: 'fair' | 'premium' | 'luxury';
    dailyRevenue: number;
    customerSatisfaction: number;
    totalSalesCount: number;
  };
  photoData?: {
    photos: import('./PhotoSystem').PhotoItem[];
    memories: import('./PhotoSystem').MemoryEntry[];
  };
  educationData?: {
    grade: number;
    homeworkDone: boolean;
    enrolledDegree?: string;
    degreeProgress: number;
    completedDegrees: string[];
  };
  rentersData?: {
    tenants: import('./RentersSystem').Tenant[];
  };
  // System data (all exported via exportData() pattern)
  resortData?: any;
  inventionData?: any;
  decoratorData?: any;
  petBreedingData?: any;
  farmData?: any;
  filmStudioData?: any;
  yachtData?: any;
  // v18: newly persisted systems
  questData?: any;
  healthData?: any;
  fameData?: any;
  politicsData?: any;
  archaeologyData?: any;
  schoolData?: any;
  themeParkData?: any;
  spaceData?: any;
  bandData?: any;
  inheritanceData?: any;
  travelData?: any;
  familiarData?: any;
  detectiveData?: any;
  equestrianData?: any;
  scubaData?: any;
  penthouseData?: any;
  privateChefData?: any;
  restaurantData?: any;
  realEstateData?: any;
  vetClinicData?: any;
  aspirationData?: any;
  weddingData?: any;
  hobbyData?: any;
  occultData?: any;
  festivalData?: any;
  trophiesUnlocked?: string[];
  gardenPlots?: import('../world/GardenSystem').GardenPlot[];
  weather?: import('./WeatherSystem').WeatherType;
}

export class SaveManager {
  private static readonly SAVE_KEY = 'sims_game_save_v1';

  public static saveGame(
    simOrGame: Sim | any,
    houseOrSlotKey?: House | string,
    career?: CareerManager,
    npcManager?: import('../entity/NPCManager').NPCManager,
    partyManager?: import('../systems/PartyManager').PartyManager,
    gardenSystem?: import('../world/GardenSystem').GardenSystem,
    weatherSystem?: import('./WeatherSystem').WeatherSystem,
    household?: import('../entity/Household').Household,
    petManager?: import('../entity/PetManager').PetManager,
    calendarManager?: import('../systems/CalendarSystem').CalendarManager,
    billsManager?: import('../systems/BillsSystem').BillsManager,
    magicManager?: import('../systems/MagicSystem').MagicManager,
    vehicleManager?: import('../systems/VehicleSystem').VehicleManager,
    businessManager?: import('../systems/BusinessSystem').BusinessManager,
    photoManager?: import('../systems/PhotoSystem').PhotoManager,
    educationManager?: import('./EducationSystem').EducationManager,
    rentersManager?: import('./RentersSystem').RentersManager
  ): boolean {
    try {
      let key = this.SAVE_KEY;
      let sim = simOrGame as Sim;
      let house = houseOrSlotKey as House;

      if (simOrGame && simOrGame.sim && simOrGame.house) {
        sim = simOrGame.sim;
        house = simOrGame.house;
        if (typeof houseOrSlotKey === 'string') {
          key = houseOrSlotKey;
        }
      }

      const saveData: GameSaveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        sim: {
          customization: sim.customization,
          gridPos: sim.gridPos,
          needs: sim.needs.getValues(),
          simoleons: sim.simoleons,
          skills: sim.skills,
          lifeStage: sim.lifeStage,
          ageDays: sim.ageDays,
          partnerName: sim.partnerName,
          childrenNames: sim.childrenNames,
          inventoryItems: sim.inventory.items,
          aspirationPoints: sim.aspirationPoints,
          aspirationId: sim.aspirationId,
          completedMilestones: sim.completedMilestones
        },
        householdSims: household?.sims.map(s => ({
          customization: s.customization,
          gridPos: s.gridPos,
          needs: s.needs.getValues(),
          simoleons: s.simoleons,
          skills: s.skills,
          lifeStage: s.lifeStage,
          ageDays: s.ageDays,
          partnerName: s.partnerName,
          childrenNames: s.childrenNames,
          inventoryItems: s.inventory.items,
          aspirationPoints: s.aspirationPoints,
          aspirationId: s.aspirationId,
          completedMilestones: s.completedMilestones
        })),
        activeSimIndex: household?.activeSimIndex || 0,
        petsData: petManager?.pets.map(p => ({
          name: p.name,
          species: p.species,
          color: p.color,
          gridPos: p.gridPos,
          needs: {
            hunger: p.needs.hunger,
            affection: p.needs.affection,
            energy: p.needs.energy,
            play: p.needs.play
          }
        })),
        house: {
          placedFurniture: house.placedFurniture,
          wallDisplayMode: house.wallDisplayMode,
          activeFloor: house.activeFloor,
          floorFurnitureMap: house.floorFurnitureMap,
          tiles: house.tiles.map(row => row.map(tile => ({
            type: tile.type,
            color: tile.color,
            hasWallNorth: tile.hasWallNorth,
            hasWallWest: tile.hasWallWest,
            wallColor: tile.wallColor,
            openingNorth: tile.openingNorth,
            openingWest: tile.openingWest
          })))
        },
        career: career ? {
          careerId: career.currentCareerId,
          rank: career.currentRank
        } : undefined,
        relationships: npcManager?.npcs.map(n => ({
          targetSimId: n.id,
          targetSimName: n.name,
          friendship: n.relationship.friendship,
          romance: n.relationship.romance
        })),
        calendarData: calendarManager ? {
          currentSeason: calendarManager.currentSeason,
          dayOfSeason: calendarManager.dayOfSeason,
          completedTraditions: calendarManager.completedTraditions
        } : undefined,
        billsData: billsManager ? {
          dueDay: billsManager.dueDay,
          pendingBillAmount: billsManager.pendingBillAmount,
          isBillDue: billsManager.isBillDue,
          isPowerCutoff: billsManager.isPowerCutoff
        } : undefined,
        magicData: magicManager ? {
          magicLevel: magicManager.magicLevel,
          magicXP: magicManager.magicXP,
          manaPoints: magicManager.manaPoints,
          unlockedSpells: magicManager.unlockedSpells
        } : undefined,
        vehicleData: vehicleManager ? {
          ownedVehicleIds: vehicleManager.ownedVehicleIds,
          activeVehicleId: vehicleManager.activeVehicleId
        } : undefined,
        businessData: businessManager ? {
          storeId: businessManager.storeId,
          isStoreOpen: businessManager.isStoreOpen,
          marginSetting: businessManager.marginSetting,
          dailyRevenue: businessManager.dailyRevenue,
          customerSatisfaction: businessManager.customerSatisfaction,
          totalSalesCount: businessManager.totalSalesCount
        } : undefined,
        photoData: photoManager ? {
          photos: photoManager.photos,
          memories: photoManager.memories
        } : undefined,
        educationData: educationManager ? {
          grade: educationManager.grade,
          homeworkDone: educationManager.homeworkDone,
          enrolledDegree: educationManager.enrolledDegree,
          degreeProgress: educationManager.degreeProgress,
          completedDegrees: educationManager.completedDegrees
        } : undefined,
        rentersData: rentersManager ? {
          tenants: rentersManager.tenants
        } : undefined,
        trophiesUnlocked: partyManager?.trophiesUnlocked,
        gardenPlots: gardenSystem?.plots,
        weather: weatherSystem?.currentWeather
      };

      const jsonStr = JSON.stringify(saveData);
      localStorage.setItem(key, jsonStr);
      return true;
    } catch (e) {
      console.error('[SaveManager] Error saving game:', e);
      return false;
    }
  }

  /**
   * Save the full game instance (all systems) to a slot key.
   * Uses exportData() pattern for all subsystems added in v10-v17.
   * This is the recommended save method when called from the game loop.
   */
  public static saveFullGame(gameInstance: any, slotKey?: string): boolean {
    try {
      const key = slotKey || this.SAVE_KEY;
      const g = gameInstance;

      // Build base save with existing saveGame logic
      const base = this.saveGame(
        g.sim, g.house, g.careerManager, g.npcManager, g.partyManager,
        g.gardenSystem, g.weatherSystem, g.household, g.petManager,
        g.calendarManager, g.billsManager, g.magicManager, g.vehicleManager,
        g.businessManager, g.photoManager, g.educationManager, g.rentersManager
      );
      if (!base) return false;

      // Load the just-saved data and extend with all new system data
      const raw = localStorage.getItem(key) || localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;

      const saveData: any = JSON.parse(raw);

      // v18 extended system saves using exportData() pattern
      const systemExports: Record<string, any> = {
        questData:       g.questManager?.exportData?.(),
        healthData:      g.healthSystem?.exportData?.(),
        fameData:        g.fameSystem?.exportData?.(),
        politicsData:    g.politicsManager?.exportData?.(),
        archaeologyData: g.archaeologySystem?.exportData?.(),
        schoolData:      g.schoolSystem?.exportData?.(),
        themeParkData:   g.themeParkManager?.exportData?.(),
        spaceData:       g.spaceManager?.exportData?.(),
        bandData:        g.bandManager?.exportData?.(),
        inheritanceData: g.inheritanceManager?.exportData?.(),
        travelData:      g.travelManager?.exportData?.(),
        familiarData:    g.familiarManager?.exportData?.(),
        detectiveData:   g.detectiveManager?.exportData?.(),
        equestrianData:  g.equestrianManager?.exportData?.(),
        scubaData:       g.scubaSystem?.exportData?.(),
        penthouseData:   g.penthouseManager?.exportData?.(),
        privateChefData: g.privateChefManager?.exportData?.(),
        restaurantData:  g.restaurantSystem?.exportData?.(),
        realEstateData:  g.realEstateManager?.exportData?.(),
        vetClinicData:   g.vetClinicManager?.exportData?.(),
        resortData:      g.resortManager?.exportData?.(),
        inventionData:   g.inventionSystem?.exportData?.(),
        decoratorData:   g.decoratorSystem?.exportData?.(),
        petBreedingData: g.petBreedingSystem?.exportData?.(),
        farmData:        g.farmSystem?.exportData?.(),
        filmStudioData:  g.filmStudioSystem?.exportData?.(),
        yachtData:       g.yachtManager?.exportData?.(),
        festivalData:    g.calendarManager?.exportFestivalData?.(),
        occultData:      g.occultSystem?.exportData?.(),
        weddingData:     g.weddingManager?.exportData?.(),
        hobbyData:       g.hobbyManager?.exportData?.(),
        marketData:      g.marketSystem?.exportData?.(),
        smartGardenData: g.smartGarden?.exportData?.(),
        cityData:        g.citySystem?.exportData?.(),
        botanyData:      g.botanySystem?.exportData?.(),
        guestData:       g.guestSystem?.exportData?.(),
        bankingData:     g.vaultSystem?.exportData?.(),
        alchemyData:     g.alchemySystem?.exportData?.(),
        nurseryData:     g.petNurserySystem?.exportData?.(),
        duelData:        g.duelSystem?.exportData?.(),
        studioData:      g.studioSystem?.exportData?.(),
        bakeryData:      g.bakerySystem?.exportData?.(),
        cinemaData:      g.cinemaSystem?.exportData?.(),
        agilityData:     g.agilitySystem?.exportData?.(),
        observatoryData: g.observatorySystem?.exportData?.(),
        spaData:         g.spaSystem?.exportData?.(),
        treeData:        g.genealogySystem?.exportData?.(),
        wallMountedArt:  g.house?.wallMountedArt,
      };

      // Merge into save object (skip undefined exports)
      Object.entries(systemExports).forEach(([k, v]) => {
        if (v !== undefined) saveData[k] = v;
      });

      localStorage.setItem(key, JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('[SaveManager] Error in saveFullGame:', e);
      return false;
    }
  }

  /**
   * Load the full game instance (all systems) from a slot key.
   * Calls importData() on all subsystems that have it.
   */
  public static loadFullGame(gameInstance: any, slotKey?: string): boolean {
    try {
      const key = slotKey || this.SAVE_KEY;
      const raw = localStorage.getItem(key);
      if (!raw) return false;

      const data: any = Sanitizer.safeJSONParse(raw, null);
      if (!data) return false;

      // Load base systems
      const base = this.loadGame(
        gameInstance.sim, gameInstance.house, gameInstance.careerManager,
        gameInstance.npcManager, gameInstance.partyManager, gameInstance.gardenSystem,
        gameInstance.weatherSystem, gameInstance.household, gameInstance.petManager,
        gameInstance.calendarManager, gameInstance.billsManager, gameInstance.magicManager,
        gameInstance.vehicleManager, gameInstance.businessManager, gameInstance.photoManager,
        gameInstance.educationManager, gameInstance.rentersManager
      );
      if (!base) return false;

      // v18 extended system loads
      const g = gameInstance;
      const systemImports: [any, string][] = [
        [g.questManager,       'questData'],
        [g.healthSystem,       'healthData'],
        [g.fameSystem,         'fameData'],
        [g.politicsManager,    'politicsData'],
        [g.archaeologySystem,  'archaeologyData'],
        [g.schoolSystem,       'schoolData'],
        [g.themeParkManager,   'themeParkData'],
        [g.spaceManager,       'spaceData'],
        [g.bandManager,        'bandData'],
        [g.inheritanceManager, 'inheritanceData'],
        [g.travelManager,      'travelData'],
        [g.familiarManager,    'familiarData'],
        [g.detectiveManager,   'detectiveData'],
        [g.equestrianManager,  'equestrianData'],
        [g.scubaSystem,        'scubaData'],
        [g.penthouseManager,   'penthouseData'],
        [g.privateChefManager, 'privateChefData'],
        [g.restaurantSystem,   'restaurantData'],
        [g.realEstateManager,  'realEstateData'],
        [g.vetClinicManager,   'vetClinicData'],
        [g.resortManager,      'resortData'],
        [g.inventionSystem,    'inventionData'],
        [g.decoratorSystem,    'decoratorData'],
        [g.petBreedingSystem,  'petBreedingData'],
        [g.farmSystem,         'farmData'],
        [g.filmStudioSystem,   'filmStudioData'],
        [g.yachtManager,       'yachtData'],
        [g.occultSystem,       'occultData'],
        [g.weddingManager,     'weddingData'],
        [g.hobbyManager,       'hobbyData'],
        [g.marketSystem,       'marketData'],
        [g.smartGarden,        'smartGardenData'],
        [g.citySystem,         'cityData'],
        [g.botanySystem,       'botanyData'],
        [g.guestSystem,        'guestData'],
        [g.vaultSystem,        'bankingData'],
        [g.alchemySystem,      'alchemyData'],
        [g.petNurserySystem,   'nurseryData'],
        [g.duelSystem,         'duelData'],
        [g.studioSystem,       'studioData'],
        [g.bakerySystem,       'bakeryData'],
        [g.cinemaSystem,       'cinemaData'],
        [g.agilitySystem,      'agilityData'],
        [g.observatorySystem,  'observatoryData'],
        [g.spaSystem,          'spaData'],
        [g.genealogySystem,    'treeData'],
      ];

      systemImports.forEach(([system, key]) => {
        if (system && typeof system.importData === 'function' && data[key] !== undefined) {
          system.importData(data[key]);
        }
      });

      if (data.wallMountedArt && g.house) {
        g.house.wallMountedArt = data.wallMountedArt;
      }

      return true;
    } catch (e) {
      console.error('[SaveManager] Error in loadFullGame:', e);
      return false;
    }
  }


  public static serializeGame(gameInstance: any): GameSaveData {
    return {
      version: '1.0.0',
      timestamp: Date.now(),
      sim: {
        customization: gameInstance.sim.customization,
        gridPos: gameInstance.sim.gridPos,
        needs: gameInstance.sim.needs.getValues(),
        simoleons: gameInstance.sim.simoleons,
        skills: gameInstance.sim.skills,
        lifeStage: gameInstance.sim.lifeStage,
        ageDays: gameInstance.sim.ageDays,
        partnerName: gameInstance.sim.partnerName,
        childrenNames: gameInstance.sim.childrenNames,
        inventoryItems: gameInstance.sim.inventory.items,
        aspirationPoints: gameInstance.sim.aspirationPoints,
        aspirationId: gameInstance.sim.aspirationId,
        completedMilestones: gameInstance.sim.completedMilestones
      },
      house: {
        placedFurniture: gameInstance.house.placedFurniture,
        wallDisplayMode: gameInstance.house.wallDisplayMode,
        activeFloor: gameInstance.house.activeFloor
      }
    };
  }

  public static applySaveData(gameInstance: any, data: any): boolean {
    if (!data || !data.sim) return false;
    try {
      if (data.sim.customization) gameInstance.sim.customization = data.sim.customization;
      if (data.sim.simoleons) gameInstance.sim.simoleons = data.sim.simoleons;
      if (data.sim.skills) gameInstance.sim.skills = data.sim.skills;
      if (data.house && data.house.placedFurniture) gameInstance.house.placedFurniture = data.house.placedFurniture;
      return true;
    } catch (e) {
      return false;
    }
  }


  public static loadGame(
    simOrGame: Sim | any,
    houseOrSlotKey?: House | string,
    career?: CareerManager,
    npcManager?: import('../entity/NPCManager').NPCManager,
    partyManager?: import('../systems/PartyManager').PartyManager,
    gardenSystem?: import('../world/GardenSystem').GardenSystem,
    weatherSystem?: import('./WeatherSystem').WeatherType | any,
    household?: import('../entity/Household').Household,
    petManager?: import('../entity/PetManager').PetManager,
    calendarManager?: import('../systems/CalendarSystem').CalendarManager,
    billsManager?: import('../systems/BillsSystem').BillsManager,
    magicManager?: import('../systems/MagicSystem').MagicManager,
    vehicleManager?: import('../systems/VehicleSystem').VehicleManager,
    businessManager?: import('../systems/BusinessSystem').BusinessManager,
    photoManager?: import('../systems/PhotoSystem').PhotoManager,
    educationManager?: import('./EducationSystem').EducationManager,
    rentersManager?: import('./RentersSystem').RentersManager
  ): boolean {
    try {
      let key = this.SAVE_KEY;
      let sim = simOrGame as Sim;
      let house = houseOrSlotKey as House;

      if (simOrGame && simOrGame.sim && simOrGame.house) {
        sim = simOrGame.sim;
        house = simOrGame.house;
        if (typeof houseOrSlotKey === 'string') {
          key = houseOrSlotKey;
        }
      }

      const raw = localStorage.getItem(key);
      if (!raw) return false;


      const data = Sanitizer.safeJSONParse<GameSaveData | null>(raw, null);
      if (!data || !data.sim || !data.house) return false;

      // Restore Sim / Household
      if (Array.isArray(data.householdSims) && data.householdSims.length > 0 && household) {
        household.sims = data.householdSims.map(savedSim => {
          const s = new Sim(savedSim.customization);
          s.gridPos = savedSim.gridPos || { x: 5, y: 5 };
          s.renderPos = { x: s.gridPos.x, y: s.gridPos.y };
          s.simoleons = Sanitizer.clamp(savedSim.simoleons, 0, 999999);
          if (savedSim.needs) {
            Object.entries(savedSim.needs).forEach(([k, val]) => {
              s.needs.modify(k as any, val - s.needs.getValues()[k as keyof typeof savedSim.needs]);
            });
          }
          if (savedSim.skills) s.skills = savedSim.skills;
          if (savedSim.lifeStage) s.lifeStage = savedSim.lifeStage;
          if (typeof savedSim.ageDays === 'number') s.ageDays = savedSim.ageDays;
          if (savedSim.partnerName) s.partnerName = Sanitizer.sanitizeText(savedSim.partnerName, 24);
          if (Array.isArray(savedSim.childrenNames)) s.childrenNames = savedSim.childrenNames;
          if (Array.isArray(savedSim.inventoryItems)) s.inventory.items = savedSim.inventoryItems;
          if (typeof savedSim.aspirationPoints === 'number') s.aspirationPoints = savedSim.aspirationPoints;
          if (savedSim.aspirationId) s.aspirationId = savedSim.aspirationId;
          if (Array.isArray(savedSim.completedMilestones)) s.completedMilestones = savedSim.completedMilestones;
          return s;
        });
        household.activeSimIndex = data.activeSimIndex || 0;
      } else {
        sim.customization = {
          name: Sanitizer.sanitizeText(data.sim.customization.name, 24),
          gender: data.sim.customization.gender,
          skinColor: data.sim.customization.skinColor,
          hairColor: data.sim.customization.hairColor,
          outfitColor: data.sim.customization.outfitColor,
          trait: Sanitizer.sanitizeText(data.sim.customization.trait, 30),
          aspiration: Sanitizer.sanitizeText(data.sim.customization.aspiration, 30)
        };
        sim.gridPos = data.sim.gridPos || { x: 5, y: 5 };
        sim.renderPos = { x: sim.gridPos.x, y: sim.gridPos.y };
        sim.simoleons = Sanitizer.clamp(data.sim.simoleons, 0, 999999);
        if (data.sim.needs) {
          Object.entries(data.sim.needs).forEach(([k, val]) => {
            sim.needs.modify(k as any, val - sim.needs.getValues()[k as keyof typeof data.sim.needs]);
          });
        }
        if (data.sim.skills) sim.skills = data.sim.skills;
        if (data.sim.lifeStage) sim.lifeStage = data.sim.lifeStage;
        if (typeof data.sim.ageDays === 'number') sim.ageDays = data.sim.ageDays;
        if (data.sim.partnerName) sim.partnerName = Sanitizer.sanitizeText(data.sim.partnerName, 24);
        if (Array.isArray(data.sim.childrenNames)) sim.childrenNames = data.sim.childrenNames.map(c => Sanitizer.sanitizeText(c, 24));
        if (Array.isArray(data.sim.inventoryItems)) sim.inventory.items = data.sim.inventoryItems;
        if (typeof data.sim.aspirationPoints === 'number') sim.aspirationPoints = data.sim.aspirationPoints;
        if (data.sim.aspirationId) sim.aspirationId = data.sim.aspirationId;
        if (Array.isArray(data.sim.completedMilestones)) sim.completedMilestones = data.sim.completedMilestones;
      }

      // Restore Pets
      if (Array.isArray(data.petsData) && petManager) {
        petManager.pets = data.petsData.map(pData => {
          const pet = new Pet(pData.name, pData.species, pData.color);
          pet.gridPos = pData.gridPos || { x: 7, y: 7 };
          pet.renderPos = { x: pet.gridPos.x, y: pet.gridPos.y };
          if (pData.needs) {
            pet.needs.hunger = pData.needs.hunger;
            pet.needs.affection = pData.needs.affection;
            pet.needs.energy = pData.needs.energy;
            pet.needs.play = pData.needs.play;
          }
          return pet;
        });
      }

      // Restore House furniture & tiles & multi-floors
      if (typeof data.house.activeFloor === 'number') {
        house.activeFloor = data.house.activeFloor;
      }
      if (data.house.floorFurnitureMap) {
        house.floorFurnitureMap = data.house.floorFurnitureMap;
      } else if (Array.isArray(data.house.placedFurniture)) {
        house.placedFurniture = data.house.placedFurniture;
      }

      if (data.house.wallDisplayMode) {
        house.wallDisplayMode = data.house.wallDisplayMode;
      }

      if (Array.isArray(data.house.tiles)) {
        data.house.tiles.forEach((row, x) => {
          if (Array.isArray(row)) {
            row.forEach((savedTile, y) => {
              if (house.tiles[x] && house.tiles[x][y]) {
                house.tiles[x][y].type = savedTile.type || 'grass';
                house.tiles[x][y].color = savedTile.color || '#27ae60';
                house.tiles[x][y].hasWallNorth = savedTile.hasWallNorth;
                house.tiles[x][y].hasWallWest = savedTile.hasWallWest;
                house.tiles[x][y].wallColor = savedTile.wallColor;
                house.tiles[x][y].openingNorth = savedTile.openingNorth;
                house.tiles[x][y].openingWest = savedTile.openingWest;
              }
            });
          }
        });
      }

      // Restore Calendar, Bills, Magic, Vehicles, Business, Photos
      if (data.calendarData && calendarManager) {
        calendarManager.currentSeason = data.calendarData.currentSeason;
        calendarManager.dayOfSeason = data.calendarData.dayOfSeason;
        calendarManager.completedTraditions = data.calendarData.completedTraditions;
      }

      if (data.billsData && billsManager) {
        billsManager.dueDay = data.billsData.dueDay;
        billsManager.pendingBillAmount = data.billsData.pendingBillAmount;
        billsManager.isBillDue = data.billsData.isBillDue;
        billsManager.isPowerCutoff = data.billsData.isPowerCutoff;
      }

      if (data.magicData && magicManager) {
        magicManager.magicLevel = data.magicData.magicLevel;
        magicManager.magicXP = data.magicData.magicXP;
        magicManager.manaPoints = data.magicData.manaPoints;
        magicManager.unlockedSpells = data.magicData.unlockedSpells;
      }

      if (data.vehicleData && vehicleManager) {
        vehicleManager.ownedVehicleIds = data.vehicleData.ownedVehicleIds;
        vehicleManager.activeVehicleId = data.vehicleData.activeVehicleId;
      }

      if (data.businessData && businessManager) {
        businessManager.storeId = data.businessData.storeId;
        businessManager.isStoreOpen = data.businessData.isStoreOpen;
        businessManager.marginSetting = data.businessData.marginSetting;
        businessManager.dailyRevenue = data.businessData.dailyRevenue;
        businessManager.customerSatisfaction = data.businessData.customerSatisfaction;
        businessManager.totalSalesCount = data.businessData.totalSalesCount;
      }

      if (data.photoData && photoManager) {
        photoManager.photos = data.photoData.photos;
        photoManager.memories = data.photoData.memories;
      }

      if (data.educationData && educationManager) {
        educationManager.grade = data.educationData.grade;
        educationManager.homeworkDone = data.educationData.homeworkDone;
        educationManager.enrolledDegree = data.educationData.enrolledDegree;
        educationManager.degreeProgress = data.educationData.degreeProgress;
        educationManager.completedDegrees = data.educationData.completedDegrees;
      }

      if (data.rentersData && rentersManager) {
        rentersManager.tenants = data.rentersData.tenants;
      }

      // Restore Career
      if (data.career && career) {
        career.currentCareerId = data.career.careerId || 'tech_guru';
        career.currentRank = data.career.rank || 1;
      }

      // Restore Relationships
      if (data.relationships && npcManager) {
        data.relationships.forEach(r => {
          const npc = npcManager.npcs.find(n => n.id === r.targetSimId);
          if (npc) {
            npc.relationship.friendship = Sanitizer.clamp(r.friendship, 0, 100);
            npc.relationship.romance = Sanitizer.clamp(r.romance, 0, 100);
          }
        });
      }

      // Restore Trophies
      if (Array.isArray(data.trophiesUnlocked) && partyManager) {
        partyManager.trophiesUnlocked = data.trophiesUnlocked;
      }

      // Restore Garden & Weather
      if (Array.isArray(data.gardenPlots) && gardenSystem) {
        gardenSystem.plots = data.gardenPlots;
      }
      if (data.weather && weatherSystem) {
        if (typeof weatherSystem.setWeather === 'function') {
          weatherSystem.setWeather(data.weather);
        }
      }

      return true;
    } catch (e) {
      console.error('[SaveManager] Error loading game:', e);
      return false;
    }
  }

  public static exportSaveFile(): string {
    const raw = localStorage.getItem(this.SAVE_KEY);
    return raw || '';
  }
}
