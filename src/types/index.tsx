export interface Question {
  id: string;
  type: 'short_text' | 'long_text' | 'multiple_choice' | 'date_time';
  question: string;
  options?: string[];
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export interface AnamnesisFormType {
  id: number,
  title: string;
  description: string;
  createdAt: string;
  sections: Section[],
  actions?: string;
}