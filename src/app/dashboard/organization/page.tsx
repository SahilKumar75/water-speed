'use client';

import { useEffect, useState } from 'react';
import { Wind, Building, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrganizationDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
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
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Organization Dashboard</h1>
              <p className="text-white/70">Welcome back, {user.name}!</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Organization Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-white/60">Organization:</span>
                  <span className="text-white ml-2">{user.organizationName}</span>
                </div>
                <div>
                  <span className="text-white/60">Contact Person:</span>
                  <span className="text-white ml-2">{user.name}</span>
                </div>
                <div>
                  <span className="text-white/60">Email:</span>
                  <span className="text-white ml-2">{user.email}</span>
                </div>
                <div>
                  <span className="text-white/60">Account Type:</span>
                  <span className="text-cyan-400 ml-2 capitalize">{user.userType}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Enterprise Features</h3>
              <p className="text-white/70">Access advanced renewable energy optimization tools for your organization!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
