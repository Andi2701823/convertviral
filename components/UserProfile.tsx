'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaCrown, FaMedal, FaTrophy, FaStar } from 'react-icons/fa';
import { User } from 'next-auth';

// Default badges
const defaultBadges = [
  { id: 1, name: 'First Conversion', icon: <FaStar className="text-yellow-400" /> },
  { id: 2, name: 'New Member', icon: <FaCrown className="text-yellow-500" /> },
];

interface UserProfileProps {
  user?: User | null;
}

const UserProfile = ({ user }: UserProfileProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Default user stats
  const userStats = {
    points: 0,
    level: 1,
    rank: '-',
    progress: 0,
    badges: defaultBadges,
  };

  // If loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }
  
  // If not authenticated
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Not Signed In</h3>
          <p className="text-sm text-gray-500 mb-4">Sign in to track your conversions and earn rewards</p>
          <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Sign In
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            {user.image ? (
              <Image
                className="h-16 w-16 rounded-full"
                src={user.image}
                alt={user.name || 'User'}
                width={64}
                height={64}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                {user.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name || 'User'}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Points</p>
            <p className="text-lg font-semibold">{userStats.points}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Level</p>
            <p className="text-lg font-semibold">{userStats.level}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Rank</p>
            <p className="text-lg font-semibold">#{userStats.rank}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Level Progress</span>
            <span className="text-sm font-medium text-gray-700">{userStats.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${userStats.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Badges Earned</h3>
          <div className="flex flex-wrap gap-2">
            {userStats.badges.map((badge) => (
              <div 
                key={badge.id}
                className="flex items-center bg-gray-50 px-3 py-1.5 rounded-full"
                title={badge.name}
              >
                <span className="mr-1.5">{badge.icon}</span>
                <span className="text-xs font-medium">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4">
        <Link 
          href="/profile"
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          View full profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;