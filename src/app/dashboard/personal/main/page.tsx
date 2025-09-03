// ...existing code...
'use client';

import { useEffect, useState } from 'react';
import SidePanel from '@/components/SidePanel';
import { v4 as uuidv4 } from 'uuid';
import { Wind, User, LogOut, MapPin, Zap, TrendingUp, Settings, Star, Pencil, Save, Plus } from 'lucide-react';
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
  // Removed edit handler
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  // Removed edit feature: no editMode, editData, saving state
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
  // Removed setEditData
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

  // Removed edit handlers

  return (
    <div className="h-screen bg-[#ecf4ef] flex flex-row overflow-hidden">
      {/* SidePanel: fixed left */}
      <SidePanel />
      {/* Main Content: Dashboard and Chat, side by side */}
      <div className="flex flex-row w-full ml-56 h-full">
        {/* Left Panel: Dashboard */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-8 text-[#244830] flex flex-col h-full overflow-hidden">
            {/* Greeting, subtitle, and stat cards styled like reference */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold text-[#1a2233]">Hello, {user?.name || 'User'}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-[#1a2233] text-base font-medium">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-[#f5f7fa] rounded-full border border-[#e6e6e6]">
                    <svg width="20" height="20" fill="none" stroke="#1a2233" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="14" height="10" rx="2"/><path d="M16 3v4M4 3v4"/></svg>
                  </span>
                </div>
              </div>
              <p className="text-[#7a869a] text-lg font-normal">Track your natural resources here</p>
            </div>
            {/* Stat cards row with dividers */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-[#e6e6e6] px-2 py-4 mb-10">
              {/* Finished */}
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#f5f7fa] rounded-full mb-2">
                  <User className="w-7 h-7 text-[#224b32]" />
                </span>
                <div className="font-semibold text-lg text-[#1a2233]">Finished</div>
                <div className="font-bold text-2xl text-[#1a2233]">{user?.onboardingData?.goals?.length || 18}</div>
                <div className="text-xs text-green-500 mt-1">+8 tasks</div>
              </div>
              <div className="h-12 w-px bg-[#e6e6e6] mx-4" />
              {/* Tracked */}
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#f5f7fa] rounded-full mb-2">
                  <Wind className="w-7 h-7 text-[#224b32]" />
                </span>
                <div className="font-semibold text-lg text-[#1a2233]">Tracked</div>
                <div className="font-bold text-2xl text-[#1a2233]">{user?.onboardingData?.currentUsage || 31}h</div>
                <div className="text-xs text-red-500 mt-1">-6 hours</div>
              </div>
              <div className="h-12 w-px bg-[#e6e6e6] mx-4" />
              {/* Efficiency */}
              <div className="flex flex-1 flex-col items-center justify-center">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#f5f7fa] rounded-full mb-2">
                  <TrendingUp className="w-7 h-7 text-[#224b32]" />
                </span>
                <div className="font-semibold text-lg text-[#1a2233]">Efficiency</div>
                <div className="font-bold text-2xl text-[#1a2233]">{user?.onboardingData?.energyType ? '93%' : '93%'}</div>
                <div className="text-xs text-green-500 mt-1">+12%</div>
              </div>
            </div>
            {/* ...existing code for goals, chat, etc. ... */}
            {/* Wind Speed AI Suggestion reply in left panel, scrollable chat area */}
            <div className="flex-1 overflow-y-auto">
              {aiSuggestion && (
                <div className="mt-8 bg-gradient-to-r from-accent/10 to-bg/10 border border-accent/20 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-green-400 font-semibold mb-3 text-lg flex items-center gap-2">
                    Wind Speed:
                  </h3>
                  <p className="text-[#224b32] text-base leading-relaxed">{aiSuggestion}</p>
                </div>
              )}
            </div>
          </div>
          {/* Floating animation element */}
          <div className="fixed top-1/2 right-10 w-4 h-4 bg-green-400 rounded-full opacity-60 z-10 animate-bounce" />
        </div>
        {/* Right Panel: Chat UI */}
        <div className="hidden md:flex w-1/3 lg:w-2/5 h-full bg-[#e6f7f1] relative flex-col">
          {/* New Conversation Button */}
          <div className="p-6 border-b border-[#c0e57b]/30 flex items-center justify-between">
            <span className="font-bold text-[#224b32] text-lg">Chat</span>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#c0e57b] text-[#224b32] shadow border border-[#224b32] hover:bg-[#c0e57b]/90 transition-colors"
              title="New Conversation"
              onClick={() => {
                setChatMessages([]);
                setChatInput('');
                if (!user) {
                  const newSessionId = uuidv4();
                  localStorage.setItem('chatSessionId', newSessionId);
                  setSessionId(newSessionId);
                }
                // Save empty conversation to backend
                fetch('/api/chat', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    userId: user ? user.id : null,
                    sessionId: !user ? (localStorage.getItem('chatSessionId') || '') : null,
                    messages: [],
                  }),
                });
              }}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 relative overflow-y-auto h-full" style={{ maxHeight: '100vh' }}>
            <div className="p-6 space-y-4">
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
