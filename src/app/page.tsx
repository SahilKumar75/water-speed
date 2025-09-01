'use client';

import { motion } from 'framer-motion';
import { Wind, Zap, Shield, Users, ArrowRight, CheckCircle, Star, TrendingUp, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/20 to-slate-900/40"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-400/20 border border-green-400/30 text-green-300 text-sm font-medium">
                    <Wind className="w-4 h-4 mr-2" />
                    Renewable Energy Platform
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                  Renewable energy solutions
                  <span className="block text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                    for a sustainable tomorrow.
                  </span>
                </h1>
                
                <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-xl">
                  With a passion for renewable energy, we specialize in wind and tidal power optimization, 
                  predictive analytics, and other eco-friendly technologies that harness the power of nature.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <motion.button
                      className="bg-gradient-to-r from-green-400 to-cyan-500 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    className="bg-white/10 backdrop-blur-lg border border-white/20 px-8 py-4 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Technology
                  </motion.button>
                </div>
              </motion.div>

              {/* Right Content - Key Metrics Cards */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">Predictive Optimization</h3>
                  <p className="text-white/70 mb-4">Real-time wind and tidal pattern forecasting for maximum power generation.</p>
                  <div className="flex items-center text-green-400">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="text-sm">35% Efficiency Boost</span>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white font-semibold text-lg mb-2">Enhanced Reliability</h3>
                  <p className="text-white/70 mb-4">Complementary wind and tidal energy for stable power supply.</p>
                  <div className="flex items-center text-green-400">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="text-sm">99.2% Grid Stability</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Floating animation element */}
          <motion.div
            className="absolute top-1/2 right-10 w-2 h-2 bg-green-400 rounded-full opacity-60"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </section>

        {/* Problem Statement & Mission */}
        <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Addressing Resource Depletion</h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-4xl mx-auto">
                We are <span className="text-green-400">committed</span> to driving the transition to a <span className="text-green-400">cleaner</span>, more sustainable
                future. Our mission is to provide innovative renewable energy solutions that
                empower communities, businesses, and nations to <span className="text-green-400">reduce</span> their carbon footprint
                while maximizing energy <span className="text-green-400">efficiency</span> and grid stability.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "75+", label: "Countries Presence" },
                { number: "2020", label: "Founded Year" },
                { number: "500+", label: "Renewable Projects" },
                { number: "2.5GW", label: "Clean Energy Generated" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Preview */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore our solutions and see how
                <br />
                <span className="text-transparent bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text">
                  you can be part of the change!
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Predictive Optimization",
                  description: "Accurately forecast wind and tidal patterns with AI-powered analytics for maximum power generation efficiency.",
                  badge: "AI-Powered"
                },
                {
                  icon: Shield,
                  title: "Enhanced Reliability",
                  description: "Leverage complementary wind and tidal energy sources for stable, consistent power supply and reduced grid instability.",
                  badge: "Grid Stable"
                },
                {
                  icon: Settings,
                  title: "Predictive Maintenance",
                  description: "AI-driven maintenance system identifies potential equipment failures before they happen, reducing operational costs.",
                  badge: "Cost Efficient"
                }
              ].map((solution, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gradient-to-r from-green-400 to-cyan-500 w-12 h-12 rounded-xl flex items-center justify-center">
                      <solution.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-green-400 font-medium px-2 py-1 bg-green-400/10 rounded-full">
                      {solution.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-white/70 mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="flex items-center text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Insights Section */}
        <section className="py-20 px-4 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">Data-Driven Environmental Insights</h2>
              <p className="text-white/70 text-lg max-w-3xl mx-auto">
                Our advanced sensor data analysis provides deep understanding of environmental factors affecting energy output, 
                enabling better site selection and optimized system design for future renewable energy projects.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Environmental Impact Reduction",
                  description: "Switching to renewable energy with Wind Speed optimization was the best decision! Not only has it improved our energy independence, but our carbon emissions have also decreased by 60% while maintaining reliable power supply.",
                  author: "Maria Rodriguez",
                  role: "Sustainability Director, GreenTech Solutions"
                },
                {
                  title: "Operational Excellence",
                  description: "I'm proud to be part of the renewable energy movement. Thanks to Wind Speed's predictive maintenance, I'm contributing to a cleaner planet while enjoying 99.8% uptime and cost-effective operations!",
                  author: "David Kim",
                  role: "Operations Manager, Coastal Wind Farm"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
                  initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-green-400 mb-3">{testimonial.title}</h3>
                  <blockquote className="text-white/80 leading-relaxed mb-6">
                    "{testimonial.description}"
                  </blockquote>
                  <div className="border-t border-white/10 pt-4">
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-green-400/10 to-cyan-500/10 backdrop-blur-xl border border-green-400/20 rounded-3xl p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to optimize your renewable energy future?
            </h2>
            <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
              Join the global movement towards sustainable energy. Let our AI-powered platform 
              maximize your wind and tidal energy potential while reducing operational costs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <motion.button
                  className="bg-gradient-to-r from-green-400 to-cyan-500 px-12 py-4 rounded-xl text-white font-semibold text-xl shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Optimizing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </Link>
              <motion.button
                className="bg-white/10 backdrop-blur-lg border border-white/20 px-12 py-4 rounded-xl text-white font-semibold text-xl hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule Consultation
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-16 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-3 rounded-xl">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Wind Speed</span>
              </div>
              <p className="text-white/60 max-w-2xl mx-auto">
                Empowering the future of renewable energy through innovative 
                predictive optimization and sustainable technology solutions.
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-white/40">
                © 2025 Wind Speed. Built with passion for a sustainable tomorrow.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
