'use client';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
  const primaryNavItems = [
    { label: 'Solutions', href: '#solutions' },
    { label: 'Technology', href: '#technology' },
    { label: 'Insights', href: '#insights' },
    { label: 'Contact', href: '#contact' },
  ];

  const actionNavItems = [
    { label: 'Login', href: '/login', variant: 'link' as const },
    { label: 'Get Started', href: '/register', variant: 'primary' as const },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20">
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
            <span className="text-xl font-bold text-white">Wind Speed</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {primaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex space-x-4">
            {actionNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.variant === 'primary'
                    ? 'bg-white/20 backdrop-blur-lg border border-white/30 px-6 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-all'
                    : 'px-4 py-2 text-white/80 hover:text-white transition-colors'
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
