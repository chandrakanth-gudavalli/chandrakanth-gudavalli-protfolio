import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import * as content from "./content";

const PUBLIC = join(process.cwd(), "public");

function localPaths(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => localPaths(n, out));
  else if (node && typeof node === "object")
    Object.values(node).forEach((v) => localPaths(v, out));
  else if (typeof node === "string" && /^\/[^/]/.test(node)) out.push(node);
  return out;
}

// Fun projects are served by their own GitHub Pages repos, not from public/.
const { fun, ...siteContent } = content;

test("every site-absolute path in content exists in public/", () => {
  const missing = localPaths(siteContent).filter(
    (p) => !existsSync(join(PUBLIC, p)),
  );
  expect(missing).toEqual([]);
});

test("public/ never shadows a fun project's path", () => {
  const clashes = fun.filter((f) => existsSync(join(PUBLIC, f.href)));
  expect(clashes).toEqual([]);
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

test("site is configured for the www domain", () => {
  const cname = readFileSync(join(PUBLIC, "CNAME"), "utf8").trim();
  expect(cname).toBe("www.chandrakanthgudavalli.com");
  const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
  expect(html).not.toMatch(/https:\/\/chandrakanthgudavalli\.com/);
  expect(html).toContain('href="https://www.chandrakanthgudavalli.com/"');
});
