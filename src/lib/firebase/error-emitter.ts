
// A simple event emitter for handling global application events.
// This is used to decouple Firestore write operations from the UI error display.

type EventMap = {
  'permission-error': (error: any) => void;
};

class EventEmitter<T extends EventMap> {
  private listeners: { [K in keyof T]?: T[K][] } = {};

  on<K extends keyof T>(event: K, listener: T[K]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof T>(event: K, listener: T[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
  }

  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach(listener => {
      try {
        listener(...args);
      } catch (e) {
        console.error(`Error in event listener for ${String(event)}:`, e);
      }
    });
  }
}

export const errorEmitter = new EventEmitter<EventMap>();
