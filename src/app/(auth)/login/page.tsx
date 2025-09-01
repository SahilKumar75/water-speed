'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'personal' | 'organization'>('personal');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setLoading(true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email.trim(),
        password: formData.password,
        userType: userType,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on user type and onboarding status
      if (data.user.userType === 'organization') {
        router.push('/dashboard/organization');
      } else {
        const isOnboarded = Boolean(data.user.onboardingCompleted);
        router.push(isOnboarded ? '/dashboard/personal/main' : '/dashboard/personal');
      }
    } else {
      setErrors({ general: data.error || 'Login failed' });
    }
  } catch (error) {
    console.error('Login error:', error);
    setErrors({ general: 'An error occurred during login' });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-green-400/20 rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-cyan-400/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 border border-blue-400/20 rounded-full"></div>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-3 rounded-xl">
              <Wind className="w-8 h-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Wind Speed</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/70">Sign in to optimize your renewable energy</p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
            <p className="text-red-300 text-sm">{errors.general}</p>
          </div>
        )}

        {/* User Type Selection */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setUserType('personal')}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                userType === 'personal'
                  ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Personal Account
            </button>
            <button
              type="button"
              onClick={() => setUserType('organization')}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                userType === 'organization'
                  ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-white shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Organization
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/20 focus:border-green-400/50 focus:ring-green-400/50'
                    }`}
                    placeholder={userType === 'organization' ? 'admin@company.com' : 'your@email.com'}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-300 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                      errors.password ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/20 focus:border-green-400/50 focus:ring-green-400/50'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-300 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-400 bg-white/10 border border-white/20 rounded focus:ring-green-400/50"
                  />
                  <span className="ml-2 text-white/70 text-sm">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-green-400 hover:text-green-300 text-sm transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-cyan-500 py-3 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Signing In...' : `Sign In to ${userType === 'organization' ? 'Organization' : 'Account'}`}
                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-white/70">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
