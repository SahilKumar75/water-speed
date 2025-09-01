export interface User {
  id: string;
  name: string;
  email: string;
  userType: 'personal' | 'organization';
  onboardingCompleted?: boolean;
}

export interface QuestionOption {
  value: string;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  title: string;
  question: string;
  description: string;
  inputType: 'location' | 'multiSelect' | 'radio' | 'range' | 'text';
  required: boolean;
  icon: any;
  fields?: string[];
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  ranges?: Array<{ min: number; max: number; label: string }>;
}

export interface LocationAnswer {
  country?: string;
  city?: string;
  zipCode?: string;
  [key: string]: string | undefined;
}

export type AnswerValue = string | string[] | number | LocationAnswer;
export type Answers = Record<string, AnswerValue>;
