
'use client';
import React from 'react';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import Link from 'next/link';

interface NavigationProps {
  onContactClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onContactClick }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);
  const primaryNavItems = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Technology', href: '/technology' },
    { label: 'Insights', href: '#insights' },
  ];

  const actionNavItems = loggedIn
    ? [
        { label: 'Dashboard', href: '/dashboard/personal/main', variant: 'primary' as const },
      ]
    : [
        { label: 'Login', href: '/login', variant: 'link' as const },
        { label: 'Get Started', href: '/register', variant: 'primary' as const },
      ];

  return (
  <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b-2 border-[#224b32]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-gradient-to-r from-green-400 to-cyan-400 p-2 rounded-lg">
              <Wind className="w-6 h-6 text-white" />
            </div>
              <span className="text-xl font-bold text-[#224b32]">Wind Speed</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                  className="text-[#224b32] hover:text-[#224b32] transition-colors rounded-full px-4 py-2 hover:bg-[#c0e57b]"
              >
                {item.label}
              </Link>
            ))}
            <button
                className="text-[#224b32] hover:text-[#224b32] transition-colors rounded-full px-4 py-2 hover:bg-[#c0e57b]"
              type="button"
              onClick={onContactClick}
            >
              Contact
            </button>
          </div>
          
          <div className="flex space-x-4">
            {actionNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                  className={
                    item.variant === 'primary'
                      ? 'bg-white/20 backdrop-blur-lg border border-white/30 px-6 py-2 rounded-lg text-[#224b32] font-medium hover:bg-[#c0e57b] hover:text-[#224b32] transition-all rounded-full'
                      : 'px-4 py-2 text-[#224b32] hover:text-[#224b32] transition-colors rounded-full hover:bg-[#c0e57b]'
                  }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
