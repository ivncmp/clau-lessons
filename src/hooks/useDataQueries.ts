import { useQuery } from "@tanstack/react-query";
import {
  loadCursosIndex,
  loadCursoDetail,
  loadEvaluations,
  loadSubjectDetail,
  loadTopicData,
  loadExamData,
  loadSlidesData,
} from "@/utils/dataLoader";
import { queryKeys } from "./queryKeys";

export function useCursosIndex() {
  return useQuery({
    queryKey: queryKeys.cursos.index(),
    queryFn: loadCursosIndex,
  });
}

export function useCursoDetail(cursoSlug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.cursos.detail(cursoSlug!),
    queryFn: () => loadCursoDetail(cursoSlug!),
    enabled: !!cursoSlug,
  });
}

export function useEvaluations(
  cursoSlug: string | undefined,
  classId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.evaluations(cursoSlug!, classId!),
    queryFn: () => loadEvaluations(cursoSlug!, classId!),
    enabled: !!cursoSlug && !!classId,
  });
}

export function useSubjectDetail(
  cursoSlug: string | undefined,
  subjectId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.subjects.detail(cursoSlug!, subjectId!),
    queryFn: () => loadSubjectDetail(cursoSlug!, subjectId!),
    enabled: !!cursoSlug && !!subjectId,
  });
}

export function useTopicData(
  cursoSlug: string | undefined,
  subjectId: string | undefined,
  topicId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.topics.detail(cursoSlug!, subjectId!, topicId!),
    queryFn: () => loadTopicData(cursoSlug!, subjectId!, topicId!),
    enabled: !!cursoSlug && !!subjectId && !!topicId,
  });
}

export function useExamData(
  cursoSlug: string | undefined,
  subjectId: string | undefined,
  topicId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.exams(cursoSlug!, subjectId!, topicId!),
    queryFn: () => loadExamData(cursoSlug!, subjectId!, topicId!),
    enabled: !!cursoSlug && !!subjectId && !!topicId,
  });
}

export function useSlidesData(
  cursoSlug: string | undefined,
  subjectId: string | undefined,
  topicId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.slides(cursoSlug!, subjectId!, topicId!),
    queryFn: () => loadSlidesData(cursoSlug!, subjectId!, topicId!),
    enabled: !!cursoSlug && !!subjectId && !!topicId,
  });
}
