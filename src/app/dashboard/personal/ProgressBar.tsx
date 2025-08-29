import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  filledCount?: number; // ✅ ADDED: Optional prop for filled answers count
}

export default function ProgressBar({ currentStep, totalSteps, filledCount }: ProgressBarProps) {
  // Use filled count for progress if provided, otherwise use current step
  const progressCount = filledCount !== undefined ? filledCount : currentStep + 1;
  const progress = (progressCount / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-white/60 mb-2">
          <span>Step {currentStep + 1} of {totalSteps}</span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{filledCount || 0} completed</span>
            </div>
            <span>•</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-3">
          <motion.div
            className="bg-gradient-to-r from-green-400 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = filledCount ? index < filledCount : false;
            const isCurrent = index === currentStep;
            
            return (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  isCompleted 
                    ? 'bg-green-400 shadow-lg shadow-green-400/50' 
                    : isCurrent 
                      ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                      : 'bg-white/20'
                }`}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
