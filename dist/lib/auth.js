"use strict";
/// <reference path="../types/next-auth.d.ts" />
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
exports.getUserById = getUserById;
exports.getUserByEmail = getUserByEmail;
exports.createUser = createUser;
exports.updateUserPoints = updateUserPoints;
exports.calculateLevel = calculateLevel;
exports.getUserBadges = getUserBadges;
exports.awardBadgeToUser = awardBadgeToUser;
var db_1 = require("./db");
var prisma_adapter_1 = require("@auth/prisma-adapter");
var google_1 = __importDefault(require("next-auth/providers/google"));
var github_1 = __importDefault(require("next-auth/providers/github"));
var credentials_1 = __importDefault(require("next-auth/providers/credentials"));
// Function to get user by ID
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var user, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: id },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            points: user.points,
                            level: user.level,
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error getting user by ID:', error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to get user by email
function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function () {
        var user, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { email: email },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            points: user.points,
                            level: user.level,
                        }];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error getting user by email:', error_2);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to create a new user
function createUser(userData) {
    return __awaiter(this, void 0, void 0, function () {
        var user, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.user.create({
                            data: {
                                name: userData.name || null,
                                email: userData.email,
                                image: userData.image || null,
                                points: 0,
                                level: 1,
                            },
                        })];
                case 1:
                    user = _a.sent();
                    return [2 /*return*/, {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            points: user.points,
                            level: user.level,
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error creating user:', error_3);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to update user points
function updateUserPoints(userId, pointsToAdd) {
    return __awaiter(this, void 0, void 0, function () {
        var user, newPoints, newLevel, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db_1.prisma.user.findUnique({
                            where: { id: userId },
                        })];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, false];
                    newPoints = user.points + pointsToAdd;
                    newLevel = calculateLevel(newPoints);
                    return [4 /*yield*/, db_1.prisma.user.update({
                            where: { id: userId },
                            data: {
                                points: newPoints,
                                level: newLevel,
                            },
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error updating user points:', error_4);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Function to calculate user level based on points
function calculateLevel(points) {
    // Simple level calculation: level = 1 + points / 100 (rounded down)
    return Math.max(1, Math.floor(1 + points / 100));
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
                            include: {
                                badge: true,
                            },
                            orderBy: {
                                earnedAt: 'desc',
                            },
                        })];
                case 1:
                    userBadges = _a.sent();
                    return [2 /*return*/, userBadges.map(function (userBadge) { return ({
                            id: userBadge.badge.id,
                            name: userBadge.badge.name,
                            description: userBadge.badge.description,
                            imageUrl: userBadge.badge.imageUrl,
                            earnedAt: userBadge.earnedAt,
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
// Function to award a badge to a user
function awardBadgeToUser(userId, badgeName) {
    return __awaiter(this, void 0, void 0, function () {
        var badge, existingBadge, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, db_1.prisma.badge.findUnique({
                            where: { name: badgeName },
                        })];
                case 1:
                    badge = _a.sent();
                    if (!badge)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db_1.prisma.userBadge.findUnique({
                            where: {
                                userId_badgeId: {
                                    userId: userId,
                                    badgeId: badge.id,
                                },
                            },
                        })];
                case 2:
                    existingBadge = _a.sent();
                    if (existingBadge)
                        return [2 /*return*/, true]; // User already has this badge
                    // Award the badge to the user
                    return [4 /*yield*/, db_1.prisma.userBadge.create({
                            data: {
                                userId: userId,
                                badgeId: badge.id,
                            },
                        })];
                case 3:
                    // Award the badge to the user
                    _a.sent();
                    return [2 /*return*/, true];
                case 4:
                    error_6 = _a.sent();
                    console.error('Error awarding badge to user:', error_6);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// NextAuth configuration options
exports.authOptions = {
    adapter: (0, prisma_adapter_1.PrismaAdapter)(db_1.prisma),
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        (0, github_1.default)({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        (0, credentials_1.default)({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: function (credentials) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // Add your own logic here for credentials-based authentication
                        // This is a placeholder implementation
                        if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                            return [2 /*return*/, null];
                        }
                        // In a real implementation, you would check the credentials against your database
                        // For now, we'll just return a mock user
                        return [2 /*return*/, {
                                id: '1',
                                name: 'Demo User',
                                email: credentials.email,
                                image: null
                            }];
                    });
                });
            }
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        session: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var session = _b.session, token = _b.token;
                return __generator(this, function (_c) {
                    if (token && session.user) {
                        session.user.id = token.sub || '';
                    }
                    return [2 /*return*/, session];
                });
            });
        },
        jwt: function (_a) {
            return __awaiter(this, arguments, void 0, function (_b) {
                var token = _b.token, user = _b.user;
                return __generator(this, function (_c) {
                    if (user) {
                        token.sub = user.id;
                    }
                    return [2 /*return*/, token];
                });
            });
        }
    },
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login',
        newUser: '/profile'
    },
    secret: process.env.NEXTAUTH_SECRET,
};
