import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const shareSchema = z.object({
  email: z.string().email('Invalid email address'),
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'copy']),
  referralCode: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = shareSchema.parse(body);
    
    const { email, platform, referralCode } = validatedData;
    
    // Find the waitlist entry
    const waitlistEntry = await prisma.waitlistEntry.findUnique({
      where: { email }
    });

    if (!waitlistEntry) {
      return NextResponse.json(
        { error: 'Email not found in waitlist' },
        { status: 404 }
      );
    }

    // Update share count
    const updatedEntry = await prisma.waitlistEntry.update({
      where: { email },
      data: {
        shareCount: {
          increment: 1
        },
        lastSharedAt: new Date()
      }
    });

    // Track the share event (you could expand this to store individual share events)
    console.log('Share tracked:', {
      email,
      platform,
      referralCode: waitlistEntry.referralCode,
      shareCount: updatedEntry.shareCount
    });

    // Calculate bonus rewards based on share count
    let bonusReward = null;
    if (updatedEntry.shareCount === 3) {
      bonusReward = 'Additional 10% discount';
    } else if (updatedEntry.shareCount === 5) {
      bonusReward = 'Free month when you upgrade';
    } else if (updatedEntry.shareCount >= 10) {
      bonusReward = 'Lifetime 20% discount';
    }

    return NextResponse.json({
      success: true,
      shareCount: updatedEntry.shareCount,
      bonusReward,
      referralCode: waitlistEntry.referralCode,
      message: 'Share tracked successfully'
    });

  } catch (error) {
    console.error('Share tracking error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    const waitlistEntry = await prisma.waitlistEntry.findUnique({
      where: { email },
      select: {
        shareCount: true,
        referralCode: true,
        lastSharedAt: true
      }
    });

    if (!waitlistEntry) {
      return NextResponse.json(
        { error: 'Email not found in waitlist' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      shareCount: waitlistEntry.shareCount,
      referralCode: waitlistEntry.referralCode,
      lastSharedAt: waitlistEntry.lastSharedAt
    });

  } catch (error) {
    console.error('Share data retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}