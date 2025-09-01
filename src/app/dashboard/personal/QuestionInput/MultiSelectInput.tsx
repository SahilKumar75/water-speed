import { Question, AnswerValue, QuestionOption } from '../types';

interface MultiSelectInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function MultiSelectInput({ question, value, onChange }: MultiSelectInputProps) {
  const handleMultiSelectChange = (optionValue: string, checked: boolean): void => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter((v: string) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option: QuestionOption) => {
        const isSelected = Array.isArray(value) && value.includes(option.value);
        return (
          <label
            key={option.value}
            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? 'border-green-400 bg-green-400/10'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => handleMultiSelectChange(option.value, e.target.checked)}
                className="w-4 h-4 text-green-400 bg-transparent border-white/40 focus:ring-green-400/50 rounded"
              />
              <div>
                <div className="text-white font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-white/60 text-sm">{option.description}</div>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
