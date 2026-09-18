export type PageId =
  | 'home'
  | 'auth'
  | 'assessment'
  | 'assessment-result'
  | 'dashboard'
  | 'chat'
  | 'journal'
  | 'voice-meditation'
  | 'meditation';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  age?: string;
  email: string;
  profession?: string;
  wellnessScore?: number;
}

export interface JournalAnalysis {
  sentiment: string;
  title: string;
  comfortText: string;
  microSteps: string[];
  affirmation: string;
}

export type DiaryMood = 'happy' | 'anxiety' | 'sad' | 'cry';

export type FallingEffect = 'none' | 'rain' | 'leaves';

export interface DiaryEntry {
  id: string;
  date: string;
  timestamp: number;
  mood: DiaryMood;
  content: string;
  photoUrl?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  aiAnalysis?: JournalAnalysis;
}

export interface DailyExercise {
  id: string;
  title: string;
  desc: string;
  steps: string[];
}
