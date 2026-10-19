import * as content from "./content";
const {
  profile,
  hero,
  work,
  experience,
  publications,
  education,
  contact,
  sections,
} = content;

const URL_KEYS = new Set([
  "href",
  "webm",
  "mp4",
  "poster",
  "image",
  "resume",
  "linkedin",
  "scholar",
]);

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
  expect(profile.tagline).toBe(
    "3D reconstruction · SfM · Gaussian Splatting · Diffusion Models",
  );
  expect(profile.bio.length).toBeGreaterThan(40);
  for (const k of ["resume", "linkedin", "scholar", "email"])
    expect(profile.links[k]).toBeTruthy();
  expect(profile.highlight.text).toMatch(
    /^#1 · IARPA WRIVA Cross-View Geo-Localization Challenge 2026$/,
  );
});

test("every link and media path is https or site-absolute", () => {
  const urls = collectUrls(content);
  expect(urls.length).toBeGreaterThan(20);
  for (const u of urls) expect(u).toMatch(/^(https:\/\/|\/[^/])/);
});

test("no phone number appears anywhere in content", () => {
  const text = JSON.stringify(content);
  expect(text).not.toMatch(
    /(?<![\d-])\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}(?![\d-])/,
  );
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
    for (const b of e.bullets)
      expect(b.split(/\s+/).length).toBeLessThanOrEqual(28);
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
  expect(contact.email).toMatch(/^[^\s@:]+@[^\s@]+\.[a-z]+$/);
  expect(profile.links.email).toBe(contact.email);
  expect(sections.map((s) => s.id)).toEqual([
    "work",
    "experience",
    "publications",
    "contact",
  ]);
});
