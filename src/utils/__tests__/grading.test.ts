import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect } from "vitest";
import type { ExamData, Question } from "../../types/data";
import { isCorrect, gradeExam } from "../grading";
import { buildCorrectAnswer } from "../answerBuilder";

// ─── Discover all exam.json files dynamically ─────────────────

const DATA_DIR = join(__dirname, "../../../public/data");

function findExamFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findExamFiles(full));
    } else if (entry.name === "exam.json") {
      files.push(full);
    }
  }
  return files;
}

function loadExam(path: string): ExamData {
  return JSON.parse(readFileSync(path, "utf-8"));
}

function prettyPath(path: string): string {
  return path.replace(DATA_DIR + "/", "").replace("/exam.json", "");
}

// ─── Tests ────────────────────────────────────────────────────

const examFiles = findExamFiles(DATA_DIR);

describe("All exams grade 100% with correct answers", () => {
  for (const file of examFiles) {
    const label = prettyPath(file);
    const exam = loadExam(file);

    describe(label, () => {
      it.each(exam.questions.map((q) => [q.id, q]))(
        "%s — correct answer is graded as correct",
        (_id: string, question: Question) => {
          const answer = buildCorrectAnswer(question);
          expect(isCorrect(question, answer)).toBe(true);
        },
      );

      it("gradeExam returns 100%", () => {
        const answers: Record<
          string,
          ReturnType<typeof buildCorrectAnswer>
        > = {};
        for (const q of exam.questions) {
          answers[q.id] = buildCorrectAnswer(q);
        }
        expect(gradeExam(exam.questions, answers)).toBe(exam.questions.length);
      });
    });
  }
});

// ─── Sanity: wrong answers should NOT pass ────────────────────

describe("Wrong answers are graded as incorrect", () => {
  const sampleExam = loadExam(examFiles[0]);

  for (const q of sampleExam.questions.slice(0, 5)) {
    it(`${q.id} — wrong answer is graded as incorrect`, () => {
      const wrongAnswer = buildWrongAnswer(q);
      if (wrongAnswer) {
        expect(isCorrect(q, wrongAnswer)).toBe(false);
      }
    });
  }
});

function buildWrongAnswer(
  question: Question,
): ReturnType<typeof buildCorrectAnswer> | null {
  switch (question.type) {
    case "choice": {
      const wrong = question.answer === 0 ? 1 : 0;
      return { type: "choice", selected: wrong };
    }
    case "true-false":
      return { type: "true-false", selected: !question.answer };
    case "word-bank-order":
      return { type: "word-bank-order", arranged: "wrong answer" };
    case "math-operation":
      return { type: "math-operation", value: question.answer + 1 };
    default:
      return null;
  }
}
