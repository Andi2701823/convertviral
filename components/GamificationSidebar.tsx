'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareIcon } from './Icons';
import { getUserLevel, getUserBadges, getDailyChallenges, getLeaderboard, awardPointsForSharing, getUserStreak, generateSharingContent } from '../lib/gamification';
import { useSession } from 'next-auth/react';

// Using types from our gamification system
type UserBadge = {
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
  }
};

type UserChallenge = {
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
    requirement: number;
    formatType?: string | null;
    criteria: string;
    isDaily: boolean;
    isActive: boolean;
  }
};

type LeaderboardEntry = {
  userId: string;
  name: string | null;
  image: string | null;
  points: number;
  level: number;
  rank: number;
  conversions?: number;
  country?: string | null;
};

type UserLevelData = {
  level: number;
  name: string;
  currentXP: number;
  nextLevelXP: number;
  progress: number;
};

type UserStreakData = {
  current: number;
  multiplier: number;
  lastActive: Date | null;
};

// Badge emoji mapping based on category and difficulty
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

// Challenge emoji mapping based on type
const getChallengeEmoji = (type: string): string => {
  const typeEmojis: Record<string, string> = {
    'conversion': '📄',
    'social': '🔗',
    'engagement': '🔥',
    'special': '✨'
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

const GamificationSidebar = () => {
  const { data: session } = useSession();
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevelData | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [userStreak, setUserStreak] = useState<UserStreakData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when session is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Get user level information
        const levelData = await getUserLevel(session.user.id);
        setUserLevel(levelData);
        
        // Get user badges (most recent 3)
        const userBadgesData = await getUserBadges(session.user.id);
        setUserBadges(userBadgesData.slice(0, 3));
        
        // Get user daily challenges
        const userChallengesData = await getDailyChallenges(session.user.id);
        setUserChallenges(userChallengesData);
        
        // Get leaderboard (top 3)
        const leaderboard = await getLeaderboard(10, 'weekly');
        setLeaderboardEntries(leaderboard.slice(0, 3));
        
        // Find user's position in leaderboard
        const userEntry = leaderboard.find(entry => entry.userId === session.user.id);
        if (userEntry) {
          setUserRank(userEntry);
        }
        
        // Get user streak information
        const streak = await getUserStreak(session.user.id);
        setUserStreak(streak);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching gamification data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [session]);
  
  // Handle sharing achievements
  const handleShareAchievements = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Generate sharing content
      const content = await generateSharingContent('achievement', {
        userId: session.user.id,
        level: userLevel?.level || 1,
        badges: userBadges.length
      });
      
      // Award points for sharing
      await awardPointsForSharing(session.user.id, 'achievement');
      
      // Open sharing dialog (this would be implemented elsewhere)
      // For now, just show an alert
      alert(`Sharing: ${content.text}\n\nYou earned points for sharing!`);
      
      // Refresh user level after sharing
      const updatedLevel = await getUserLevel(session.user.id);
      setUserLevel(updatedLevel);
    } catch (error) {
      console.error('Error sharing achievements:', error);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  // Show loading state or no data message
  if (isLoading) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p>Loading gamification data...</p>
        </div>
      </div>
    );
  }
  
  if (!session?.user) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <p>Sign in to view your progress and achievements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-40 transition-all duration-300 ${isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-3rem)]'}`}>
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-l-lg shadow-lg"
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <svg 
          className={`h-6 w-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Sidebar content */}
      <div className="w-80 h-[calc(100vh-10rem)] max-h-[600px] bg-white dark:bg-gray-800 rounded-l-xl shadow-xl overflow-hidden flex flex-col">
        {/* Glass effect header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white opacity-10 transform translate-x-6 -translate-y-6"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white opacity-10 transform -translate-x-6 translate-y-6"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">Your Progress</h3>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white bg-opacity-20 text-white font-bold text-sm mr-3">
                {userLevel?.level || 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span>Level {userLevel?.level || 1}</span>
                  <span>{userLevel?.currentXP || 0}/{userLevel?.nextLevelXP || 100} XP</span>
                </div>
                <div className="w-full h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-yellow-300" 
                    initial={{ width: 0 }}
                    animate={{ width: `${userLevel?.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-white text-opacity-90">
              {Math.round((userLevel?.nextLevelXP || 100) - (userLevel?.currentXP || 0))} XP needed for Level {(userLevel?.level || 1) + 1}
            </p>
            {userStreak && userStreak.current > 0 && (
              <p className="text-xs text-white text-opacity-80 mt-1">
                🔥 {userStreak.current} day streak (x{userStreak.multiplier} bonus)
              </p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Recent badges */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">🏅</span> Recent Badges
            </h4>
            <div className="space-y-2">
              {userBadges.length > 0 ? (
                userBadges.map((userBadge) => (
                  <motion.div 
                    key={userBadge.id}
                    whileHover={{ x: 5 }}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      userBadge.badge.difficulty === 'easy' ? 'bg-green-500' :
                      userBadge.badge.difficulty === 'medium' ? 'bg-orange-500' :
                      userBadge.badge.difficulty === 'hard' ? 'bg-red-500' :
                      'bg-purple-500'
                    } text-white text-lg mr-3`}>
                      {getBadgeEmoji(userBadge.badge.category, userBadge.badge.difficulty)}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{userBadge.badge.name}</h5>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(userBadge.earnedAt)}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Complete activities to earn badges!</p>
              )}
            </div>
            <div className="mt-2 text-right">
              <Link href="/badges" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                View all badges
              </Link>
            </div>
          </div>

          {/* Daily challenges */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">🎯</span> Daily Challenges
            </h4>
            <div className="space-y-3">
              {userChallenges.length > 0 ? (
                userChallenges.map((userChallenge) => {
                  // Calculate progress percentage
                  const total = 1; // Default to 1 for boolean challenges
                  const progressPercent = userChallenge.completed ? 100 : 
                    (userChallenge.progress / total) * 100;
                  
                  return (
                    <div key={userChallenge.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 text-sm mr-2">
                          {getChallengeEmoji(userChallenge.challenge.type)}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{userChallenge.challenge.title}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{userChallenge.challenge.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {userChallenge.progress}/{total} completed
                        </div>
                        <div className="text-xs font-medium text-primary-600 dark:text-primary-400">
                          +{userChallenge.challenge.points} XP
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No active challenges today. Check back tomorrow!</p>
              )}
            </div>
          </div>

          {/* Leaderboard preview */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <span className="mr-2">🏆</span> Leaderboard
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {leaderboardEntries.length > 0 ? (
                  leaderboardEntries.map((entry) => (
                    <div 
                      key={entry.userId} 
                      className={`flex items-center p-3 ${entry.userId === session?.user?.id ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
                    >
                      <div className="w-6 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                        {entry.rank}
                      </div>
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mx-3">
                        {entry.image ? '👤' : (entry.country ? `🏳️‍${entry.country}` : '👤')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {entry.name || 'Anonymous'}
                            {entry.userId === session?.user?.id && <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>}
                          </span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Lvl {entry.level}</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{entry.points.toLocaleString()} points</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No leaderboard data available yet.
                  </div>
                )}
              </div>
              <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                <Link 
                  href="/leaderboard" 
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View full leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Share achievements button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleShareAchievements}
            className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200"
          >
            <ShareIcon className="h-5 w-5 mr-2" />
            Share Achievements
          </button>
        </div>
      </div>
    </div>
  );
};


export default GamificationSidebar;