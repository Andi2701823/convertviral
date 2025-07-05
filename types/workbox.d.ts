// Type definitions for Workbox

interface WorkboxWindow {
  messageSW(message: any): Promise<any>;
}

declare global {
  interface Window {
    workbox: WorkboxWindow;
  }
}