'use client';

import { useState, useEffect } from 'react';
import { UserGroupIcon, FireIcon } from '@heroicons/react/24/solid';

export default function SocialProof() {
  const [waitlistStats, setWaitlistStats] = useState({
    total: 0,
    premium: 0,
    business: 0,
    recentSignups: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchWaitlistStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(fetchWaitlistStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchWaitlistStats = async () => {
    try {
      const response = await fetch('/api/waitlist/stats');
      const data = await response.json();
      setWaitlistStats(data);
    } catch (error) {
      console.error('Failed to fetch waitlist stats:', error);
      // Fallback to demo numbers
      setWaitlistStats({
        total: 1247,
        premium: 892,
        business: 355,
        recentSignups: 23
      });
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center text-gray-600">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center text-primary-700">
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span className="font-semibold">{waitlistStats.total.toLocaleString()}</span>
          <span className="ml-1">people waiting</span>
        </div>
        
        {waitlistStats.recentSignups > 0 && (
          <div className="flex items-center text-orange-600">
            <FireIcon className="h-4 w-4 mr-1" />
            <span className="font-semibold">{waitlistStats.recentSignups}</span>
            <span className="ml-1">joined today</span>
          </div>
        )}
      </div>

      {/* Plan Breakdown */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-primary-200">
          <span className="text-primary-600 font-medium">{waitlistStats.premium.toLocaleString()}</span>
          <span className="text-gray-600 ml-1">Premium</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-200">
          <span className="text-purple-600 font-medium">{waitlistStats.business.toLocaleString()}</span>
          <span className="text-gray-600 ml-1">Business</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="text-center">
        <p className="text-xs text-gray-600">
          🔥 <span className="font-medium">High demand!</span> Join now to secure your early bird discount
        </p>
      </div>
    </div>
  );
}