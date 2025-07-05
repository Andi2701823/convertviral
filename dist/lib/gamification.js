"use strict";
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
exports.STREAK_MULTIPLIERS = exports.LEVELS = exports.POINTS = void 0;
exports.getLeaderboard = getLeaderboard;
exports.getUserRank = getUserRank;
exports.getUserLevel = getUserLevel;
exports.getAllBadges = getAllBadges;
exports.getUserBadges = getUserBadges;
exports.getUserStreak = getUserStreak;
exports.initializeDefaultBadges = initializeDefaultBadges;
exports.awardPointsForConversion = awardPointsForConversion;
exports.updateUserStreak = updateUserStreak;
exports.checkForBadgeAchievements = checkForBadgeAchievements;
exports.updateUserLevel = updateUserLevel;
exports.awardPointsForSharing = awardPointsForSharing;
exports.awardPointsForReferral = awardPointsForReferral;
exports.initializeDailyChallenges = initializeDailyChallenges;
exports.getDailyChallenges = getDailyChallenges;
exports.checkChallengeProgress = checkChallengeProgress;
exports.generateSharingContent = generateSharingContent;
var db_1 = require("./db");
var redis_1 = require("./redis");
// Constants for gamification system
exports.POINTS = {
    CONVERSION: {
        PDF: 10,
        IMAGE: 5,
        AUDIO: 8,
        VIDEO: 15,
        DEFAULT: 3
    },
    SHARE: 5,
    REFERRAL: 50,
    STREAK: {
        THREE_DAYS: 10,
        SEVEN_DAYS: 25,
        THIRTY_DAYS: 100
    }
};
exports.LEVELS = {
    BEGINNER: { min: 0, max: 100, name: 'Beginner' },
    CONVERT_MASTER: { min: 100, max: 500, name: 'Convert Master' },
    FILE_WIZARD: { min: 500, max: 1000, name: 'File Wizard' },
    VIRAL_LEGEND: { min: 1000, max: Infinity, name: 'Viral Legend' }
};
exports.STREAK_MULTIPLIERS = {
    THREE_DAYS: 1.2,
    SEVEN_DAYS: 1.5,
    FOURTEEN_DAYS: 1.8,
    THIRTY_DAYS: 2.0
};
// Function to get leaderboard
function getLeaderboard() {
    return __awaiter(this, arguments, void 0, function (limit, timeframe, country) {
        var cacheKey, cachedLeaderboard, dateFilter, now, startOfDay, startOfWeek, countryFilter, users, leaderboard, error_1;
        if (limit === void 0) { limit = 10; }
        if (timeframe === void 0) { timeframe = 'allTime'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    cacheKey = "leaderboard:".concat(timeframe, ":").concat(country || 'all', ":").concat(limit);
                    return [4 /*yield*/, (0, redis_1.getCache)(cacheKey)];
                case 1:
                    cachedLeaderboard = _a.sent();
                    if (cachedLeaderboard) {
                        return [2 /*return*/, cachedLeaderboard];
                    }
                    dateFilter = {};
                    now = new Date();
                    if (timeframe === 'daily') {
                        startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        dateFilter = {
                            createdAt: {
                                gte: startOfDay
                            }
                        };
                    }
                    else if (timeframe === 'weekly') {
                        startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
                        startOfWeek.setHours(0, 0, 0, 0);
                        dateFilter = {
                            createdAt: {
                                gte: startOfWeek
                            }
                        };
                    }
                    countryFilter = country ? { country: country } : {};
                    return [4 /*yield*/, db_1.prisma.user.findMany({
                            where: __assign({}, countryFilter),
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                points: true,
                                level: true,
                                country: true,
                                conversions: {
                                    where: dateFilter,
                                    select: {
                                        id: true
                                    }
                                }
                            },
                            orderBy: {
                                points: 'desc',
                            },
                            take: limit,
                        })];
                case 2:
                    users = _a.sent();
                    leaderboard = users.map(function (user, index) { return ({
                        userId: user.id,
                        name: user.name,
                        image: user.image,
                        points: user.points,
                        level: user.level,
                        rank: index + 1,
                        conversions: user.conversions.length,
                        country: user.country
                    }); });
                    // Cache the result for 5 minutes
                    return [4 /*yield*/, (0, redis_1.setCache)(cacheKey, leaderboard, 300)];
                case 3:
                    // Cache the result for 5 minutes
                    _a.sent();
                    return [2 /*return*/, leaderboard];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error getting leaderboard:', error_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Function to get user rank
function getUserRank(userId_1) {
    return __awaiter(this, arguments, void 0, function (userId, timeframe) {
        var user, dateFilter, now, startOfDay, startOfWeek, usersWithMorePoints, error_2;
        if (timeframe === void 0) { timeframe = 'allTime'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: { points: true },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, 0];
                    dateFilter = {};
                    now = new Date();
                    if (timeframe === 'daily') {
                        startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                        dateFilter = {
                            dailyPoints: {
                                some: {
                                    date: {
                                        gte: startOfDay
                                    }
                                }
                            }
                        };
                    }
                    else if (timeframe === 'weekly') {
                        startOfWeek = new Date(now);
                        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
                        startOfWeek.setHours(0, 0, 0, 0);
                        dateFilter = {
                            dailyPoints: {
                                some: {
                                    date: {
                                        gte: startOfWeek
                                    }
                                }
                            }
                        };
                    }
                    return [4 /*yield*/, db_1.prisma.user.count({
                            where: __assign({ points: {
                                    gt: user.points,
                                } }, dateFilter),
                        })];
                case 2:
                    usersWithMorePoints = _a.sent();
                    // Rank is the number of users with more points + 1
                    return [2 /*return*/, usersWithMorePoints + 1];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error getting user rank:', error_2);
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to get user level information
function getUserLevel(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, levelInfo, nextLevelXP, progress, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: { level: true, xp: true },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, {
                                level: 1,
                                name: exports.LEVELS.BEGINNER.name,
                                currentXP: 0,
                                nextLevelXP: 100,
                                progress: 0
                            }];
                    }
                    levelInfo = exports.LEVELS.BEGINNER;
                    if (user.xp >= exports.LEVELS.VIRAL_LEGEND.min) {
                        levelInfo = exports.LEVELS.VIRAL_LEGEND;
                    }
                    else if (user.xp >= exports.LEVELS.FILE_WIZARD.min) {
                        levelInfo = exports.LEVELS.FILE_WIZARD;
                    }
                    else if (user.xp >= exports.LEVELS.CONVERT_MASTER.min) {
                        levelInfo = exports.LEVELS.CONVERT_MASTER;
                    }
                    nextLevelXP = levelInfo.max === Infinity ? user.xp * 2 : levelInfo.max;
                    progress = ((user.xp - levelInfo.min) / (nextLevelXP - levelInfo.min)) * 100;
                    return [2 /*return*/, {
                            level: user.level,
                            name: levelInfo.name,
                            currentXP: user.xp,
                            nextLevelXP: nextLevelXP,
                            progress: Math.min(progress, 100)
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error getting user level:', error_3);
                    return [2 /*return*/, {
                            level: 1,
                            name: exports.LEVELS.BEGINNER.name,
                            currentXP: 0,
                            nextLevelXP: 100,
                            progress: 0
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get all available badges
function getAllBadges() {
    return __awaiter(this, void 0, void 0, function () {
        var badges, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.badge.findMany()];
                case 1:
                    badges = _a.sent();
                    return [2 /*return*/, badges.map(function (badge) { return ({
                            id: badge.id,
                            name: badge.name,
                            description: badge.description,
                            imageUrl: badge.imageUrl,
                            category: badge.category,
                            difficulty: badge.difficulty,
                            points: badge.points
                        }); })];
                case 2:
                    error_4 = _a.sent();
                    console.error('Error getting all badges:', error_4);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get user badges
function getUserBadges(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var userBadges, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.userBadge.findMany({
                            where: { userId: userId },
                            include: { badge: true },
                            orderBy: { earnedAt: 'desc' }
                        })];
                case 1:
                    userBadges = _a.sent();
                    return [2 /*return*/, userBadges.map(function (userBadge) { return ({
                            id: userBadge.id,
                            userId: userBadge.userId,
                            badgeId: userBadge.badgeId,
                            earnedAt: userBadge.earnedAt,
                            badge: {
                                id: userBadge.badge.id,
                                name: userBadge.badge.name,
                                description: userBadge.badge.description,
                                imageUrl: userBadge.badge.imageUrl,
                                category: userBadge.badge.category,
                                difficulty: userBadge.badge.difficulty,
                                points: userBadge.badge.points
                            }
                        }); })];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error getting user badges:', error_5);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get user streak information
function getUserStreak(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, multiplier, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: { streak: true, lastActive: true }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, { current: 0, multiplier: 1, lastActive: null }];
                    }
                    multiplier = 1;
                    if (user.streak >= 30) {
                        multiplier = exports.STREAK_MULTIPLIERS.THIRTY_DAYS;
                    }
                    else if (user.streak >= 14) {
                        multiplier = exports.STREAK_MULTIPLIERS.FOURTEEN_DAYS;
                    }
                    else if (user.streak >= 7) {
                        multiplier = exports.STREAK_MULTIPLIERS.SEVEN_DAYS;
                    }
                    else if (user.streak >= 3) {
                        multiplier = exports.STREAK_MULTIPLIERS.THREE_DAYS;
                    }
                    return [2 /*return*/, {
                            current: user.streak,
                            multiplier: multiplier,
                            lastActive: user.lastActive
                        }];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error getting user streak:', error_6);
                    return [2 /*return*/, { current: 0, multiplier: 1, lastActive: null }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to initialize default badges in the database
function initializeDefaultBadges() {
    return __awaiter(this, void 0, void 0, function () {
        var defaultBadges, _i, defaultBadges_1, badge, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    defaultBadges = [
                        {
                            name: 'first_convert',
                            description: 'Completed your first file conversion',
                            imageUrl: '/badges/first_conversion.svg',
                            criteria: JSON.stringify({ conversions: 1 }),
                            category: 'conversion',
                            difficulty: 'easy',
                            points: 10
                        },
                        {
                            name: 'pdf_master',
                            description: 'Completed 50 PDF conversions',
                            imageUrl: '/badges/pdf_master.svg',
                            criteria: JSON.stringify({ pdf_conversions: 50 }),
                            category: 'conversion',
                            difficulty: 'medium',
                            points: 50
                        },
                        {
                            name: 'speed_demon',
                            description: 'Completed 10 conversions in 1 hour',
                            imageUrl: '/badges/speed_demon.svg',
                            criteria: JSON.stringify({ conversions_per_hour: 10 }),
                            category: 'achievement',
                            difficulty: 'medium',
                            points: 75
                        },
                        {
                            name: 'viral_sharer',
                            description: 'Shared 5 conversion results',
                            imageUrl: '/badges/viral_sharer.svg',
                            criteria: JSON.stringify({ shares: 5 }),
                            category: 'social',
                            difficulty: 'easy',
                            points: 25
                        },
                        {
                            name: 'format_explorer',
                            description: 'Used 10 different formats',
                            imageUrl: '/badges/format_explorer.svg',
                            criteria: JSON.stringify({ unique_formats: 10 }),
                            category: 'conversion',
                            difficulty: 'medium',
                            points: 50
                        },
                        {
                            name: 'streak_king',
                            description: 'Maintained a 7-day conversion streak',
                            imageUrl: '/badges/streak_king.svg',
                            criteria: JSON.stringify({ streak_days: 7 }),
                            category: 'achievement',
                            difficulty: 'hard',
                            points: 100
                        },
                        {
                            name: 'batch_boss',
                            description: 'Converted 50+ files at once',
                            imageUrl: '/badges/batch_boss.svg',
                            criteria: JSON.stringify({ batch_size: 50 }),
                            category: 'conversion',
                            difficulty: 'hard',
                            points: 150
                        },
                        {
                            name: 'conversion_enthusiast',
                            description: 'Completed 10 file conversions',
                            imageUrl: '/badges/conversion_enthusiast.svg',
                            criteria: JSON.stringify({ conversions: 10 }),
                            category: 'conversion',
                            difficulty: 'easy',
                            points: 20
                        },
                        {
                            name: 'conversion_pro',
                            description: 'Completed 50 file conversions',
                            imageUrl: '/badges/conversion_pro.svg',
                            criteria: JSON.stringify({ conversions: 50 }),
                            category: 'conversion',
                            difficulty: 'medium',
                            points: 50
                        },
                        {
                            name: 'conversion_master',
                            description: 'Completed 100 file conversions',
                            imageUrl: '/badges/conversion_master.svg',
                            criteria: JSON.stringify({ conversions: 100 }),
                            category: 'conversion',
                            difficulty: 'hard',
                            points: 100
                        },
                        {
                            name: 'points_starter',
                            description: 'Earned 100 points',
                            imageUrl: '/badges/points_starter.svg',
                            criteria: JSON.stringify({ points: 100 }),
                            category: 'achievement',
                            difficulty: 'easy',
                            points: 10
                        },
                        {
                            name: 'points_collector',
                            description: 'Earned 500 points',
                            imageUrl: '/badges/points_collector.svg',
                            criteria: JSON.stringify({ points: 500 }),
                            category: 'achievement',
                            difficulty: 'medium',
                            points: 25
                        },
                        {
                            name: 'points_master',
                            description: 'Earned 1000 points',
                            imageUrl: '/badges/points_master.svg',
                            criteria: JSON.stringify({ points: 1000 }),
                            category: 'achievement',
                            difficulty: 'hard',
                            points: 50
                        },
                    ];
                    _i = 0, defaultBadges_1 = defaultBadges;
                    _a.label = 1;
                case 1:
                    if (!(_i < defaultBadges_1.length)) return [3 /*break*/, 4];
                    badge = defaultBadges_1[_i];
                    return [4 /*yield*/, db_1.prisma.badge.upsert({
                            where: { name: badge.name },
                            update: badge,
                            create: badge,
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_7 = _a.sent();
                    console.error('Error initializing default badges:', error_7);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Function to award points for a conversion
function awardPointsForConversion(userId, sourceFormat, targetFormat, batchId) {
    return __awaiter(this, void 0, void 0, function () {
        var points, formatCategory, multiplier, totalPoints, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    points = exports.POINTS.CONVERSION.DEFAULT;
                    formatCategory = sourceFormat.split('/')[0].toUpperCase();
                    if (formatCategory === 'APPLICATION' && sourceFormat.includes('pdf')) {
                        points = exports.POINTS.CONVERSION.PDF;
                    }
                    else if (formatCategory === 'IMAGE') {
                        points = exports.POINTS.CONVERSION.IMAGE;
                    }
                    else if (formatCategory === 'AUDIO') {
                        points = exports.POINTS.CONVERSION.AUDIO;
                    }
                    else if (formatCategory === 'VIDEO') {
                        points = exports.POINTS.CONVERSION.VIDEO;
                    }
                    return [4 /*yield*/, getUserStreak(userId)];
                case 1:
                    multiplier = (_a.sent()).multiplier;
                    totalPoints = Math.round(points * multiplier);
                    // Update conversion record with points earned
                    return [4 /*yield*/, db_1.prisma.conversion.update({
                            where: {
                                id: batchId || undefined,
                            },
                            data: {
                                pointsEarned: totalPoints
                            }
                        })];
                case 2:
                    // Update conversion record with points earned
                    _a.sent();
                    // Add points to user's total
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                points: {
                                    increment: totalPoints
                                },
                                xp: {
                                    increment: totalPoints
                                }
                            }
                        })];
                case 3:
                    // Add points to user's total
                    _a.sent();
                    // Record daily points
                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                            data: {
                                userId: userId,
                                points: totalPoints,
                                source: 'conversion'
                            }
                        })];
                case 4:
                    // Record daily points
                    _a.sent();
                    // Check for badge achievements
                    return [4 /*yield*/, checkForBadgeAchievements(userId)];
                case 5:
                    // Check for badge achievements
                    _a.sent();
                    // Update user level if needed
                    return [4 /*yield*/, updateUserLevel(userId)];
                case 6:
                    // Update user level if needed
                    _a.sent();
                    return [2 /*return*/, totalPoints];
                case 7:
                    error_8 = _a.sent();
                    console.error('Error awarding points for conversion:', error_8);
                    return [2 /*return*/, 0];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Function to update user streak
function updateUserStreak(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, now, today, newStreak, streakBonusPoints, yesterday, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: { streak: true, lastActive: true }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/];
                    now = new Date();
                    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    // If user has been active today, no need to update
                    if (user.lastActive && user.lastActive.getDate() === today.getDate() &&
                        user.lastActive.getMonth() === today.getMonth() &&
                        user.lastActive.getFullYear() === today.getFullYear()) {
                        return [2 /*return*/];
                    }
                    newStreak = 1;
                    streakBonusPoints = 0;
                    // Check if yesterday
                    if (user.lastActive) {
                        yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        if (user.lastActive.getDate() === yesterday.getDate() &&
                            user.lastActive.getMonth() === yesterday.getMonth() &&
                            user.lastActive.getFullYear() === yesterday.getFullYear()) {
                            // Continuing streak
                            newStreak = user.streak + 1;
                            // Award streak bonus points
                            if (newStreak === 3) {
                                streakBonusPoints = exports.POINTS.STREAK.THREE_DAYS;
                            }
                            else if (newStreak === 7) {
                                streakBonusPoints = exports.POINTS.STREAK.SEVEN_DAYS;
                            }
                            else if (newStreak === 30) {
                                streakBonusPoints = exports.POINTS.STREAK.THIRTY_DAYS;
                            }
                        }
                    }
                    // Update user streak and last active date
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                streak: newStreak,
                                lastActive: now,
                                points: {
                                    increment: streakBonusPoints
                                },
                                xp: {
                                    increment: streakBonusPoints
                                }
                            }
                        })];
                case 2:
                    // Update user streak and last active date
                    _a.sent();
                    if (!(streakBonusPoints > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                            data: {
                                userId: userId,
                                points: streakBonusPoints,
                                source: 'streak'
                            }
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    if (!(newStreak >= 7)) return [3 /*break*/, 6];
                    return [4 /*yield*/, checkForBadgeAchievements(userId)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_9 = _a.sent();
                    console.error('Error updating user streak:', error_9);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Function to check for badge achievements
function checkForBadgeAchievements(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var allBadges, userBadges, userBadgeIds, user, _loop_1, _i, allBadges_1, badge, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, getAllBadges()];
                case 1:
                    allBadges = _a.sent();
                    return [4 /*yield*/, getUserBadges(userId)];
                case 2:
                    userBadges = _a.sent();
                    userBadgeIds = userBadges.map(function (badge) { return badge.id; });
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: {
                                points: true,
                                xp: true,
                                streak: true,
                                conversions: {
                                    select: {
                                        id: true,
                                        sourceFormat: true,
                                        targetFormat: true,
                                        createdAt: true,
                                        batchId: true
                                    }
                                },
                                badges: {
                                    select: {
                                        badgeId: true
                                    }
                                }
                            }
                        })];
                case 3:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/];
                    _loop_1 = function (badge) {
                        var criteria, awardBadge, pdfConversions, uniqueFormats_1, batches_1, _b, _c, _d, _, count, hourlyConversions_1, _e, _f, _g, _, count, shareCount;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0:
                                    // Skip if user already has this badge
                                    if (userBadgeIds.includes(badge.id))
                                        return [2 /*return*/, "continue"];
                                    criteria = JSON.parse(badge.criteria || '{}');
                                    awardBadge = false;
                                    // Check different criteria types
                                    if (criteria.conversions && user.conversions && user.conversions.length >= criteria.conversions) {
                                        awardBadge = true;
                                    }
                                    if (criteria.points && user.points >= criteria.points) {
                                        awardBadge = true;
                                    }
                                    if (criteria.streak_days && user.streak >= criteria.streak_days) {
                                        awardBadge = true;
                                    }
                                    if (criteria.pdf_conversions && user.conversions) {
                                        pdfConversions = user.conversions.filter(function (conv) { return conv.sourceFormat.includes('pdf') || conv.targetFormat.includes('pdf'); }).length;
                                        if (pdfConversions >= criteria.pdf_conversions) {
                                            awardBadge = true;
                                        }
                                    }
                                    if (criteria.unique_formats && user.conversions) {
                                        uniqueFormats_1 = new Set();
                                        user.conversions.forEach(function (conv) {
                                            uniqueFormats_1.add(conv.sourceFormat);
                                            uniqueFormats_1.add(conv.targetFormat);
                                        });
                                        if (uniqueFormats_1.size >= criteria.unique_formats) {
                                            awardBadge = true;
                                        }
                                    }
                                    if (criteria.batch_size && user.conversions) {
                                        batches_1 = new Map();
                                        user.conversions.forEach(function (conv) {
                                            if (conv.batchId) {
                                                if (!batches_1.has(conv.batchId)) {
                                                    batches_1.set(conv.batchId, 0);
                                                }
                                                batches_1.set(conv.batchId, batches_1.get(conv.batchId) + 1);
                                            }
                                        });
                                        // Check if any batch meets the criteria
                                        for (_b = 0, _c = Array.from(batches_1.entries()); _b < _c.length; _b++) {
                                            _d = _c[_b], _ = _d[0], count = _d[1];
                                            if (count >= criteria.batch_size) {
                                                awardBadge = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (criteria.conversions_per_hour && user.conversions) {
                                        hourlyConversions_1 = new Map();
                                        user.conversions.forEach(function (conv) {
                                            var hourKey = "".concat(conv.createdAt.getFullYear(), "-").concat(conv.createdAt.getMonth(), "-").concat(conv.createdAt.getDate(), "-").concat(conv.createdAt.getHours());
                                            if (!hourlyConversions_1.has(hourKey)) {
                                                hourlyConversions_1.set(hourKey, 0);
                                            }
                                            hourlyConversions_1.set(hourKey, hourlyConversions_1.get(hourKey) + 1);
                                        });
                                        // Check if any hour meets the criteria
                                        for (_e = 0, _f = Array.from(hourlyConversions_1.entries()); _e < _f.length; _e++) {
                                            _g = _f[_e], _ = _g[0], count = _g[1];
                                            if (count >= criteria.conversions_per_hour) {
                                                awardBadge = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!criteria.shares) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db_1.prisma.dailyPoints.count({
                                            where: {
                                                userId: userId,
                                                source: 'share'
                                            }
                                        })];
                                case 1:
                                    shareCount = _h.sent();
                                    if (shareCount >= criteria.shares) {
                                        awardBadge = true;
                                    }
                                    _h.label = 2;
                                case 2:
                                    if (!awardBadge) return [3 /*break*/, 6];
                                    return [4 /*yield*/, db_1.prisma.userBadge.create({
                                            data: {
                                                userId: userId,
                                                badgeId: badge.id,
                                                earnedAt: new Date()
                                            }
                                        })];
                                case 3:
                                    _h.sent();
                                    if (!(badge.points > 0)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, db_1.prisma.user.update({
                                            where: { id: userId },
                                            data: {
                                                points: {
                                                    increment: badge.points
                                                },
                                                xp: {
                                                    increment: badge.points
                                                }
                                            }
                                        })];
                                case 4:
                                    _h.sent();
                                    // Record the points
                                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                                            data: {
                                                userId: userId,
                                                points: badge.points,
                                                source: 'badge'
                                            }
                                        })];
                                case 5:
                                    // Record the points
                                    _h.sent();
                                    _h.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, allBadges_1 = allBadges;
                    _a.label = 4;
                case 4:
                    if (!(_i < allBadges_1.length)) return [3 /*break*/, 7];
                    badge = allBadges_1[_i];
                    return [5 /*yield**/, _loop_1(badge)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_10 = _a.sent();
                    console.error('Error checking for badge achievements:', error_10);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Function to update user level based on XP
function updateUserLevel(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var user, newLevel, levelThreshold, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                            select: { xp: true }
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/];
                    newLevel = '';
                    levelThreshold = 0;
                    if (user.xp < exports.LEVELS.CONVERT_MASTER.min) {
                        newLevel = 'Beginner';
                        levelThreshold = exports.LEVELS.CONVERT_MASTER.min;
                    }
                    else if (user.xp < exports.LEVELS.FILE_WIZARD.min) {
                        newLevel = 'Convert Master';
                        levelThreshold = exports.LEVELS.FILE_WIZARD.min;
                    }
                    else if (user.xp < exports.LEVELS.VIRAL_LEGEND.min) {
                        newLevel = 'File Wizard';
                        levelThreshold = exports.LEVELS.VIRAL_LEGEND.min;
                    }
                    else {
                        newLevel = 'Viral Legend';
                        levelThreshold = Infinity;
                    }
                    // Update user level
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: { level: user.xp }
                        })];
                case 2:
                    // Update user level
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_11 = _a.sent();
                    console.error('Error updating user level:', error_11);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to award points for sharing
function awardPointsForSharing(userId, shareType) {
    return __awaiter(this, void 0, void 0, function () {
        var points, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    points = 0;
                    switch (shareType) {
                        case 'conversion':
                            points = exports.POINTS.SHARE;
                            break;
                        case 'achievement':
                            points = exports.POINTS.SHARE;
                            break;
                        case 'challenge':
                            points = exports.POINTS.SHARE;
                            break;
                    }
                    // Update user points
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                points: {
                                    increment: points
                                },
                                xp: {
                                    increment: points
                                }
                            }
                        })];
                case 1:
                    // Update user points
                    _a.sent();
                    // Record the points
                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                            data: {
                                userId: userId,
                                points: points,
                                source: 'share'
                            }
                        })];
                case 2:
                    // Record the points
                    _a.sent();
                    // Check for sharing-related badges
                    return [4 /*yield*/, checkForBadgeAchievements(userId)];
                case 3:
                    // Check for sharing-related badges
                    _a.sent();
                    return [2 /*return*/, points];
                case 4:
                    error_12 = _a.sent();
                    console.error('Error awarding points for sharing:', error_12);
                    return [2 /*return*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Function to award points for referrals
function awardPointsForReferral(userId, referredUserId) {
    return __awaiter(this, void 0, void 0, function () {
        var points, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    points = exports.POINTS.REFERRAL;
                    // Award points to referring user
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                points: {
                                    increment: points
                                },
                                xp: {
                                    increment: points
                                }
                            }
                        })];
                case 1:
                    // Award points to referring user
                    _a.sent();
                    // Record the points
                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                            data: {
                                userId: userId,
                                points: points,
                                source: 'referral'
                            }
                        })];
                case 2:
                    // Record the points
                    _a.sent();
                    // Also award points to the referred user
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: referredUserId },
                            data: {
                                points: {
                                    increment: exports.POINTS.REFERRAL
                                },
                                xp: {
                                    increment: exports.POINTS.REFERRAL
                                }
                            }
                        })];
                case 3:
                    // Also award points to the referred user
                    _a.sent();
                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                            data: {
                                userId: referredUserId,
                                points: exports.POINTS.REFERRAL,
                                source: 'referred'
                            }
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, points];
                case 5:
                    error_13 = _a.sent();
                    console.error('Error awarding points for referral:', error_13);
                    return [2 /*return*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Function to initialize daily challenges
function initializeDailyChallenges() {
    return __awaiter(this, void 0, void 0, function () {
        var defaultChallenges, _i, defaultChallenges_1, challenge, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    defaultChallenges = [
                        {
                            title: 'Format Explorer',
                            description: 'Convert 3 different formats today',
                            points: 50,
                            criteria: JSON.stringify({ unique_formats: 3 }),
                            type: 'conversion'
                        },
                        {
                            title: 'Social Butterfly',
                            description: 'Share your conversion stats',
                            points: 25,
                            criteria: JSON.stringify({ shares: 1 }),
                            type: 'social'
                        },
                        {
                            title: 'New Horizons',
                            description: 'Try a new conversion type',
                            points: 30,
                            criteria: JSON.stringify({ new_format: true }),
                            type: 'conversion'
                        },
                        {
                            title: 'PDF Master',
                            description: 'Convert 5 images to PDF',
                            points: 40,
                            criteria: JSON.stringify({ image_to_pdf: 5 }),
                            type: 'conversion'
                        },
                        {
                            title: 'Batch Converter',
                            description: 'Convert 10 files in a single batch',
                            points: 60,
                            criteria: JSON.stringify({ batch_size: 10 }),
                            type: 'conversion'
                        },
                        {
                            title: 'Video Virtuoso',
                            description: 'Convert 3 video files',
                            points: 45,
                            criteria: JSON.stringify({ video_conversions: 3 }),
                            type: 'conversion'
                        },
                        {
                            title: 'Audio Ace',
                            description: 'Convert 3 audio files',
                            points: 35,
                            criteria: JSON.stringify({ audio_conversions: 3 }),
                            type: 'conversion'
                        },
                        {
                            title: 'Referral Champion',
                            description: 'Refer a friend to ConvertViral',
                            points: 75,
                            criteria: JSON.stringify({ referrals: 1 }),
                            type: 'social'
                        },
                        {
                            title: 'Streak Starter',
                            description: 'Log in for 3 consecutive days',
                            points: 30,
                            criteria: JSON.stringify({ login_streak: 3 }),
                            type: 'engagement'
                        },
                        {
                            title: 'Conversion Marathon',
                            description: 'Convert 20 files in a day',
                            points: 100,
                            criteria: JSON.stringify({ daily_conversions: 20 }),
                            type: 'conversion'
                        }
                    ];
                    _i = 0, defaultChallenges_1 = defaultChallenges;
                    _a.label = 1;
                case 1:
                    if (!(_i < defaultChallenges_1.length)) return [3 /*break*/, 4];
                    challenge = defaultChallenges_1[_i];
                    return [4 /*yield*/, db_1.prisma.challenge.upsert({
                            where: { id: challenge.title },
                            update: __assign(__assign({}, challenge), { requirement: 1, formatType: null, isDaily: true, isActive: true }),
                            create: __assign(__assign({}, challenge), { requirement: 1, formatType: null, isDaily: true, isActive: true }),
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_14 = _a.sent();
                    console.error('Error initializing daily challenges:', error_14);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Function to get daily challenges for a user
function getDailyChallenges(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var today, startOfDay, endOfDay, existingChallenges, allChallenges, shuffled, selectedChallenges, userChallenges, _i, selectedChallenges_1, challenge, userChallenge, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    today = new Date();
                    startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                    return [4 /*yield*/, db_1.prisma.userChallenge.findMany({
                            where: {
                                userId: userId,
                                createdAt: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                }
                            },
                            include: {
                                challenge: true
                            }
                        })];
                case 1:
                    existingChallenges = _a.sent();
                    if (existingChallenges.length > 0) {
                        // Return existing challenges as UserChallenge[]
                        return [2 /*return*/, existingChallenges.map(function (uc) { return ({
                                id: uc.id,
                                userId: uc.userId,
                                challengeId: uc.challengeId,
                                progress: uc.progress,
                                completed: uc.completed,
                                completedAt: uc.completedAt,
                                challenge: {
                                    id: uc.challenge.id,
                                    title: uc.challenge.title,
                                    description: uc.challenge.description,
                                    type: uc.challenge.type,
                                    requirement: uc.challenge.requirement,
                                    formatType: uc.challenge.formatType,
                                    criteria: uc.challenge.criteria,
                                    points: uc.challenge.points,
                                    isDaily: uc.challenge.isDaily,
                                    isActive: uc.challenge.isActive
                                }
                            }); })];
                    }
                    return [4 /*yield*/, db_1.prisma.challenge.findMany()];
                case 2:
                    allChallenges = _a.sent();
                    shuffled = allChallenges.sort(function () { return 0.5 - Math.random(); });
                    selectedChallenges = shuffled.slice(0, 3);
                    userChallenges = [];
                    _i = 0, selectedChallenges_1 = selectedChallenges;
                    _a.label = 3;
                case 3:
                    if (!(_i < selectedChallenges_1.length)) return [3 /*break*/, 6];
                    challenge = selectedChallenges_1[_i];
                    return [4 /*yield*/, db_1.prisma.userChallenge.create({
                            data: {
                                userId: userId,
                                challengeId: challenge.id,
                                completed: false,
                                progress: 0
                            }
                        })];
                case 4:
                    userChallenge = _a.sent();
                    userChallenges.push({
                        id: userChallenge.id,
                        userId: userChallenge.userId,
                        challengeId: userChallenge.challengeId,
                        progress: userChallenge.progress,
                        completed: userChallenge.completed,
                        completedAt: userChallenge.completedAt,
                        challenge: {
                            id: challenge.id,
                            title: challenge.title,
                            description: challenge.description,
                            type: challenge.type,
                            requirement: challenge.requirement,
                            formatType: challenge.formatType,
                            criteria: challenge.criteria,
                            points: challenge.points,
                            isDaily: challenge.isDaily,
                            isActive: challenge.isActive
                        }
                    });
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, userChallenges];
                case 7:
                    error_15 = _a.sent();
                    console.error('Error getting daily challenges:', error_15);
                    return [2 /*return*/, []];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Function to check challenge progress
function checkChallengeProgress(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var today, startOfDay, endOfDay, userChallenges, userConversions, userShares, userReferrals, _loop_2, _i, userChallenges_1, userChallenge, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    today = new Date();
                    startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                    return [4 /*yield*/, db_1.prisma.userChallenge.findMany({
                            where: {
                                userId: userId,
                                createdAt: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                },
                                completed: false
                            },
                            include: {
                                challenge: true
                            }
                        })];
                case 1:
                    userChallenges = _a.sent();
                    if (userChallenges.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.prisma.conversion.findMany({
                            where: {
                                userId: userId,
                                createdAt: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                }
                            }
                        })];
                case 2:
                    userConversions = _a.sent();
                    return [4 /*yield*/, db_1.prisma.dailyPoints.count({
                            where: {
                                userId: userId,
                                date: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                },
                                source: 'share'
                            }
                        })];
                case 3:
                    userShares = _a.sent();
                    return [4 /*yield*/, db_1.prisma.dailyPoints.count({
                            where: {
                                userId: userId,
                                date: {
                                    gte: startOfDay,
                                    lt: endOfDay
                                },
                                source: 'referral'
                            }
                        })];
                case 4:
                    userReferrals = _a.sent();
                    _loop_2 = function (userChallenge) {
                        var challenge, criteria, progress, completed, uniqueFormats_2, previousFormats, previousFormatSet_1, usedNewFormat, _b, userConversions_1, conv, imageToPdfCount, batches_2, largestBatch, _c, _d, count, videoCount, audioCount;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    challenge = userChallenge.challenge;
                                    criteria = JSON.parse(challenge.criteria);
                                    progress = 0;
                                    completed = false;
                                    // Check different criteria types
                                    if (criteria.unique_formats) {
                                        uniqueFormats_2 = new Set();
                                        userConversions.forEach(function (conv) {
                                            uniqueFormats_2.add(conv.sourceFormat);
                                            uniqueFormats_2.add(conv.targetFormat);
                                        });
                                        progress = Math.min(uniqueFormats_2.size, criteria.unique_formats);
                                        completed = uniqueFormats_2.size >= criteria.unique_formats;
                                    }
                                    if (criteria.shares) {
                                        progress = Math.min(userShares, criteria.shares);
                                        completed = userShares >= criteria.shares;
                                    }
                                    if (!criteria.new_format) return [3 /*break*/, 2];
                                    return [4 /*yield*/, db_1.prisma.conversion.findMany({
                                            where: {
                                                userId: userId,
                                                createdAt: {
                                                    lt: startOfDay
                                                }
                                            },
                                            select: {
                                                sourceFormat: true,
                                                targetFormat: true
                                            }
                                        })];
                                case 1:
                                    previousFormats = _e.sent();
                                    previousFormatSet_1 = new Set();
                                    previousFormats.forEach(function (conv) {
                                        previousFormatSet_1.add(conv.sourceFormat);
                                        previousFormatSet_1.add(conv.targetFormat);
                                    });
                                    usedNewFormat = false;
                                    for (_b = 0, userConversions_1 = userConversions; _b < userConversions_1.length; _b++) {
                                        conv = userConversions_1[_b];
                                        if (!previousFormatSet_1.has(conv.sourceFormat) || !previousFormatSet_1.has(conv.targetFormat)) {
                                            usedNewFormat = true;
                                            break;
                                        }
                                    }
                                    progress = usedNewFormat ? 1 : 0;
                                    completed = usedNewFormat;
                                    _e.label = 2;
                                case 2:
                                    if (criteria.image_to_pdf) {
                                        imageToPdfCount = userConversions.filter(function (conv) { return conv.sourceFormat.startsWith('image/') && conv.targetFormat.includes('pdf'); }).length;
                                        progress = Math.min(imageToPdfCount, criteria.image_to_pdf);
                                        completed = imageToPdfCount >= criteria.image_to_pdf;
                                    }
                                    if (criteria.batch_size) {
                                        batches_2 = new Map();
                                        userConversions.forEach(function (conv) {
                                            if (conv.batchId) {
                                                if (!batches_2.has(conv.batchId)) {
                                                    batches_2.set(conv.batchId, 0);
                                                }
                                                batches_2.set(conv.batchId, batches_2.get(conv.batchId) + 1);
                                            }
                                        });
                                        largestBatch = 0;
                                        for (_c = 0, _d = Array.from(batches_2.values()); _c < _d.length; _c++) {
                                            count = _d[_c];
                                            largestBatch = Math.max(largestBatch, count);
                                        }
                                        progress = Math.min(largestBatch, criteria.batch_size);
                                        completed = largestBatch >= criteria.batch_size;
                                    }
                                    if (criteria.video_conversions) {
                                        videoCount = userConversions.filter(function (conv) { return conv.sourceFormat.startsWith('video/') || conv.targetFormat.startsWith('video/'); }).length;
                                        progress = Math.min(videoCount, criteria.video_conversions);
                                        completed = videoCount >= criteria.video_conversions;
                                    }
                                    if (criteria.audio_conversions) {
                                        audioCount = userConversions.filter(function (conv) { return conv.sourceFormat.startsWith('audio/') || conv.targetFormat.startsWith('audio/'); }).length;
                                        progress = Math.min(audioCount, criteria.audio_conversions);
                                        completed = audioCount >= criteria.audio_conversions;
                                    }
                                    if (criteria.referrals) {
                                        progress = Math.min(userReferrals, criteria.referrals);
                                        completed = userReferrals >= criteria.referrals;
                                    }
                                    if (criteria.daily_conversions) {
                                        progress = Math.min(userConversions.length, criteria.daily_conversions);
                                        completed = userConversions.length >= criteria.daily_conversions;
                                    }
                                    // Update challenge progress
                                    return [4 /*yield*/, db_1.prisma.userChallenge.update({
                                            where: { id: userChallenge.id },
                                            data: {
                                                progress: progress,
                                                completed: completed
                                            }
                                        })];
                                case 3:
                                    // Update challenge progress
                                    _e.sent();
                                    if (!(completed && !userChallenge.completed)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, db_1.prisma.user.update({
                                            where: { id: userId },
                                            data: {
                                                points: {
                                                    increment: challenge.points
                                                },
                                                xp: {
                                                    increment: challenge.points
                                                }
                                            }
                                        })];
                                case 4:
                                    _e.sent();
                                    // Record the points
                                    return [4 /*yield*/, db_1.prisma.dailyPoints.create({
                                            data: {
                                                userId: userId,
                                                points: challenge.points,
                                                source: 'challenge'
                                            }
                                        })];
                                case 5:
                                    // Record the points
                                    _e.sent();
                                    _e.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, userChallenges_1 = userChallenges;
                    _a.label = 5;
                case 5:
                    if (!(_i < userChallenges_1.length)) return [3 /*break*/, 8];
                    userChallenge = userChallenges_1[_i];
                    return [5 /*yield**/, _loop_2(userChallenge)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_16 = _a.sent();
                    console.error('Error checking challenge progress:', error_16);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
// Function to generate social sharing content
function generateSharingContent(type, data) {
    var text = '';
    var imageUrl = '/images/share-default.png';
    switch (type) {
        case 'conversion':
            var count = data.count, format = data.format;
            if (count > 1) {
                text = "I just converted ".concat(count, " files").concat(format ? " to ".concat(format) : '', " on ConvertViral! \uD83D\uDE80");
                imageUrl = '/images/share-conversion-batch.png';
            }
            else {
                text = "Just converted a file".concat(format ? " to ".concat(format) : '', " on ConvertViral! So easy! \u2728");
                imageUrl = '/images/share-conversion-single.png';
            }
            break;
        case 'achievement':
            var badge = data.badge;
            text = "I just earned the \"".concat(badge.name, "\" badge on ConvertViral! \uD83C\uDFC6");
            imageUrl = badge.imageUrl || '/images/share-achievement.png';
            break;
        case 'challenge':
            var challenge = data.challenge;
            text = "I just completed the \"".concat(challenge.title, "\" challenge on ConvertViral! \uD83C\uDFAF");
            imageUrl = '/images/share-challenge.png';
            break;
    }
    return { text: text, imageUrl: imageUrl };
}
