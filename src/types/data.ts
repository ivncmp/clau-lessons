// ─── Curso Index ───────────────────────────────────────────────

export interface CursosIndex {
  cursos: CursoSummary[];
}

export interface CursoSummary {
  id: string;
  name: string;
}

// ─── Curso Detail ──────────────────────────────────────────────

export interface CursoDetail {
  id: string;
  name: string;
  subjects: SubjectSummary[];
}

export interface SubjectSummary {
  id: string;
  name: string;
  icon: string;
  color: string;
  lang: "es" | "en";
  topicCount: number;
}

// ─── Subject Detail (per curso) ────────────────────────────────

export interface SubjectDetail {
  id: string;
  name: string;
  icon: string;
  color: string;
  lang: "es" | "en";
  topics: TopicSummary[];
}

export interface TopicSummary {
  id: string;
  title: string;
  description: string;
  icon: string;
  questionCount: number;
}

// ─── Topic ─────────────────────────────────────────────────────

export interface TopicData {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  icon: string;
  texts: Record<string, ReadingText>;
  images?: Record<string, string>;
}

export interface ReadingText {
  title: string;
  html: string;
}

// ─── Slides ─────────────────────────────────────────────────────

export interface SlidesData {
  topicId: string;
  subjectId: string;
  slides: Slide[];
}

interface SlideBase {
  id: string;
  emoji: string;
  title: string;
}

export interface ConceptSlide extends SlideBase {
  type: "concept";
  content: string;
  tip?: string;
}

export interface StorySlide extends SlideBase {
  type: "story";
  html: string;
}

export interface ExampleSlide extends SlideBase {
  type: "example";
  problem: string;
  steps: string[];
  answer: string;
}

export interface SummarySlide extends SlideBase {
  type: "summary";
  points: string[];
}

export type Slide = ConceptSlide | StorySlide | ExampleSlide | SummarySlide;

// ─── Exam ──────────────────────────────────────────────────────

export interface ExamData {
  topicId: string;
  subjectId: string;
  questions: Question[];
}

// ─── Question Types ────────────────────────────────────────────

interface QuestionBase {
  id: string;
  emoji: string;
  question: string;
  refText?: string;
  image?: string;
  explanation?: string;
}

export interface ChoiceQuestion extends QuestionBase {
  type: "choice";
  options: string[];
  answer: number;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: "true-false";
  answer: boolean;
}

export interface MatchingQuestion extends QuestionBase {
  type: "matching";
  pairs: MatchPair[];
  rightOptions?: string[];
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface WordBankClassifyQuestion extends QuestionBase {
  type: "word-bank-classify";
  words: string[];
  slots: ClassifySlot[];
}

export interface ClassifySlot {
  label: string;
  accepts: string[];
}

export interface WordBankFillQuestion extends QuestionBase {
  type: "word-bank-fill";
  sentence: string;
  blanks: string[];
  wordBank: string[];
}

export interface WordBankOrderQuestion extends QuestionBase {
  type: "word-bank-order";
  words: string[];
  answer: string;
}

export type Question =
  | ChoiceQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | WordBankClassifyQuestion
  | WordBankFillQuestion
  | WordBankOrderQuestion;
