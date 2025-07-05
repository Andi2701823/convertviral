"use strict";
// Utility for handling offline data storage using IndexedDB
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var DB_NAME = 'ConvertViralOfflineDB';
var DB_VERSION = 1;
// Database schema
var STORES = {
    PENDING_CONVERSIONS: 'pendingConversions',
    CONVERSION_HISTORY: 'conversionHistory',
    USER_PREFERENCES: 'userPreferences',
    ACHIEVEMENTS: 'achievements'
};
// Initialize the database
function initDB() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    if (!('indexedDB' in window)) {
                        reject(new Error('IndexedDB is not supported in this browser'));
                        return;
                    }
                    var request = indexedDB.open(DB_NAME, DB_VERSION);
                    request.onerror = function (event) {
                        reject(new Error('Error opening IndexedDB'));
                    };
                    request.onsuccess = function (event) {
                        resolve(request.result);
                    };
                    request.onupgradeneeded = function (event) {
                        var db = request.result;
                        // Create object stores
                        if (!db.objectStoreNames.contains(STORES.PENDING_CONVERSIONS)) {
                            var pendingConversionsStore = db.createObjectStore(STORES.PENDING_CONVERSIONS, { keyPath: 'id' });
                            pendingConversionsStore.createIndex('createdAt', 'createdAt', { unique: false });
                        }
                        if (!db.objectStoreNames.contains(STORES.CONVERSION_HISTORY)) {
                            var conversionHistoryStore = db.createObjectStore(STORES.CONVERSION_HISTORY, { keyPath: 'id' });
                            conversionHistoryStore.createIndex('createdAt', 'createdAt', { unique: false });
                            conversionHistoryStore.createIndex('userId', 'userId', { unique: false });
                        }
                        if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
                            db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
                            var achievementsStore = db.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
                            achievementsStore.createIndex('userId', 'userId', { unique: false });
                        }
                    };
                })];
        });
    });
}
// Generic function to add an item to a store
function addItem(storeName, item) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(storeName, 'readwrite');
                            var store = transaction.objectStore(storeName);
                            var request = store.add(item);
                            request.onsuccess = function () {
                                resolve(item);
                            };
                            request.onerror = function () {
                                reject(new Error("Failed to add item to ".concat(storeName)));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Generic function to get all items from a store
function getAllItems(storeName) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(storeName, 'readonly');
                            var store = transaction.objectStore(storeName);
                            var request = store.getAll();
                            request.onsuccess = function () {
                                resolve(request.result);
                            };
                            request.onerror = function () {
                                reject(new Error("Failed to get items from ".concat(storeName)));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Generic function to get an item by ID
function getItemById(storeName, id) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(storeName, 'readonly');
                            var store = transaction.objectStore(storeName);
                            var request = store.get(id);
                            request.onsuccess = function () {
                                resolve(request.result || null);
                            };
                            request.onerror = function () {
                                reject(new Error("Failed to get item from ".concat(storeName)));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Generic function to update an item
function updateItem(storeName, item) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(storeName, 'readwrite');
                            var store = transaction.objectStore(storeName);
                            var request = store.put(item);
                            request.onsuccess = function () {
                                resolve(item);
                            };
                            request.onerror = function () {
                                reject(new Error("Failed to update item in ".concat(storeName)));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Generic function to delete an item
function deleteItem(storeName, id) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(storeName, 'readwrite');
                            var store = transaction.objectStore(storeName);
                            var request = store.delete(id);
                            request.onsuccess = function () {
                                resolve();
                            };
                            request.onerror = function () {
                                reject(new Error("Failed to delete item from ".concat(storeName)));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Function to add a pending conversion
function addPendingConversion(conversion) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, addItem(STORES.PENDING_CONVERSIONS, __assign(__assign({}, conversion), { createdAt: Date.now(), status: 'PENDING' }))];
        });
    });
}
// Function to get all pending conversions
function getPendingConversions() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getAllItems(STORES.PENDING_CONVERSIONS)];
        });
    });
}
// Function to mark a conversion as complete
function markConversionComplete(id) {
    return __awaiter(this, void 0, void 0, function () {
        var conversion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getItemById(STORES.PENDING_CONVERSIONS, id)];
                case 1:
                    conversion = _a.sent();
                    if (!conversion) return [3 /*break*/, 4];
                    // Add to conversion history
                    return [4 /*yield*/, addItem(STORES.CONVERSION_HISTORY, __assign(__assign({}, conversion), { status: 'COMPLETED', completedAt: Date.now() }))];
                case 2:
                    // Add to conversion history
                    _a.sent();
                    // Remove from pending conversions
                    return [4 /*yield*/, deleteItem(STORES.PENDING_CONVERSIONS, id)];
                case 3:
                    // Remove from pending conversions
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to save user preferences
function saveUserPreferences(preferences) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, updateItem(STORES.USER_PREFERENCES, __assign(__assign({ id: 'user-preferences' }, preferences), { updatedAt: Date.now() }))];
        });
    });
}
// Function to get user preferences
function getUserPreferences() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, getItemById(STORES.USER_PREFERENCES, 'user-preferences')];
        });
    });
}
// Function to save an achievement
function saveAchievement(achievement) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, addItem(STORES.ACHIEVEMENTS, __assign(__assign({}, achievement), { earnedAt: Date.now() }))];
        });
    });
}
// Function to get all achievements for a user
function getUserAchievements(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var transaction = db.transaction(STORES.ACHIEVEMENTS, 'readonly');
                            var store = transaction.objectStore(STORES.ACHIEVEMENTS);
                            var index = store.index('userId');
                            var request = index.getAll(userId);
                            request.onsuccess = function () {
                                resolve(request.result);
                            };
                            request.onerror = function () {
                                reject(new Error('Failed to get user achievements'));
                            };
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
// Function to clear all data (for testing or reset)
function clearAllData() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initDB()];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var storeNames = Object.values(STORES);
                            var transaction = db.transaction(storeNames, 'readwrite');
                            var completed = 0;
                            var hasError = false;
                            storeNames.forEach(function (storeName) {
                                var store = transaction.objectStore(storeName);
                                var request = store.clear();
                                request.onsuccess = function () {
                                    completed++;
                                    if (completed === storeNames.length && !hasError) {
                                        resolve();
                                    }
                                };
                                request.onerror = function () {
                                    if (!hasError) {
                                        hasError = true;
                                        reject(new Error("Failed to clear ".concat(storeName)));
                                    }
                                };
                            });
                            transaction.oncomplete = function () {
                                db.close();
                            };
                        })];
            }
        });
    });
}
