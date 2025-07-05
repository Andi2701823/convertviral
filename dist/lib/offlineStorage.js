"use strict";
// Utility for handling offline data storage using IndexedDB
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
exports.addItem = addItem;
exports.getAllItems = getAllItems;
exports.getItemById = getItemById;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
exports.addPendingConversion = addPendingConversion;
exports.getPendingConversions = getPendingConversions;
exports.markConversionComplete = markConversionComplete;
exports.saveUserPreferences = saveUserPreferences;
exports.getUserPreferences = getUserPreferences;
exports.saveAchievement = saveAchievement;
exports.getUserAchievements = getUserAchievements;
exports.clearAllData = clearAllData;
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
async function initDB() {
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
async function addItem(storeName, item) {
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
async function getAllItems(storeName) {
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
async function getItemById(storeName, id) {
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
async function updateItem(storeName, item) {
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
async function deleteItem(storeName, id) {
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
async function addPendingConversion(conversion) {
    return addItem(STORES.PENDING_CONVERSIONS, {
        ...conversion,
        createdAt: Date.now(),
        status: 'PENDING'
    });
}
// Function to get all pending conversions
async function getPendingConversions() {
    return getAllItems(STORES.PENDING_CONVERSIONS);
}
// Function to mark a conversion as complete
async function markConversionComplete(id) {
    const conversion = await getItemById(STORES.PENDING_CONVERSIONS, id);
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
async function saveUserPreferences(preferences) {
    return updateItem(STORES.USER_PREFERENCES, {
        id: 'user-preferences',
        ...preferences,
        updatedAt: Date.now()
    });
}
// Function to get user preferences
async function getUserPreferences() {
    return getItemById(STORES.USER_PREFERENCES, 'user-preferences');
}
// Function to save an achievement
async function saveAchievement(achievement) {
    return addItem(STORES.ACHIEVEMENTS, {
        ...achievement,
        earnedAt: Date.now()
    });
}
// Function to get all achievements for a user
async function getUserAchievements(userId) {
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
async function clearAllData() {
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
