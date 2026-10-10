# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2019-era React 16 portfolio with a calm, single-page Vite + React 18 site that shows a recruiter, within seconds, that Chandrakanth is strong at 3D reconstruction.

**Architecture:** One centered scrolling page (Nav → Hero → Work → Experience → Publications → Education → Contact → Footer). All copy and links live in `src/content.js`; section components are presentational and receive their slice as props. Plain CSS with custom-property tokens (Night default, Light override). Hero shows two synced, muted, looping videos (camera poses + dense model) encoded from local source files by a committed ffmpeg script.

**Tech Stack:** Vite 5, React 18, plain CSS, `@fontsource/inter`, `@fontsource/jetbrains-mono`, Vitest 2 + jsdom + React Testing Library, `gh-pages`, ffmpeg (local, for media only).

**Spec:** `docs/superpowers/specs/2026-10-09-portfolio-rebuild-design.md`

## Global Constraints

- Runtime dependencies are exactly: `react`, `react-dom`, `@fontsource/inter`, `@fontsource/jetbrains-mono`. No router, UI kit, CSS-in-JS, animation or chart library.
- Node ≥ 20 (machine has v20.20.2). Package manager: npm.
- Tagline is exactly: `3D reconstruction · SfM · Gaussian Splatting · Diffusion Models`.
- No phone number anywhere in site source or content (the resume PDF in `public/` is the only exception).
- Domain: `chandrakanthgudavalli.com` via `public/CNAME`; Vite `base: '/'`.
- External links open in a new tab with `rel="noopener noreferrer"`; `mailto:` and same-site links do not.
- Every `href`/media path in content is `https://…`, `mailto:…`, or a site-absolute path starting with `/`.
- Colors only from tokens in §6 of the spec; text contrast ≥ 4.5:1.
- Hero videos: `muted playsInline loop preload="metadata"`, poster always set; no autoplay under `prefers-reduced-motion: reduce`.
- Each encoded media file ≤ 2.5 MB; built `dist/` total < 8 MB.
- `assets/` (raw source videos) is git-ignored and never committed.
- Do **not** run `npm run deploy` without explicit user approval.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Autoplay blocked** (iOS Low Power Mode, data saver): `video.play()` rejects → posters stay visible, a "▶ play reconstruction" button appears, no uncaught promise rejection. Test: Task 5, Step 1 (`shows play button when autoplay is blocked`).
2. **`localStorage` throws** (Safari private mode, blocked storage): site renders with OS/Night theme and the toggle still works for the session. Test: Task 3, Step 1 (`survives localStorage throwing`).
3. **Missing browser APIs** (`IntersectionObserver` / `matchMedia` absent — old browsers, jsdom): nav and hero still render; hero tries to play immediately. Tests: Task 4 Step 1 (`renders without IntersectionObserver`), Task 5 Step 1 (`plays immediately without IntersectionObserver`).
4. **Broken or oversized media path** after the owner renames/re-encodes a file: a test fails if any `/…` path in content is missing from `public/` or any file in `public/media` exceeds 2.5 MB. Test: Task 8, Step 1.
5. **Owner edits content later** (publication without a link, entries out of order): a publication without `href` renders as plain text; years are grouped and sorted descending regardless of input order. Tests: Task 7, Step 1 (`groupByYear sorts…`, `renders unlinked title when href missing`).

---

## File Map

| Path | Responsibility | Task |
| --- | --- | --- |
| `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `public/CNAME`, `public/favicon.svg` | Tooling, entry HTML with SEO/OG meta + no-flash theme script | 1, 3 |
| `src/main.jsx` | Mount React, import fonts + CSS | 1 |
| `src/App.jsx` | Compose Nav + sections in order | 1, 4–7 |
| `src/test/setup.js` | jest-dom matchers, media element stubs | 1 |
| `src/content.js` | All site content | 2 |
| `src/content.test.js` | Content schema/safety tests | 2 |
| `src/styles.css` | Tokens, base, all section styles (appended per task) | 3–7 |
| `src/hooks/useTheme.js` (+ test) | Theme state, OS default, persisted on toggle | 3 |
| `src/components/ThemeToggle.jsx` | ☾/☀ button | 3 |
| `src/hooks/useActiveSection.js` | IntersectionObserver active-anchor tracking | 4 |
| `src/components/Nav.jsx` (+ test) | Sticky nav | 4 |
| `src/lib/media.js` | `prefersReducedMotion()`, `safePlay()` | 5 |
| `src/components/LinkChips.jsx` | Row of links with correct target/rel | 5 |
| `src/components/VideoPane.jsx` | Viewer-window framed `<video>` | 5 |
| `src/sections/Hero.jsx` (+ test) | Hero text, links, synced pipeline videos | 5 |
| `src/components/Section.jsx` | `<section>` wrapper with `// label` heading | 6 |
| `src/components/WorkCard.jsx`, `src/sections/Work.jsx` (+ test) | Selected reconstructions grid | 6 |
| `src/lib/groupByYear.js`, `src/components/PubItem.jsx` | Publication grouping + item | 7 |
| `src/sections/Experience.jsx`, `Publications.jsx`, `Education.jsx`, `Contact.jsx`, `Footer.jsx` (+ test) | Remaining sections | 7 |
| `scripts/encode-media.sh`, `public/media/*`, `public/resume.pdf`, `public/og-image.jpg`, `src/media.test.js` | Media pipeline + checks | 8 |
| `CLAUDE.md` | Updated developer docs | 9 |

---

### Task 1: Scaffold Vite app and remove the old CRA app

**Files:**
- Delete: `src/` (entire old tree), `public/index.html`, `public/manifest.json`, `public/icons/`, `package-lock.json`
- Create: `package.json` (replace), `vite.config.js`, `index.html`, `public/CNAME`, `public/favicon.svg`, `src/main.jsx`, `src/App.jsx`, `src/styles.css`, `src/test/setup.js`, `src/App.test.jsx`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm test` (Vitest, jsdom, globals), `npm run dev|build|preview|deploy`; `src/styles.css` exists (empty base) for later tasks to append to; `src/App.jsx` default export `App`.

- [ ] **Step 1: Protect uncommitted user work**

Run: `git status --short`
If `src/shared/opensource/publications.json` is still listed as modified, STOP and ask the user whether to commit it first (it will be deleted with the old `src/`). Do not delete untracked root files (`*.jpeg`, `CLAUDE.md`, the Scholar HTML, the resume PDF).

- [ ] **Step 2: Remove the old app**

```bash
git rm -r -q src public/index.html public/manifest.json public/icons package-lock.json
rm -rf node_modules build
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "private": true,
  "name": "chandrakanth-portfolio",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "media": "bash scripts/encode-media.sh",
    "predeploy": "npm run build",
    "deploy": "gh-pages -b gh-pages -d dist"
  },
  "dependencies": {
    "@fontsource/inter": "^5.1.0",
    "@fontsource/jetbrains-mono": "^5.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.2",
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.3",
    "gh-pages": "^6.2.0",
    "husky": "^4.3.8",
    "jsdom": "^25.0.1",
    "lint-staged": "^10.5.4",
    "prettier": "^3.3.3",
    "vite": "^5.4.10",
    "vitest": "^2.1.4"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,css,md,json}": "prettier --write"
  }
}
```

- [ ] **Step 4: Write `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
```

- [ ] **Step 5: Write `src/test/setup.js`**

jsdom does not implement media playback; stub it so components can call `play()`/`pause()`.

```js
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();
```

- [ ] **Step 6: Write the failing smoke test `src/App.test.jsx`**

```jsx
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the owner's name as the page heading", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Chandrakanth Gudavalli" }),
  ).toBeInTheDocument();
});
```

- [ ] **Step 7: Install and run the test to verify it fails**

Run: `npm install && npm test`
Expected: FAIL — cannot resolve `./App`.

- [ ] **Step 8: Write the minimal app**

`src/App.jsx`:

```jsx
export default function App() {
  return (
    <main>
      <h1>Chandrakanth Gudavalli</h1>
    </main>
  );
}
```

`src/main.jsx`:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/styles.css`:

```css
/* Tokens and section styles are added by later tasks. */
```

`index.html` (repo root):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Chandrakanth Gudavalli — 3D Reconstruction Engineer</title>
    <meta
      name="description"
      content="I build 3D reconstruction systems that hold up on messy, real-world imagery — from Structure-from-Motion and camera pose estimation to Gaussian Splatting, at campus and city scale."
    />
    <link rel="canonical" href="https://chandrakanthgudavalli.com/" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="theme-color" content="#16181c" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://chandrakanthgudavalli.com/" />
    <meta property="og:title" content="Chandrakanth Gudavalli — 3D Reconstruction Engineer" />
    <meta
      property="og:description"
      content="3D reconstruction · SfM · Gaussian Splatting · Diffusion Models"
    />
    <meta property="og:image" content="https://chandrakanthgudavalli.com/og-image.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

`public/CNAME` (single line, no trailing content):

```
chandrakanthgudavalli.com
```

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#16181c"/>
  <text x="32" y="41" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="26" fill="#7fb5a8">cg</text>
</svg>
```

Append to `.gitignore` (keep existing lines; `.superpowers/` and `assets/` are already there):

```
node_modules/
dist/
```

- [ ] **Step 9: Run tests and build**

Run: `npm test && npm run build`
Expected: 1 test PASS; build writes `dist/` with `CNAME`, `favicon.svg`, `robots.txt`.

- [ ] **Step 10: Commit**

```bash
git add -A package.json package-lock.json vite.config.js index.html .gitignore public src
git commit -m "chore: replace CRA app with Vite + React 18 scaffold

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Content file and content safety tests

**Files:**
- Create: `src/content.js`, `src/content.test.js`

**Interfaces:**
- Produces (named exports of `src/content.js`):
  - `profile: { name, tagline, bio, links: { resume, linkedin, scholar, email } }` — all strings
  - `hero: { caption, subject, panes: [{ label, video: { webm, mp4 }, poster }] }` — exactly 2 panes; pane 0 is the primary (poses), pane 1 the dense model
  - `work: [{ title, impact, media?: { image, alt } | { video: { webm, mp4 }, poster, alt }, links: [{ label, href }] }]`
  - `experience: [{ org, role, location, start, end, bullets: string[], compact?: boolean }]`
  - `publications: [{ year: number, title, authors, venue, href?, type: "paper" | "patent" }]`
  - `education: [{ degree, school, year }]`
  - `contact: { blurb, email, linkedin }`
  - `sections: [{ id, label }]` — nav order: work, experience, publications, contact

- [ ] **Step 1: Write the failing tests `src/content.test.js`**

```js
import * as content from "./content";
const { profile, hero, work, experience, publications, education, contact, sections } = content;

const URL_KEYS = new Set(["href", "webm", "mp4", "poster", "image", "resume", "linkedin", "scholar", "email"]);

function collectUrls(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => collectUrls(n, out));
  else if (node && typeof node === "object")
    for (const [k, v] of Object.entries(node)) {
      if (URL_KEYS.has(k) && typeof v === "string") out.push(v);
      else collectUrls(v, out);
    }
  return out;
}

test("profile has the agreed tagline and all links", () => {
  expect(profile.name).toBe("Chandrakanth Gudavalli");
  expect(profile.tagline).toBe("3D reconstruction · SfM · Gaussian Splatting · Diffusion Models");
  expect(profile.bio.length).toBeGreaterThan(40);
  for (const k of ["resume", "linkedin", "scholar", "email"]) expect(profile.links[k]).toBeTruthy();
});

test("every link and media path is https, mailto or site-absolute", () => {
  const urls = collectUrls(content);
  expect(urls.length).toBeGreaterThan(20);
  for (const u of urls) expect(u).toMatch(/^(https:\/\/|mailto:|\/[^/])/);
});

test("no phone number appears anywhere in content", () => {
  const text = JSON.stringify(content);
  expect(text).not.toMatch(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
  expect(text).not.toContain("9135");
});

test("hero has exactly two complete panes", () => {
  expect(hero.panes).toHaveLength(2);
  for (const p of hero.panes) {
    expect(p.label).toBeTruthy();
    expect(p.poster).toBeTruthy();
    expect(p.video.webm).toMatch(/\.webm$/);
    expect(p.video.mp4).toMatch(/\.mp4$/);
  }
});

test("four work cards, each with impact, links and accessible media", () => {
  expect(work).toHaveLength(4);
  for (const w of work) {
    expect(w.title && w.impact).toBeTruthy();
    expect(w.links.length).toBeGreaterThan(0);
    if (w.media) expect(w.media.alt).toBeTruthy();
  }
});

test("experience entries have 1–3 short bullets", () => {
  for (const e of experience) {
    expect(e.bullets.length).toBeGreaterThanOrEqual(1);
    expect(e.bullets.length).toBeLessThanOrEqual(3);
    for (const b of e.bullets) expect(b.split(/\s+/).length).toBeLessThanOrEqual(28);
  }
});

test("publications are typed, dated and include the author", () => {
  expect(publications).toHaveLength(10);
  for (const p of publications) {
    expect(["paper", "patent"]).toContain(p.type);
    expect(Number.isInteger(p.year)).toBe(true);
    if (p.type === "paper") expect(p.authors).toMatch(/C\. Gudavalli/);
  }
});

test("education, contact and nav sections are present", () => {
  expect(education).toHaveLength(2);
  expect(contact.email).toMatch(/^mailto:/);
  expect(sections.map((s) => s.id)).toEqual(["work", "experience", "publications", "contact"]);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/content.test.js`
Expected: FAIL — cannot resolve `./content`.

- [ ] **Step 3: Write `src/content.js`**

Before writing, look up DOIs for the three papers marked `href` below as "lookup" (Q-RBSA, SeeTheSeams, Seam Carving chapter):

```bash
for q in "Q-RBSA high-resolution 3D EBSD map generation quaternion transformer" \
         "SeeTheSeams Localized Detection of Seam Carving based Image Forgery in Satellite Imagery" \
         "Seam Carving Detection and Localization Using Two-Stage Deep Neural Networks"; do
  curl -s "https://api.crossref.org/works?rows=1&query.bibliographic=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$q")" \
  | python3 -c 'import sys,json;i=json.load(sys.stdin)["message"]["items"][0];print(i["title"][0],"|",i["DOI"])'
done
```

Use `https://doi.org/<DOI>` only if the returned title matches the paper; otherwise omit `href` for that entry (it then renders unlinked — Task 7 handles this).

```js
export const sections = [
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "publications", label: "publications" },
  { id: "contact", label: "contact" },
];

export const profile = {
  name: "Chandrakanth Gudavalli",
  tagline: "3D reconstruction · SfM · Gaussian Splatting · Diffusion Models",
  bio: "I build 3D reconstruction systems that hold up on messy, real-world imagery — from Structure-from-Motion and camera pose estimation to Gaussian Splatting, at campus and city scale.",
  links: {
    resume: "/resume.pdf",
    linkedin: "https://www.linkedin.com/in/gudavallic",
    scholar: "https://scholar.google.com/citations?user=TyzK9okAAAAJ",
    email: "mailto:chandrakanthgudavalli@gmail.com",
  },
};

export const hero = {
  caption: "images → SfM cameras → dense reconstruction",
  subject: "JHU campus · IARPA WRIVA",
  panes: [
    {
      label: "1 · recovered camera poses",
      video: { webm: "/media/hero-poses.webm", mp4: "/media/hero-poses.mp4" },
      poster: "/media/hero-poses.jpg",
    },
    {
      label: "2 · dense 3D model",
      video: { webm: "/media/hero-dense.webm", mp4: "/media/hero-dense.mp4" },
      poster: "/media/hero-dense.jpg",
    },
  ],
};

export const work = [
  {
    title: "Cloud-native SfM for IARPA WRIVA",
    impact:
      "Wide-baseline, mixed-altitude imagery fused with GPS, OpenStreetMap and satellite priors. Ranked #1 on the WRIVA leaderboard, ahead of teams from MIT and Stanford.",
    media: { image: "/media/wriva.jpg", alt: "Dense 3D reconstruction of the JHU campus seen from above" },
    links: [{ label: "demo", href: "https://cpeng93.github.io/JHU-in-3D/" }],
  },
  {
    title: "Campus-scale reconstruction from drone footage",
    impact:
      "UCSB campus reconstructed end-to-end from thousands of heterogeneous drone images — ingestion, pose estimation, dense reconstruction and validation.",
    media: { image: "/media/campus.jpg", alt: "3D reconstruction of the UCSB campus from drone footage" },
    links: [
      { label: "demo 1", href: "https://youtu.be/2GJS7BRKg1s" },
      { label: "demo 2", href: "https://youtu.be/LbreY2Czc7E" },
    ],
  },
  {
    title: "Ground → satellite geolocalization via 3DGS",
    impact:
      "Clusters of ground images rendered to a zenith view with Gaussian Splatting and Difix3D, then registered to WorldView-3 imagery. Sub-10 m camera RMSE.",
    media: { image: "/media/geoloc.jpg", alt: "Ground images geo-located onto satellite imagery" },
    links: [{ label: "CVPR 2026", href: "https://arxiv.org/abs/2602.14929" }],
  },
  {
    title: "MetaReg: fast incremental registration",
    impact:
      "Custom PnP that uses noisy GPS and spatial neighbours to add a new camera to an existing reconstruction in under 1.34 s.",
    media: {
      video: { webm: "/media/metareg.webm", mp4: "/media/metareg.mp4" },
      poster: "/media/metareg.jpg",
      alt: "New cameras registering into an aerial point cloud",
    },
    links: [
      { label: "ICIP 2025", href: "https://drive.google.com/file/d/1pQgsJrdcIrL6Ntq7tu0qqvlFOJ5Z3w9F/view" },
    ],
  },
];

export const experience = [
  {
    org: "Mayachitra Inc",
    role: "Research Engineer, 3D Computer Vision",
    location: "Santa Barbara, CA",
    start: "Dec 2019",
    end: "Present",
    bullets: [
      "Productionized a cloud-native SfM pipeline for IARPA WRIVA fusing GPS, OpenStreetMap and satellite priors — #1 on the program leaderboard.",
      "Built ground-to-satellite geolocalization with Gaussian Splatting and Difix3D, reaching sub-10 m camera RMSE (CVPR 2026).",
      "Benchmarked feed-forward pose models (VGGT, Pi3) against COLMAP and GLOMAP; recovered reliable poses from as few as 2–5 images.",
    ],
  },
  {
    org: "Vision Research Lab, UCSB",
    role: "Visiting Research Staff, ML Ops & 3D Vision",
    location: "Santa Barbara, CA",
    start: "Jun 2022",
    end: "Present",
    bullets: [
      "Led campus-scale 3D reconstruction from sparse, heterogeneous imagery, scaling to thousands of images.",
      "Technical lead for a 14-member cross-institution collaboration with Johns Hopkins University.",
      "Moved the BisQue 3D platform onto Kubernetes and Argo, with GPU-backed services and web viewers for point clouds and Gaussian splats.",
    ],
  },
  {
    org: "National Renewable Energy Laboratory",
    role: "Graduate Intern, Computer Vision",
    location: "Denver, CO",
    start: "Mar 2019",
    end: "Dec 2019",
    compact: true,
    bullets: ["Segmentation for heliostat defect detection and GRU-based anomaly detection in bio-feedstock streams."],
  },
  {
    org: "Netcracker Technologies",
    role: "Software Engineer",
    location: "Hyderabad, India",
    start: "Jun 2015",
    end: "Jul 2017",
    compact: true,
    bullets: ["C++ and Python developer on telecom billing systems and PCI-compliant payment APIs."],
  },
];

export const publications = [
  {
    year: 2026,
    type: "paper",
    title: "Wrivinder: Towards Spatial Intelligence for Geo-locating Ground Images onto Satellite Imagery",
    authors: "C. Gudavalli et al.",
    venue: "CVPR 2026",
    href: "https://arxiv.org/abs/2602.14929",
  },
  {
    year: 2025,
    type: "paper",
    title: "METAREG: Robust Camera Parameter Estimation by Leveraging Noisy Camera Extrinsics",
    authors: "C. Gudavalli et al.",
    venue: "IEEE ICIP 2025",
    href: "https://drive.google.com/file/d/1pQgsJrdcIrL6Ntq7tu0qqvlFOJ5Z3w9F/view",
  },
  {
    year: 2025,
    type: "paper",
    title: "CIMGEN: Controlled Satellite Image Manipulation by Fine-Tuning Pretrained Generative Models on Limited Data",
    authors: "C. Gudavalli, E. Rosten, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "ICPR (Springer)",
    href: "https://link.springer.com/chapter/10.1007/978-3-031-78305-0_7",
  },
  {
    year: 2024,
    type: "paper",
    title: "Q-RBSA: High-Resolution 3D EBSD Map Generation Using an Efficient Quaternion Transformer Network",
    authors: "D. K. Jangid, N. R. Brodnik, M. P. Echlin, C. Gudavalli, C. Levenson, T. M. Pollock, S. H. Daly, B. S. Manjunath",
    venue: "npj Computational Materials",
    // href: lookup (Step 3) — omit if no confident match
  },
  {
    year: 2023,
    type: "paper",
    title: "Resampling Estimation Based RPC Metadata Verification in Satellite Imagery",
    authors: "C. Gudavalli, M. Goebel, T. Nanjundaswamy, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "IEEE Transactions on Information Forensics and Security",
    href: "https://ieeexplore.ieee.org/abstract/document/10124789",
  },
  {
    year: 2023,
    type: "patent",
    title: "Rational Polynomial Coefficient Based Metadata Verification",
    authors: "C. Gudavalli, M. Goebel, T. Nanjundaswamy, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "US 11,842,471 B2",
    href: "https://patents.google.com/patent/US11842471B2/en",
  },
  {
    year: 2023,
    type: "patent",
    title: "Controlled Image Manipulations Using Semantic Labels",
    authors: "C. Gudavalli et al.",
    venue: "US 2023/0419655 A1",
    href: "https://patents.google.com/patent/US20230419655A1/en",
  },
  {
    year: 2022,
    type: "paper",
    title: "SeeTheSeams: Localized Detection of Seam Carving Based Image Forgery in Satellite Imagery",
    authors: "C. Gudavalli, E. Rosten, L. Nataraj, S. Chandrasekaran, B. S. Manjunath",
    venue: "CVPR 2022 Workshop on Media Forensics",
    // href: lookup (Step 3)
  },
  {
    year: 2021,
    type: "paper",
    title: "Seam Carving Detection and Localization Using Two-Stage Deep Neural Networks",
    authors: "L. Nataraj, C. Gudavalli, T. M. Mohammed, S. Chandrasekaran, B. S. Manjunath",
    venue: "Machine Learning, Deep Learning and Computational Intelligence for Wireless Communication (Springer)",
    // href: lookup (Step 3)
  },
  {
    year: 2020,
    type: "paper",
    title: "Real-Time Biomass Feedstock Particle Quality Detection Using Image Analysis and Machine Vision",
    authors: "C. Gudavalli, E. Bose, B. S. Donohoe, D. A. Sievers",
    venue: "Biomass Conversion and Biorefinery",
    href: "https://rdcu.be/caZd9",
  },
];

export const education = [
  { degree: "M.S. Electrical & Computer Engineering", school: "University of Colorado Denver", year: "2019" },
  { degree: "B.Tech Electronics & Communication Engineering", school: "JNTU Hyderabad", year: "2015" },
];

export const contact = {
  blurb: "Open to 3D vision and spatial-AI roles. The fastest way to reach me is email.",
  email: "mailto:chandrakanthgudavalli@gmail.com",
  linkedin: "https://www.linkedin.com/in/gudavallic",
};
```

Replace each `// href: lookup` comment with `href: "https://doi.org/<DOI>",` when Step 3's lookup matched; otherwise delete the comment line.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- src/content.test.js`
Expected: 8 PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content.js src/content.test.js
git commit -m "feat: add site content with schema and privacy tests

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Design tokens, theme hook and toggle

**Files:**
- Create: `src/hooks/useTheme.js`, `src/hooks/useTheme.test.jsx`, `src/components/ThemeToggle.jsx`
- Modify: `src/styles.css` (replace placeholder), `index.html` (add no-flash script in `<head>`)

**Interfaces:**
- Produces: `initialTheme(): "dark" | "light"`; `useTheme(): { theme, toggle }` (sets `document.documentElement.dataset.theme`, persists to `localStorage["theme"]` only on toggle); `<ThemeToggle theme onToggle />`.
- CSS tokens: `--bg --surface --border --text --muted --accent --mono --sans --col`.

- [ ] **Step 1: Write failing tests `src/hooks/useTheme.test.jsx`**

```jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { initialTheme, useTheme } from "./useTheme";
import ThemeToggle from "../components/ThemeToggle";

function Harness() {
  const { theme, toggle } = useTheme();
  return <ThemeToggle theme={theme} onToggle={toggle} />;
}

test("defaults to dark when no preference is stored and matchMedia is missing", () => {
  expect(initialTheme()).toBe("dark");
});

test("uses a stored preference", () => {
  localStorage.setItem("theme", "light");
  expect(initialTheme()).toBe("light");
});

test("toggle flips data-theme and persists the choice", () => {
  render(<Harness />);
  expect(document.documentElement.dataset.theme).toBe("dark");
  fireEvent.click(screen.getByRole("button", { name: /switch to light theme/i }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("theme")).toBe("light");
});

test("survives localStorage throwing", () => {
  const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  render(<Harness />);
  fireEvent.click(screen.getByRole("button"));
  expect(document.documentElement.dataset.theme).toBe("light");
  get.mockRestore();
  set.mockRestore();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/hooks/useTheme.test.jsx`
Expected: FAIL — cannot resolve `./useTheme`.

- [ ] **Step 3: Implement**

`src/hooks/useTheme.js`:

```js
import { useEffect, useState } from "react";

const KEY = "theme";

function readStored() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function systemTheme() {
  if (typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function initialTheme() {
  const stored = readStored();
  return stored === "light" || stored === "dark" ? stored : systemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: choice lasts for this visit only */
    }
  };

  return { theme, toggle };
}
```

`src/components/ThemeToggle.jsx`:

```jsx
export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button type="button" className="theme-toggle" onClick={onToggle} aria-label={`Switch to ${next} theme`}>
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
```

`src/styles.css` (replace the placeholder):

```css
:root,
[data-theme="dark"] {
  --bg: #16181c;
  --surface: #1d2025;
  --border: #262a30;
  --text: #e6e4df;
  --muted: #8a8d93;
  --accent: #7fb5a8;
  color-scheme: dark;
}
[data-theme="light"] {
  --bg: #f7f7f5;
  --surface: #ffffff;
  --border: #e4e4e0;
  --text: #1f2124;
  --muted: #6a6d72;
  --accent: #2f6f62;
  color-scheme: light;
}
:root {
  --sans: "Inter", system-ui, -apple-system, sans-serif;
  --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
  --col: 680px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 64px;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 400 16.5px/1.65 var(--sans);
  -webkit-font-smoothing: antialiased;
}
a {
  color: var(--accent);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
.mono {
  font-family: var(--mono);
}
.container {
  max-width: var(--col);
  margin: 0 auto;
  padding: 0 20px;
}
.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 6px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 14px;
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    transition: none !important;
    animation: none !important;
  }
}
```

In `index.html`, add as the first child of `<head>` after the viewport meta, to avoid a wrong-theme flash before React mounts:

```html
<script>
  try {
    var t = localStorage.getItem("theme");
    if (t !== "light" && t !== "dark")
      t = window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = t;
  } catch (e) {}
</script>
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS (App, content, theme).

- [ ] **Step 5: Commit**

```bash
git add src/hooks src/components/ThemeToggle.jsx src/styles.css index.html
git commit -m "feat: add Night/Light design tokens and theme toggle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Sticky nav with active-section highlight

**Files:**
- Create: `src/hooks/useActiveSection.js`, `src/components/Nav.jsx`, `src/components/Nav.test.jsx`
- Modify: `src/App.jsx`, `src/styles.css` (append)

**Interfaces:**
- Consumes: `sections` from `src/content.js`; `useTheme`, `ThemeToggle` (Task 3).
- Produces: `useActiveSection(ids: string[]): string | null`; `<Nav sections theme onToggleTheme />`. Sections are later rendered as elements with `id` equal to the nav ids.

- [ ] **Step 1: Write failing tests `src/components/Nav.test.jsx`**

```jsx
import { render, screen, act } from "@testing-library/react";
import Nav from "./Nav";

const sections = [
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

test("renders anchors for each section and the theme toggle", () => {
  render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />);
  expect(screen.getByRole("link", { name: "work" })).toHaveAttribute("href", "#work");
  expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute("href", "#contact");
  expect(screen.getByRole("link", { name: "~/cg" })).toHaveAttribute("href", "#top");
  expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
});

test("renders without IntersectionObserver", () => {
  const saved = window.IntersectionObserver;
  delete window.IntersectionObserver;
  expect(() => render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />)).not.toThrow();
  window.IntersectionObserver = saved;
});

test("marks the intersecting section as current", () => {
  document.body.innerHTML = '<section id="work"></section><section id="contact"></section>';
  let cb;
  window.IntersectionObserver = class {
    constructor(fn) {
      cb = fn;
    }
    observe() {}
    disconnect() {}
  };
  render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />);
  act(() => cb([{ isIntersecting: true, target: document.getElementById("contact") }]));
  expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute("aria-current", "true");
  expect(screen.getByRole("link", { name: "work" })).not.toHaveAttribute("aria-current");
  delete window.IntersectionObserver;
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/components/Nav.test.jsx`
Expected: FAIL — cannot resolve `./Nav`.

- [ ] **Step 3: Implement**

`src/hooks/useActiveSection.js`:

```js
import { useEffect, useState } from "react";

export function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  const key = ids.join(",");

  useEffect(() => {
    if (typeof window.IntersectionObserver !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    key.split(",").forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key]);

  return active;
}
```

`src/components/Nav.jsx`:

```jsx
import ThemeToggle from "./ThemeToggle";
import { useActiveSection } from "../hooks/useActiveSection";

export default function Nav({ sections, theme, onToggleTheme }) {
  const active = useActiveSection(sections.map((s) => s.id));
  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav-inner">
        <a className="nav-brand mono" href="#top">~/cg</a>
        <div className="nav-links mono">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>
              {s.label}
            </a>
          ))}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </nav>
  );
}
```

`src/App.jsx`:

```jsx
import Nav from "./components/Nav";
import { useTheme } from "./hooks/useTheme";
import { sections } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <h1>Chandrakanth Gudavalli</h1>
      </main>
    </>
  );
}
```

Append to `src/styles.css`:

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: color-mix(in srgb, var(--bg) 85%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.nav-brand {
  color: var(--muted);
  font-size: 13px;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
  overflow-x: auto;
  white-space: nowrap;
}
.nav-links a {
  color: var(--muted);
}
.nav-links a[aria-current="true"],
.nav-links a:hover {
  color: var(--text);
  text-decoration: none;
}
@media (max-width: 480px) {
  .nav-links {
    gap: 12px;
    font-size: 12px;
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useActiveSection.js src/components/Nav.jsx src/components/Nav.test.jsx src/App.jsx src/styles.css
git commit -m "feat: add sticky nav with active-section highlight

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Hero with synced pipeline videos

**Files:**
- Create: `src/lib/media.js`, `src/components/LinkChips.jsx`, `src/components/VideoPane.jsx`, `src/sections/Hero.jsx`, `src/sections/Hero.test.jsx`
- Modify: `src/App.jsx`, `src/styles.css` (append)

**Interfaces:**
- Consumes: `profile`, `hero` from content (Task 2).
- Produces: `prefersReducedMotion(): boolean`; `safePlay(video: HTMLVideoElement): Promise<boolean>` (resolves `false` on rejection/throw, never rejects); `<LinkChips links={[{label, href}]} className? />`; `<VideoPane ref label video poster />` (forwardRef to `<video>`); `<Hero profile hero />` rendering `<header id="top">` with the `h1`.

- [ ] **Step 1: Write failing tests `src/sections/Hero.test.jsx`**

```jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Hero from "./Hero";
import { profile, hero } from "../content";

const play = window.HTMLMediaElement.prototype.play;

afterEach(() => {
  play.mockReset();
  play.mockImplementation(() => Promise.resolve());
  delete window.matchMedia;
  delete window.IntersectionObserver;
});

test("renders name, tagline, bio and links", () => {
  render(<Hero profile={profile} hero={hero} />);
  expect(screen.getByRole("heading", { level: 1, name: profile.name })).toBeInTheDocument();
  expect(screen.getByText(profile.tagline)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "resume.pdf" })).toHaveAttribute("href", "/resume.pdf");
  expect(screen.getByRole("link", { name: "email" })).toHaveAttribute("href", profile.links.email);
  const li = screen.getByRole("link", { name: "linkedin" });
  expect(li).toHaveAttribute("target", "_blank");
  expect(li).toHaveAttribute("rel", "noopener noreferrer");
  expect(screen.getByRole("link", { name: "email" })).not.toHaveAttribute("target");
});

test("renders two muted, looping videos with posters and both sources", () => {
  const { container } = render(<Hero profile={profile} hero={hero} />);
  const videos = container.querySelectorAll("video");
  expect(videos).toHaveLength(2);
  videos.forEach((v, i) => {
    expect(v.muted).toBe(true);
    expect(v.loop).toBe(true);
    expect(v).toHaveAttribute("poster", hero.panes[i].poster);
    expect(v.querySelector('source[type="video/webm"]')).toHaveAttribute("src", hero.panes[i].video.webm);
    expect(v.querySelector('source[type="video/mp4"]')).toHaveAttribute("src", hero.panes[i].video.mp4);
  });
  expect(screen.getByText(hero.panes[0].label)).toBeInTheDocument();
});

test("plays immediately without IntersectionObserver", async () => {
  render(<Hero profile={profile} hero={hero} />);
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
});

test("does not autoplay under reduced motion, plays on button click", async () => {
  window.matchMedia = vi.fn((q) => ({ matches: q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
  render(<Hero profile={profile} hero={hero} />);
  expect(play).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: /play reconstruction/i }));
  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
});

test("shows play button when autoplay is blocked", async () => {
  play.mockImplementation(() => Promise.reject(new DOMException("blocked", "NotAllowedError")));
  render(<Hero profile={profile} hero={hero} />);
  expect(await screen.findByRole("button", { name: /play reconstruction/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/sections/Hero.test.jsx`
Expected: FAIL — cannot resolve `./Hero`.

- [ ] **Step 3: Implement**

`src/lib/media.js`:

```js
export function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function safePlay(video) {
  try {
    const p = video.play();
    return p && typeof p.then === "function" ? p.then(() => true, () => false) : Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}
```

`src/components/LinkChips.jsx`:

```jsx
export default function LinkChips({ links, className = "chips" }) {
  return (
    <div className={`${className} mono`}>
      {links.map(({ label, href }) => {
        const external = href.startsWith("http");
        return (
          <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {label}
          </a>
        );
      })}
    </div>
  );
}
```

`src/components/VideoPane.jsx`:

```jsx
import { forwardRef } from "react";

const VideoPane = forwardRef(function VideoPane({ label, video, poster }, ref) {
  return (
    <figure className="viewer">
      <figcaption className="viewer-bar mono">{label}</figcaption>
      <video ref={ref} className="viewer-video" muted playsInline loop preload="metadata" poster={poster} aria-label={label}>
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
    </figure>
  );
});

export default VideoPane;
```

`src/sections/Hero.jsx`:

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import LinkChips from "../components/LinkChips";
import VideoPane from "../components/VideoPane";
import { prefersReducedMotion, safePlay } from "../lib/media";

export default function Hero({ profile, hero }) {
  const primary = useRef(null);
  const secondary = useRef(null);
  const box = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);

  const playAll = useCallback(async () => {
    const videos = [primary.current, secondary.current].filter(Boolean);
    const results = await Promise.all(videos.map(safePlay));
    setNeedsTap(!results.every(Boolean));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setNeedsTap(true);
      return;
    }
    if (typeof window.IntersectionObserver !== "function") {
      playAll();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) playAll();
        else [primary.current, secondary.current].forEach((v) => v && v.pause());
      },
      { threshold: 0.25 },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [playAll]);

  useEffect(() => {
    const a = primary.current;
    const b = secondary.current;
    if (!a || !b) return;
    const sync = () => {
      if (Math.abs(a.currentTime - b.currentTime) > 0.15) b.currentTime = a.currentTime;
    };
    a.addEventListener("timeupdate", sync);
    return () => a.removeEventListener("timeupdate", sync);
  }, []);

  const { links } = profile;
  return (
    <header id="top" className="hero">
      <h1 className="hero-name">{profile.name}</h1>
      <p className="hero-tagline mono">{profile.tagline}</p>
      <p className="hero-bio">{profile.bio}</p>
      <LinkChips
        className="hero-links"
        links={[
          { label: "resume.pdf", href: links.resume },
          { label: "linkedin", href: links.linkedin },
          { label: "scholar", href: links.scholar },
          { label: "email", href: links.email },
        ]}
      />
      <div className="pipeline" ref={box}>
        <VideoPane ref={primary} {...hero.panes[0]} />
        <VideoPane ref={secondary} {...hero.panes[1]} />
      </div>
      <p className="pipeline-caption mono">
        {hero.caption} <span className="muted">· {hero.subject}</span>
      </p>
      {needsTap && (
        <button type="button" className="play-btn mono" onClick={playAll}>
          ▶ play reconstruction
        </button>
      )}
    </header>
  );
}
```

`src/App.jsx` — replace the placeholder `<h1>` with the hero:

```jsx
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import { useTheme } from "./hooks/useTheme";
import { sections, profile, hero } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <Hero profile={profile} hero={hero} />
      </main>
    </>
  );
}
```

Append to `src/styles.css`:

```css
.muted {
  color: var(--muted);
}
.hero {
  padding: 72px 0 40px;
}
.hero-name {
  font-size: clamp(30px, 5vw, 40px);
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin: 0;
}
.hero-tagline {
  color: var(--accent);
  font-size: 14px;
  margin: 10px 0 0;
}
.hero-bio {
  color: var(--muted);
  margin: 16px 0 0;
  max-width: 600px;
}
.hero-links,
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 13px;
  margin-top: 16px;
}
.chips {
  margin-top: 10px;
  font-size: 12px;
}
.pipeline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 36px;
}
.viewer {
  margin: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}
.viewer-bar {
  background: var(--surface);
  color: var(--muted);
  font-size: 11px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--border);
}
.viewer-video {
  display: block;
  width: 100%;
  aspect-ratio: 1848 / 940;
  object-fit: cover;
  background: #fff;
}
.pipeline-caption {
  font-size: 12px;
  color: var(--text);
  margin: 10px 0 0;
}
.play-btn {
  margin-top: 12px;
  background: none;
  border: 1px solid var(--border);
  color: var(--accent);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}
@media (max-width: 640px) {
  .hero {
    padding-top: 48px;
  }
  .pipeline {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS (App test still finds the `h1`, now rendered by Hero).

- [ ] **Step 5: Commit**

```bash
git add src/lib src/components/LinkChips.jsx src/components/VideoPane.jsx src/sections src/App.jsx src/styles.css
git commit -m "feat: add hero with synced camera-pose and dense-model videos

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Selected reconstructions (Work)

**Files:**
- Create: `src/components/Section.jsx`, `src/components/WorkCard.jsx`, `src/sections/Work.jsx`, `src/sections/Work.test.jsx`
- Modify: `src/App.jsx`, `src/styles.css` (append)

**Interfaces:**
- Consumes: `work` (Task 2), `LinkChips`, `prefersReducedMotion` (Task 5).
- Produces: `<Section id label children />` → `<section id aria-labelledby><h2 class="section-label mono">// {label}</h2>…`; `<WorkCard title impact media? links />`; `<Work items />` with `id="work"`.

- [ ] **Step 1: Write failing tests `src/sections/Work.test.jsx`**

```jsx
import { render, screen, within } from "@testing-library/react";
import Work from "./Work";
import { work } from "../content";

test("renders a labelled section with one card per item", () => {
  render(<Work items={work} />);
  const section = screen.getByRole("region", { name: "// selected reconstructions" });
  expect(section).toHaveAttribute("id", "work");
  expect(within(section).getAllByRole("article")).toHaveLength(work.length);
});

test("image cards have alt text; video cards have a poster and no controls", () => {
  const { container } = render(<Work items={work} />);
  expect(screen.getByAltText(work[0].media.alt)).toHaveAttribute("src", work[0].media.image);
  const v = container.querySelector("video");
  expect(v).toHaveAttribute("poster", work[3].media.poster);
  expect(v.muted).toBe(true);
});

test("card without media renders text only", () => {
  const { container } = render(<Work items={[{ title: "T", impact: "I", links: [{ label: "x", href: "https://x.org" }] }]} />);
  expect(container.querySelector(".card-media")).toBeNull();
  expect(screen.getByRole("link", { name: "x" })).toHaveAttribute("target", "_blank");
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/sections/Work.test.jsx`
Expected: FAIL — cannot resolve `./Work`.

- [ ] **Step 3: Implement**

`src/components/Section.jsx`:

```jsx
export default function Section({ id, label, children }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-label`}>
      <h2 id={`${id}-label`} className="section-label mono">
        // {label}
      </h2>
      {children}
    </section>
  );
}
```

`src/components/WorkCard.jsx`:

```jsx
import LinkChips from "./LinkChips";
import { prefersReducedMotion } from "../lib/media";

function Media({ media }) {
  if (media.video) {
    return (
      <video
        className="card-media"
        muted
        playsInline
        loop
        autoPlay={!prefersReducedMotion()}
        preload="metadata"
        poster={media.poster}
        aria-label={media.alt}
      >
        <source src={media.video.webm} type="video/webm" />
        <source src={media.video.mp4} type="video/mp4" />
      </video>
    );
  }
  return <img className="card-media" src={media.image} alt={media.alt} loading="lazy" />;
}

export default function WorkCard({ title, impact, media, links }) {
  return (
    <article className="card">
      {media && <Media media={media} />}
      <h3 className="card-title">{title}</h3>
      <p className="card-impact">{impact}</p>
      <LinkChips links={links} />
    </article>
  );
}
```

`src/sections/Work.jsx`:

```jsx
import Section from "../components/Section";
import WorkCard from "../components/WorkCard";

export default function Work({ items }) {
  return (
    <Section id="work" label="selected reconstructions">
      <div className="work-grid">
        {items.map((w) => (
          <WorkCard key={w.title} {...w} />
        ))}
      </div>
    </Section>
  );
}
```

`src/App.jsx` — add the import `import Work from "./sections/Work";`, add `work` to the content import, and render `<Work items={work} />` directly after `<Hero … />`.

Append to `src/styles.css`:

```css
.section {
  padding: 48px 0;
  border-top: 1px solid var(--border);
  animation: fade-in 200ms ease-out both;
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
.section-label {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin: 0 0 20px;
}
.work-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 20px;
}
.card-media {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
}
.card-title {
  font-size: 15.5px;
  font-weight: 500;
  margin: 12px 0 0;
}
.card-impact {
  font-size: 14px;
  color: var(--muted);
  margin: 4px 0 0;
}
@media (max-width: 640px) {
  .work-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Section.jsx src/components/WorkCard.jsx src/sections/Work.jsx src/sections/Work.test.jsx src/App.jsx src/styles.css
git commit -m "feat: add selected reconstructions grid

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Experience, Publications, Education, Contact, Footer

**Files:**
- Create: `src/lib/groupByYear.js`, `src/components/PubItem.jsx`, `src/sections/Experience.jsx`, `src/sections/Publications.jsx`, `src/sections/Education.jsx`, `src/sections/Contact.jsx`, `src/sections/Footer.jsx`, `src/sections/sections.test.jsx`
- Modify: `src/App.jsx` (final composition), `src/styles.css` (append)

**Interfaces:**
- Consumes: `experience`, `publications`, `education`, `contact`, `profile` (Task 2); `Section` (Task 6); `LinkChips` (Task 5).
- Produces: `groupByYear(pubs): [year: number, pubs[]][]` sorted by year descending, input order preserved within a year; `renderAuthors(authors: string): ReactNode[]` exported from `PubItem.jsx`; section components `<Experience items />`, `<Publications items />`, `<Education items />`, `<Contact contact />`, `<Footer name />`.

- [ ] **Step 1: Write failing tests `src/sections/sections.test.jsx`**

```jsx
import { render, screen, within } from "@testing-library/react";
import Experience from "./Experience";
import Publications from "./Publications";
import Education from "./Education";
import Contact from "./Contact";
import { groupByYear } from "../lib/groupByYear";
import { experience, publications, education, contact } from "../content";

test("groupByYear sorts years descending regardless of input order", () => {
  const out = groupByYear([
    { year: 2020, title: "a" },
    { year: 2026, title: "b" },
    { year: 2020, title: "c" },
  ]);
  expect(out.map(([y]) => y)).toEqual([2026, 2020]);
  expect(out[1][1].map((p) => p.title)).toEqual(["a", "c"]);
});

test("experience lists every role with dates", () => {
  render(<Experience items={experience} />);
  const section = screen.getByRole("region", { name: "// experience" });
  for (const e of experience) {
    expect(within(section).getByText(e.org, { exact: false })).toBeInTheDocument();
    expect(within(section).getByText(`${e.start} – ${e.end}`)).toBeInTheDocument();
  }
});

test("publications bold the owner's name and tag patents", () => {
  const { container } = render(<Publications items={publications} />);
  expect(container.querySelector("strong")).toHaveTextContent("C. Gudavalli");
  expect(screen.getAllByText("patent")).toHaveLength(publications.filter((p) => p.type === "patent").length);
  expect(screen.getByRole("heading", { name: "2026" })).toBeInTheDocument();
});

test("renders unlinked title when href missing", () => {
  render(<Publications items={[{ year: 2024, type: "paper", title: "No Link Paper", authors: "C. Gudavalli", venue: "V" }]} />);
  expect(screen.getByText("No Link Paper").closest("a")).toBeNull();
});

test("education and contact render; contact has no phone", () => {
  render(<Education items={education} />);
  expect(screen.getByText(education[0].degree, { exact: false })).toBeInTheDocument();
  const { container } = render(<Contact contact={contact} />);
  expect(screen.getByRole("link", { name: /chandrakanthgudavalli@gmail\.com/ })).toHaveAttribute("href", contact.email);
  expect(container.textContent).not.toMatch(/\d{3}[-.\s]\d{3}[-.\s]\d{4}/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/sections/sections.test.jsx`
Expected: FAIL — cannot resolve `./Experience`.

- [ ] **Step 3: Implement**

`src/lib/groupByYear.js`:

```js
export function groupByYear(pubs) {
  const map = new Map();
  for (const p of pubs) {
    if (!map.has(p.year)) map.set(p.year, []);
    map.get(p.year).push(p);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
```

`src/components/PubItem.jsx`:

```jsx
const OWNER = /(C\. Gudavalli)/;

export function renderAuthors(authors) {
  return authors.split(OWNER).map((part, i) => (OWNER.test(part) ? <strong key={i}>{part}</strong> : part));
}

export default function PubItem({ title, authors, venue, href, type }) {
  return (
    <li className="pub">
      <div className="pub-title">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          <span>{title}</span>
        )}
        {type === "patent" && <span className="tag mono">patent</span>}
      </div>
      <div className="pub-authors">{renderAuthors(authors)}</div>
      <div className="pub-venue mono">{venue}</div>
    </li>
  );
}
```

`src/sections/Experience.jsx`:

```jsx
import Section from "../components/Section";

export default function Experience({ items }) {
  return (
    <Section id="experience" label="experience">
      <ol className="exp-list">
        {items.map((e) => (
          <li key={e.org} className={e.compact ? "exp compact" : "exp"}>
            <div className="exp-head">
              <span>
                <span className="exp-org">{e.org}</span> — {e.role}
              </span>
              <span className="exp-dates mono">{`${e.start} – ${e.end}`}</span>
            </div>
            <div className="exp-loc">{e.location}</div>
            <ul className="exp-bullets">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/sections/Publications.jsx`:

```jsx
import Section from "../components/Section";
import PubItem from "../components/PubItem";
import { groupByYear } from "../lib/groupByYear";

export default function Publications({ items }) {
  return (
    <Section id="publications" label="publications & patents">
      {groupByYear(items).map(([year, pubs]) => (
        <div key={year} className="pub-year">
          <h3 className="pub-year-label mono">{year}</h3>
          <ul className="pub-list">
            {pubs.map((p) => (
              <PubItem key={p.title} {...p} />
            ))}
          </ul>
        </div>
      ))}
    </Section>
  );
}
```

`src/sections/Education.jsx`:

```jsx
import Section from "../components/Section";

export default function Education({ items }) {
  return (
    <Section id="education" label="education">
      <ul className="edu-list">
        {items.map((e) => (
          <li key={e.degree}>
            <span>
              {e.degree}, <span className="muted">{e.school}</span>
            </span>
            <span className="mono muted">{e.year}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

`src/sections/Contact.jsx`:

```jsx
import Section from "../components/Section";
import LinkChips from "../components/LinkChips";

export default function Contact({ contact }) {
  return (
    <Section id="contact" label="contact">
      <p className="contact-blurb">{contact.blurb}</p>
      <LinkChips
        className="hero-links"
        links={[
          { label: contact.email.replace("mailto:", ""), href: contact.email },
          { label: "linkedin", href: contact.linkedin },
        ]}
      />
    </Section>
  );
}
```

`src/sections/Footer.jsx`:

```jsx
export default function Footer({ name }) {
  return (
    <footer className="footer mono">
      © {new Date().getFullYear()} {name}
    </footer>
  );
}
```

`src/App.jsx` (final):

```jsx
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import Experience from "./sections/Experience";
import Publications from "./sections/Publications";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import { useTheme } from "./hooks/useTheme";
import { sections, profile, hero, work, experience, publications, education, contact } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <Hero profile={profile} hero={hero} />
        <Work items={work} />
        <Experience items={experience} />
        <Publications items={publications} />
        <Education items={education} />
        <Contact contact={contact} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
```

Append to `src/styles.css`:

```css
.exp-list,
.exp-bullets,
.pub-list,
.edu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.exp + .exp {
  margin-top: 28px;
}
.exp-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.exp-org {
  font-weight: 500;
}
.exp-dates,
.exp-loc {
  font-size: 12.5px;
  color: var(--muted);
}
.exp-bullets li {
  font-size: 14.5px;
  color: var(--muted);
  margin-top: 6px;
  padding-left: 14px;
  position: relative;
}
.exp-bullets li::before {
  content: "–";
  position: absolute;
  left: 0;
}
.exp.compact + .exp.compact {
  margin-top: 16px;
}
.pub-year + .pub-year {
  margin-top: 22px;
}
.pub-year-label {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin: 0 0 8px;
}
.pub + .pub {
  margin-top: 14px;
}
.pub-title {
  font-size: 15px;
}
.pub-title a {
  color: var(--text);
}
.pub-title a:hover {
  color: var(--accent);
}
.pub-authors {
  font-size: 13.5px;
  color: var(--muted);
}
.pub-authors strong {
  color: var(--text);
  font-weight: 500;
}
.pub-venue {
  font-size: 12px;
  color: var(--muted);
}
.tag {
  font-size: 10.5px;
  color: var(--accent);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 6px;
  margin-left: 8px;
  vertical-align: 2px;
}
.edu-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;
}
.edu-list li + li {
  margin-top: 8px;
}
.contact-blurb {
  margin: 0;
}
.footer {
  text-align: center;
  font-size: 12px;
  color: var(--muted);
  padding: 32px 20px 48px;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/groupByYear.js src/components/PubItem.jsx src/sections src/App.jsx src/styles.css
git commit -m "feat: add experience, publications, education, contact and footer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Media pipeline, resume, social image

**Files:**
- Create: `scripts/encode-media.sh`, `src/media.test.js`, `public/media/*` (generated), `public/resume.pdf`, `public/og-image.jpg`

**Interfaces:**
- Consumes: every site-absolute path in `src/content.js` (Task 2); `assets/dense_reconstruction_of_whole_JHU_campus.webm`, `assets/mxreg_video (1).mp4`, `Resume__Chandrakanth_Gudavalli.pdf` (local, untracked).
- Produces: files at exactly the paths content references: `/media/hero-{poses,dense}.{webm,mp4,jpg}`, `/media/metareg.{webm,mp4,jpg}`, `/media/wriva.jpg`, `/media/campus.jpg`, `/media/geoloc.jpg`, `/resume.pdf`; plus `/og-image.jpg`.

- [ ] **Step 1: Write failing test `src/media.test.js`**

```js
import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as content from "./content";

const PUBLIC = fileURLToPath(new URL("../public", import.meta.url));

function localPaths(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => localPaths(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((v) => localPaths(v, out));
  else if (typeof node === "string" && /^\/[^/]/.test(node)) out.push(node);
  return out;
}

test("every site-absolute path in content exists in public/", () => {
  const missing = localPaths(content).filter((p) => !existsSync(join(PUBLIC, p)));
  expect(missing).toEqual([]);
});

test("each media file is at most 2.5 MB", () => {
  const dir = join(PUBLIC, "media");
  const big = readdirSync(dir)
    .map((f) => [f, statSync(join(dir, f)).size])
    .filter(([, size]) => size > 2.5 * 1024 * 1024);
  expect(big).toEqual([]);
});

test("social preview image exists", () => {
  expect(existsSync(join(PUBLIC, "og-image.jpg"))).toBe(true);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- src/media.test.js`
Expected: FAIL — missing paths listed; `public/media` does not exist.

- [ ] **Step 3: Write `scripts/encode-media.sh`**

```bash
#!/usr/bin/env bash
# Builds public/media from the raw (git-ignored) videos in assets/.
# Usage: npm run media   (tweak HERO_START / HERO_DUR / CRF_* via env)
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets
OUT=public/media
JHU="$SRC/dense_reconstruction_of_whole_JHU_campus.webm"
MX="$SRC/mxreg_video (1).mp4"
HERO_START=${HERO_START:-2}
HERO_DUR=${HERO_DUR:-14}
CRF_VP9=${CRF_VP9:-40}
CRF_H264=${CRF_H264:-28}
mkdir -p "$OUT"

# encode <input> <start> <duration> <filter> <name>
encode() {
  local in=$1 ss=$2 t=$3 vf=$4 name=$5
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "$vf,fps=24" -an \
    -c:v libvpx-vp9 -b:v 0 -crf "$CRF_VP9" -row-mt 1 "$OUT/$name.webm"
  ffmpeg -v error -y -ss "$ss" -t "$t" -i "$in" -vf "$vf,fps=24" -an \
    -c:v libx264 -preset slow -crf "$CRF_H264" -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$in" -vf "$vf" -frames:v 1 -q:v 4 "$OUT/$name.jpg"
}

# Hero: the JHU video stacks the dense model (top half) over the camera poses (bottom half).
encode "$JHU" "$HERO_START" "$HERO_DUR" "crop=iw:ih/2:0:0,scale=960:-2" hero-dense
encode "$JHU" "$HERO_START" "$HERO_DUR" "crop=iw:ih/2:0:ih/2,scale=960:-2" hero-poses

# MetaReg card video.
encode "$MX" 0 8 "scale=720:-2" metareg

# WRIVA card still: aerial view from the dense half.
ffmpeg -v error -y -ss 38 -i "$JHU" -vf "crop=iw:ih/2:0:0,scale=800:-2" -frames:v 1 -q:v 4 "$OUT/wriva.jpg"

# Campus card still: YouTube thumbnail of the UCSB drone reconstruction.
curl -fsSL "https://img.youtube.com/vi/2GJS7BRKg1s/maxresdefault.jpg" -o "$OUT/campus.jpg" ||
  curl -fsSL "https://img.youtube.com/vi/2GJS7BRKg1s/hqdefault.jpg" -o "$OUT/campus.jpg"

# Social preview (1200x630) from the dense model.
ffmpeg -v error -y -ss "$HERO_START" -i "$JHU" \
  -vf "crop=iw:ih/2:0:0,scale=-2:630,crop=1200:630" -frames:v 1 -q:v 3 public/og-image.jpg

ls -lh "$OUT" public/og-image.jpg
```

- [ ] **Step 4: Run the script and check sizes**

Run: `chmod +x scripts/encode-media.sh && npm run media`
Expected: lists files; every `public/media/*` ≤ 2.5 MB. If a hero clip exceeds 2.5 MB, rerun with `CRF_VP9=44 CRF_H264=31 npm run media`.

- [ ] **Step 5: Check the visuals**

Extract and view the posters (`public/media/hero-dense.jpg`, `hero-poses.jpg`, `wriva.jpg`, `metareg.jpg`, `campus.jpg`, `public/og-image.jpg`) with the Read tool. Confirm: hero-dense shows the photoreal campus, hero-poses shows red camera frustums, wriva shows an aerial view (if not, change `-ss 38` to another second in 30–44 and rerun). If the first second of the hero looks like a blank fade-in, set `HERO_START` to a later second and rerun.

- [ ] **Step 6: Create the geolocalization card image**

```bash
mkdir -p /tmp/geoloc && curl -fsSL https://arxiv.org/pdf/2602.14929 -o /tmp/geoloc/paper.pdf
pdftoppm -f 1 -l 1 -r 150 -jpeg /tmp/geoloc/paper.pdf /tmp/geoloc/p1
```

View `/tmp/geoloc/p1-1.jpg`. If page 1 has a teaser figure, crop it to roughly 16:10 with
`ffmpeg -v error -y -i /tmp/geoloc/p1-1.jpg -vf "crop=W:H:X:Y,scale=800:-2" -q:v 4 public/media/geoloc.jpg`, choosing `W:H:X:Y` from the viewed image, and view the result. If there is no usable figure, remove the `media` field from the "Ground → satellite" entry in `src/content.js` (the card then renders text-only).

- [ ] **Step 7: Copy the resume**

```bash
cp Resume__Chandrakanth_Gudavalli.pdf public/resume.pdf
```

- [ ] **Step 8: Run all tests**

Run: `npm test`
Expected: all PASS, including `src/media.test.js`.

- [ ] **Step 9: Commit**

```bash
git add scripts/encode-media.sh src/media.test.js public/media public/resume.pdf public/og-image.jpg src/content.js
git commit -m "feat: add media pipeline, encoded reconstructions, resume and social image

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Docs, build verification, manual review

**Files:**
- Modify: `CLAUDE.md` (rewrite for new architecture)

**Interfaces:**
- Consumes: everything above.
- Produces: a verified production build in `dist/`, ready for user-approved deploy.

- [ ] **Step 1: Rewrite `CLAUDE.md`**

```markdown
# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Commands

npm run dev        # dev server (Vite)
npm test           # Vitest, run once
npm run build      # production build to dist/
npm run preview    # serve dist/ locally
npm run media      # re-encode public/media from raw videos in assets/ (needs ffmpeg)
npm run deploy     # build + publish dist/ to the gh-pages branch (ask before running)

Prettier runs on staged files via a husky pre-commit hook.

## Architecture

Single-page Vite + React 18 site served at chandrakanthgudavalli.com (GitHub Pages, `public/CNAME`).

- `src/content.js` — ALL site copy, links and media paths. Edit this to update the site.
- `src/App.jsx` — composes Nav + sections in order.
- `src/sections/` — Hero, Work, Experience, Publications, Education, Contact, Footer (presentational; content via props).
- `src/components/` — Nav, ThemeToggle, VideoPane, WorkCard, PubItem, LinkChips, Section.
- `src/hooks/` — useTheme (OS default, persisted on toggle), useActiveSection (nav highlight).
- `src/styles.css` — design tokens (Night default, `[data-theme="light"]`) and all styles.
- `public/media/` — encoded videos/images generated by `scripts/encode-media.sh`; raw sources live in git-ignored `assets/`.

## Rules

- No phone number in site content (enforced by `src/content.test.js`).
- Every media path in content must exist in `public/` and media files must be ≤ 2.5 MB (`src/media.test.js`).
- Keep runtime deps to react, react-dom and the two @fontsource packages.
```

- [ ] **Step 2: Full test run and build**

Run: `npm test && npm run build && du -sh dist && du -ah dist | sort -h | tail -8`
Expected: all tests PASS; build succeeds; `dist` total < 8 MB.

- [ ] **Step 3: Serve for manual review**

Run (background): `npm run preview -- --host 127.0.0.1 --port 4173`
Tell the user to forward the port (`ssh -L 4173:localhost:4173 <host>`) and open `http://localhost:4173/`. Ask them to check at desktop width and phone width (devtools 375 px), in both themes, and with reduced motion enabled (devtools → Rendering → emulate `prefers-reduced-motion`). Collect feedback; fix issues as separate commits with tests where behavior changes.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for the rebuilt site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Hand off**

Report test results, `dist` size, and the preview URL. Ask the user (a) for approval to run `npm run deploy`, and (b) whether to delete the untracked Scholar HTML dump and `1790977736926.jpeg`. Do not do either without a yes.
