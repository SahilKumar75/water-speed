// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
  // General handler for edit changes
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<User['onboardingData'] | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  // Chat state for right panel
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // Generate/load sessionId for anonymous users
  useEffect(() => {
    if (!user) {
      let sid = localStorage.getItem('chatSessionId');
      if (!sid) {
        sid = uuidv4();
        localStorage.setItem('chatSessionId', sid);
      }
      setSessionId(sid || '');
    } else {
      setSessionId(null);
    }
  }, [user]);
  // Fetch chat history on load
  useEffect(() => {
    const fetchHistory = async () => {
      const params = user ? `userId=${user.id}` : `sessionId=${sessionId}`;
      const res = await fetch(`/api/chat?${params}`);
      const data = await res.json();
      if (data.messages) setChatMessages(data.messages);
    };
    if (user || sessionId) fetchHistory();
  }, [user, sessionId]);

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

  // Chat: handle user sending a message
  const handleSendChat = async () => {
    if (!chatInput.trim() || !user?.onboardingData) return;
    setChatLoading(true);
    // Add user message
  const newMessages = [...chatMessages, { sender: 'user' as 'user', text: chatInput }];
  setChatMessages(newMessages);
    try {
      const res = await fetch('/api/ml/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingData: user.onboardingData, message: chatInput }),
      });
      let reply = 'Could not generate suggestions.';
      if (res.ok) {
        const data = await res.json();
        reply = data.suggestion || reply;
      }
  const updatedMessages = [...newMessages, { sender: 'ai' as 'ai', text: reply }];
  setChatMessages(updatedMessages);
      // Persist chat history
      const payload = {
        userId: user ? user.id : null,
        sessionId: !user ? sessionId : null,
        messages: updatedMessages,
      };
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
  const updatedMessages = [...newMessages, { sender: 'ai' as 'ai', text: 'Could not generate suggestions.' }];
  setChatMessages(updatedMessages);
      // Persist failed chat history
      const payload = {
        userId: user ? user.id : null,
        sessionId: !user ? sessionId : null,
        messages: updatedMessages,
      };
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setChatInput('');
    setChatLoading(false);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecf4ef]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-[#c0e57b] backdrop-blur-xl border border-[#244830] rounded-3xl p-12 max-w-md mx-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Star className="w-10 h-10 text-white" />
        </motion.div>
          <h2 className="text-[#224b32] text-2xl font-bold mb-2">Loading your dashboard...</h2>
          <p className="text-[#224b32]/70">Please wait while we personalize your experience.</p>
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

  return (
    <div className="min-h-screen bg-[#ecf4ef] flex flex-col">
      {/* Top Navigation Bar - stretches end to end */}
      <nav className="bg-white/10 backdrop-blur-xl border-b-2 border-[#244830]/40 p-4 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Wind className="w-8 h-8 text-[#c0e57b]" />
              <span className="text-xl font-bold text-[#224b32]">Wind Speed</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode((e) => !e)}
          className={`flex items-center space-x-2 text-[#224b32] hover:text-[#224b32] px-4 py-2 rounded-full border border-[#224b32] transition-colors bg-[#c0e57b] hover:bg-[#c0e57b]/90 ${editMode ? 'bg-[#c0e57b]/40' : ''}`}
              disabled={saving}
            >
              {editMode ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              <span>{editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}</span>
            </button>
            <button
              onClick={handleLogout}
          className="flex items-center space-x-2 text-[#224b32] hover:text-[#224b32] px-4 py-2 rounded-full border border-[#224b32] transition-colors bg-[#c0e57b] hover:bg-[#c0e57b]/90"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-row flex-1 min-h-0">
        {/* Left Panel: Dashboard */}
        <div className="w-full md:w-2/3 lg:w-3/5 border-r border-[#244830]/20 min-h-full flex flex-col">
          <div className="max-w-7xl mx-auto p-8 text-[#244830] flex flex-col h-full">
        <motion.div
          className="bg-[#c0e57b] backdrop-blur-xl border border-[#244830] rounded-2xl p-8 text-[#244830] flex flex-col h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <motion.div
              className="bg-gradient-to-r from-accent to-bg p-3 rounded-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-[#244830] mb-1">Hello, {user?.name || 'User'} </h1>
              <p className="text-[#244830]/70 text-lg">Here's your personalized dashboard</p>
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
                    className="text-[#244830]/50 text-sm mt-1"
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
              className="bg-white/5 rounded-xl p-6 shadow-lg border border-[#244830] text-[#244830]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-green-400 animate-bounce" />
                <h3 className="text-[#244830] font-semibold">Location Analysis</h3>
              </div>
              {editMode ? (
                <div className="flex gap-2">
                  <input
                    className="bg-white/10 border border-[#244830] rounded px-2 py-1 text-[#244830] text-sm"
                    placeholder="City"
                    value={editData?.location?.city || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, city: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-[#244830] rounded px-2 py-1 text-[#244830] text-sm"
                    placeholder="Country"
                    value={editData?.location?.country || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, country: e.target.value })}
                  />
                  <input
                    className="bg-white/10 border border-[#244830] rounded px-2 py-1 text-[#244830] text-sm"
                    placeholder="ZIP"
                    value={editData?.location?.zipCode || ''}
                    onChange={e => handleEditChange('location', { ...editData?.location, zipCode: e.target.value })}
                  />
                </div>
              ) : (
                <p className="text-[#244830]/70">
                  {user?.onboardingData?.location?.country
                    ? `Based on conditions near ${user.onboardingData.location.city || 'your area'}, ${user.onboardingData.location.country}.`
                    : 'Your renewable energy potential analysis is complete.'}
                </p>
              )}
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-xl p-6 shadow-lg border border-[#244830] text-[#244830]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h3 className="text-[#244830] font-semibold">Efficiency Recommendations</h3>
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
                  <label className="block text-[#244830]/70 text-sm mb-1">Energy Types</label>
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
                <p className="text-[#244830]/70">
                  {Array.isArray(user?.onboardingData?.energyType) && user.onboardingData!.energyType!.length > 0
                    ? `Focusing on ${user.onboardingData!.energyType!.join(', ')} for your ${user?.onboardingData?.propertyType || 'property'}.`
                    : 'Personalized suggestions based on your profile.'}
                </p>
              )}
            </motion.div>

            <motion.div
              className="bg-white/5 rounded-xl p-6 shadow-lg border border-[#244830] text-[#244830]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-6 h-6 text-cyan-400 animate-float" />
                <h3 className="text-[#244830] font-semibold">Savings Projection</h3>
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
                <p className="text-[#244830]/70">
                  {typeof user?.onboardingData?.currentUsage === 'number'
                    ? `Estimated ROI based on ${user.onboardingData!.currentUsage} kWh/month and timeline '${user?.onboardingData?.timeframe || 'N/A'}'.`
                    : 'Estimated cost savings and ROI calculations.'}
                </p>
              )}
            </motion.div>
          </div>

          {editMode ? (
            <motion.div
              className="mt-8 bg-white/5 rounded-xl p-6 shadow-lg border border-[#244830] text-[#244830]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-[#244830] font-semibold mb-3">Your Goals</h3>
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
                className="mt-8 bg-white/5 rounded-xl p-6 shadow-lg border border-[#244830] text-[#244830]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-[#244830] font-semibold mb-3">Your Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {user!.onboardingData!.goals!.map((g) => (
                    <span key={g} className="px-3 py-1 rounded-full bg-gradient-to-r from-accent to-bg text-[#224b32] text-sm border border-white/20 shadow">
                      {g}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          )}

          
          {/* Wind Speed AI Suggestion reply in left panel, scrollable chat area */}
          <div className="flex-1 overflow-y-auto">
            {aiSuggestion && (
              <motion.div
                className="mt-8 bg-gradient-to-r from-accent/10 to-bg/10 border border-accent/20 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-green-400 font-semibold mb-3 text-lg flex items-center gap-2">
                  Wind Speed:
                </h3>
                <p className="text-[#224b32] text-base leading-relaxed">{aiSuggestion}</p>
              </motion.div>
            )}
          </div>
         
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
        {/* Right Panel: Chat UI */}
        <div className="hidden md:flex w-1/3 lg:w-2/5 min-h-full bg-[#e6f7f1] relative flex-col">
          <div className="flex-1 relative">
            <div className="overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              {chatMessages.length === 0 && (
                <div className="text-[#143726]/60 text-center mt-20">Start a conversation with <span className="font-bold text-[#224b32]">Wind Speed</span>!</div>
              )}
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-white text-[#143726]' : 'bg-gradient-to-r from-accent/20 to-bg/20 text-[#224b32] border border-accent/30'}`}>
                    {msg.sender === 'ai' && (
                      <span className="font-bold text-green-600 mr-2">Wind Speed:</span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] px-4 py-2 rounded-2xl shadow bg-gradient-to-r from-accent/20 to-bg/20 text-[#224b32] border border-accent/30 animate-pulse">
                    <span className="font-bold text-green-600 mr-2">Wind Speed:</span>
                    Generating reply...
                  </div>
                </div>
              )}
            </div>
            {/* Added missing closing div for chat area */}
          </div>
          <form
            className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#e6f7f1] to-transparent"
            onSubmit={e => { e.preventDefault(); handleSendChat(); }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-full border border-[#143726]/30 focus:outline-none focus:ring-2 focus:ring-[#143726]/40 bg-white/80 text-[#143726] shadow-lg"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={chatLoading}
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#c0e57b] text-[#224b32] font-bold shadow border border-[#224b32] hover:bg-[#c0e57b]/90 transition-colors"
                disabled={chatLoading || !chatInput.trim()}
              >Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
