"use client"

import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

const themes = [
  {
    id: "cosmic",
    name: "Космічна",
    description: "Глибокий синьо-фіолетовий",
    preview: "linear-gradient(135deg, oklch(0.65 0.25 280), oklch(0.55 0.2 240))",
  },
  {
    id: "nebula",
    name: "Туманність",
    description: "Рожево-пурпурний",
    preview: "linear-gradient(135deg, oklch(0.65 0.25 330), oklch(0.6 0.22 300))",
  },
  {
    id: "aurora",
    name: "Аврора",
    description: "Зелено-бірюзовий",
    preview: "linear-gradient(135deg, oklch(0.7 0.2 160), oklch(0.65 0.18 200))",
  },
  {
    id: "solar",
    name: "Сонячна",
    description: "Помаранчево-жовтий",
    preview: "linear-gradient(135deg, oklch(0.75 0.2 60), oklch(0.7 0.18 40))",
  },
  {
    id: "crimson",
    name: "Багряна",
    description: "Червоно-рожевий",
    preview: "linear-gradient(135deg, oklch(0.6 0.25 20), oklch(0.65 0.22 350))",
  },
  {
    id: "ocean",
    name: "Океанічна",
    description: "Синьо-блакитний",
    preview: "linear-gradient(135deg, oklch(0.6 0.2 220), oklch(0.65 0.18 200))",
  },
]

export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState("cosmic")

  useEffect(() => {
    const savedTheme = localStorage.getItem("exovision-theme") || "cosmic"
    setCurrentTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    localStorage.setItem("exovision-theme", themeId)
    document.documentElement.setAttribute("data-theme", themeId)
  }

  const currentThemeData = themes.find((t) => t.id === currentTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-transparent">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Вибрати колірну тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Колірна палітра</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => changeTheme(theme.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-md border-2 border-border" style={{ background: theme.preview }} />
            <div className="flex-1">
              <div className="font-medium flex items-center gap-2">
                {theme.name}
                {currentTheme === theme.id && <span className="text-xs text-primary">✓</span>}
              </div>
              <div className="text-xs text-muted-foreground">{theme.description}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
