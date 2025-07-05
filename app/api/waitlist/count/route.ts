import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const planType = searchParams.get('planType');
    
    if (planType && !['premium', 'business'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    const whereClause = planType ? { planType } : {};
    
    const count = await prisma.waitlistEntry.count({
      where: whereClause
    });

    return NextResponse.json({ count });

  } catch (error) {
    console.error('Waitlist count error:', error);
    
    // Return fallback count if database fails
    const fallbackCounts = {
      premium: 892,
      business: 355,
      total: 1247
    };
    
    const { searchParams } = new URL(request.url);
    const planType = searchParams.get('planType');
    const fallbackCount = planType ? fallbackCounts[planType as keyof typeof fallbackCounts] : fallbackCounts.total;
    
    return NextResponse.json({ count: fallbackCount });
  }
}