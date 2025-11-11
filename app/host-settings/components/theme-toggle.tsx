"use client"

import { Sun, Moon } from "lucide-react"

interface ThemeToggleProps {
  isDark: boolean
  setIsDark: (isDark: boolean) => void
}

export default function ThemeToggle({ isDark, setIsDark }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <button
        onClick={() => setIsDark(false)}
        className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
          !isDark ? "bg-foreground text-background" : "hover:bg-muted text-foreground"
        }`}
      >
        <Sun size={16} />
        Light
      </button>
      <button
        onClick={() => setIsDark(true)}
        className={`flex items-center gap-1 px-3 py-1 rounded transition-colors ${
          isDark ? "bg-foreground text-background" : "hover:bg-muted text-foreground"
        }`}
      >
        <Moon size={16} />
        Dark
      </button>
    </div>
  )
}
