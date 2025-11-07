# CV + Portfolio (LaTeX || GitHub)
This repo contains: 
- `cv.tex`: ATS-friendly LaTeX CV you can compile in **Overleaf** or via GitHub Actions.
- `site/`: a minimal static portfolio that is automatically **deployed to GitHub Pages** on every push.
- `.github/workflows/latex-pages.yml`: builds the PDF and deploys the `site/` (including the fresh PDF).

## How to use
### Option A — Overleaf
1. Go to Overleaf → **New Project** → **Upload Project** → upload this `.zip` (or at least `cv.tex`).
2. Compiler: **XeLaTeX**.
3. Edit and compile. Download `cv.pdf`.

### Option B — GitHub (Auto Build + Pages) - Prefer this one
1. Create a new GitHub repo (public is fine for Pages).
2. Upload everything from this repo.
3. Go to **Settings → Pages** and ensure the source is set to **GitHub Actions**.
4. Push to `main`. The workflow will:
   - Build `cv.pdf` (artifact).
   - Copy `cv.pdf` into `public/assets/cv.pdf` along with `site/`.
   - Deploy `public/` to GitHub Pages.
5. Your site will be available at `https://<your-user>.github.io/<repo-name>/` with a link to the latest **CV (PDF)**.

### Structure
```
.
├── cv.tex
├── site/
│   ├── index.html
│   └── assets/
│       └── (cv.pdf will be placed here by the workflow)
└── .github/
    └── workflows/
        └── latex-pages.yml
```

### Notes
- The LaTeX is kept **simple** (single column, no tables/icons) for better ATS parsing.
- You can customize `site/index.html` as a portfolio (projects, screenshots, links).
- If you want to add screenshots or images, put them under `site/assets/`.

---
## Troubleshooting
- **CV button doesn't open:** ensure the workflow run finished and that `public/assets/cv.pdf` exists in the Pages artifact.
- To publish a custom filename, set `PDF_NAME` in `.github/workflows/latex-pages.yml`. The site keeps a stable alias `assets/cv.pdf`.
- If your LaTeX file isn't `cv.tex`, the workflow auto-detects the first `.tex` file and uses it as the root.
