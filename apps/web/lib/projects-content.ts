import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ProjectFrontMatter } from "../types/projects";

function resolveContentRoot() {
  const p1 = path.join(process.cwd(), "apps", "content", "projects");   // cwd=repo root
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), "..", "content", "projects");     // cwd=apps/web
  if (fs.existsSync(p2)) return p2;
  throw new Error(`No pude encontrar /apps/content/projects. Probé:\n - ${p1}\n - ${p2}`);
}
const CONTENT_ROOT = resolveContentRoot();

export function listProjectSlugs(): string[] {
  return fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })
           .filter(d => d.isDirectory())
           .map(d => d.name);
}

export function readProjectFrontMatter(slugRaw?: string): ProjectFrontMatter | null {
  // Normaliza y valida el slug
  const slug = (slugRaw ?? "").toString().trim();
  if (!slug) {
    console.warn(`[projects-content] slug vacío/indefinido recibido:`, slugRaw);
    return null;
  }

  // Busca carpeta case-insensitive
  const folders = listProjectSlugs();
  const matched =
    folders.find((f) => f === slug) ||
    folders.find((f) => f.toLowerCase() === slug.toLowerCase());

  if (!matched) {
    console.warn(`[projects-content] No folder matches slug="${slug}". Folders:`, folders);
    return null;
  }

  const file = path.join(CONTENT_ROOT, matched, "index.mdx");
  if (!fs.existsSync(file)) {
    console.warn(`[projects-content] index.mdx not found at`, file);
    return null;
  }

  const raw = fs.readFileSync(file, "utf-8");
  const { data } = matter(raw);
  if (!data?.title || !data?.slug) {
    throw new Error(`Front-matter inválido en ${file} (faltan 'title' o 'slug')`);
  }
  return data as ProjectFrontMatter;
}

export function getAllProjectFrontMatters(): ProjectFrontMatter[] {
  return listProjectSlugs().map(readProjectFrontMatter).filter(Boolean) as ProjectFrontMatter[];
}
