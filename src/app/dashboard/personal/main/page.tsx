'use client';

import { useEffect, useState } from 'react';
import { Wind, User, LogOut, MapPin, Zap, TrendingUp, Settings, Star, Pencil, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<User['onboardingData'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

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
        setEditData(data.user.onboardingData);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  // Fetch AI suggestion when user data is loaded
  useEffect(() => {
    if (user && user.onboardingData) {
      setAiLoading(true);
      setAiSuggestion(null);
      fetch('/api/ml/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingData: user.onboardingData }),
      })
        .then(async (res) => {
          if (!res.ok) {
            setAiSuggestion('Could not generate suggestions.');
            setAiLoading(false);
            return;
          }
          const data = await res.json();
          setAiSuggestion(data.suggestion);
          setAiLoading(false);
        })
        .catch(() => {
          setAiSuggestion('Could not generate suggestions.');
          setAiLoading(false);
        });
    }
  }, [user]);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Star className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-white text-2xl font-bold mb-2">Loading your dashboard...</h2>
        <p className="text-white/70">Please wait while we personalize your experience.</p>
      </motion.div>
    </div>
  );

  // Handle input changes in edit mode
  // Helper for nested location
  const handleEditLocation = (key: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      location: { ...prev?.location, [key]: value },
    }));
  };

  // General handler
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  // Save changes to MongoDB
  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    if (!token || !user) return;
    // Ensure all fields are present
    const completeData = {
      location: editData?.location || { country: '', city: '', zipCode: '' },
      energyType: editData?.energyType || [],
      propertyType: editData?.propertyType || '',
      currentUsage: editData?.currentUsage || 0,
      timeframe: editData?.timeframe || '',
      goals: editData?.goals || [],
    };
    try {
      const payload = {
        userId: user.id,
        onboardingData: completeData,
      };
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to update');
      setEditMode(false);
      setUser((prev) => prev ? { ...prev, onboardingData: completeData } : prev);
    } catch (e) {
      alert('Could not save changes.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Wind className="w-8 h-8 text-green-400 animate-spin-slow" />
              <span className="text-white font-bold text-xl">Wind Speed</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode((e) => !e)}
              className={`flex items-center space-x-2 text-white/70 hover:text-white px-3 py-1 rounded transition ${editMode ? 'bg-green-400/20' : ''}`}
              disabled={saving}
            >
              {editMode ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              <span>{editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white/70 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-cyan-500 p-3 rounded-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Hello, {user?.name || 'User'} 👋</h1>
              <p className="text-white/70 text-lg">Here's your personalized dashboard</p>
              {editMode ? (
                <div className="flex gap-2 mt-2">
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="City"
                    value={editData?.location?.city || ''}
                    onChange={e => handleEditLocation('city', e.target.value)}
                  />
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="Country"
                    value={editData?.location?.country || ''}
                    onChange={e => handleEditLocation('country', e.target.value)}
                  />
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="ZIP"
                    value={editData?.location?.zipCode || ''}
                    onChange={e => handleEditLocation('zipCode', e.target.value)}
                  />
                </div>
              ) : (
                user?.onboardingData?.location && (
                  <motion.p
                    className="text-white/50 text-sm mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {user.onboardingData.location.city ? `${user.onboardingData.location.city}, ` : ''}
                    {user.onboardingData.location.country || ''}
                    {user.onboardingData.location.zipCode ? ` • ${user.onboardingData.location.zipCode}` : ''}
                  </motion.p>
                )
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              className="bg-white/5 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-green-400 animate-bounce" />
                <h3 className="text-white font-semibold">Location Analysis</h3>
              </div>
              {editMode ? (
                <div className="flex gap-2">
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="City"
                    value={editData?.location?.city || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, city: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="Country"
                    value={editData?.location?.country || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, country: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                    placeholder="ZIP"
                    value={editData?.location?.zipCode || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, zipCode: e.target.value })}
                  />
                </div>
              ) : (
                <p className="text-white/70">
                  {user?.onboardingData?.location?.country
                    ? `Based on conditions near ${user.onboardingData.location.city || 'your area'}, ${user.onboardingData.location.country}.`
                    : 'Your renewable energy potential analysis is complete.'}
                </p>
              )}
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h3 className="text-white font-semibold">Efficiency Recommendations</h3>
              </div>
              {editMode ? (
                <div>
                  <select
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm mb-2 w-full"
                    value={editData?.propertyType || ''}
                    onChange={e => handleEditChange('propertyType', e.target.value)}
                  >
                    <option value="">Select Property Type</option>
                    <option value="house">Single Family House</option>
                    <option value="apartment">Apartment/Condo</option>
                    <option value="farm">Farm/Rural Property</option>
                    <option value="business">Small Business</option>
                  </select>
                  <label className="block text-white/70 text-sm mb-1">Energy Types</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['wind','tidal','solar','hydroelectric'].map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`px-3 py-1 rounded-full border ${editData?.energyType?.includes(type) ? 'bg-green-400/20 border-green-400 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}
                        onClick={() => {
                          const arr = editData?.energyType || [];
                          if (arr.includes(type)) {
                            handleEditChange('energyType', arr.filter(t => t !== type));
                          } else {
                            handleEditChange('energyType', [...arr, type]);
                          }
                        }}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-white/70">
                  {Array.isArray(user?.onboardingData?.energyType) && user.onboardingData!.energyType!.length > 0
                    ? `Focusing on ${user.onboardingData!.energyType!.join(', ')} for your ${user?.onboardingData?.propertyType || 'property'}.`
                    : 'Personalized suggestions based on your profile.'}
                </p>
              )}
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400 animate-float" />
                <h3 className="text-white font-semibold">Savings Projection</h3>
              </div>
              {editMode ? (
                <div>
                  <input
                    type="number"
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm mb-2"
                    placeholder="Current Usage (kWh/month)"
                    value={editData?.currentUsage || ''}
                    onChange={e => handleEditChange('currentUsage', Number(e.target.value))}
                  />
                  <select
                    className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm mb-2 w-full"
                    value={editData?.timeframe || ''}
                    onChange={e => handleEditChange('timeframe', e.target.value)}
                  >
                    <option value="">Select Timeframe</option>
                    <option value="immediate">Within 3 months</option>
                    <option value="short">3-6 months</option>
                    <option value="medium">6-12 months</option>
                    <option value="long">1+ years</option>
                  </select>
                </div>
              ) : (
                <p className="text-white/70">
                  {typeof user?.onboardingData?.currentUsage === 'number'
                    ? `Estimated ROI based on ${user.onboardingData!.currentUsage} kWh/month and timeline '${user?.onboardingData?.timeframe || 'N/A'}'.`
                    : 'Estimated cost savings and ROI calculations.'}
                </p>
              )}
            </motion.div>
          </div>

          {editMode ? (
            <motion.div
              className="mt-8 bg-white/5 rounded-xl p-6 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-white font-semibold mb-3">Your Goals</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  { value: 'cost_savings', label: 'Reduce Energy Costs' },
                  { value: 'environmental', label: 'Environmental Impact' },
                  { value: 'independence', label: 'Energy Independence' },
                  { value: 'property_value', label: 'Increase Property Value' },
                  { value: 'reliability', label: 'Power Reliability' }
                ].map(goal => (
                  <button
                    key={goal.value}
                    type="button"
                    className={`px-3 py-1 rounded-full border ${editData?.goals?.includes(goal.value) ? 'bg-green-400/20 border-green-400 text-white' : 'bg-white/10 border-white/20 text-white/70'}`}
                    onClick={() => {
                      const arr = editData?.goals || [];
                      if (arr.includes(goal.value)) {
                        handleEditChange('goals', arr.filter(g => g !== goal.value));
                      } else {
                        handleEditChange('goals', [...arr, goal.value]);
                      }
                    }}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            Array.isArray(user?.onboardingData?.goals) && user!.onboardingData!.goals!.length > 0 && (
              <motion.div
                className="mt-8 bg-white/5 rounded-xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-white font-semibold mb-3">Your Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {user!.onboardingData!.goals!.map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 text-white/90 text-sm border border-white/20 shadow">
                      {g}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          )}

          {/*
          AI Suggestion Section
          <motion.div
            className="mt-8 bg-gradient-to-r from-green-400/10 to-cyan-400/10 border border-green-400/20 rounded-2xl p-6 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-green-400 font-semibold mb-3 text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" /> AI Suggestions
            </h3>
            {aiLoading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  className="w-10 h-10 rounded-full border-4 border-green-400 border-t-transparent animate-spin"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                <span className="ml-4 text-white/70">Generating personalized recommendations...</span>
              </div>
            ) : (
              <p className="text-white/80 text-base leading-relaxed">{aiSuggestion}</p>
            )}
          </motion.div>
          */}
        </motion.div>
      </div>

      {/* Floating animation element */}
      <motion.div
        className="fixed top-1/2 right-10 w-4 h-4 bg-green-400 rounded-full opacity-60 z-10"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}
