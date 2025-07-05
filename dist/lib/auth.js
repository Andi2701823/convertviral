"use strict";
/// <reference path="../types/next-auth.d.ts" />
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
const db_1 = require("./db");
const prisma_adapter_1 = require("@auth/prisma-adapter");
const google_1 = __importDefault(require("next-auth/providers/google"));
const github_1 = __importDefault(require("next-auth/providers/github"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
// Function to get user by ID
async function getUserById(id) {
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            points: user.points,
            level: user.level,
        };
    }
    catch (error) {
        console.error('Error getting user by ID:', error);
        return null;
    }
}
// Function to get user by email
async function getUserByEmail(email) {
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            points: user.points,
            level: user.level,
        };
    }
    catch (error) {
        console.error('Error getting user by email:', error);
        return null;
    }
}
// Function to create a new user
async function createUser(userData) {
    try {
        const user = await db_1.prisma.user.create({
            data: {
                name: userData.name || null,
                email: userData.email,
                image: userData.image || null,
                points: 0,
                level: 1,
            },
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            points: user.points,
            level: user.level,
        };
    }
    catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}
// Function to update user points
async function updateUserPoints(userId, pointsToAdd) {
    try {
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return false;
        const newPoints = user.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        await db_1.prisma.user.update({
            where: { id: userId },
            data: {
                points: newPoints,
                level: newLevel,
            },
        });
        return true;
    }
    catch (error) {
        console.error('Error updating user points:', error);
        return false;
    }
}
// Function to calculate user level based on points
function calculateLevel(points) {
    // Simple level calculation: level = 1 + points / 100 (rounded down)
    return Math.max(1, Math.floor(1 + points / 100));
}
// Function to get user badges
async function getUserBadges(userId) {
    try {
        const userBadges = await db_1.prisma.userBadge.findMany({
            where: { userId },
            include: {
                badge: true,
            },
            orderBy: {
                earnedAt: 'desc',
            },
        });
        return userBadges.map((userBadge) => ({
            id: userBadge.badge.id,
            name: userBadge.badge.name,
            description: userBadge.badge.description,
            imageUrl: userBadge.badge.imageUrl,
            earnedAt: userBadge.earnedAt,
        }));
    }
    catch (error) {
        console.error('Error getting user badges:', error);
        return [];
    }
}
// Function to award a badge to a user
async function awardBadgeToUser(userId, badgeName) {
    try {
        // Check if the badge exists
        const badge = await db_1.prisma.badge.findUnique({
            where: { name: badgeName },
        });
        if (!badge)
            return false;
        // Check if the user already has this badge
        const existingBadge = await db_1.prisma.userBadge.findUnique({
            where: {
                userId_badgeId: {
                    userId,
                    badgeId: badge.id,
                },
            },
        });
        if (existingBadge)
            return true; // User already has this badge
        // Award the badge to the user
        await db_1.prisma.userBadge.create({
            data: {
                userId,
                badgeId: badge.id,
            },
        });
        return true;
    }
    catch (error) {
        console.error('Error awarding badge to user:', error);
        return false;
    }
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
            async authorize(credentials) {
                // Add your own logic here for credentials-based authentication
                // This is a placeholder implementation
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                // In a real implementation, you would check the credentials against your database
                // For now, we'll just return a mock user
                return {
                    id: '1',
                    name: 'Demo User',
                    email: credentials.email,
                    image: null
                };
            }
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub || '';
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
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
