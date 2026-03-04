/** Convert display curso ("2º Primaria") to folder slug ("2-primaria"). */
export function courseToSlug(course: string | undefined): string {
  return (
    course?.toLowerCase().replace(/[ºª]/g, "").trim().replace(/\s+/g, "-") ?? ""
  );
}
