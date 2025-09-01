import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
}

export default function NavigationButtons({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext 
}: NavigationButtonsProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={isFirst}
        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
          isFirst
            ? 'text-white/40 cursor-not-allowed'
            : 'text-white hover:bg-white/10'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <motion.button
        onClick={onNext}
        className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-cyan-500 px-8 py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>{isLast ? 'Complete Setup' : 'Next'}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
