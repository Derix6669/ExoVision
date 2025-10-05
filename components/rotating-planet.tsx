"use client"

import { useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export function RotatingPlanet() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 240
    canvas.height = 240

    let rotation = 0

    const drawPlanet = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 85

      ctx.globalAlpha = 0.3
      const outerGlow = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, radius + 30)
      outerGlow.addColorStop(0, "rgba(100, 200, 255, 0.4)")
      outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = outerGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.clip()

      const gradient = ctx.createRadialGradient(centerX - 25, centerY - 25, 10, centerX, centerY, radius * 1.5)
      gradient.addColorStop(0, "#a8d8ff")
      gradient.addColorStop(0.3, "#5eb3e8")
      gradient.addColorStop(0.6, "#2e7fb8")
      gradient.addColorStop(1, "#1a4d7a")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      ctx.translate(-centerX, -centerY)

      for (let i = 0; i < 8; i++) {
        const y = (i / 8) * canvas.height
        const bandHeight = canvas.height / 8
        const opacity = 0.15 + Math.sin(rotation * 5 + i) * 0.1

        ctx.globalAlpha = opacity
        ctx.fillStyle = i % 2 === 0 ? "#4a9fd8" : "#3a8fc8"
        ctx.fillRect(0, y, canvas.width, bandHeight)
      }

      ctx.restore()

      ctx.globalAlpha = 0.4
      const shadowGradient = ctx.createRadialGradient(
        centerX + 40,
        centerY + 20,
        10,
        centerX + 40,
        centerY + 20,
        radius,
      )
      shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.6)")
      shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = shadowGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1

      ctx.globalAlpha = 0.5
      const highlight = ctx.createRadialGradient(centerX - 30, centerY - 30, 0, centerX - 30, centerY - 30, 40)
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.9)")
      highlight.addColorStop(0.5, "rgba(255, 255, 255, 0.3)")
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.fillStyle = highlight
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1

      ctx.restore()

      rotation += 0.005
      requestAnimationFrame(drawPlanet)
    }

    drawPlanet()
  }, [])

  const handleClick = () => {
    router.push("/visualization-3d")
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center gap-4 cursor-pointer group transition-all duration-300 hover:scale-105"
    >
      <canvas
        ref={canvasRef}
        className="drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(100,200,255,0.5)] transition-all duration-300"
      />
      <p className="text-sm font-medium text-muted-foreground/80 group-hover:text-cyan-400 transition-colors duration-300 tracking-wide">
        Click to Explore
      </p>
    </div>
  )
}
