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
}

export default function PersonalMainDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser: User = JSON.parse(userData);
    // If not onboarded, send to onboarding flow
    if (!parsedUser.onboardingCompleted) {
      router.replace('/dashboard/personal');
      return;
    }
    setUser(parsedUser);
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
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-green-400" />
                <h3 className="text-white font-semibold">Location Analysis</h3>
              </div>
              <p className="text-white/70">Your renewable energy potential analysis is complete.</p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <h3 className="text-white font-semibold">Efficiency Recommendations</h3>
              </div>
              <p className="text-white/70">Personalized suggestions based on your profile.</p>
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h3 className="text-white font-semibold">Savings Projection</h3>
              </div>
              <p className="text-white/70">Estimated cost savings and ROI calculations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
