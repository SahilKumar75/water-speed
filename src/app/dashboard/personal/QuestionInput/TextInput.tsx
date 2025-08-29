import { Question, AnswerValue } from '../types';

interface TextInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function TextInput({ question, value, onChange }: TextInputProps) {
  return (
    <input
      type="text"
      value={(value as string) || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 transition-all"
      placeholder="Enter your answer"
    />
  );
}
