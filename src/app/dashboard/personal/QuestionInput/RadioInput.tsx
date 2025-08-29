import { Question, AnswerValue, QuestionOption } from '../types';

interface RadioInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function RadioInput({ question, value, onChange }: RadioInputProps) {
  return (
    <div className="space-y-3">
      {question.options?.map((option: QuestionOption) => (
        <label
          key={option.value}
          className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
            value === option.value
              ? 'border-green-400 bg-green-400/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-green-400 bg-transparent border-white/40 focus:ring-green-400/50"
            />
            <div>
              <div className="text-white font-medium">{option.label}</div>
              {option.description && (
                <div className="text-white/60 text-sm">{option.description}</div>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
