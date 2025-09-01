import { Question, AnswerValue } from '../types';
import LocationInput from './LocationInput';
import RadioInput from './RadioInput';
import MultiSelectInput from './MultiSelectInput';
import RangeInput from './RangeInput';
import TextInput from './TextInput';

interface QuestionInputProps {
  question: Question;
  value?: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export default function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  switch (question.inputType) {
    case 'location':
      return <LocationInput question={question} value={value} onChange={onChange} />;
    case 'radio':
      return <RadioInput question={question} value={value} onChange={onChange} />;
    case 'multiSelect':
      return <MultiSelectInput question={question} value={value} onChange={onChange} />;
    case 'range':
      return <RangeInput question={question} value={value} onChange={onChange} />;
    default:
      return <TextInput question={question} value={value} onChange={onChange} />;
  }
}
