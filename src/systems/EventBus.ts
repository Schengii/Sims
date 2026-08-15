/**
 * Typed Global Event Bus for Decoupled Systems Communication
 */

export type GameEventMap = {
  'SIM_NEED_CRITICAL': { simId: string; need: string; value: number };
  'SIM_SKILL_LEVELUP': { simId: string; skill: string; newLevel: number };
  'SIM_SOCIAL_INTERACTION': { simId: string; targetNpcId: string; interactionId: string; emote: string };
  'HOUSE_WALL_CHANGED': { gridX: number; gridY: number; floor: number };
  'HOUSE_FLOOR_CHANGED': { floor: number };
  'FURNITURE_PLACED': { instanceId: string; furnitureId: string; gridX: number; gridY: number; floor: number };
  'FURNITURE_ROTATED': { instanceId: string; rotation: number };
  'FURNITURE_SOLD': { instanceId: string; refundAmount: number };
  'TIME_HOUR_PASSED': { hour: number; day: number };
  'WEATHER_CHANGED': { weather: string };
  'TOAST_TRIGGER': { title: string; message: string; icon: string; type: 'info' | 'success' | 'warning' | 'levelUp' };
};

type EventCallback<T> = (data: T) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: { [key: string]: Array<EventCallback<any>> } = {};

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<K extends keyof GameEventMap>(event: K, callback: EventCallback<GameEventMap[K]>): () => void {
    if (!this.listeners[event as string]) {
      this.listeners[event as string] = [];
    }
    this.listeners[event as string].push(callback);

    // Return unregister function
    return () => {
      this.off(event, callback);
    };
  }

  public off<K extends keyof GameEventMap>(event: K, callback: EventCallback<GameEventMap[K]>): void {
    if (!this.listeners[event as string]) return;
    this.listeners[event as string] = this.listeners[event as string].filter(cb => cb !== callback);
  }

  public emit<K extends keyof GameEventMap>(event: K, data: GameEventMap[K]): void {
    const handlers = this.listeners[event as string];
    if (!handlers) return;
    handlers.forEach(callback => {
      try {
        callback(data);
      } catch (err) {
        console.error(`[EventBus] Error handling event ${String(event)}:`, err);
      }
    });
  }

  public clear(): void {
    this.listeners = {};
  }
}
