"use client";

import { useEffect } from "react";
import { getSavedTheme, applyTheme } from "@/utils/themeManager";

export default function ThemeInitializer() {
  useEffect(() => {
    const theme = getSavedTheme();
    applyTheme(theme);
  }, []);

  return null;
}
