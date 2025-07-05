/// <reference path="../types/next-auth.d.ts" />

import { User } from '@prisma/client';
import { prisma } from './db';
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

// Types for authentication
export type AuthUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  points: number;
  level: number;
};

// Function to get user by ID
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      points: user.points,
      level: user.level,
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Function to get user by email
export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      points: user.points,
      level: user.level,
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Function to create a new user
export async function createUser(userData: {
  name?: string;
  email: string;
  image?: string;
}): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.create({
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
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Function to update user points
export async function updateUserPoints(userId: string, pointsToAdd: number): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) return false;
    
    const newPoints = user.points + pointsToAdd;
    const newLevel = calculateLevel(newPoints);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints,
        level: newLevel,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user points:', error);
    return false;
  }
}

// Function to calculate user level based on points
export function calculateLevel(points: number): number {
  // Simple level calculation: level = 1 + points / 100 (rounded down)
  return Math.max(1, Math.floor(1 + points / 100));
}

// Function to get user badges
export async function getUserBadges(userId: string) {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    });
    
    return userBadges.map((userBadge: any) => ({
      id: userBadge.badge.id,
      name: userBadge.badge.name,
      description: userBadge.badge.description,
      imageUrl: userBadge.badge.imageUrl,
      earnedAt: userBadge.earnedAt,
    }));
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
}

// Function to award a badge to a user
export async function awardBadgeToUser(userId: string, badgeName: string): Promise<boolean> {
  try {
    // Check if the badge exists
    const badge = await prisma.badge.findUnique({
      where: { name: badgeName },
    });
    
    if (!badge) return false;
    
    // Check if the user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
    });
    
    if (existingBadge) return true; // User already has this badge
    
    // Award the badge to the user
    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });
    
    return true;
  } catch (error) {
    console.error('Error awarding badge to user:', error);
    return false;
  }
}

// NextAuth configuration options
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    CredentialsProvider({
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