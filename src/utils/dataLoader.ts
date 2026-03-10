import type {
  CursosIndex,
  CursoDetail,
  Evaluation,
  EvaluationsFile,
  SubjectDetail,
  TopicData,
  ExamData,
  SlidesData,
  ReviewExamsIndex,
  ReviewExamData,
} from "../types/data";

const DATA_BASE = "/data";

export async function loadCursosIndex(): Promise<CursosIndex> {
  const res = await fetch(`${DATA_BASE}/cursos.json`);
  if (!res.ok) throw new Error("Failed to load cursos index");
  return res.json() as Promise<CursosIndex>;
}

export async function loadCursoDetail(cursoSlug: string): Promise<CursoDetail> {
  const res = await fetch(`${DATA_BASE}/${cursoSlug}/curso.json`);
  if (!res.ok) throw new Error(`Failed to load curso: ${cursoSlug}`);
  return res.json() as Promise<CursoDetail>;
}

export async function loadEvaluations(
  cursoSlug: string,
  classId: string,
): Promise<Evaluation[]> {
  const res = await fetch(`${DATA_BASE}/${cursoSlug}/evaluations.json`);
  if (!res.ok) return [];
  const file = (await res.json()) as EvaluationsFile;
  return file.evaluations.map((entry) => ({
    name: entry.name,
    note: entry.note,
    exams: entry.exams[classId] ?? [],
    content: entry.content,
  }));
}

export async function loadSubjectDetail(
  cursoSlug: string,
  subjectId: string,
): Promise<SubjectDetail> {
  const res = await fetch(
    `${DATA_BASE}/${cursoSlug}/${subjectId}/subject.json`,
  );
  if (!res.ok)
    throw new Error(`Failed to load subject: ${cursoSlug}/${subjectId}`);
  return res.json() as Promise<SubjectDetail>;
}

export async function loadTopicData(
  cursoSlug: string,
  subjectId: string,
  topicId: string,
): Promise<TopicData> {
  const res = await fetch(
    `${DATA_BASE}/${cursoSlug}/${subjectId}/${topicId}/topic.json`,
  );
  if (!res.ok)
    throw new Error(
      `Failed to load topic: ${cursoSlug}/${subjectId}/${topicId}`,
    );
  return res.json() as Promise<TopicData>;
}

export async function loadExamData(
  cursoSlug: string,
  subjectId: string,
  topicId: string,
): Promise<ExamData> {
  const res = await fetch(
    `${DATA_BASE}/${cursoSlug}/${subjectId}/${topicId}/exam.json`,
  );
  if (!res.ok)
    throw new Error(
      `Failed to load exam: ${cursoSlug}/${subjectId}/${topicId}`,
    );
  return res.json() as Promise<ExamData>;
}

export async function loadSlidesData(
  cursoSlug: string,
  subjectId: string,
  topicId: string,
): Promise<SlidesData> {
  const res = await fetch(
    `${DATA_BASE}/${cursoSlug}/${subjectId}/${topicId}/slides.json`,
  );
  if (!res.ok)
    throw new Error(
      `Failed to load slides: ${cursoSlug}/${subjectId}/${topicId}`,
    );
  return res.json() as Promise<SlidesData>;
}

export async function loadReviewExamsIndex(
  cursoSlug: string,
): Promise<ReviewExamsIndex> {
  const res = await fetch(`${DATA_BASE}/${cursoSlug}/review-exams/index.json`);
  if (!res.ok) throw new Error("Failed to load review exams index");
  return res.json() as Promise<ReviewExamsIndex>;
}

export async function loadReviewExamData(
  cursoSlug: string,
  evaluationId: string,
  examId: string,
): Promise<ReviewExamData> {
  const res = await fetch(
    `${DATA_BASE}/${cursoSlug}/review-exams/${evaluationId}/${examId}.json`,
  );
  if (!res.ok)
    throw new Error(`Failed to load review exam: ${evaluationId}/${examId}`);
  return res.json() as Promise<ReviewExamData>;
}
