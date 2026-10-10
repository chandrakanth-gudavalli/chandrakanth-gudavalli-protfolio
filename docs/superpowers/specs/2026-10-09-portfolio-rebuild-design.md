# Portfolio Rebuild — Design Spec

Date: 2026-10-09 · Branch: `bellerophon` · Status: awaiting review

## 1. Goal

Replace the outdated 2019-era React 16 portfolio with a calm, minimal, single-page site that, within a few seconds, convinces an **industry recruiter** that Chandrakanth is strong at **3D reconstruction**.

Success criteria:

- Above the fold: name, reconstruction-focused tagline, short bio, links (resume, LinkedIn, Scholar, email) and a visual of a real reconstruction.
- Content matches the current resume (`Resume__Chandrakanth_Gudavalli.pdf`, 2026).
- Visually calm: dark "Night" theme, one accent color, generous whitespace, no clutter.
- Fast: no heavy UI libraries; hero media ≤ ~5 MB total and does not block first paint.
- Easy to update: all content in one file.

Non-goals: blog, contact form/backend, GitHub statistics, CMS, analytics.

## 2. Decisions made during brainstorming

| Topic          | Decision                                                                                |
| -------------- | --------------------------------------------------------------------------------------- |
| Approach       | Lean rebuild (not restyle-in-place, not a static-site theme)                            |
| Visual style   | "Night": soft charcoal background, muted teal accent, monospace labels; light theme too |
| Layout         | Single centered scrolling column with a slim sticky top nav                             |
| Positioning    | 3D reconstruction first; BisQue/Kubernetes work lives in Experience, not hero/work      |
| Tagline        | `3D reconstruction · SfM · Gaussian Splatting · Diffusion Models`                       |
| Hero visual    | Pipeline pair: camera-poses video + dense-model video, synced, in viewer frames         |
| Domain         | `chandrakanthgudavalli.com` (add `public/CNAME`)                                        |
| Phone number   | Not shown on the site (the downloadable resume PDF still contains it)                   |
| Old codebase   | Removed in this branch; recoverable from git history / `main`                           |

## 3. Architecture

**Stack:** Vite + React 18, plain CSS with custom properties. Fonts: Inter (text) and JetBrains Mono (labels), self-hosted via `@fontsource` packages. Tests: Vitest + React Testing Library. Deploy: `gh-pages` to the `gh-pages` branch, unchanged workflow (`npm run deploy`).

Runtime dependencies: `react`, `react-dom`, `@fontsource/inter`, `@fontsource/jetbrains-mono`. No router (single page with hash anchors), no UI kit, no CSS-in-JS.

**File layout**

```
index.html                 # Vite entry; SEO + Open Graph meta
public/
  CNAME                    # chandrakanthgudavalli.com
  resume.pdf               # copy of the resume
  og-image.jpg             # 1200×630 social preview (frame from hero video)
  favicon.svg
  media/
    hero-poses.webm/.mp4   # bottom half of JHU video, ~12–15 s loop
    hero-dense.webm/.mp4   # top half of JHU video, same time range
    hero-poses.jpg         # poster frames
    hero-dense.jpg
    metareg.webm/.mp4      # card video (from assets/mxreg_video (1).mp4)
    metareg.jpg
    wriva.jpg              # YouTube thumbnail, saved locally
    campus.jpg             # YouTube thumbnail, saved locally
    geoloc.jpg             # figure/frame for the CVPR 2026 card
src/
  main.jsx
  App.jsx                  # renders Nav + sections in order
  content.js               # ALL site content (the only file edited for updates)
  styles.css               # tokens + base + section styles
  hooks/useTheme.js        # theme state: OS preference → Night default, persisted
  hooks/useActiveSection.js# IntersectionObserver for nav highlight
  components/
    Nav.jsx  ThemeToggle.jsx  VideoPane.jsx  WorkCard.jsx  PubItem.jsx  LinkChips.jsx
  sections/
    Hero.jsx  Work.jsx  Experience.jsx  Publications.jsx  Education.jsx  Contact.jsx
scripts/
  encode-media.sh          # reproducible ffmpeg commands that build public/media from assets/
```

Each section component takes its slice of `content.js` as props and does no data fetching. Components are presentational and small.

**Removed:** `src/` of the old app (containers, components, pages, theme.js, portfolio.js, shared/, assests/), CRA config, ~30 obsolete deps (bootstrap, baseui, styletron, radium, styled-components, apollo, chart.js, node-sass, react-reveal, react-spring, etc.), `src/shared/opensource/*` and the Google Scholar HTML dump after publications are verified. Husky + lint-staged + prettier are kept (prettier upgraded to v3).

`assets/` (raw source videos, 100+ MB) is git-ignored; only encoded outputs in `public/media/` are committed.

## 4. Content model (`src/content.js`)

```js
export const profile = {
  name, tagline, bio,                       // strings
  links: { resume, linkedin, scholar, email },
};
export const hero = {
  caption: "images → SfM cameras → dense reconstruction",
  panes: [ { label, video: {webm, mp4}, poster }, ... ],  // exactly 2
};
export const work = [ { title, impact, media: {image | video}, links: [{label, href}] } ];
export const experience = [ { org, role, location, start, end, bullets: [string], compact?: bool } ];
export const publications = [ { year, title, authors, venue, href, type: "paper" | "patent" } ];
export const education = [ { degree, school, year } ];
export const contact = { blurb, email, linkedin };
```

Author name "Gudavalli" / "C. Gudavalli" is bolded automatically when rendering `authors`.

## 5. Page sections

Order: Nav → Hero → Work → Experience → Publications → Education → Contact → footer.

**Nav** — sticky, slim, translucent background. Left `~/cg`; right anchors `work · experience · publications · contact` + theme toggle (☾/☀). Active section highlighted via IntersectionObserver. On narrow screens anchors remain, scroll horizontally if needed; no hamburger.

**Hero**

- Name; mono tagline `3D reconstruction · SfM · Gaussian Splatting · Diffusion Models`.
- Bio: "I build 3D reconstruction systems that hold up on messy, real-world imagery — from Structure-from-Motion and camera pose estimation to Gaussian Splatting, at campus and city scale."
- Link row: `resume.pdf · linkedin · scholar · email`.
- Pipeline pair: two `VideoPane`s side by side (stacked on < 640 px), each in a "viewer window" frame (dark title bar with mono caption, light video area because source videos have white backgrounds). Labels: `1 · recovered camera poses`, `2 · dense 3D model`. Caption below: `images → SfM cameras → dense reconstruction`.
- Video behavior: `muted playsinline loop preload="metadata"`, poster shown immediately; autoplay starts only when in viewport. The two panes are kept in sync (secondary pane follows the primary's `currentTime` on loop/seek). With `prefers-reduced-motion: reduce`, videos do not autoplay — posters shown with a small play button.

**Selected Work — "Reconstructions"** (2×2 grid, 1 column < 640 px). Each `WorkCard`: media (image, or muted looping video for MetaReg), title, one-line impact, link chips.

1. **Cloud-native SfM for IARPA WRIVA** — "Wide-baseline, mixed-altitude imagery fused with GPS, OSM and satellite priors. #1 on the WRIVA leaderboard, ahead of MIT and Stanford teams." → demo (YouTube `2GJS7BRKg1s`).
2. **Campus-scale reconstruction (UCSB × JHU)** — "Thousands of heterogeneous images reconstructed end-to-end; technical lead for a 14-member cross-institution team." → demo (YouTube `LbreY2Czc7E`), project page (cpeng93.github.io/JHU-in-3D).
3. **Ground → satellite geolocalization via 3DGS** — "Ground-image clusters rendered to a zenith view with Gaussian Splatting and Difix3D, registered to WorldView-3. Sub-10 m camera RMSE." → CVPR 2026 paper (arXiv 2602.14929).
4. **MetaReg: fast incremental registration** — "Custom PnP using noisy GPS and spatial neighbors adds a camera to an existing model in < 1.34 s." → ICIP 2025 (link from Scholar if available).

Mapping of YouTube IDs to WRIVA vs. campus is verified against the videos before implementation; links open in a new tab.

**Experience** — quiet list; each entry: `org — role` and dates on one line, location muted, 2–3 bullets (≤ ~20 words each) condensed from the resume.

- Mayachitra Inc — Research Engineer, 3D Computer Vision (Dec 2019 – present): WRIVA SfM; ground→satellite geolocalization; feed-forward vs. optimization-based pose estimation (VGGT, Pi3 vs. COLMAP/GLOMAP); generative + forensic satellite work with patents.
- Vision Research Lab, UCSB — Visiting Research Staff, ML Ops & 3D Vision (Jun 2022 – present): campus-scale reconstruction; JHU collaboration lead; BisQue on Kubernetes/Argo with GPU workloads and 3D/3DGS viewers.
- NREL — Graduate Intern, Computer Vision (2019) — compact, one line.
- Netcracker — Software Engineer (2015–2017) — compact, one line.

**Publications & Patents** — grouped by year (desc). Each `PubItem`: linked title, authors (own name bold), venue in muted mono, `patent` tag where applicable. All 10 resume items; URLs taken from resume links, filled in from the Google Scholar HTML where missing. Patents: US11842471B2, US20230419655A1.

**Education** — two lines: M.S. Electrical & Computer Engineering, University of Colorado Denver (2019); B.Tech Electronics & Communication Engineering, JNTU (2015). No GPAs.

**Contact** — "Open to 3D vision and spatial-AI roles. The fastest way to reach me is email." + email (mailto) and LinkedIn. No phone, no form.

**Footer** — `© 2026 Chandrakanth Gudavalli` in muted mono.

## 6. Visual system

Tokens on `:root` (Night default) with a `[data-theme="light"]` override:

| Token        | Night     | Light     |
| ------------ | --------- | --------- |
| `--bg`       | `#16181c` | `#f7f7f5` |
| `--surface`  | `#1d2025` | `#ffffff` |
| `--border`   | `#262a30` | `#e4e4e0` |
| `--text`     | `#e6e4df` | `#1f2124` |
| `--muted`    | `#8a8d93` | `#6a6d72` |
| `--accent`   | `#7fb5a8` | `#2f6f62` |

Content column max-width ~680 px (work grid may extend to ~760 px). Body 16–17 px, line-height 1.65. Section labels as mono `// work` etc. Motion: 200 ms fades on section entry only; none under reduced motion. All text/background pairs ≥ 4.5:1 contrast.

## 7. Media pipeline

`scripts/encode-media.sh` (ffmpeg, committed) generates `public/media/` from `assets/`:

- JHU webm (1848×1880, 45.8 s, 102 MB): pick a ~12–15 s segment; crop top half → `hero-dense`, bottom half → `hero-poses`; scale to ~960 px wide; VP9 WebM + H.264 MP4; target ≤ 2.5 MB per clip; posters as JPEG.
- `mxreg_video (1).mp4` (1080×670, 7.8 s, 3.9 MB) → `metareg.webm/.mp4` ~720 px, ≤ 1.5 MB, + poster.
- YouTube thumbnails fetched once (`img.youtube.com/vi/<id>/maxresdefault.jpg`) and saved locally.
- `og-image.jpg`: 1200×630 composite from a hero frame.

## 8. SEO & sharing

`<title>Chandrakanth Gudavalli — 3D Reconstruction Engineer</title>`, meta description from bio, Open Graph + Twitter card tags with `og-image.jpg`, canonical URL `https://chandrakanthgudavalli.com/`, `robots.txt` kept.

## 9. Error handling & resilience

- Video fails to load / unsupported → poster image remains; layout unaffected.
- `localStorage` unavailable → theme falls back to OS preference, no crash (try/catch).
- No JS-fetched data, so no network failure states beyond media.

## 10. Testing & verification

- Vitest: `content.js` schema checks (required fields present; every `href` is absolute `https://` or `mailto:`; exactly 2 hero panes; no phone number pattern anywhere in content); each section renders its content; theme toggle switches `data-theme` and persists.
- `npm run build` succeeds; built `dist/` total size reported (target < 8 MB including media).
- Manual pass in browser at 1280 px and 375 px, both themes, with reduced motion on, before `npm run deploy`.
- Deployment itself is only run after explicit approval.
