import type {
  AppStore,
  UserData,
  UserProfile,
  UserProgress,
  ExamAttempt,
  ExportedData,
  MentalMathStats,
} from "../types/storage";

const STORE_KEY = "clau_lessons_store";
const LEGACY_KEY = "clau_lessons_profile";

// ─── Store Management ──────────────────────────────────────────

function createEmptyStore(): AppStore {
  return { version: 1, activeUserId: null, users: {} };
}

export function getStore(): AppStore {
  migrateV0ToV1();
  migrateSpanishFields();
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return createEmptyStore();
  try {
    return JSON.parse(raw) as AppStore;
  } catch {
    return createEmptyStore();
  }
}

export function saveStore(store: AppStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// ─── User Management ───────────────────────────────────────────

function generateUserId(nombre: string): string {
  const slug = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

export function createUser(
  name: string,
  course: string,
  classId: string,
  avatar?: string,
): UserProfile {
  const store = getStore();
  const id = generateUserId(name);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    id,
    name: name.trim(),
    avatar,
    course,
    classId,
    createdAt: now,
    lastLoginAt: now,
  };

  store.users[id] = {
    profile,
    progress: { subjects: {} },
  };
  store.activeUserId = id;
  saveStore(store);
  return profile;
}

export function getAllUsers(): UserProfile[] {
  const store = getStore();
  return Object.values(store.users).map((u) => u.profile);
}

export function getActiveUser(): UserData | null {
  const store = getStore();
  if (!store.activeUserId) return null;
  return store.users[store.activeUserId] ?? null;
}

export function setActiveUser(userId: string): void {
  const store = getStore();
  if (!store.users[userId]) return;
  store.activeUserId = userId;
  store.users[userId].profile.lastLoginAt = new Date().toISOString();
  saveStore(store);
}

export function deleteUser(userId: string): void {
  const store = getStore();
  delete store.users[userId];
  if (store.activeUserId === userId) {
    store.activeUserId = null;
  }
  saveStore(store);
}

export function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, "name" | "avatar" | "classId">>,
): UserProfile | null {
  const store = getStore();
  const user = store.users[userId];
  if (!user) return null;
  if (updates.name !== undefined) user.profile.name = updates.name.trim();
  if (updates.avatar !== undefined) user.profile.avatar = updates.avatar;
  if (updates.classId !== undefined) user.profile.classId = updates.classId;
  saveStore(store);
  return user.profile;
}

export function logout(): void {
  const store = getStore();
  store.activeUserId = null;
  saveStore(store);
}

// ─── Progress ──────────────────────────────────────────────────

export function getProgress(userId: string): UserProgress {
  const store = getStore();
  return store.users[userId]?.progress ?? { subjects: {} };
}

export function recordExamAttempt(
  userId: string,
  subjectId: string,
  topicId: string,
  attempt: ExamAttempt,
): void {
  const store = getStore();
  const user = store.users[userId];
  if (!user) return;

  const now = new Date().toISOString();

  if (!user.progress.subjects[subjectId]) {
    user.progress.subjects[subjectId] = {
      lastAccessedAt: now,
      topics: {},
    };
  }

  const subject = user.progress.subjects[subjectId];
  subject.lastAccessedAt = now;

  if (!subject.topics[topicId]) {
    subject.topics[topicId] = {
      viewed: true,
      examAttempts: [],
      lastAccessedAt: now,
    };
  }

  const topic = subject.topics[topicId];
  topic.lastAccessedAt = now;
  topic.examAttempts.push(attempt);

  saveStore(store);
}

export function markTopicViewed(
  userId: string,
  subjectId: string,
  topicId: string,
): void {
  const store = getStore();
  const user = store.users[userId];
  if (!user) return;

  const now = new Date().toISOString();

  if (!user.progress.subjects[subjectId]) {
    user.progress.subjects[subjectId] = {
      lastAccessedAt: now,
      topics: {},
    };
  }

  const subject = user.progress.subjects[subjectId];

  if (!subject.topics[topicId]) {
    subject.topics[topicId] = {
      viewed: true,
      examAttempts: [],
      lastAccessedAt: now,
    };
  } else {
    subject.topics[topicId].viewed = true;
    subject.topics[topicId].lastAccessedAt = now;
  }

  saveStore(store);
}

export function getBestScore(
  userId: string,
  subjectId: string,
  topicId: string,
): number | null {
  const progress = getProgress(userId);
  const attempts =
    progress.subjects[subjectId]?.topics[topicId]?.examAttempts ?? [];
  if (attempts.length === 0) return null;
  return Math.max(...attempts.map((a) => a.score / a.total));
}

// ─── Mental Math Stats ────────────────────────────────────────

export function getMentalMathStats(userId: string): MentalMathStats {
  const progress = getProgress(userId);
  return (
    progress.mentalMath ?? { rounds: 0, totalCorrect: 0, totalAttempted: 0 }
  );
}

export function recordMentalMathRound(
  userId: string,
  correct: number,
  total: number,
): void {
  const store = getStore();
  const user = store.users[userId];
  if (!user) return;
  if (!user.progress.mentalMath) {
    user.progress.mentalMath = {
      rounds: 0,
      totalCorrect: 0,
      totalAttempted: 0,
    };
  }
  user.progress.mentalMath.rounds++;
  user.progress.mentalMath.totalCorrect += correct;
  user.progress.mentalMath.totalAttempted += total;
  saveStore(store);
}

// ─── In-Progress Exam ─────────────────────────────────────────

interface InProgressExam {
  answers: Record<string, import("../types/storage").UserAnswer>;
  currentIndex: number;
  startedAt: number;
}

function examProgressKey(
  userId: string,
  subjectId: string,
  topicId: string,
): string {
  return `clau_exam_${userId}_${subjectId}_${topicId}`;
}

/** Returns total number of in-progress exams for a user. */
export function getAllInProgressExamsCount(userId: string): number {
  return getAllInProgressExams(userId).length;
}

export interface InProgressExamInfo {
  subjectId: string;
  topicId: string;
  answeredCount: number;
  startedAt: number;
}

/** Returns all in-progress exams for a user with their subject/topic IDs. */
export function getAllInProgressExams(userId: string): InProgressExamInfo[] {
  const prefix = `clau_exam_${userId}_`;
  const results: InProgressExamInfo[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(prefix)) continue;
    // key format: clau_exam_{userId}_{subjectId}_{topicId}
    const rest = key.slice(prefix.length);
    const sepIdx = rest.indexOf("_");
    if (sepIdx === -1) continue;
    const subjectId = rest.slice(0, sepIdx);
    const topicId = rest.slice(sepIdx + 1);
    try {
      const data = JSON.parse(localStorage.getItem(key)!) as InProgressExam;
      results.push({
        subjectId,
        topicId,
        answeredCount: Object.keys(data.answers).length,
        startedAt: data.startedAt,
      });
    } catch {
      // skip corrupted entries
    }
  }
  return results;
}

/** Returns count of answered questions for an in-progress exam, or null if none. */
export function getInProgressCount(
  userId: string,
  subjectId: string,
  topicId: string,
): number | null {
  const data = getInProgressExam(userId, subjectId, topicId);
  if (!data) return null;
  return Object.keys(data.answers).length;
}

export function getInProgressExam(
  userId: string,
  subjectId: string,
  topicId: string,
): InProgressExam | null {
  const raw = localStorage.getItem(examProgressKey(userId, subjectId, topicId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InProgressExam;
  } catch {
    return null;
  }
}

export function saveInProgressExam(
  userId: string,
  subjectId: string,
  topicId: string,
  data: InProgressExam,
): void {
  localStorage.setItem(
    examProgressKey(userId, subjectId, topicId),
    JSON.stringify(data),
  );
}

export function clearInProgressExam(
  userId: string,
  subjectId: string,
  topicId: string,
): void {
  localStorage.removeItem(examProgressKey(userId, subjectId, topicId));
}

// ─── Export / Import ───────────────────────────────────────────

export function exportUserData(userId: string): string {
  const store = getStore();
  const user = store.users[userId];
  if (!user) throw new Error("User not found");

  const data: ExportedData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    app: "clau-lessons",
    user,
  };
  return JSON.stringify(data, null, 2);
}

export function downloadUserData(userId: string): void {
  const store = getStore();
  const user = store.users[userId];
  if (!user) return;

  const json = exportUserData(userId);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `clau-lessons-${user.profile.name.toLowerCase().replace(/\s+/g, "-")}-${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function handleFileImport(file: File): Promise<UserProfile> {
  const text = await file.text();
  const data = JSON.parse(text) as ExportedData;

  if (data.app !== "clau-lessons" || data.version !== 1) {
    throw new Error("Archivo no válido");
  }

  const store = getStore();
  const incoming = data.user.profile;

  // Check if a user with the same name and course already exists
  const existing = Object.values(store.users).find(
    (u) =>
      u.profile.name === incoming.name && u.profile.course === incoming.course,
  );

  if (existing) {
    // Update existing user's progress instead of creating a duplicate
    existing.progress = data.user.progress;
    existing.profile.lastLoginAt = new Date().toISOString();
    saveStore(store);
    return existing.profile;
  }

  const newId = generateUserId(incoming.name);
  const profile: UserProfile = {
    ...incoming,
    id: newId,
    lastLoginAt: new Date().toISOString(),
  };

  store.users[newId] = {
    profile,
    progress: data.user.progress,
  };
  saveStore(store);
  return profile;
}

// ─── Migration ─────────────────────────────────────────────────

/** Migrate v1 stores that used Spanish field names (nombre/curso) to English (name/course). */
function migrateSpanishFields(): void {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return;
  try {
    const store = JSON.parse(raw);
    if (store.version !== 1) return;
    let changed = false;
    for (const user of Object.values(store.users) as Record<
      string,
      unknown
    >[]) {
      const profile = user.profile as Record<string, unknown>;
      if (profile && "nombre" in profile && !("name" in profile)) {
        profile.name = profile.nombre;
        delete profile.nombre;
        changed = true;
      }
      if (profile && "curso" in profile && !("course" in profile)) {
        profile.course = profile.curso;
        delete profile.curso;
        changed = true;
      }
      if (profile && !("classId" in profile)) {
        profile.classId = "";
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    }
  } catch {
    // Corrupted data, ignore
  }
}

function migrateV0ToV1(): void {
  const oldRaw = localStorage.getItem(LEGACY_KEY);
  if (!oldRaw || localStorage.getItem(STORE_KEY)) return;

  try {
    const old = JSON.parse(oldRaw) as {
      nombre: string;
      curso: string;
      createdAt: string;
    };
    const id = generateUserId(old.nombre);
    const now = new Date().toISOString();

    const store: AppStore = {
      version: 1,
      activeUserId: id,
      users: {
        [id]: {
          profile: {
            id,
            name: old.nombre,
            course: old.curso,
            classId: "",
            createdAt: old.createdAt,
            lastLoginAt: now,
          },
          progress: { subjects: {} },
        },
      },
    };

    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Corrupted legacy data, ignore
  }
}
