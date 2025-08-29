import { Question } from './types';

interface QuestionContentProps {
  question: Question;
}

export default function QuestionContent({ question }: QuestionContentProps) {
  const IconComponent = question.icon;

  return (
    <>
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-cyan-500 p-3 rounded-xl">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-green-400 text-sm font-medium">{question.title}</p>
          <h2 className="text-2xl font-bold text-white">{question.question}</h2>
        </div>
      </div>
      <p className="text-white/70 mb-8 leading-relaxed">{question.description}</p>
    </>
  );
}
