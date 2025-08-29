'use client';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import Link from 'next/link';

export default function Navigation() {
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
            <Link href="#solutions" className="text-white/80 hover:text-white transition-colors">Solutions</Link>
            <Link href="#technology" className="text-white/80 hover:text-white transition-colors">Technology</Link>
            <Link href="#insights" className="text-white/80 hover:text-white transition-colors">Insights</Link>
            <Link href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              href="/login"
              className="px-4 py-2 text-white/80 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="bg-white/20 backdrop-blur-lg border border-white/30 px-6 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
