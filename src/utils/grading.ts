import type { Question } from "../types/data";
import type { UserAnswer } from "../types/storage";

/** Check if a user's answer to a question is correct. */
export function isCorrect(question: Question, answer: UserAnswer): boolean {
  switch (question.type) {
    case "choice":
      return answer.type === "choice" && answer.selected === question.answer;

    case "true-false":
      return (
        answer.type === "true-false" && answer.selected === question.answer
      );

    case "matching":
      if (answer.type !== "matching") return false;
      return question.pairs.every(
        (pair, i) => answer.selections[i] === pair.right,
      );

    case "word-bank-classify":
      if (answer.type !== "word-bank-classify") return false;
      return question.slots.every((slot, i) => {
        const placed = answer.placements[i] ?? [];
        return (
          slot.accepts.length === placed.length &&
          slot.accepts.every((w) => placed.includes(w))
        );
      });

    case "word-bank-fill":
      if (answer.type !== "word-bank-fill") return false;
      return question.blanks.every(
        (expected, i) =>
          answer.words[i]?.toLowerCase() === expected.toLowerCase(),
      );

    case "word-bank-order":
      return (
        answer.type === "word-bank-order" && answer.arranged === question.answer
      );
  }
}

/** Grade a full exam. Returns the count of correct answers. */
export function gradeExam(
  questions: Question[],
  answers: Record<string, UserAnswer>,
): number {
  return questions.filter((q) => {
    const answer = answers[q.id];
    return answer ? isCorrect(q, answer) : false;
  }).length;
}
