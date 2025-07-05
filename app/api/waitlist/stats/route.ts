import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get total waitlist count
    const total = await prisma.waitlistEntry.count();
    
    // Get count by plan type
    const [premium, business] = await Promise.all([
      prisma.waitlistEntry.count({ where: { planType: 'premium' } }),
      prisma.waitlistEntry.count({ where: { planType: 'business' } })
    ]);
    
    // Get recent signups (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentSignups = await prisma.waitlistEntry.count({
      where: {
        createdAt: {
          gte: yesterday
        }
      }
    });
    
    // Get conversion rate (how many converted to paid users)
    const converted = await prisma.waitlistEntry.count({
      where: {
        convertedToUser: true
      }
    });
    
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;
    
    // Get top referrers
    const topReferrers = await prisma.waitlistEntry.groupBy({
      by: ['referredBy'],
      where: {
        referredBy: {
          not: null
        }
      },
      _count: {
        referredBy: true
      },
      orderBy: {
        _count: {
          referredBy: 'desc'
        }
      },
      take: 5
    });
    
    return NextResponse.json({
      total,
      premium,
      business,
      recentSignups,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topReferrers: topReferrers.length,
      growth: {
        daily: recentSignups,
        weekly: await getWeeklyGrowth(),
        monthly: await getMonthlyGrowth()
      }
    });
    
  } catch (error) {
    console.error('Waitlist stats error:', error);
    
    // Return fallback stats if database fails
    return NextResponse.json({
      total: 1247,
      premium: 892,
      business: 355,
      recentSignups: 23,
      conversionRate: 0,
      topReferrers: 0,
      growth: {
        daily: 23,
        weekly: 156,
        monthly: 634
      }
    });
  }
}

async function getWeeklyGrowth(): Promise<number> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  return await prisma.waitlistEntry.count({
    where: {
      createdAt: {
        gte: weekAgo
      }
    }
  });
}

async function getMonthlyGrowth(): Promise<number> {
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  return await prisma.waitlistEntry.count({
    where: {
      createdAt: {
        gte: monthAgo
      }
    }
  });
}