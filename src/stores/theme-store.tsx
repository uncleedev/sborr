import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  initialize: () => void;
}

const storageKey = "app-theme";

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem(storageKey) as Theme) || "system",

  setTheme: (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    set({ theme });

    // Apply immediately
    applyTheme(theme);
  },

  initialize: () => {
    const stored = (localStorage.getItem(storageKey) as Theme) || "system";
    set({ theme: stored });
    applyTheme(stored);
  },
}));

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}
