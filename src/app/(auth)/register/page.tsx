'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Mail, Lock, Eye, EyeOff, User, Building, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'personal' | 'organization'>('personal');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    agreedToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (userType === 'organization' && !formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
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
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        userType: userType,
        ...(userType === 'organization' && { organizationName: formData.organizationName.trim() }),
      };

      console.log('Sending registration data:', registrationData);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! You can now login.');
        router.push('/login');
      } else {
        setErrors({ general: data.error || 'Registration failed' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'An error occurred during registration' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 py-8">
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
          <h1 className="text-3xl font-bold text-white mb-2">Join Wind Speed</h1>
          <p className="text-white/70">Create your account and start optimizing renewable energy</p>
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
              <User className="w-4 h-4 mx-auto mb-1" />
              Personal
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
              <Building className="w-4 h-4 mx-auto mb-1" />
              Organization
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {userType === 'organization' ? 'Contact Person Name' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                      errors.name ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/20 focus:border-green-400/50 focus:ring-green-400/50'
                    }`}
                    placeholder={userType === 'organization' ? 'John Doe (Project Manager)' : 'Your full name'}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-red-300 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              {/* Organization Name (if organization type) */}
              {userType === 'organization' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className={`w-full bg-white/10 border rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                        errors.organizationName ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/20 focus:border-green-400/50 focus:ring-green-400/50'
                      }`}
                      placeholder="Green Energy Solutions Ltd."
                      required
                    />
                  </div>
                  {errors.organizationName && (
                    <p className="text-red-300 text-sm mt-2">{errors.organizationName}</p>
                  )}
                </motion.div>
              )}

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
                    placeholder="Create a strong password"
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

              {/* Confirm Password Input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full bg-white/10 border rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword ? 'border-red-400/50 focus:border-red-400/50 focus:ring-red-400/50' : 'border-white/20 focus:border-green-400/50 focus:ring-green-400/50'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-300 text-sm mt-2">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-400 bg-white/10 border border-white/20 rounded focus:ring-green-400/50 mt-1"
                  required
                />
                <label className="text-white/70 text-sm leading-relaxed">
                  I agree to Wind Speed's{' '}
                  <Link href="/terms" className="text-green-400 hover:text-green-300 transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-green-400 hover:text-green-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-300 text-sm">{errors.agreedToTerms}</p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-400 to-cyan-500 py-3 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? 'Creating Account...' : `Create ${userType === 'organization' ? 'Organization' : 'Personal'} Account`}
                {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
              </motion.button>
            </div>
          </motion.div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-white/70">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
