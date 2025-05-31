export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface InterviewDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficultyLevels: DifficultyLevel[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  text: string;
  domain: string;
  difficulty: string;
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  feedback: Feedback;
  timestamp: string;
}

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  domainId: string;
  difficultyId: string;
  status: 'in-progress' | 'completed';
  startTime: string;
  endTime?: string;
  questions: Question[];
  answers: Answer[];
  totalScore?: number;
  summary?: {
    strengths: string[];
    improvements: string[];
    overallFeedback: string;
  };
}

export interface Interview {
  id: string;
  session: InterviewSession;
  domain: string;
  difficulty: string;
  date: string;
  score: number;
}

export interface AIResponse {
  question: Question;
  feedback?: Feedback;
}

export interface UserStats {
  totalInterviews: number;
  averageScore: number;
  domainPerformance: {
    domain: string;
    averageScore: number;
    interviewCount: number;
  }[];
  recentImprovement: number;
}