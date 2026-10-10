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
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
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
