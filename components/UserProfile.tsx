'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt?: Date;
};

type UserProfileProps = {
  userId?: string;
};

const UserProfile = ({ userId }: UserProfileProps) => {
  const [user, setUser] = useState<{
    name: string | null;
    email: string | null;
    image: string | null;
    points: number;
    level: number;
    rank: number;
  } | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Mock user data
        setUser({
          name: 'Guest User',
          email: null,
          image: null,
          points: 125,
          level: 2,
          rank: 42,
        });
        
        // Mock badges data
        setBadges([
          {
            id: 'first_conversion',
            name: 'First Conversion',
            description: 'Completed your first file conversion',
            imageUrl: '/badges/first_conversion.svg',
            earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          },
          {
            id: 'points_starter',
            name: 'Points Starter',
            description: 'Earned 100 points',
            imageUrl: '/badges/points_starter.svg',
            earnedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          },
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mx-auto"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">Sign in to track your progress</h3>
        <p className="mt-2 text-sm text-gray-500">
          Create an account to earn points, collect badges, and compete on the leaderboard.
        </p>
        <div className="mt-4">
          <Link href="/login" className="btn-primary mr-2">
            Log in
          </Link>
          <Link href="/signup" className="btn-secondary">
            Sign up
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-4">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-2xl">
            {user.image ? (
              <img src={user.image} alt={user.name || 'User'} className="h-16 w-16 rounded-full" />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="ml-4 text-white">
            <h3 className="text-xl font-bold">{user.name || 'Guest User'}</h3>
            <p className="text-primary-100">{user.email || 'Sign in to save your progress'}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{user.points}</div>
            <div className="text-sm text-gray-500">Points</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{user.level}</div>
            <div className="text-sm text-gray-500">Level</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">#{user.rank}</div>
            <div className="text-sm text-gray-500">Rank</div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3">Level Progress</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-primary-600 h-2.5 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(user.points % 100) / 100 * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Level {user.level}</span>
            <span>{100 - (user.points % 100)} points to Level {user.level + 1}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-3">Badges Earned ({badges.length})</h4>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  className="bg-gray-50 p-3 rounded-lg text-center"
                  whileHover={{ y: -5, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl mb-2">
                    {/* In a real app, this would be an actual image */}
                    {badge.id === 'first_conversion' && '🏆'}
                    {badge.id === 'points_starter' && '💯'}
                  </div>
                  <div className="text-sm font-medium">{badge.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No badges earned yet. Start converting files to earn badges!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;