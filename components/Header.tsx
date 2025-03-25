"use client"

import ThemeToggle from "@/components/ThemeToggle"
import { Activity } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

export default function Header() {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)] transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-[var(--accent)]" />
          <h1 className="text-xl font-bold text-[var(--text)]">SystemDashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1 text-sm text-[var(--muted)]">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>System Online</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

