import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getLeaderboard } from '@/lib/gamification';

const Leaderboard = dynamic(() => import('@/components/Leaderboard'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Leaderboard - ConvertViral',
  description: 'See who has the most points and conversions on ConvertViral.',
};

export default async function LeaderboardPage() {
  // Get user session
  const session = await getServerSession(authOptions);
  
  // Fetch global leaderboard data
  const dailyLeaderboard = await getLeaderboard(10, 'daily');
  const weeklyLeaderboard = await getLeaderboard(10, 'weekly');
  const monthlyLeaderboard = await getLeaderboard(10, 'weekly'); // Using weekly as monthly isn't available
  const allTimeLeaderboard = await getLeaderboard(10, 'allTime');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">See who's leading the pack in file conversions and points</p>
      
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <Leaderboard 
          dailyData={dailyLeaderboard}
          weeklyData={weeklyLeaderboard}
          monthlyData={monthlyLeaderboard}
          allTimeData={allTimeLeaderboard}
          session={session}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">How to Earn Points</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-medium text-lg mb-2">Convert Files</h3>
            <p className="text-sm text-gray-600">
              Each file conversion earns you points based on file type and size.
              More complex conversions = more points!
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">🔁</div>
            <h3 className="font-medium text-lg mb-2">Daily Streaks</h3>
            <p className="text-sm text-gray-600">
              Convert files on consecutive days to earn streak bonuses.
              Don't break your streak!
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-medium text-lg mb-2">Complete Challenges</h3>
            <p className="text-sm text-gray-600">
              Special challenges appear weekly with bonus point opportunities.
              Check your dashboard for current challenges.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to climb the ranks?</h2>
        <a href="/convert" className="btn-primary inline-block">
          Start Converting Now
        </a>
      </div>
    </div>
  );
}