export const queryKeys = {
  cursos: {
    index: () => ["cursos"] as const,
    detail: (slug: string) => ["cursos", slug] as const,
  },
  evaluations: (slug: string, classId: string) =>
    ["evaluations", slug, classId] as const,
  subjects: {
    detail: (slug: string, id: string) => ["subjects", slug, id] as const,
  },
  topics: {
    detail: (slug: string, sid: string, tid: string) =>
      ["topics", slug, sid, tid] as const,
  },
  exams: (slug: string, sid: string, tid: string) =>
    ["exams", slug, sid, tid] as const,
  slides: (slug: string, sid: string, tid: string) =>
    ["slides", slug, sid, tid] as const,
};
