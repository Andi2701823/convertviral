import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDailyChallenges } from '@/lib/gamification';

// Force dynamic rendering to prevent static optimization warnings
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // If not logged in, return empty array
    if (!session?.user?.id) {
      return NextResponse.json({ challenges: [] });
    }
    
    // Get user challenges
    const challenges = await getDailyChallenges(session.user.id);
    
    return NextResponse.json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}