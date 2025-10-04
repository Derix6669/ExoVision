"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Star, Calendar, Ruler, Thermometer, Clock } from "lucide-react"
import { useState } from "react"
import { ExoplanetDetailsModal } from "./exoplanet-details-modal"

interface ExoplanetCardProps {
  planet: {
    id: string
    name: string
    hostStar: string
    planetType: string
    discoveryYear: number
    discoveryMethod: string
    stellarDistance: number
    planetRadius: number
    planetMass?: number
    orbitalEccentricity?: number
    orbitalPeriod: number
    equilibriumTemp: number
    status: string
  }
  isComparing?: boolean
  onCompare?: (planet: ExoplanetCardProps["planet"]) => void
}

export function ExoplanetCard({ planet, isComparing = false, onCompare }: ExoplanetCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formatValue = (value: number | null | undefined, decimals = 2, suffix = ""): string => {
    if (value === null || value === undefined || value === 0 || isNaN(value)) {
      return "N/A"
    }
    return `${value.toFixed(decimals)}${suffix}`
  }

  const getPlanetGradient = () => {
    const type = planet.planetType?.toLowerCase() || "unknown"
    const temp = planet.equilibriumTemp || 0
    const isHot = temp > 1000
    const isCold = temp < 200 && temp > 0
    const isHabitable = temp >= 273 && temp <= 373

    switch (type) {
      case "gas giant":
        if (isHot) {
          return "from-orange-500/10 via-red-500/5 to-background"
        }
        return "from-amber-600/10 via-yellow-700/5 to-background"

      case "neptune-like":
        if (isHot) {
          return "from-blue-400/10 via-purple-500/5 to-background"
        }
        return "from-cyan-500/10 via-blue-600/5 to-background"

      case "super earth":
        if (isHabitable) {
          return "from-green-500/10 via-blue-500/5 to-background"
        } else if (isHot) {
          return "from-red-600/10 via-orange-600/5 to-background"
        }
        return "from-slate-500/10 via-gray-600/5 to-background"

      case "terrestrial":
        if (isHabitable) {
          return "from-emerald-500/10 via-teal-500/5 to-background"
        } else if (isHot) {
          return "from-red-700/10 via-orange-700/5 to-background"
        } else if (isCold) {
          return "from-blue-300/10 via-cyan-400/5 to-background"
        }
        return "from-stone-500/10 via-neutral-600/5 to-background"

      default:
        return "from-primary/5 via-primary/3 to-background"
    }
  }

  const getTypeColor = (type: string | undefined) => {
    if (!type) return "bg-muted text-muted-foreground"

    switch (type.toLowerCase()) {
      case "gas giant":
        return "bg-chart-4/20 text-chart-4 border-chart-4/30"
      case "super earth":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30"
      case "terrestrial":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30"
      case "neptune-like":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const isHabitable = planet.equilibriumTemp >= 273 && planet.equilibriumTemp <= 373

  return (
    <>
      <Card
        className={`group h-full min-w-0 overflow-hidden border-border/50 bg-gradient-to-br ${getPlanetGradient()} backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`}
      >
        <CardHeader className="space-y-3">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <Globe className="h-8 w-8 shrink-0 text-primary" />
            <div className="flex min-w-0 flex-wrap items-start justify-end gap-1.5">
              {isHabitable && (
                <Badge variant="outline" className="shrink-0 border-chart-3/50 bg-chart-3/10 text-chart-3 text-xs">
                  Habitable Zone
                </Badge>
              )}
              {planet.status === "Confirmed" && (
                <Badge variant="outline" className="shrink-0 border-primary/50 bg-primary/10 text-primary text-xs">
                  Confirmed
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="min-w-0 truncate text-xl">{planet.name}</CardTitle>
          <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-3 w-3 shrink-0" />
            <span className="truncate">{planet.hostStar}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getTypeColor(planet.planetType)} text-xs`}>{planet.planetType || "Unknown"}</Badge>
            <Badge variant="outline" className="text-xs">
              {planet.discoveryMethod}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Discovered</div>
                <div className="truncate font-medium">{planet.discoveryYear || "N/A"}</div>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <Ruler className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Distance</div>
                <div className="truncate font-medium">{formatValue(planet.stellarDistance, 1, " pc")}</div>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Radius</div>
                <div className="truncate font-medium">{formatValue(planet.planetRadius, 2, "x Earth")}</div>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <Thermometer className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Temp</div>
                <div className="truncate font-medium">{formatValue(planet.equilibriumTemp, 0, " K")}</div>
              </div>
            </div>

            <div className="col-span-2 flex min-w-0 items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Orbital Period</div>
                <div className="truncate font-medium">{formatValue(planet.orbitalPeriod, 2, " days")}</div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsModalOpen(true)}>
            View Details
          </Button>
        </CardContent>
      </Card>

      <ExoplanetDetailsModal planet={planet} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
