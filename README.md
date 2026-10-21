# bibek-bhattarai.vercel.app

Personal portfolio of Bibek Bhattarai — Data Science & Civil Engineering student at Arkansas State University.

**Live:** https://bibek-bhattarai.vercel.app

- `index.html` — the whole site: hand-written HTML/CSS/JS, no build step.
  The hero figure is a Warren truss drawn on a 2D canvas with a simple perspective projection;
  its deflection under a moving point load follows simply-supported beam theory.
- `img/` — project screenshots (WebP, with 720px variants for phones).
- `Bibek-Bhattarai-CV.pdf` — the downloadable CV.
- `cv/` — script that generates the CV as a Word file (`npm install && npm run build` in `cv/`),
  then export it to PDF from Word.

Pushing to `main` deploys to Vercel automatically.
