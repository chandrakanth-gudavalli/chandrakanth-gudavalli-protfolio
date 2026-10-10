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
  fireEvent.click(
    screen.getByRole("button", { name: /switch to light theme/i }),
  );
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(localStorage.getItem("theme")).toBe("light");
});

test("survives localStorage throwing", () => {
  const get = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("blocked");
  });
  render(<Harness />);
  fireEvent.click(screen.getByRole("button"));
  expect(document.documentElement.dataset.theme).toBe("light");
  get.mockRestore();
  set.mockRestore();
});
