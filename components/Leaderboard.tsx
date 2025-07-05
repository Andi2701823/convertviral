'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../lib/gamification';
import { useSession } from 'next-auth/react';

// Using the LeaderboardEntry type from our gamification system
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

interface LeaderboardProps {
  dailyData: LeaderboardEntry[];
  weeklyData: LeaderboardEntry[];
  monthlyData: LeaderboardEntry[];
  allTimeData: LeaderboardEntry[];
  session: any;
}

const Leaderboard = ({ dailyData, weeklyData, monthlyData, allTimeData, session }: LeaderboardProps) => {
  const { data: sessionData } = useSession();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  
  // Use the provided data based on timeframe
  useEffect(() => {
    let data: LeaderboardEntry[] = [];
    
    switch(timeframe) {
      case 'daily':
        data = dailyData;
        break;
      case 'weekly':
        data = weeklyData;
        break;
      case 'monthly':
        data = monthlyData;
        break;
      case 'allTime':
        data = allTimeData;
        break;
      default:
        data = weeklyData;
    }
    
    // Apply country filter if needed
    if (countryFilter) {
      data = data.filter(entry => entry.country === countryFilter);
    }
    
    setEntries(data);
    
    // Find current user in leaderboard
    const currentUser = session?.user || sessionData?.user;
    if (currentUser?.id) {
      const userEntry = data.find(entry => entry.userId === currentUser.id);
      setCurrentUserRank(userEntry || null);
    }
  }, [timeframe, countryFilter, dailyData, weeklyData, monthlyData, allTimeData, session, sessionData]);
  
  // Function to get row style based on rank
  const getRowStyle = (entry: LeaderboardEntry) => {
    if (entry.rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/20';
    if (entry.rank === 2) return 'bg-gray-50 dark:bg-gray-800/50';
    if (entry.rank === 3) return 'bg-amber-50 dark:bg-amber-900/20';
    if (session?.user?.id && entry.userId === session.user.id) return 'bg-blue-50 dark:bg-blue-900/20'; // Current user
    return '';
  };

  // Function to get medal emoji based on rank
  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };
  
  // Function to get avatar for user
  const getAvatar = (entry: LeaderboardEntry) => {
    if (entry.image) {
      return <img src={entry.image} alt={entry.name || 'User'} className="h-8 w-8 rounded-full" />;
    }
    
    // Use country flag if available
    if (entry.country) {
      return <span className="text-xl">{`🏳️‍${entry.country}`}</span>;
    }
    
    // Default avatar based on rank
    const avatars = ['👑', '🥷', '🧙‍♂️', '📄', '🧙', '👸', '🧘', '🖼️', '🔄', '🏆'];
    return <span className="text-xl">{entry.rank <= 10 ? avatars[entry.rank - 1] : '👤'}</span>;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {/* Timeframe and country filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('allTime')}
              className={`px-3 py-1 text-sm rounded-md ${timeframe === 'allTime' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
            >
              All Time
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="country-filter" className="text-sm text-gray-600 dark:text-gray-300">Country:</label>
            <select 
              id="country-filter"
              value={countryFilter || ''}
              onChange={(e) => setCountryFilter(e.target.value || null)}
              className="text-sm rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              <option value="">All Countries</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
              <option value="IN">India</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversions</th>
              {countryFilter === null && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={countryFilter === null ? 6 : 5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Loading leaderboard data...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={countryFilter === null ? 6 : 5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No leaderboard data available for the selected filters.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <motion.tr 
                  key={entry.userId}
                  className={getRowStyle(entry)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{getMedalEmoji(entry.rank)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                        {getAvatar(entry)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {entry.name || 'Anonymous'}
                          {session?.user?.id && entry.userId === session.user.id && (
                            <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">Level {entry.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{entry.points.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{entry.conversions?.toLocaleString() || '-'}</div>
                  </td>
                  {countryFilter === null && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {entry.country ? `${entry.country}` : '-'}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
            
            {/* Show current user if not in top results */}
            {!isLoading && currentUserRank && !entries.some(e => e.userId === session?.user?.id) && (
              <tr className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900/20">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{currentUserRank.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                      {getAvatar(currentUserRank)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {currentUserRank.name || 'You'}
                        <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">Level {currentUserRank.level}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{currentUserRank.points.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{currentUserRank.conversions?.toLocaleString() || '-'}</div>
                </td>
                {countryFilter === null && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {currentUserRank.country ? `${currentUserRank.country}` : '-'}
                    </div>
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;