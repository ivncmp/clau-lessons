/** Convert display curso ("2º Primaria") to folder slug ("2-primaria"). */
export function cursoToSlug(curso: string): string {
  return curso.toLowerCase().replace(/[ºª]/g, "").trim().replace(/\s+/g, "-");
}
