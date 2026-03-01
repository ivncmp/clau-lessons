// ─── App Store ─────────────────────────────────────────────────

export interface AppStore {
  version: 1;
  activeUserId: string | null;
  users: Record<string, UserData>;
}

export interface UserData {
  profile: UserProfile;
  progress: UserProgress;
}

// ─── User Profile ──────────────────────────────────────────────

export interface UserProfile {
  id: string;
  nombre: string;
  curso: string;
  createdAt: string;
  lastLoginAt: string;
}

// ─── Progress ──────────────────────────────────────────────────

export interface UserProgress {
  subjects: Record<string, SubjectProgress>;
}

export interface SubjectProgress {
  lastAccessedAt: string;
  topics: Record<string, TopicProgress>;
}

export interface TopicProgress {
  viewed: boolean;
  examAttempts: ExamAttempt[];
  lastAccessedAt: string;
}

export interface ExamAttempt {
  id: string;
  completedAt: string;
  score: number;
  total: number;
  answers: Record<string, UserAnswer>;
  durationSeconds: number;
}

// ─── User Answers ──────────────────────────────────────────────

export type UserAnswer =
  | { type: "choice"; selected: number }
  | { type: "true-false"; selected: boolean }
  | { type: "matching"; selections: Record<number, string> }
  | { type: "word-bank-classify"; placements: Record<number, string[]> }
  | { type: "word-bank-fill"; words: (string | null)[] }
  | { type: "word-bank-order"; arranged: string };

// ─── Export/Import ─────────────────────────────────────────────

export interface ExportedData {
  version: 1;
  exportedAt: string;
  app: "clau-lessons";
  user: UserData;
}
