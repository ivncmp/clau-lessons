import type { Question } from "../types/data";
import type { UserAnswer } from "../types/storage";

/**
 * Build a correct UserAnswer for a question, simulating
 * how each question component constructs the answer object.
 */
export function buildCorrectAnswer(question: Question): UserAnswer {
  switch (question.type) {
    case "choice":
      return { type: "choice", selected: question.answer };

    case "true-false":
      return { type: "true-false", selected: question.answer };

    case "matching": {
      const selections: Record<number, string> = {};
      question.pairs.forEach((pair, i) => {
        selections[i] = pair.right;
      });
      return { type: "matching", selections };
    }

    case "word-bank-classify": {
      const placements: Record<number, string[]> = {};
      question.slots.forEach((slot, i) => {
        placements[i] = [...slot.accepts];
      });
      return { type: "word-bank-classify", placements };
    }

    case "word-bank-fill":
      return { type: "word-bank-fill", words: [...question.blanks] };

    case "word-bank-order": {
      // Simulate clicking words one by one, like the component does
      const sep = question.separator ?? " ";
      const answerWords = sep
        ? question.answer.split(sep)
        : splitBySyllables(question.answer, question.words);
      let arranged = "";
      for (const word of answerWords) {
        arranged = arranged ? arranged + sep + word : word;
      }
      return { type: "word-bank-order", arranged };
    }

    case "math-operation":
      return { type: "math-operation", value: question.answer };

    case "number-series":
      return { type: "number-series", values: [...question.answers] };

    case "word-selection":
      return {
        type: "word-selection",
        selected: question.answers.map((a) => [...a]),
      };
  }
}

/**
 * Split a concatenated string back into syllables using greedy matching
 * (mirrors the component's splitIntoPieces logic for separator="").
 */
function splitBySyllables(text: string, words: string[]): string[] {
  const pieces: string[] = [];
  let remaining = text;
  const sorted = [...words].sort((a, b) => b.length - a.length);
  while (remaining.length > 0) {
    const match = sorted.find((w) => remaining.startsWith(w));
    if (!match) break;
    pieces.push(match);
    remaining = remaining.slice(match.length);
  }
  return pieces;
}
