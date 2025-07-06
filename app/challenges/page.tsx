'use client';

import { useState, useEffect } from 'react';
import { UserChallenge } from '@/lib/gamification';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Suspense } from 'react';
import ChallengeCard from './ChallengeCard';



export default function ChallengesPage() {
  // Get user session
  const { data: session, status } = useSession();
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch user challenges if logged in
  useEffect(() => {
    async function fetchChallenges() {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/challenges');
          if (!response.ok) {
            throw new Error('Failed to fetch challenges');
          }
          const data = await response.json();
          setUserChallenges(data.challenges);
        } catch (error) {
          console.error('Error fetching challenges:', error);
        }
      }
      setLoading(false);
    }
    
    if (status !== 'loading') {
      fetchChallenges();
    }
  }, [session, status]);
  
  const isLoggedIn = !!session?.user;
  
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
  
  // Helper function to determine difficulty based on points
  const getChallengeDifficulty = (points: number): string => {
    if (points <= 30) return 'Easy';
    if (points <= 75) return 'Medium';
    return 'Hard';
  };
  
  // Helper function to get challenge color based on difficulty
  const getChallengeColor = (points: number) => {
    const difficulty = getChallengeDifficulty(points);
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500 dark:bg-green-700';
      case 'medium':
        return 'bg-yellow-500 dark:bg-yellow-700';
      case 'hard':
        return 'bg-red-500 dark:bg-red-700';
      default:
        return 'bg-gray-500 dark:bg-gray-700';
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
  
  // Calculate expiration date (24 hours from assignedAt)
  const getExpirationDate = (assignedAt?: Date): Date => {
    const baseDate = assignedAt ? new Date(assignedAt) : new Date();
    const expirationDate = new Date(baseDate);
    expirationDate.setHours(expirationDate.getHours() + 24);
    return expirationDate;
  };
  
  // Format time remaining
  const formatTimeRemaining = (assignedAt?: Date): string => {
    const now = new Date();
    const expiresAt = getExpirationDate(assignedAt);
    const diffInMs = expiresAt.getTime() - now.getTime();
    
    if (diffInMs <= 0) {
      return 'Expired';
    }
    
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = diffInMs / (1000 * 60);
      return `${Math.floor(diffInMinutes)} minutes left`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours left`;
    } else {
      const diffInDays = diffInHours / 24;
      return `${Math.floor(diffInDays)} days left`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Challenges</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Complete challenges to earn XP and unlock rewards. New challenges are available daily!  
        </p>
      </div>
      
      {!isLoggedIn ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in to view challenges</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to view and complete challenges. Sign in now to start earning rewards!
          </p>
          <Link 
            href="/api/auth/signin"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      ) : userChallenges.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No Active Challenges</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have any active challenges right now. Check back later or try converting some files to unlock new challenges!
          </p>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Converting
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userChallenges.map((userChallenge) => (
            <Suspense key={userChallenge.challengeId} fallback={<div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">Loading...</div>}>
              <ChallengeCard 
                key={userChallenge.challengeId} 
                userChallenge={userChallenge} 
                getChallengeEmoji={getChallengeEmoji}
                getChallengeColor={getChallengeColor}
                getChallengeDifficulty={getChallengeDifficulty}
                formatTimeRemaining={formatTimeRemaining}
                formatRelativeTime={formatRelativeTime}
              />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
}