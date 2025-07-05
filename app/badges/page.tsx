import { Metadata } from 'next';
import { getAllBadges, getUserBadges } from '@/lib/gamification';

export const metadata: Metadata = {
  title: 'Badges - ConvertViral',
  description: 'View and earn badges by converting files and completing challenges.',
};

// Define Badge and UserBadge types
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
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

// BadgeCard component
const BadgeCard = ({ badge, userBadge }: { badge: Badge; userBadge?: UserBadge }) => {
  const isEarned = !!userBadge;
  const earnedAt = userBadge ? formatRelativeTime(userBadge.earnedAt) : null;
  const emoji = badge.imageUrl ? null : getBadgeEmoji(badge.category, badge.difficulty);

  return (
    <div className={`p-4 rounded-lg border ${isEarned ? 'border-green-500 dark:border-green-400' : 'border-gray-200 dark:border-gray-700'} hover:shadow-md transition-shadow`}>
      <div className="flex items-center mb-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getBadgeColor(badge.difficulty)}`}>
          {badge.imageUrl ? (
            <img src={badge.imageUrl} alt={badge.name} className="w-6 h-6" />
          ) : (
            <span className="text-xl">{emoji}</span>
          )}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{badge.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{badge.description}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(badge.difficulty)} text-white`}>
            {badge.difficulty.charAt(0).toUpperCase() + badge.difficulty.slice(1)}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">{badge.points} XP</span>
        </div>
        {isEarned && (
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
            Earned {earnedAt}
          </span>
        )}
      </div>
    </div>
  );
};

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

// Helper function to get badge color based on difficulty
const getBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500 dark:bg-green-700';
    case 'medium':
      return 'bg-yellow-500 dark:bg-yellow-700';
    case 'hard':
      return 'bg-red-500 dark:bg-red-700';
    case 'legendary':
      return 'bg-purple-500 dark:bg-purple-700';
    default:
      return 'bg-gray-500 dark:bg-gray-700';
  }
};

// Helper function to get category title
const getCategoryTitle = (category: string) => {
  switch (category) {
    case 'conversion':
      return 'Conversion Badges';
    case 'achievement':
      return 'Achievement Badges';
    case 'social':
      return 'Social Badges';
    case 'special':
      return 'Special Badges';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1) + ' Badges';
  }
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

export default async function BadgesPage() {
  // Fetch all available badges
  const badges = await getAllBadges();
  
  // In a real implementation, we would get the current user's ID from the session
  // and fetch their earned badges
  // For now, we'll just show all available badges
  // const userBadges = await getUserBadges(userId);
  
  // Fetch all available badges
  const allBadges = await getAllBadges();
  
  // In a real application, you would fetch user-specific badges here
  // const session = await getServerSession(authOptions);
  // const userBadges = session?.user ? await getUserBadges(session.user.id) : [];
  // const userBadgeMap = new Map(userBadges.map(ub => [ub.badgeId, ub]));
  
  // Group badges by category
  const badgesByCategory: Record<string, Badge[]> = {};
  
  allBadges.forEach(badge => {
    if (!badgesByCategory[badge.category]) {
      badgesByCategory[badge.category] = [];
    }
    badgesByCategory[badge.category].push(badge);
  });
  
  // Sort categories alphabetically, but put 'conversion' and 'achievement' first
  const sortedCategories = Object.keys(badgesByCategory).sort((a, b) => {
    if (a === 'conversion') return -1;
    if (b === 'conversion') return 1;
    if (a === 'achievement') return -1;
    if (b === 'achievement') return 1;
    return a.localeCompare(b);
  });
  
  // Sort badges within each category by difficulty
  const difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2, 'legendary': 3 };
  
  for (const category of sortedCategories) {
    badgesByCategory[category].sort((a, b) => {
      return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
             (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
    });
  }
  
  // Calculate badge statistics
  const totalBadges = allBadges.length;
  // const earnedBadges = userBadges?.length || 0;
  // const earnedPercentage = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Badges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Earn badges by converting files, completing challenges, and achieving milestones.
        </p>
        
        {/* Badge progress - would be enabled with real user data */}
        {/* <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Your progress</span>
            <span className="text-sm font-medium">{earnedBadges} / {totalBadges} badges earned ({earnedPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${earnedPercentage}%` }}
            ></div>
          </div>
        </div> */}
      </div>
      
      {sortedCategories.map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{getCategoryTitle(category)}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgesByCategory[category].map((badge) => (
              // In a real app, you would pass the user badge if earned
              // <BadgeCard 
              //   key={badge.id} 
              //   badge={badge} 
              //   userBadge={userBadgeMap.get(badge.id)}
              // />
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      ))}
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to start earning badges?</h2>
        <a href="/convert" className="btn-primary inline-block">
          Start Converting Now
        </a>
      </div>
    </div>
  );
}