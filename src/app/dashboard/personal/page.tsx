'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Building, CheckCircle, BarChart3, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import components with relative paths
import Header from './Header';
import ProgressBar from './ProgressBar';
import QuestionContent from './QuestionContent';
import NavigationButtons from './NavigationButtons';
import CompletionScreen from './CompletionScreen';
import QuestionInput from './QuestionInput';
import { User, Question, Answers, AnswerValue } from './types';

const onboardingQuestions: Question[] = [
  {
    id: 'location',
    title: 'Tell us about your location',
    question: 'Where are you located?',
    description: 'We need your location to analyze local wind and water conditions for optimal energy efficiency.',
    inputType: 'location',
    required: true,
    icon: MapPin,
    fields: ['country', 'city', 'zipCode']
  },
  {
    id: 'energyType',
    title: 'Energy preferences',
    question: 'Which renewable energy sources interest you?',
    description: 'Select the energy sources you want to optimize for your location.',
    inputType: 'multiSelect',
    required: true,
    icon: Zap,
    options: [
      { value: 'wind', label: 'Wind Energy', description: 'Harness wind power for electricity generation' },
      { value: 'tidal', label: 'Tidal Energy', description: 'Utilize tidal movements for sustainable power' },
      { value: 'solar', label: 'Solar Energy', description: 'Convert sunlight into clean electricity' },
      { value: 'hydroelectric', label: 'Hydroelectric', description: 'Generate power from water flow' }
    ]
  },
  {
    id: 'propertyType',
    title: 'Property information',
    question: 'What type of property do you have?',
    description: 'This helps us recommend the most suitable renewable energy solutions.',
    inputType: 'radio',
    required: true,
    icon: Building,
    options: [
      { value: 'house', label: 'Single Family House', description: 'Standalone residential property' },
      { value: 'apartment', label: 'Apartment/Condo', description: 'Multi-unit residential building' },
      { value: 'farm', label: 'Farm/Rural Property', description: 'Agricultural or rural land' },
      { value: 'business', label: 'Small Business', description: 'Commercial property' }
    ]
  },
  {
    id: 'currentUsage',
    title: 'Energy consumption',
    question: 'What\'s your approximate monthly energy usage?',
    description: 'Help us calculate potential savings and efficiency improvements.',
    inputType: 'range',
    required: true,
    icon: BarChart3,
    min: 200,
    max: 2000,
    step: 50,
    unit: 'kWh',
    ranges: [
      { min: 200, max: 500, label: 'Low usage (Small apartment)' },
      { min: 500, max: 1000, label: 'Average usage (Medium home)' },
      { min: 1000, max: 1500, label: 'High usage (Large home)' },
      { min: 1500, max: 2000, label: 'Very high usage (Large home + business)' }
    ]
  },
  {
    id: 'timeframe',
    title: 'Implementation timeline',
    question: 'When would you like to implement renewable energy solutions?',
    description: 'Understanding your timeline helps us prioritize recommendations.',
    inputType: 'radio',
    required: true,
    icon: Clock,
    options: [
      { value: 'immediate', label: 'Within 3 months', description: 'Ready to start soon' },
      { value: 'short', label: '3-6 months', description: 'Planning phase' },
      { value: 'medium', label: '6-12 months', description: 'Research and preparation' },
      { value: 'long', label: '1+ years', description: 'Long-term planning' }
    ]
  },
  {
    id: 'goals',
    title: 'Your sustainability goals',
    question: 'What are your main goals for renewable energy?',
    description: 'Select all that apply to personalize your recommendations.',
    inputType: 'multiSelect',
    required: true,
    icon: CheckCircle,
    options: [
      { value: 'cost_savings', label: 'Reduce Energy Costs', description: 'Lower monthly energy bills' },
      { value: 'environmental', label: 'Environmental Impact', description: 'Reduce carbon footprint' },
      { value: 'independence', label: 'Energy Independence', description: 'Less reliance on grid power' },
      { value: 'property_value', label: 'Increase Property Value', description: 'Improve home value' },
      { value: 'reliability', label: 'Power Reliability', description: 'Backup power during outages' }
    ]
  }
];

// Helper function to count filled answers for progress calculation
const countFilledAnswers = (answers: Answers, questions: Question[]): number => {
  let count = 0;
  
  questions.forEach((question) => {
    const answer = answers[question.id];
    
    if (!answer) return;
    
    switch (question.inputType) {
      case 'location':
        const locationAnswer = answer as any;
        if (locationAnswer && Object.values(locationAnswer).some(value => 
          typeof value === 'string' && value.trim() !== ''
        )) {
          count++;
        }
        break;
        
      case 'multiSelect':
        const multiSelectAnswer = answer as string[];
        if (multiSelectAnswer && multiSelectAnswer.length > 0) {
          count++;
        }
        break;
        
      case 'radio':
        if (typeof answer === 'string' && answer.trim() !== '') {
          count++;
        }
        break;
        
      case 'range':
        if (typeof answer === 'number') {
          count++;
        }
        break;
        
      case 'text':
      default:
        if (typeof answer === 'string' && answer.trim() !== '') {
          count++;
        }
        break;
    }
  });
  
  return count;
};

export default function PersonalOnboarding() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser: User = JSON.parse(userData);
    // If already onboarded, send to main dashboard
    if (parsedUser.onboardingCompleted) {
      router.replace('/dashboard/personal/main');
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const updateAnswer = (questionId: string, value: AnswerValue): void => {
    setAnswers((prev: Answers) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Calculate dynamic progress based on filled answers
  const filledAnswersCount = countFilledAnswers(answers, onboardingQuestions);
  const totalQuestions = onboardingQuestions.length;

  const nextStep = (): void => {
    const currentQuestion = onboardingQuestions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (currentQuestion.required && !currentAnswer) {
      alert('Please answer this question before continuing.');
      return;
    }
    
    if (currentQuestion.inputType === 'multiSelect' && Array.isArray(currentAnswer) && currentAnswer.length === 0) {
      alert('Please select at least one option.');
      return;
    }

    setDirection(1);
    if (currentStep < onboardingQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ COMPLETE ONBOARDING FUNCTION - This submits data to API
  const completeOnboarding = async (): Promise<void> => {
  const token = localStorage.getItem('token');
  
  console.log('🔍 Token exists:', !!token);
  console.log('🔍 Token value:', token); // Remove in production!
  
  if (!token) {
    alert('No authentication token found. Please login again.');
    router.push('/login');
    return;
  }
  
  try {
    const payload = {
      userId: user?.id,
      onboardingData: answers
    };

    const response = await fetch('/api/user/onboarding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    // ✅ Check if response is ok before parsing
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ✅ Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON');
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      // ✅ Get raw response text for debugging
      const responseText = await response.text();
      console.error('❌ Raw response:', responseText);
      alert('Server returned invalid response. Check console for details.');
      setIsCompleted(false);
      return;
    }

    if (result.success) {
      console.log('✅ Success:', result);
      // ✅ Persist onboarding completion locally so guards don't bounce back
      try {
        const storedUserRaw = localStorage.getItem('user');
        const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
        const updatedUser = result.user
          ? { ...storedUser, ...result.user, onboardingCompleted: true }
          : { ...storedUser, onboardingCompleted: true };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (e) {
        console.warn('Could not update local user after onboarding:', e);
      }

      setTimeout(() => {
        router.push('/dashboard/personal/main');
      }, 500);
    } else {
      alert(`Failed to save: ${result.error || 'Unknown error'}`);
      setIsCompleted(false);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    if (error instanceof Error) {
      alert(`Network error: ${error.message}`);
    } else {
      alert('Network error occurred.');
    }
    setIsCompleted(false);
  }
};

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div>Loading...</div>;

  if (isCompleted) {
    return <CompletionScreen user={user} />;
  }

  const currentQuestion = onboardingQuestions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Header user={user} onLogout={handleLogout} />
      
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalQuestions}
        filledCount={filledAnswersCount}
      />

      <div className="max-w-2xl mx-auto px-4 pb-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8"
          >
            <QuestionContent question={currentQuestion} />

            <div className="mb-8">
              <QuestionInput 
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={(value: AnswerValue) => updateAnswer(currentQuestion.id, value)}
              />
            </div>

            <NavigationButtons
              currentStep={currentStep}
              totalSteps={onboardingQuestions.length}
              onPrevious={prevStep}
              onNext={nextStep}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
