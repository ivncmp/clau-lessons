import type { StudentProfile } from "../types/profile";

const STORAGE_KEY = "clau_lessons_profile";

export function getProfile(): StudentProfile | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as StudentProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}
