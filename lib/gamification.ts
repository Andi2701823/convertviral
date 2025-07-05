import { prisma } from './db';
import { getCache, setCache } from './redis';
import { ConversionStatus } from '@prisma/client';

// Constants for gamification system
export const POINTS = {
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

export const LEVELS = {
  BEGINNER: { min: 0, max: 100, name: 'Beginner' },
  CONVERT_MASTER: { min: 100, max: 500, name: 'Convert Master' },
  FILE_WIZARD: { min: 500, max: 1000, name: 'File Wizard' },
  VIRAL_LEGEND: { min: 1000, max: Infinity, name: 'Viral Legend' }
};

export const STREAK_MULTIPLIERS = {
  THREE_DAYS: 1.2,
  SEVEN_DAYS: 1.5,
  FOURTEEN_DAYS: 1.8,
  THIRTY_DAYS: 2.0
};

// Types for gamification
export type LeaderboardEntry = {
  userId: string;
  name: string | null;
  image: string | null;
  points: number;
  level: number;
  rank: number;
  conversions?: number;
  country?: string | null;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: string;
  points: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  type: string;
  requirement: number;
  formatType?: string | null;
  criteria: string;
  points: number;
  isDaily: boolean;
  isActive: boolean;
};

export type UserChallenge = {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date | null;
  challenge: Challenge;
};

export type UserBadge = {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
};

export type UserLevel = {
  level: number;
  name: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
};

export type DailyStreak = {
  current: number;
  multiplier: number;
  lastActive: Date | null;
};

// Function to get leaderboard
export async function getLeaderboard(limit = 10, timeframe: 'daily' | 'weekly' | 'allTime' = 'allTime', country?: string): Promise<LeaderboardEntry[]> {
  try {
    // Try to get from cache first
    const cacheKey = `leaderboard:${timeframe}:${country || 'all'}:${limit}`;
    const cachedLeaderboard = await getCache<LeaderboardEntry[]>(cacheKey);
    
    if (cachedLeaderboard) {
      return cachedLeaderboard;
    }
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'daily') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = {
        createdAt: {
          gte: startOfDay
        }
      };
    } else if (timeframe === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = {
        createdAt: {
          gte: startOfWeek
        }
      };
    }
    
    // If country is specified, add it to the filter
    const countryFilter = country ? { country } : {};
    
    // Get users with conversion counts
    const users = await prisma.user.findMany({
      where: {
        ...countryFilter
      },
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
    });
    
    const leaderboard = users.map((user: any, index: number) => ({
      userId: user.id,
      name: user.name,
      image: user.image,
      points: user.points,
      level: user.level,
      rank: index + 1,
      conversions: user.conversions.length,
      country: user.country
    }));
    
    // Cache the result for 5 minutes
    await setCache(cacheKey, leaderboard, 300);
    
    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

// Function to get user rank
export async function getUserRank(userId: string, timeframe: 'daily' | 'weekly' | 'allTime' = 'allTime'): Promise<number> {
  try {
    // Get user's points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true },
    });
    
    if (!user) return 0;
    
    let dateFilter = {};
    const now = new Date();
    
    if (timeframe === 'daily') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateFilter = {
        dailyPoints: {
          some: {
            date: {
              gte: startOfDay
            }
          }
        }
      };
    } else if (timeframe === 'weekly') {
      const startOfWeek = new Date(now);
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
    
    // Count users with more points
    const usersWithMorePoints = await prisma.user.count({
      where: {
        points: {
          gt: user.points,
        },
        ...dateFilter
      },
    });
    
    // Rank is the number of users with more points + 1
    return usersWithMorePoints + 1;
  } catch (error) {
    console.error('Error getting user rank:', error);
    return 0;
  }
}

// Function to get user level information
export async function getUserLevel(userId: string): Promise<UserLevel> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, xp: true },
    });
    
    if (!user) {
      return {
        level: 1,
        name: LEVELS.BEGINNER.name,
        currentXP: 0,
        nextLevelXP: 100,
        progress: 0
      };
    }
    
    let levelInfo = LEVELS.BEGINNER;
    if (user.xp >= LEVELS.VIRAL_LEGEND.min) {
      levelInfo = LEVELS.VIRAL_LEGEND;
    } else if (user.xp >= LEVELS.FILE_WIZARD.min) {
      levelInfo = LEVELS.FILE_WIZARD;
    } else if (user.xp >= LEVELS.CONVERT_MASTER.min) {
      levelInfo = LEVELS.CONVERT_MASTER;
    }
    
    const nextLevelXP = levelInfo.max === Infinity ? user.xp * 2 : levelInfo.max;
    const progress = ((user.xp - levelInfo.min) / (nextLevelXP - levelInfo.min)) * 100;
    
    return {
      level: user.level,
      name: levelInfo.name,
      currentXP: user.xp,
      nextLevelXP,
      progress: Math.min(progress, 100)
    };
  } catch (error) {
    console.error('Error getting user level:', error);
    return {
      level: 1,
      name: LEVELS.BEGINNER.name,
      currentXP: 0,
      nextLevelXP: 100,
      progress: 0
    };
  }
}

// Function to get all available badges
export async function getAllBadges(): Promise<Badge[]> {
  try {
    const badges = await prisma.badge.findMany();
    
    return badges.map((badge: any) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description,
      imageUrl: badge.imageUrl,
      category: badge.category,
      difficulty: badge.difficulty,
      points: badge.points
    }));
  } catch (error) {
    console.error('Error getting all badges:', error);
    return [];
  }
}

// Function to get user badges
export async function getUserBadges(userId: string): Promise<UserBadge[]> {
  try {
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' }
    });
    
    return userBadges.map((userBadge: any) => ({
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
    }));
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
}

// Function to get user streak information
export async function getUserStreak(userId: string): Promise<DailyStreak> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastActive: true }
    });
    
    if (!user) {
      return { current: 0, multiplier: 1, lastActive: null };
    }
    
    // Calculate multiplier based on streak
    let multiplier = 1;
    if (user.streak >= 30) {
      multiplier = STREAK_MULTIPLIERS.THIRTY_DAYS;
    } else if (user.streak >= 14) {
      multiplier = STREAK_MULTIPLIERS.FOURTEEN_DAYS;
    } else if (user.streak >= 7) {
      multiplier = STREAK_MULTIPLIERS.SEVEN_DAYS;
    } else if (user.streak >= 3) {
      multiplier = STREAK_MULTIPLIERS.THREE_DAYS;
    }
    
    return {
      current: user.streak,
      multiplier,
      lastActive: user.lastActive
    };
  } catch (error) {
    console.error('Error getting user streak:', error);
    return { current: 0, multiplier: 1, lastActive: null };
  }
}

// Function to initialize default badges in the database
export async function initializeDefaultBadges(): Promise<void> {
  try {
    const defaultBadges = [
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
    
    for (const badge of defaultBadges) {
      await prisma.badge.upsert({
        where: { name: badge.name },
        update: badge,
        create: badge,
      });
    }
  } catch (error) {
    console.error('Error initializing default badges:', error);
  }
}

// Function to award points for a conversion
export async function awardPointsForConversion(userId: string, sourceFormat: string, targetFormat: string, batchId?: string): Promise<number> {
  try {
    // Determine points based on format type
    let points = POINTS.CONVERSION.DEFAULT;
    
    const formatCategory = sourceFormat.split('/')[0].toUpperCase();
    if (formatCategory === 'APPLICATION' && sourceFormat.includes('pdf')) {
      points = POINTS.CONVERSION.PDF;
    } else if (formatCategory === 'IMAGE') {
      points = POINTS.CONVERSION.IMAGE;
    } else if (formatCategory === 'AUDIO') {
      points = POINTS.CONVERSION.AUDIO;
    } else if (formatCategory === 'VIDEO') {
      points = POINTS.CONVERSION.VIDEO;
    }
    
    // Get user streak for multiplier
    const { multiplier } = await getUserStreak(userId);
    const totalPoints = Math.round(points * multiplier);
    
    // Update conversion record with points earned
    await prisma.conversion.update({
      where: {
        id: batchId || undefined,
      },
      data: {
        pointsEarned: totalPoints
      }
    });
    
    // Add points to user's total
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: totalPoints
        },
        xp: {
          increment: totalPoints
        }
      }
    });
    
    // Record daily points
    await prisma.dailyPoints.create({
      data: {
        userId,
        points: totalPoints,
        source: 'conversion'
      }
    });
    
    // Check for badge achievements
    await checkForBadgeAchievements(userId);
    
    // Update user level if needed
    await updateUserLevel(userId);
    
    return totalPoints;
  } catch (error) {
    console.error('Error awarding points for conversion:', error);
    return 0;
  }
}

// Function to update user streak
export async function updateUserStreak(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { streak: true, lastActive: true }
    });
    
    if (!user) return;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // If user has been active today, no need to update
    if (user.lastActive && user.lastActive.getDate() === today.getDate() &&
        user.lastActive.getMonth() === today.getMonth() &&
        user.lastActive.getFullYear() === today.getFullYear()) {
      return;
    }
    
    let newStreak = 1;
    let streakBonusPoints = 0;
    
    // Check if yesterday
    if (user.lastActive) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (user.lastActive.getDate() === yesterday.getDate() &&
          user.lastActive.getMonth() === yesterday.getMonth() &&
          user.lastActive.getFullYear() === yesterday.getFullYear()) {
        // Continuing streak
        newStreak = user.streak + 1;
        
        // Award streak bonus points
        if (newStreak === 3) {
          streakBonusPoints = POINTS.STREAK.THREE_DAYS;
        } else if (newStreak === 7) {
          streakBonusPoints = POINTS.STREAK.SEVEN_DAYS;
        } else if (newStreak === 30) {
          streakBonusPoints = POINTS.STREAK.THIRTY_DAYS;
        }
      }
    }
    
    // Update user streak and last active date
    await prisma.user.update({
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
    });
    
    // If bonus points were awarded, record them
    if (streakBonusPoints > 0) {
      await prisma.dailyPoints.create({
        data: {
          userId,
          points: streakBonusPoints,
          source: 'streak'
        }
      });
    }
    
    // Check for streak-related badges
    if (newStreak >= 7) {
      await checkForBadgeAchievements(userId);
    }
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}

// Function to check for badge achievements
export async function checkForBadgeAchievements(userId: string): Promise<void> {
  try {
    // Get all badges
    const allBadges = await getAllBadges();
    
    // Get user's current badges
    const userBadges = await getUserBadges(userId);
    const userBadgeIds = userBadges.map(badge => badge.id);
    
    // Get user stats
    const user = await prisma.user.findUnique({
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
    }) as {
      points: number;
      xp: number;
      streak: number;
      conversions: {
        id: string;
        sourceFormat: string;
        targetFormat: string;
        createdAt: Date;
        batchId: string | null;
      }[];
      badges: {
         badgeId: string;
       }[];
    } | null;
    
    if (!user) return;
    
    // Check each badge criteria
    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (userBadgeIds.includes(badge.id)) continue;
      
      const criteria = JSON.parse((badge as any).criteria || '{}');
      let awardBadge = false;
      
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
        const pdfConversions = user.conversions.filter(
          (conv: any) => conv.sourceFormat.includes('pdf') || conv.targetFormat.includes('pdf')
        ).length;
        if (pdfConversions >= criteria.pdf_conversions) {
          awardBadge = true;
        }
      }
      
      if (criteria.unique_formats && user.conversions) {
        const uniqueFormats = new Set();
        user.conversions.forEach((conv: any) => {
          uniqueFormats.add(conv.sourceFormat);
          uniqueFormats.add(conv.targetFormat);
        });
        if (uniqueFormats.size >= criteria.unique_formats) {
          awardBadge = true;
        }
      }
      
      if (criteria.batch_size && user.conversions) {
        // Group conversions by batchId
        const batches = new Map();
        user.conversions.forEach((conv: any) => {
          if (conv.batchId) {
            if (!batches.has(conv.batchId)) {
              batches.set(conv.batchId, 0);
            }
            batches.set(conv.batchId, batches.get(conv.batchId) + 1);
          }
        });
        
        // Check if any batch meets the criteria
        for (const [_, count] of Array.from(batches.entries())) {
          if (count >= criteria.batch_size) {
            awardBadge = true;
            break;
          }
        }
      }
      
      if (criteria.conversions_per_hour && user.conversions) {
        // Group conversions by hour
        const hourlyConversions = new Map();
        user.conversions.forEach((conv: any) => {
          const hourKey = `${conv.createdAt.getFullYear()}-${conv.createdAt.getMonth()}-${conv.createdAt.getDate()}-${conv.createdAt.getHours()}`;
          if (!hourlyConversions.has(hourKey)) {
            hourlyConversions.set(hourKey, 0);
          }
          hourlyConversions.set(hourKey, hourlyConversions.get(hourKey) + 1);
        });
        
        // Check if any hour meets the criteria
        for (const [_, count] of Array.from(hourlyConversions.entries())) {
          if (count >= criteria.conversions_per_hour) {
            awardBadge = true;
            break;
          }
        }
      }
      
      if (criteria.shares) {
        // Get share count from DailyPoints
        const shareCount = await prisma.dailyPoints.count({
          where: {
            userId,
            source: 'share'
          }
        });
        
        if (shareCount >= criteria.shares) {
          awardBadge = true;
        }
      }
      
      // Award the badge if criteria met
      if (awardBadge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
            earnedAt: new Date()
          }
        });
        
        // Award bonus points for earning the badge
        if (badge.points > 0) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              points: {
                increment: badge.points
              },
              xp: {
                increment: badge.points
              }
            }
          });
          
          // Record the points
          await prisma.dailyPoints.create({
            data: {
              userId,
              points: badge.points,
              source: 'badge'
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking for badge achievements:', error);
  }
}

// Function to update user level based on XP
export async function updateUserLevel(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true }
    });
    
    if (!user) return;
    
    // Calculate new level based on XP
    let newLevel = '';
    let levelThreshold = 0;
    
    if (user.xp < LEVELS.CONVERT_MASTER.min) {
      newLevel = 'Beginner';
      levelThreshold = LEVELS.CONVERT_MASTER.min;
    } else if (user.xp < LEVELS.FILE_WIZARD.min) {
      newLevel = 'Convert Master';
      levelThreshold = LEVELS.FILE_WIZARD.min;
    } else if (user.xp < LEVELS.VIRAL_LEGEND.min) {
      newLevel = 'File Wizard';
      levelThreshold = LEVELS.VIRAL_LEGEND.min;
    } else {
      newLevel = 'Viral Legend';
      levelThreshold = Infinity;
    }
    
    // Update user level
    await prisma.user.update({
      where: { id: userId },
      data: { level: user.xp }
    });
  } catch (error) {
    console.error('Error updating user level:', error);
  }
}

// Function to award points for sharing
export async function awardPointsForSharing(userId: string, shareType: 'conversion' | 'achievement' | 'challenge'): Promise<number> {
  try {
    let points = 0;
    
    switch (shareType) {
      case 'conversion':
        points = POINTS.SHARE;
        break;
      case 'achievement':
        points = POINTS.SHARE;
        break;
      case 'challenge':
        points = POINTS.SHARE;
        break;
    }
    
    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points
        },
        xp: {
          increment: points
        }
      }
    });
    
    // Record the points
    await prisma.dailyPoints.create({
      data: {
        userId,
        points,
        source: 'share'
      }
    });
    
    // Check for sharing-related badges
    await checkForBadgeAchievements(userId);
    
    return points;
  } catch (error) {
    console.error('Error awarding points for sharing:', error);
    return 0;
  }
}

// Function to award points for referrals
export async function awardPointsForReferral(userId: string, referredUserId: string): Promise<number> {
  try {
    const points = POINTS.REFERRAL;
    
    // Award points to referring user
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: points
        },
        xp: {
          increment: points
        }
      }
    });
    
    // Record the points
    await prisma.dailyPoints.create({
      data: {
        userId,
        points,
        source: 'referral'
      }
    });
    
    // Also award points to the referred user
    await prisma.user.update({
      where: { id: referredUserId },
      data: {
        points: {
          increment: POINTS.REFERRAL
        },
        xp: {
          increment: POINTS.REFERRAL
        }
      }
    });
    
    await prisma.dailyPoints.create({
      data: {
        userId: referredUserId,
        points: POINTS.REFERRAL,
        source: 'referred'
      }
    });
    
    return points;
  } catch (error) {
    console.error('Error awarding points for referral:', error);
    return 0;
  }
}

// Function to initialize daily challenges
export async function initializeDailyChallenges(): Promise<void> {
  try {
    const defaultChallenges = [
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
    
    for (const challenge of defaultChallenges) {
      await prisma.challenge.upsert({
        where: { id: challenge.title },
        update: {
          ...challenge,
          requirement: 1,
          formatType: null,
          isDaily: true,
          isActive: true
        },
        create: {
          ...challenge,
          requirement: 1,
          formatType: null,
          isDaily: true,
          isActive: true
        },
      });
    }
  } catch (error) {
    console.error('Error initializing daily challenges:', error);
  }
}

// Function to get daily challenges for a user
export async function getDailyChallenges(userId: string): Promise<UserChallenge[]> {
  try {
    // Get today's date (start and end)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Check if user already has challenges for today
    const existingChallenges = await prisma.userChallenge.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      },
      include: {
        challenge: true
      }
    });
    
    if (existingChallenges.length > 0) {
      // Return existing challenges as UserChallenge[]
      return existingChallenges.map((uc: any) => ({
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
      }));
    }
    
    // Get all challenges
    const allChallenges = await prisma.challenge.findMany();
    
    // Randomly select 3 challenges
    const shuffled = allChallenges.sort(() => 0.5 - Math.random());
    const selectedChallenges = shuffled.slice(0, 3);
    
    // Assign challenges to user and collect UserChallenge data
    const userChallenges: UserChallenge[] = [];
    for (const challenge of selectedChallenges) {
      const userChallenge = await prisma.userChallenge.create({
        data: {
          userId,
          challengeId: challenge.id,
          completed: false,
          progress: 0
        }
      });
      
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
    }
    
    return userChallenges;
  } catch (error) {
    console.error('Error getting daily challenges:', error);
    return [];
  }
}

// Function to check challenge progress
export async function checkChallengeProgress(userId: string): Promise<void> {
  try {
    // Get today's date (start and end)
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Get user's active challenges
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        },
        completed: false
      },
      include: {
        challenge: true
      }
    });
    
    if (userChallenges.length === 0) return;
    
    // Get user's activity for today
    const userConversions = await prisma.conversion.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });
    
    const userShares = await prisma.dailyPoints.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        source: 'share'
      }
    });
    
    const userReferrals = await prisma.dailyPoints.count({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        source: 'referral'
      }
    });
    
    // Check each challenge
    for (const userChallenge of userChallenges) {
      const challenge = userChallenge.challenge;
      const criteria = JSON.parse(challenge.criteria);
      let progress = 0;
      let completed = false;
      
      // Check different criteria types
      if (criteria.unique_formats) {
        const uniqueFormats = new Set();
        userConversions.forEach((conv: any) => {
          uniqueFormats.add(conv.sourceFormat);
          uniqueFormats.add(conv.targetFormat);
        });
        progress = Math.min(uniqueFormats.size, criteria.unique_formats);
        completed = uniqueFormats.size >= criteria.unique_formats;
      }
      
      if (criteria.shares) {
        progress = Math.min(userShares, criteria.shares);
        completed = userShares >= criteria.shares;
      }
      
      if (criteria.new_format) {
        // Get user's previously used formats
        const previousFormats = await prisma.conversion.findMany({
          where: {
            userId,
            createdAt: {
              lt: startOfDay
            }
          },
          select: {
            sourceFormat: true,
            targetFormat: true
          }
        });
        
        const previousFormatSet = new Set();
        previousFormats.forEach((conv: any) => {
          previousFormatSet.add(conv.sourceFormat);
          previousFormatSet.add(conv.targetFormat);
        });
        
        // Check if user used any new format today
        let usedNewFormat = false;
        for (const conv of userConversions) {
          if (!previousFormatSet.has(conv.sourceFormat) || !previousFormatSet.has(conv.targetFormat)) {
            usedNewFormat = true;
            break;
          }
        }
        
        progress = usedNewFormat ? 1 : 0;
        completed = usedNewFormat;
      }
      
      if (criteria.image_to_pdf) {
        const imageToPdfCount = userConversions.filter(
          (conv: any) => conv.sourceFormat.startsWith('image/') && conv.targetFormat.includes('pdf')
        ).length;
        progress = Math.min(imageToPdfCount, criteria.image_to_pdf);
        completed = imageToPdfCount >= criteria.image_to_pdf;
      }
      
      if (criteria.batch_size) {
        // Group conversions by batchId
        const batches = new Map();
        userConversions.forEach((conv: any) => {
          if (conv.batchId) {
            if (!batches.has(conv.batchId)) {
              batches.set(conv.batchId, 0);
            }
            batches.set(conv.batchId, batches.get(conv.batchId) + 1);
          }
        });
        
        // Find the largest batch
        let largestBatch = 0;
        for (const count of Array.from(batches.values())) {
          largestBatch = Math.max(largestBatch, count);
        }
        
        progress = Math.min(largestBatch, criteria.batch_size);
        completed = largestBatch >= criteria.batch_size;
      }
      
      if (criteria.video_conversions) {
        const videoCount = userConversions.filter(
          (conv: any) => conv.sourceFormat.startsWith('video/') || conv.targetFormat.startsWith('video/')
        ).length;
        progress = Math.min(videoCount, criteria.video_conversions);
        completed = videoCount >= criteria.video_conversions;
      }
      
      if (criteria.audio_conversions) {
        const audioCount = userConversions.filter(
          (conv: any) => conv.sourceFormat.startsWith('audio/') || conv.targetFormat.startsWith('audio/')
        ).length;
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
      await prisma.userChallenge.update({
        where: { id: userChallenge.id },
        data: {
          progress,
          completed
        }
      });
      
      // Award points if challenge completed
      if (completed && !userChallenge.completed) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: challenge.points
            },
            xp: {
              increment: challenge.points
            }
          }
        });
        
        // Record the points
        await prisma.dailyPoints.create({
          data: {
            userId,
            points: challenge.points,
            source: 'challenge'
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking challenge progress:', error);
  }
}

// Function to generate social sharing content
export function generateSharingContent(type: 'conversion' | 'achievement' | 'challenge', data: any): { text: string, imageUrl: string } {
  let text = '';
  let imageUrl = '/images/share-default.png';
  
  switch (type) {
    case 'conversion':
      const { count, format } = data;
      if (count > 1) {
        text = `I just converted ${count} files${format ? ` to ${format}` : ''} on ConvertViral! 🚀`;
        imageUrl = '/images/share-conversion-batch.png';
      } else {
        text = `Just converted a file${format ? ` to ${format}` : ''} on ConvertViral! So easy! ✨`;
        imageUrl = '/images/share-conversion-single.png';
      }
      break;
      
    case 'achievement':
      const { badge } = data;
      text = `I just earned the "${badge.name}" badge on ConvertViral! 🏆`;
      imageUrl = badge.imageUrl || '/images/share-achievement.png';
      break;
      
    case 'challenge':
      const { challenge } = data;
      text = `I just completed the "${challenge.title}" challenge on ConvertViral! 🎯`;
      imageUrl = '/images/share-challenge.png';
      break;
  }
  
  return { text, imageUrl };
}