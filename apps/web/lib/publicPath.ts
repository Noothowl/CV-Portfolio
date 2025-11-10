export function publicPath(p?: string) {
  if (!p) return "";
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = p.startsWith("/") ? p : `/${p}`;
  return `${base}${clean}`;
}
