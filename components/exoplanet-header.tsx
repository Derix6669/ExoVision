"use client"

import { Button } from "@/components/ui/button"
import { Telescope, BookOpen, Info } from "lucide-react"
import { ThemeSelector } from "@/components/theme-selector"

interface ExoplanetHeaderProps {
  onLearnClick?: () => void
  onAboutClick?: () => void
  isModalOpen?: boolean
}

export function ExoplanetHeader({ onLearnClick, onAboutClick, isModalOpen }: ExoplanetHeaderProps) {
  return (
    <header
      className={`relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        isModalOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Telescope className="h-6 w-6 text-primary" />
          <h1 className="glow-purple text-xl font-bold">Exoplanet Discovery</h1>
        </div>
        <nav className="flex items-center gap-2">
          <ThemeSelector />
          <Button variant="ghost" size="sm" onClick={onLearnClick}>
            <BookOpen className="mr-2 h-4 w-4" />
            Learn
          </Button>
          <Button variant="ghost" size="sm" onClick={onAboutClick}>
            <Info className="mr-2 h-4 w-4" />
            About
          </Button>
        </nav>
      </div>
    </header>
  )
}
