'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import ConversionHistory from '@/components/ConversionHistory';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <UserProfile user={session?.user} />
        </div>
        
        <div className="md:col-span-2">
          <ConversionHistory />
          
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="/convert" 
                className="bg-primary-50 hover:bg-primary-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-200"
              >
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-medium">New Conversion</h3>
                <p className="text-sm text-gray-500 mt-1">Convert a new file</p>
              </a>
              
              <a 
                href="/leaderboard" 
                className="bg-secondary-50 hover:bg-secondary-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-200"
              >
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-medium">Leaderboard</h3>
                <p className="text-sm text-gray-500 mt-1">See how you rank</p>
              </a>
              
              <a 
                href="/badges" 
                className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-200"
              >
                <div className="text-3xl mb-2">🎖️</div>
                <h3 className="font-medium">All Badges</h3>
                <p className="text-sm text-gray-500 mt-1">View available badges</p>
              </a>
              
              <a 
                href="/settings" 
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center text-center transition-colors duration-200"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-medium">Settings</h3>
                <p className="text-sm text-gray-500 mt-1">Manage your account</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}