'use client';

import { useEffect, useState } from 'react';
import { Wind, User, LogOut, MapPin, Zap, TrendingUp, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

// TypeScript Interface
interface User {
  id: string;
  name: string;
  email: string;
  userType: 'personal' | 'organization';
  onboardingCompleted?: boolean;
  onboardingData?: {
    location?: { country?: string; city?: string; zipCode?: string };
    energyType?: string[];
    propertyType?: string;
    currentUsage?: number;
    timeframe?: string;
    goals?: string[];
  };
}

export default function PersonalMainDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (!data.user.onboardingCompleted) {
          router.replace('/dashboard/personal');
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wind className="w-8 h-8 text-green-400" />
            <span className="text-white font-bold text-xl">Wind Speed</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white/70 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-3 rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Personal Dashboard</h1>
              <p className="text-white/70">Welcome back, {user?.name || 'User'}!</p>
              {user?.onboardingData?.location && (
                <p className="text-white/50 text-sm mt-1">
                  {user.onboardingData.location.city ? `${user.onboardingData.location.city}, ` : ''}
                  {user.onboardingData.location.country || ''}
                  {user.onboardingData.location.zipCode ? ` • ${user.onboardingData.location.zipCode}` : ''}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Location Analysis</h3>
              </div>
              <p className="text-white/70">
                {user?.onboardingData?.location?.country
                  ? `Based on conditions near ${user.onboardingData.location.city || 'your area'}, ${user.onboardingData.location.country}.`
                  : 'Your renewable energy potential analysis is complete.'}
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-white font-semibold">Efficiency Recommendations</h3>
              </div>
              <p className="text-white/70">
                {Array.isArray(user?.onboardingData?.energyType) && user.onboardingData!.energyType!.length > 0
                  ? `Focusing on ${user.onboardingData!.energyType!.join(', ')} for your ${user?.onboardingData?.propertyType || 'property'}.`
                  : 'Personalized suggestions based on your profile.'}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-white font-semibold">Savings Projection</h3>
              </div>
              <p className="text-white/70">
                {typeof user?.onboardingData?.currentUsage === 'number'
                  ? `Estimated ROI based on ${user.onboardingData!.currentUsage} kWh/month and timeline '${user?.onboardingData?.timeframe || 'N/A'}'.`
                  : 'Estimated cost savings and ROI calculations.'}
              </p>
            </div>
          </div>

          {Array.isArray(user?.onboardingData?.goals) && user!.onboardingData!.goals!.length > 0 && (
            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-3">Your Goals</h3>
              <div className="flex flex-wrap gap-2">
                {user!.onboardingData!.goals!.map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm border border-white/20">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
