import { useReducer, useCallback } from "react";
import type { Question } from "../../../types/data";
import type { UserAnswer } from "../../../types/storage";

import { isCorrect } from "../../../utils/grading";

// ─── State ─────────────────────────────────────────────────────

interface ExamState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
  status: "in-progress" | "finished";
  startedAt: number;
  score: number;
}

// ─── Actions ───────────────────────────────────────────────────

type ExamAction =
  | { type: "ANSWER"; questionId: string; answer: UserAnswer }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GO_TO"; index: number }
  | { type: "FINISH" };

// ─── Reducer ───────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer,
        },
      };

    case "NEXT":
      return {
        ...state,
        currentIndex: Math.min(
          state.currentIndex + 1,
          state.questions.length - 1,
        ),
      };

    case "PREV":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
      };

    case "GO_TO":
      return {
        ...state,
        currentIndex: Math.max(
          0,
          Math.min(action.index, state.questions.length - 1),
        ),
      };

    case "FINISH": {
      const score = state.questions.filter((q) => {
        const answer = state.answers[q.id];
        return answer ? isCorrect(q, answer) : false;
      }).length;

      return {
        ...state,
        status: "finished",
        score,
      };
    }
  }
}

// ─── Hook ──────────────────────────────────────────────────────

export interface ExamInitialState {
  answers?: Record<string, UserAnswer>;
  currentIndex?: number;
  startedAt?: number;
}

export function useExam(questions: Question[], initial?: ExamInitialState) {
  const [state, dispatch] = useReducer(examReducer, {
    questions,
    currentIndex: initial?.currentIndex ?? 0,
    answers: initial?.answers ?? {},
    status: "in-progress",
    startedAt: initial?.startedAt ?? Date.now(),
    score: 0,
  });

  const currentQuestion = state.questions[state.currentIndex];
  const totalQuestions = state.questions.length;
  const answeredCount = Object.keys(state.answers).length;
  const allAnswered = answeredCount === totalQuestions;
  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === totalQuestions - 1;
  const durationSeconds = Math.round((Date.now() - state.startedAt) / 1000);

  const setAnswer = useCallback((questionId: string, answer: UserAnswer) => {
    dispatch({ type: "ANSWER", questionId, answer });
  }, []);

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);
  const goTo = useCallback(
    (index: number) => dispatch({ type: "GO_TO", index }),
    [],
  );
  const finish = useCallback(() => dispatch({ type: "FINISH" }), []);

  return {
    ...state,
    currentQuestion,
    totalQuestions,
    answeredCount,
    allAnswered,
    isFirst,
    isLast,
    durationSeconds,
    setAnswer,
    next,
    prev,
    goTo,
    finish,
  };
}
