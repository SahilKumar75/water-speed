import { Question, AnswerValue } from '../types';

interface RangeInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function RangeInput({ question, value, onChange }: RangeInputProps) {
  const currentValue = (value as number) || question.min || 0;
  const currentRange = question.ranges?.find((r: { min: number; max: number; label: string }) => 
    currentValue >= r.min && currentValue <= r.max
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-2">
          {currentValue} {question.unit}
        </div>
        {currentRange && (
          <div className="text-green-400 text-sm">{currentRange.label}</div>
        )}
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={question.min}
          max={question.max}
          step={question.step}
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none slider cursor-pointer"
        />
        <div className="flex justify-between text-white/60 text-xs mt-2">
          <span>{question.min} {question.unit}</span>
          <span>{question.max} {question.unit}</span>
        </div>
      </div>
    </div>
  );
}
