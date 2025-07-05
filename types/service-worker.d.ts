// Type definitions for Service Worker and related APIs

declare global {
  interface SyncManager {
    register(tag: string): Promise<void>;
  }

  interface ServiceWorkerRegistration {
    sync?: SyncManager;
  }

  interface Window {
    workbox?: any;
  }
}