import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  getUserLevel,
  getUserBadges,
  getDailyChallenges,
  getUserStreak,
  getLeaderboard
} from '@/lib/gamification';

export const metadata: Metadata = {
  title: 'My Profile - ConvertViral',
  description: 'View your profile, badges, and achievements.',
};

// Define types
interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  imageUrl?: string;
}

interface UserBadge {
  id: string;
  badgeId: string;
  userId: string;
  earnedAt: Date;
  badge: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    difficulty: string;
    points: number;
  };
}

interface Challenge {
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
}

interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedAt?: Date | null;
  challenge: {
    id: string;
    title: string;
    description: string;
    points: number;
    type: string;
    criteria: string;
    requirement: number;
    formatType?: string | null;
    isDaily: boolean;
    isActive: boolean;
  }
}

interface UserLevelData {
  level: number;
  name: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
}

interface UserStreakData {
  current: number;
  multiplier: number;
  lastActive: Date | null;
}

export default async function ProfilePage() {
  // Get user session
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  
  // Fetch user data
  const userId = session.user.id;
  const userLevel = await getUserLevel(userId);
  const userBadges = await getUserBadges(userId);
  const userChallenges = await getDailyChallenges(userId);
  const userStreak = await getUserStreak(userId);
  
  // Get user rank from leaderboard
  const leaderboard = await getLeaderboard(10, 'allTime');
  const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
  
  // Calculate badge statistics
  const earnedBadges = userBadges.length;
  
  // Calculate active and completed challenges
  const completedChallenges = userChallenges.filter(uc => uc.completed);
  const activeChallenges = userChallenges.filter(uc => !uc.completed);
  
  // Helper function to get badge emoji based on category and difficulty
  const getBadgeEmoji = (category: string, difficulty: string): string => {
    const categoryEmojis: Record<string, string> = {
      'conversion': '📄',
      'achievement': '🏆',
      'social': '🔗',
      'special': '✨'
    };
    
    const difficultyEmojis: Record<string, string> = {
      'easy': '🟢',
      'medium': '🟠',
      'hard': '🔴',
      'legendary': '⭐'
    };
    
    return categoryEmojis[category] || difficultyEmojis[difficulty] || '🎯';
  };
  
  // Helper function to get challenge emoji based on type
  const getChallengeEmoji = (type: string): string => {
    const typeEmojis: Record<string, string> = {
      'conversion': '📄',
      'batch': '📚',
      'streak': '🔥',
      'share': '🔗',
      'points': '⭐'
    };
    
    return typeEmojis[type] || '🎯';
  };
  
  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    
    if (diffInHours < 24) {
      return diffInHours < 1 ? 'Just now' : `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 2) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">
          View your progress, badges, and achievements
        </p>
      </div>
      
      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl mr-4">
              {session.user.image ? (
                <img src={session.user.image} alt={session.user.name || 'User'} className="w-16 h-16 rounded-full" />
              ) : (
                <span>{session.user.name?.charAt(0) || '👤'}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{session.user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{session.user.email}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Level {userLevel.level}</span>
              <span className="text-sm font-medium">{userLevel.currentXP} / {userLevel.nextLevelXP} XP</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(userLevel.currentXP / userLevel.nextLevelXP) * 100}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold">{userLevel.currentXP}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
              </div>
              <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold">#{userRank > 0 ? userRank : '—'}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rank</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Streak</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="text-5xl">🔥</div>
            <div className="text-4xl font-bold ml-4">{userStreak.current} days</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold">{userStreak.multiplier}x</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Multiplier</div>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-sm font-medium">Last Active</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{userStreak.lastActive ? formatRelativeTime(userStreak.lastActive) : 'Never'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Badges & Challenges</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold">{earnedBadges}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</div>
            </div>
            <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold">{completedChallenges.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Challenges Completed</div>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Link 
              href="/badges"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View All Badges
            </Link>
            <Link 
              href="/challenges"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View Challenges
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Badges */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Recent Badges</h2>
          <Link 
            href="/badges"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {userBadges.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You haven't earned any badges yet. Start converting files to earn badges!
            </p>
            <Link 
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Convert Files
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userBadges.slice(0, 4).map((userBadge) => (
              <div 
                key={userBadge.badgeId} 
                className="p-4 rounded-lg border border-green-500 dark:border-green-400 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-green-500 dark:bg-green-700">
                    {userBadge.badge.imageUrl ? (
                      <img src={userBadge.badge.imageUrl} alt={userBadge.badge.name} className="w-6 h-6" />
                    ) : (
                      <span className="text-xl">{getBadgeEmoji(userBadge.badge.category, userBadge.badge.difficulty)}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{userBadge.badge.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{formatRelativeTime(userBadge.earnedAt)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{userBadge.badge.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Active Challenges */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Active Challenges</h2>
          <Link 
            href="/challenges"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {activeChallenges.length === 0 ? (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any active challenges. Check back tomorrow for new challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.slice(0, 3).map((userChallenge) => (
              <div 
                key={userChallenge.challengeId} 
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-500 dark:bg-blue-700">
                    <span className="text-xl">{getChallengeEmoji(userChallenge.challenge.type)}</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">{userChallenge.challenge.title}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{userChallenge.challenge.points} XP</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{userChallenge.challenge.description}</p>
                
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium">
                      Progress: {userChallenge.progress} / {userChallenge.challenge.requirement}
                    </span>
                    <span className="text-xs font-medium">
                      {Math.round((userChallenge.progress / userChallenge.challenge.requirement) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, Math.round((userChallenge.progress / userChallenge.challenge.requirement) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}