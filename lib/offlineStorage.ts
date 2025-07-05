// Utility for handling offline data storage using IndexedDB

const DB_NAME = 'ConvertViralOfflineDB';
const DB_VERSION = 1;

// Database schema
const STORES = {
  PENDING_CONVERSIONS: 'pendingConversions',
  CONVERSION_HISTORY: 'conversionHistory',
  USER_PREFERENCES: 'userPreferences',
  ACHIEVEMENTS: 'achievements'
};

// Initialize the database
export async function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject(new Error('Error opening IndexedDB'));
    };

    request.onsuccess = (event) => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      // Create object stores
      if (!db.objectStoreNames.contains(STORES.PENDING_CONVERSIONS)) {
        const pendingConversionsStore = db.createObjectStore(STORES.PENDING_CONVERSIONS, { keyPath: 'id' });
        pendingConversionsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CONVERSION_HISTORY)) {
        const conversionHistoryStore = db.createObjectStore(STORES.CONVERSION_HISTORY, { keyPath: 'id' });
        conversionHistoryStore.createIndex('createdAt', 'createdAt', { unique: false });
        conversionHistoryStore.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
        db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        const achievementsStore = db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
        achievementsStore.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
}

// Generic function to add an item to a store
export async function addItem<T>(storeName: string, item: T): Promise<T> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    request.onsuccess = () => {
      resolve(item);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to add item to ${storeName}`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Generic function to get all items from a store
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to get items from ${storeName}`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Generic function to get an item by ID
export async function getItemById<T>(storeName: string, id: string): Promise<T | null> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to get item from ${storeName}`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Generic function to update an item
export async function updateItem<T>(storeName: string, item: T): Promise<T> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onsuccess = () => {
      resolve(item);
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to update item in ${storeName}`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Generic function to delete an item
export async function deleteItem(storeName: string, id: string): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = () => {
      reject(new Error(`Failed to delete item from ${storeName}`));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Function to add a pending conversion
export async function addPendingConversion(conversion: Record<string, any>): Promise<any> {
  return addItem(STORES.PENDING_CONVERSIONS, {
    ...conversion,
    createdAt: Date.now(),
    status: 'PENDING'
  });
}

// Function to get all pending conversions
export async function getPendingConversions(): Promise<any[]> {
  return getAllItems(STORES.PENDING_CONVERSIONS);
}

// Function to mark a conversion as complete
export async function markConversionComplete(id: string): Promise<void> {
  const conversion = await getItemById<Record<string, any>>(STORES.PENDING_CONVERSIONS, id);
  
  if (conversion) {
    // Add to conversion history
    await addItem(STORES.CONVERSION_HISTORY, {
      ...conversion,
      status: 'COMPLETED',
      completedAt: Date.now()
    });
    
    // Remove from pending conversions
    await deleteItem(STORES.PENDING_CONVERSIONS, id);
  }
}

// Function to save user preferences
export async function saveUserPreferences(preferences: any): Promise<any> {
  return updateItem(STORES.USER_PREFERENCES, {
    id: 'user-preferences',
    ...preferences,
    updatedAt: Date.now()
  });
}

// Function to get user preferences
export async function getUserPreferences(): Promise<any | null> {
  return getItemById(STORES.USER_PREFERENCES, 'user-preferences');
}

// Function to save an achievement
export async function saveAchievement(achievement: any): Promise<any> {
  return addItem(STORES.ACHIEVEMENTS, {
    ...achievement,
    earnedAt: Date.now()
  });
}

// Function to get all achievements for a user
export async function getUserAchievements(userId: string): Promise<any[]> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.ACHIEVEMENTS, 'readonly');
    const store = transaction.objectStore(STORES.ACHIEVEMENTS);
    const index = store.index('userId');
    const request = index.getAll(userId);
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = () => {
      reject(new Error('Failed to get user achievements'));
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}

// Function to clear all data (for testing or reset)
export async function clearAllData(): Promise<void> {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const storeNames = Object.values(STORES);
    const transaction = db.transaction(storeNames, 'readwrite');
    
    let completed = 0;
    let hasError = false;
    
    storeNames.forEach(storeName => {
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => {
        completed++;
        if (completed === storeNames.length && !hasError) {
          resolve();
        }
      };
      
      request.onerror = () => {
        if (!hasError) {
          hasError = true;
          reject(new Error(`Failed to clear ${storeName}`));
        }
      };
    });
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
}