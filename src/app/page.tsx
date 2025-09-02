
'use client';
import React from 'react';
import ContactModal from '@/components/ContactModal';

import { motion } from 'framer-motion';
import { Wind, Zap, Shield, Users, ArrowRight, CheckCircle, Star, TrendingUp, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);
  React.useEffect(() => {
    setLoggedIn(!!localStorage.getItem('token'));
  }, []);
  return (
    <>
  <Navigation onContactClick={() => setShowContact(true)} />
  <div className="min-h-screen bg-primary">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Ocean Wave Animation */}
          <div className="absolute left-0 right-0 bottom-0 h-[320px] min-w-full pointer-events-none z-0">
            <svg className="absolute left-0 w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <path fill="#38bdf8" fillOpacity="0.3">
                <animate attributeName="d" dur="6s" repeatCount="indefinite"
                  values="M0,160L60,149.3C120,139,240,117,360,128C480,139,600,181,720,186.7C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
                  M0,192L60,186.7C120,181,240,160,360,154.7C480,149,600,171,720,186.7C840,203,960,213,1080,202.7C1200,192,1320,160,1380,149.3L1440,139L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
                  M0,224L60,213.3C120,203,240,181,360,160C480,139,600,117,720,128C840,139,960,181,1080,186.7C1200,192,1320,160,1380,149.3L1440,139L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
                  M0,160L60,149.3C120,139,240,117,360,128C480,139,600,181,720,186.7C840,192,960,160,1080,154.7C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
                />
              </path>
            </svg>
          </div>
          {/* Background overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary/80 z-10"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium">
                    <Wind className="w-4 h-4 mr-2" />
                    Renewable Energy Platform
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#224b32] leading-tight">
                  Renewable energy solutions
                  <span className="block text-transparent bg-gradient-to-r from-primary to-primary bg-clip-text text-[#224b32]">
                    for a sustainable tomorrow.
                  </span>
                </h1>
                
                <p className="text-xl text-[#224b32] mb-8 leading-relaxed max-w-xl">
                  With a passion for renewable energy, we specialize in wind and tidal power optimization, 
                  predictive analytics, and other eco-friendly technologies that harness the power of nature.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {loggedIn ? (
                    <Link href="/dashboard/personal/main">
                      <motion.button
                        className="bg-[#c0e57b] px-8 py-4 rounded-xl text-[#224b32] font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login">
                        <motion.button
                          className="bg-[#c0e57b] px-8 py-4 rounded-xl text-[#224b32] font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Login
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                      <Link href="/register">
                        <motion.button
                          className="bg-[#c0e57b] backdrop-blur-lg border border-[#224b32] px-8 py-4 rounded-xl text-[#224b32] font-semibold text-lg hover:bg-[#c0e57b]/90 transition-all flex items-center justify-center group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right Content removed as requested */}
            </div>
          </div>

          {/* Floating animation element */}
          <motion.div
            className="absolute top-1/2 right-10 w-2 h-2 bg-primary rounded-full opacity-60"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </section>

        {/* Problem Statement & Mission */}
  <section className="py-16 px-4 bg-primary backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-[#224b32] mb-6">Addressing Resource Depletion</h2>
              <p className="text-[#224b32] text-lg leading-relaxed max-w-4xl mx-auto">
                We are <span className="text-[#224b32] font-bold">committed</span> to driving the transition to a <span className="text-[#224b32] font-bold">cleaner</span>, more sustainable
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
                  <div className="text-4xl md:text-5xl font-bold text-[#224b32] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[#224b32] text-sm uppercase tracking-wide">
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
              <h2 className="text-4xl md:text-5xl font-bold text-[#224b32] mb-6">
                Explore our solutions and see how
                <br />
                <span className="text-transparent bg-gradient-to-r from-primary to-primary bg-clip-text text-[#224b32]">
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
                  className="bg-[#c0e57b] backdrop-blur-xl border border-[#224b32] rounded-2xl p-8 hover:bg-[#c0e57b]/90 transition-all duration-300 group cursor-pointer"
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
                    <span className="text-xs text-[#224b32] font-medium px-2 py-1 bg-primary/10 rounded-full">
                      {solution.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#224b32] mb-3 group-hover:text-[#224b32] transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-[#224b32] mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <div className="flex items-center text-[#224b32] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Insights Section */}
  <section className="py-20 px-4 bg-primary backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#224b32] mb-4">Data-Driven Environmental Insights</h2>
              <p className="text-[#224b32] text-lg max-w-3xl mx-auto">
                Our advanced sensor data analysis provides deep understanding of environmental factors affecting energy output, 
                enabling better site selection and optimized system design for future renewable energy projects.
              </p>
            </motion.div>

            <div className="w-full py-8 flex justify-center items-center">
              {/* Free interactive map of India using OpenStreetMap, full width */}
              <div className="w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-primary">
                <iframe
                  title="India Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=68.1766451354%2C6.751896%2C97.4025614766%2C37.285263&layer=mapnik"
                  className="w-full h-[500px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!loggedIn && (
    <section className="py-20 px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/10 to-primary/10 backdrop-blur-xl border border-primary/20 rounded-3xl p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#224b32] mb-6">
                Ready to optimize your renewable energy future?
              </h2>
              <p className="text-[#224b32] mb-8 text-lg max-w-2xl mx-auto">
                Join the global movement towards sustainable energy. Let our AI-powered platform 
                maximize your wind and tidal energy potential while reducing operational costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <motion.button
                    className="bg-gradient-to-r from-oliveMid to-oliveLight px-12 py-4 rounded-xl text-oliveDark font-semibold text-xl shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Optimizing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </Link>
                <motion.button
                  className="bg-olivePale/80 backdrop-blur-lg border border-oliveLight px-12 py-4 rounded-xl text-oliveDark font-semibold text-xl hover:bg-olivePale transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Consultation
                </motion.button>
              </div>
            </motion.div>
          </section>
        )}

        {/* Footer */}
  <footer className="border-t border-oliveDark/10 py-16 px-4 bg-oliveDark/50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-oliveMid to-oliveLight p-3 rounded-xl">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-olivePale">Wind Speed</span>
              </div>
              <p className="text-oliveLight max-w-2xl mx-auto">
                Empowering the future of renewable energy through innovative 
                predictive optimization and sustainable technology solutions.
              </p>
              <button
                className="mt-6 px-6 py-2 bg-oliveMid text-oliveDark rounded-lg font-semibold shadow hover:bg-oliveLight transition-all"
                onClick={() => setShowContact(true)}
              >
                Contact
              </button>
            </div>
            <div className="border-t border-oliveDark/10 pt-8 text-center">
              <p className="text-olivePale/60">
                © 2025 Wind Speed. Built with passion for a sustainable tomorrow.
              </p>
            </div>
          </div>
          {/* Contact Modal */}
          <ContactModal open={showContact} onClose={() => setShowContact(false)} />
        </footer>
      </div>
    </>
  );
}
