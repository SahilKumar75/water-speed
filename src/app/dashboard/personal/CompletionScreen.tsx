import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { User } from './types';

interface CompletionScreenProps {
  user: User;
}

export default function CompletionScreen({ user }: CompletionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      <motion.div
        className="text-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-4">Welcome aboard, {user.name}!</h2>
        <p className="text-white/70 mb-6">
          Thank you for completing your profile. We're analyzing your responses to create 
          personalized renewable energy recommendations.
        </p>
        <div className="text-white/60 text-sm">
          Redirecting to your dashboard...
        </div>
      </motion.div>
    </div>
  );
}
