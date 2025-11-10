#!/usr/bin/env node
/**
 * Scaffolder for: Next.js portfolio + LaTeX→PDF + GitHub Pages
 * Usage:
 *   npm.cmd run scaffold
 *   npm.cmd run scaffold -- --only-structure
 *   npm.cmd run scaffold:structure
 *   npm.cmd run scaffold:clean   (recreate from scratch)
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const ONLY_STRUCTURE = args.includes("--only-structure");
const FORCE = args.includes("--force");

const root = process.cwd();
const w = (p) => path.join(root, p);

function mkdirp(p) { fs.mkdirSync(p, { recursive: true }); }
function writeFile(file, content, { skipIfExists = false } = {}) {
  if (skipIfExists && fs.existsSync(file)) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("  ✓", path.relative(root, file));
}
function touch(file) { writeFile(file, "", { skipIfExists: false }); }

/* -------------------- Templates -------------------- */

const README = `# CV + Portfolio (Next.js + LaTeX → PDF + GitHub Pages)

Monorepo que despliega un portfolio Next.js **estático** y mantiene el flujo LaTeX→PDF. 
El CI compila el PDF y lo copia al sitio (botón “Ver CV” abre siempre la versión más reciente).

## Estructura
\`\`\`
/
├─ apps/
│  └─ web/                    # Next.js (App Router, export estático)
│     ├─ app/
│     │  ├─ page.tsx          # Home (grid + overlay modal)
│     │  └─ layout.tsx        # Carga estilos globales
│     ├─ components/          # Card, Modal, TagPill
│     ├─ data/projects.ts     # Data manual (VSCode)
│     ├─ public/              # imágenes + cv.pdf (copiado por CI)
│     ├─ styles/theme.ts
│     └─ next.config.mjs
├─ .github/workflows/site.yml  # CI Pages (LaTeX→PDF + Next export + Deploy)
├─ .gitignore
└─ (Coloca aquí tu .tex; el CI lo compila)
\`\`\`

## Dev
\`\`\`bash
cd apps/web
npm i
npm run dev
\`\`\`

## GitHub Pages
- Settings → Pages → Source = **GitHub Actions**
- Push a \`main\`.
`;

const GITIGNORE = `node_modules/
.next/
out/
dist/
.DS_Store
Thumbs.db
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
`;

/**
 * IMPORTANT:
 * Use String.raw and escape the GitHub Actions interpolations:
 *   ${{ ... }}  ->  \${{ ... }}
 */
const WORKFLOW = String.raw`name: Build CV (LaTeX) + Next.js + Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  latex:
    name: Build CV PDF (LaTeX)
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Find TeX root
        id: texroot
        run: |
          TEX=$(ls -1 *.tex | head -n1 || true)
          if [ -z "$TEX" ]; then
            echo "::error::No .tex file found at repo root. Please add your LaTeX CV file (e.g. martinchipoco-cv.tex)."
            exit 1
          fi
          echo "texfile=$TEX" >> $GITHUB_OUTPUT

      - name: Compile LaTeX
        uses: xu-cheng/latex-action@v3
        with:
          root_file: \${{ steps.texroot.outputs.texfile }}
          latexmk_use_xelatex: true

      - name: Upload cv.pdf artifact
        uses: actions/upload-artifact@v4
        with:
          name: cv-pdf
          path: |
            *.pdf
          if-no-files-found: error

  web:
    name: Build Next.js
    needs: latex
    runs-on: ubuntu-latest
    env:
      NEXT_TELEMETRY_DISABLED: 1
      GITHUB_REPOSITORY: \${{ github.repository }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Download cv.pdf
        uses: actions/download-artifact@v4
        with:
          name: cv-pdf
          path: .
      - name: Place cv.pdf into Next public
        run: |
          mkdir -p apps/web/public
          PDF=$(ls -1 *.pdf | head -n1)
          cp "$PDF" apps/web/public/cv.pdf

      - name: Install deps
        working-directory: apps/web
        run: npm ci

      - name: Build (next build + export)
        working-directory: apps/web
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: apps/web/out

  deploy:
    name: Deploy to GitHub Pages
    needs: web
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
`;

const PKG_WEB = JSON.stringify({
  name: "cv-portfolio-web",
  private: true,
  scripts: {
    dev: "next dev -p 5173",
    build: "next build && next export",
    start: "npx serve -s out"
  },
  dependencies: {
    next: "14.2.14",
    react: "18.3.1",
    "react-dom": "18.3.1"
  }
}, null, 2);

const NEXT_CONFIG = `/** @type {import('next').NextConfig} */
const isProjectPage = process.env.GITHUB_REPOSITORY && !/^[^/]+\\/[^/]+\\.github\\.io$/.test(process.env.GITHUB_REPOSITORY);
const repoName = isProjectPage ? \`/\${process.env.GITHUB_REPOSITORY.split('/')[1]}\` : '';

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: repoName,
  assetPrefix: repoName ? \`\${repoName}/\` : undefined
};
`;

const LAYOUT = `import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
`;

const GLOBALS = `:root{
  --bg-canvas:#0d1117; --bg-subtle:#161b22; --border-subtle:#30363d;
  --fg-default:#c9d1d9; --fg-muted:#8b949e; --accent:#2f81f7; --shadow:0 10px 30px rgba(0,0,0,0.35);
  --pill-gray-fg:#c9d1d9; --pill-gray-bg:#30363d;
  --pill-green-fg:#c9f0d0; --pill-green-bg:#23863626; --pill-green-border:#238636;
  --pill-yellow-fg:#d29922; --pill-yellow-bg:#d2992226; --pill-yellow-border:#9e6a03;
  --pill-red-fg:#f85149; --pill-red-bg:#f8514926; --pill-red-border:#8e1519;
  --card-bg:#1b1f24; --card-hover:#22262c; --radius:16px
}
html,body{background:var(--bg-canvas);color:var(--fg-default);font-family:system-ui,-apple-system,"Segoe UI",Roboto,Inter,Arial,sans-serif}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}
.container{max-width:1120px;margin:0 auto;padding:24px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}
.card{background:var(--card-bg);border:1px solid var(--border-subtle);border-radius:var(--radius);overflow:hidden;transition:transform .15s ease,background .15s ease,border-color .15s ease}
.card:hover{transform:translateY(-2px);background:var(--card-hover);border-color:#3a3f46}
.card-thumb{width:100%;height:160px;object-fit:cover;background:#2a2f36;display:block}
.card-body{padding:14px 16px 16px}.card-title{font-weight:700;font-size:18px;margin:8px 0}.card-meta{color:var(--fg-muted);font-size:13px}
.pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.pill{font-size:12px;font-weight:600;border-radius:999px;padding:6px 10px;border:1px solid transparent;line-height:1;user-select:none}
.pill--gray{color:var(--pill-gray-fg);background:var(--pill-gray-bg)}
.pill--green{color:#c9f0d0;background:var(--pill-green-bg);border-color:var(--pill-green-border)}
.pill--yellow{color:var(--pill-yellow-fg);background:var(--pill-yellow-bg);border-color:var(--pill-yellow-border)}
.pill--red{color:var(--pill-red-fg);background:var(--pill-red-bg);border-color:var(--pill-red-border)}
.backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;padding:24px;z-index:50}
.modal{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:20px;width:min(1100px,100%);max-height:84vh;overflow:auto;box-shadow:var(--shadow)}
.modal-head{display:flex;gap:16px;align-items:center;padding:18px 20px;border-bottom:1px solid var(--border-subtle)}
.modal-body{padding:20px}
.modal-close{margin-left:auto;background:var(--pill-gray-bg);border:1px solid var(--border-subtle);color:var(--fg-default);border-radius:10px;padding:6px 10px;cursor:pointer}
.modal-close:hover{background:var(--card-hover)}
`;

const PAGE = `"use client";

import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { TagPill } from "../components/TagPill";

export default function Home() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter(p => !q || (p.title + p.summary + (p.tech ?? []).join(" ")).toLowerCase().includes(q))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [query]);

  const opened = projects.find(p => p.id === openId) ?? null;

  return (
    <div>
      <header style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:24, fontWeight:800, marginRight:"auto"}}>Portfolio</h1>
        <input
          placeholder="Buscar proyectos…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background:"var(--bg-subtle)", color:"var(--fg-default)",
            border:"1px solid var(--border-subtle)", borderRadius:10, padding:"8px 12px"
          }}
        />
        <a href="/cv.pdf" target="_blank" rel="noreferrer"
           style={{padding:"8px 12px", border:"1px solid var(--border-subtle)",
                   borderRadius:10, textDecoration:"none"}}>Ver CV</a>
      </header>

      <div className="grid">
        {list.map(p => (
          <Card key={p.id}
            title={p.title}
            thumbnail={p.thumbnail}
            period={p.period ? formatPeriod(p.period) : undefined}
            tags={p.tags}
            onOpen={() => setOpenId(p.id)}
          />
        ))}
      </div>

      <Modal open={!!opened} onClose={() => setOpenId(null)} title={opened?.title}>
        {opened && (
          <div style={{display:"grid", gap:16}}>
            <img src={opened.thumbnail} alt="" style={{width:240, borderRadius:12}} />
            <div style={{color:"var(--fg-muted)"}}>{opened.period && formatPeriod(opened.period)}</div>
            <div className="pills">{opened.tags.map((t,i)=><TagPill key={i} tone={t.tone}>{t.text}</TagPill>)}</div>
            <p style={{whiteSpace:"pre-wrap", lineHeight:1.6}}>{opened.description}</p>
            {opened.tech && (<div><strong>Technologies:</strong> {opened.tech.join(", ")}</div>)}
            {opened.links && (
              <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                {opened.links.demo && <a href={opened.links.demo} target="_blank" rel="noreferrer">Demo</a>}
                {opened.links.repo && <a href={opened.links.repo} target="_blank" rel="noreferrer">Repository</a>}
                {opened.links.page && <a href={opened.links.page} target="_blank" rel="noreferrer">Page</a>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatPeriod(p: {start: string; end?: string}) {
  return p.end ? \`\${p.start} – \${p.end}\` : p.start;
}
`;

const CARD = `type Props = {
  title: string;
  thumbnail: string;
  period?: string;
  tags?: Array<{ text: string; tone?: "gray"|"green"|"yellow"|"red" }>;
  onOpen?: () => void;
};

export function Card({ title, thumbnail, period, tags = [], onOpen }: Props) {
  return (
    <article className="card" role="button" tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.())}>
      <img className="card-thumb" src={thumbnail} alt="" />
      <div className="card-body">
        <div className="card-title">{title}</div>
        {period && <div className="card-meta">{period}</div>}
        {tags.length > 0 && (
          <div className="pills">
            {tags.map((t, i) => <span key={i} className={\`pill pill--\${t.tone ?? "gray"}\`}>{t.text}</span>)}
          </div>
        )}
      </div>
    </article>
  );
}
`;

const MODAL = `import { useEffect, useRef } from "react";

export function Modal({
  open, onClose, title, children
}: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <strong style={{ fontSize: 18 }}>{title}</strong>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
`;

const TAGPILL = `export function TagPill({ children, tone = "gray" }) {
  return <span className={\`pill pill--\${tone}\`}>{children}</span>;
}
`;

const THEME = `export const theme = {
  colors: {
    canvas: "#0d1117",
    subtle: "#161b22",
    border: "#30363d",
    fg: "#c9d1d9",
    muted: "#8b949e",
    accent: "#2f81f7",
    pills: {
      gray:   { fg: "#c9d1d9", bg: "#30363d" },
      green:  { fg: "#c9f0d0", bg: "#23863626", border: "#238636" },
      yellow: { fg: "#d29922", bg: "#d2992226", border: "#9e6a03" },
      red:    { fg: "#f85149", bg: "#f8514926", border: "#8e1519" }
    }
  },
} as const;

export type PillTone = "gray" | "green" | "yellow" | "red";
`;

const PROJECTS = `export const projects = [
  {
    id: "licht-rayders",
    title: "Licht Rayders – UE",
    period: { start: "2025-05", end: "2025-06" },
    thumbnail: "/images/placeholder.jpg",
    summary: "Short-form gameplay prototype demonstrating modular systems.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam.",
    tags: [
      { text: "Game", tone: "green" },
      { text: "Project", tone: "gray" },
      { text: "Technical", tone: "yellow" }
    ],
    tech: ["Unreal Engine", "GAS", "C++"],
    links: { demo: "#", repo: "#" },
    featured: true
  }
];
`;

const PLACEHOLDER_NOTE = `# Put images here
# e.g. placeholder.jpg
`;

/* -------------------- Build / Clean -------------------- */

function cleanIf(force) {
  if (!force) return;
  const toRm = [
    ".github/workflows/site.yml",
    "README.md",
    ".gitignore",
    "apps/web"
  ].map(w);
  for (const p of toRm) {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log("  ␡ removed", path.relative(root, p));
    }
  }
}

function scaffold() {
  console.log("Scaffolding monorepo…");

  mkdirp(w(".github/workflows"));
  mkdirp(w("apps/web/app"));
  mkdirp(w("apps/web/components"));
  mkdirp(w("apps/web/data"));
  mkdirp(w("apps/web/public/images"));
  mkdirp(w("apps/web/styles"));
  mkdirp(w("scripts"));

  if (ONLY_STRUCTURE) {
    writeFile(w("README.md"), README);
    writeFile(w(".gitignore"), GITIGNORE);
    writeFile(w(".github/workflows/site.yml"), WORKFLOW);
    touch(w("apps/web/package.json"));
    touch(w("apps/web/next.config.mjs"));
    touch(w("apps/web/app/layout.tsx"));
    touch(w("apps/web/app/page.tsx"));
    touch(w("apps/web/app/globals.css"));
    touch(w("apps/web/components/Card.tsx"));
    touch(w("apps/web/components/Modal.tsx"));
    touch(w("apps/web/components/TagPill.tsx"));
    touch(w("apps/web/styles/theme.ts"));
    touch(w("apps/web/data/projects.ts"));
    writeFile(w("apps/web/public/images/README.txt"), PLACEHOLDER_NOTE);
  } else {
    writeFile(w("README.md"), README);
    writeFile(w(".gitignore"), GITIGNORE);
    writeFile(w(".github/workflows/site.yml"), WORKFLOW);
    writeFile(w("apps/web/package.json"), PKG_WEB);
    writeFile(w("apps/web/next.config.mjs"), NEXT_CONFIG);
    writeFile(w("apps/web/app/layout.tsx"), LAYOUT);
    writeFile(w("apps/web/app/page.tsx"), PAGE);
    writeFile(w("apps/web/app/globals.css"), GLOBALS);
    writeFile(w("apps/web/components/Card.tsx"), CARD);
    writeFile(w("apps/web/components/Modal.tsx"), MODAL);
    writeFile(w("apps/web/components/TagPill.tsx"), TAGPILL);
    writeFile(w("apps/web/styles/theme.ts"), THEME);
    writeFile(w("apps/web/data/projects.ts"), PROJECTS);
    writeFile(w("apps/web/public/images/README.txt"), PLACEHOLDER_NOTE);
  }

  console.log("\nListo ✅");
  console.log(`- Coloca tu archivo .tex en el root (p.ej. martinchipoco-cv.tex).`);
  console.log(`- Añade placeholder en apps/web/public/images/placeholder.jpg`);
  console.log(`- Luego: cd apps/web && npm.cmd i && npm.cmd run dev`);
}

/* Run */
cleanIf(FORCE);
scaffold();
