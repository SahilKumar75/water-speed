import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, TrendingUp, Settings, Star, User } from 'lucide-react';

interface DashboardPanelsProps {
  user: any;
  editMode: boolean;
  editData: any;
  handleEditLocation: (key: string, value: string) => void;
  handleEditChange: (field: string, value: any) => void;
}


const DashboardPanels: React.FC<DashboardPanelsProps> = ({ user, editMode, editData, handleEditLocation, handleEditChange }) => {
  const aiSuggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (aiSuggestionRef.current) {
      aiSuggestionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [user?.aiSuggestion]);

  return (
    <div className="max-w-7xl mx-auto p-8 text-[#244830]">
      <motion.div
        className="bg-[#c0e57b] backdrop-blur-xl border border-[#244830] rounded-2xl p-8 text-[#244830]"
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
        {/* ...existing code for panels (location, efficiency, savings, goals)... */}
        {/* Wind Speed AI Suggestion reply in left panel */}
        {user?.aiSuggestion && (
          <motion.div
            ref={aiSuggestionRef}
            className="mt-8 bg-gradient-to-r from-accent/10 to-bg/10 border border-accent/20 rounded-2xl p-6 shadow-lg max-h-64 overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-green-400 font-semibold mb-3 text-lg flex items-center gap-2">
              Wind Speed:
            </h3>
            <p className="text-[#224b32] text-base leading-relaxed">{user.aiSuggestion}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPanels;
