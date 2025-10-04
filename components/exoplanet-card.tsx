"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Star, Calendar, Ruler, Thermometer, Clock } from "lucide-react"

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
    orbitalPeriod: number
    equilibriumTemp: number
    status: string
  }
  isComparing?: boolean
  onCompare?: (planet: ExoplanetCardProps["planet"]) => void
}

export function ExoplanetCard({ planet, isComparing = false, onCompare }: ExoplanetCardProps) {
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
    <Card className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <Globe className="h-8 w-8 text-primary" />
          <div className="flex gap-2">
            {isHabitable && (
              <Badge variant="outline" className="border-chart-3/50 bg-chart-3/10 text-chart-3">
                Habitable Zone
              </Badge>
            )}
            {planet.status === "Confirmed" && (
              <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
                Confirmed
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-xl">{planet.name}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-3 w-3" />
          <span>{planet.hostStar}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge className={getTypeColor(planet.planetType)}>{planet.planetType || "Unknown"}</Badge>
          <Badge variant="outline">{planet.discoveryMethod}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Discovered</div>
              <div className="font-medium">{planet.discoveryYear}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Distance</div>
              <div className="font-medium">{planet.stellarDistance.toFixed(1)} pc</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Radius</div>
              <div className="font-medium">{planet.planetRadius.toFixed(2)}x Earth</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Temp</div>
              <div className="font-medium">{planet.equilibriumTemp.toFixed(0)} K</div>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-xs text-muted-foreground">Orbital Period</div>
              <div className="font-medium">{planet.orbitalPeriod.toFixed(2)} days</div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
