import { render, screen, act } from "@testing-library/react";
import Nav from "./Nav";

const sections = [
  { id: "work", label: "work" },
  { id: "contact", label: "contact" },
];

test("renders anchors for each section and the theme toggle", () => {
  render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />);
  expect(screen.getByRole("link", { name: "work" })).toHaveAttribute(
    "href",
    "#work",
  );
  expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute(
    "href",
    "#contact",
  );
  expect(screen.getByRole("link", { name: "~/cg" })).toHaveAttribute(
    "href",
    "#top",
  );
  expect(
    screen.getByRole("button", { name: /switch to light theme/i }),
  ).toBeInTheDocument();
});

test("renders without IntersectionObserver", () => {
  const saved = window.IntersectionObserver;
  delete window.IntersectionObserver;
  expect(() =>
    render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />),
  ).not.toThrow();
  window.IntersectionObserver = saved;
});

test("marks the intersecting section as current", () => {
  document.body.innerHTML =
    '<section id="work"></section><section id="contact"></section>';
  let cb;
  window.IntersectionObserver = class {
    constructor(fn) {
      cb = fn;
    }
    observe() {}
    disconnect() {}
  };
  render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />);
  act(() =>
    cb([{ isIntersecting: true, target: document.getElementById("contact") }]),
  );
  expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  expect(screen.getByRole("link", { name: "work" })).not.toHaveAttribute(
    "aria-current",
  );
  delete window.IntersectionObserver;
});

test("marks the last section current when scrolled to the page bottom", () => {
  document.body.innerHTML =
    '<section id="work"></section><section id="contact"></section>';
  const define = (obj, key, value) =>
    Object.defineProperty(obj, key, { value, configurable: true });
  define(window, "innerHeight", 800);
  define(window, "scrollY", 1200);
  define(document.documentElement, "scrollHeight", 2000);
  render(<Nav sections={sections} theme="dark" onToggleTheme={() => {}} />);
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
  expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute(
    "aria-current",
    "true",
  );
  expect(screen.getByRole("link", { name: "work" })).not.toHaveAttribute(
    "aria-current",
  );
  define(window, "scrollY", 0);
  define(document.documentElement, "scrollHeight", 0);
});
