import type {
  AppStore,
  UserData,
  UserProfile,
  UserProgress,
  ExamAttempt,
  ExportedData,
} from "../types/storage";

const STORE_KEY = "clau_lessons_store";
const LEGACY_KEY = "clau_lessons_profile";

// ─── Store Management ──────────────────────────────────────────

function createEmptyStore(): AppStore {
  return { version: 1, activeUserId: null, users: {} };
}

export function getStore(): AppStore {
  migrateV0ToV1();
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

export function createUser(nombre: string, curso: string): UserProfile {
  const store = getStore();
  const id = generateUserId(nombre);
  const now = new Date().toISOString();

  const profile: UserProfile = {
    id,
    nombre: nombre.trim(),
    curso,
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
  a.download = `clau-lessons-${user.profile.nombre.toLowerCase().replace(/\s+/g, "-")}-${date}.json`;
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
  const newId = generateUserId(data.user.profile.nombre);
  const profile: UserProfile = {
    ...data.user.profile,
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
            nombre: old.nombre,
            curso: old.curso,
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
