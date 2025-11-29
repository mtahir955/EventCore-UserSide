"use client";

export type AllowedTheme = "light" | "dark";

/* ===============================
    GET THEME FROM LOCAL STORAGE
================================ */
export const getSavedTheme = (): AllowedTheme => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem("adminTheme");
  return saved === "dark" ? "dark" : "light";
};

/* ===============================
    APPLY THEME TO DOCUMENT ROOT
================================ */
export const applyTheme = (theme: AllowedTheme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

/* ===============================
    SAVE AND APPLY THEME
================================ */
export const setThemeGlobal = (theme: AllowedTheme) => {
  localStorage.setItem("adminTheme", theme);
  applyTheme(theme);
};

/* ===============================
    SYNC THEME WITH BACKEND USER
================================ */
export const syncThemeWithBackend = (backendUser: any) => {
  if (!backendUser?.theme) return;

  const backendTheme = backendUser.theme === "dark" ? "dark" : "light";

  localStorage.setItem("adminTheme", backendTheme);
  applyTheme(backendTheme);
};
