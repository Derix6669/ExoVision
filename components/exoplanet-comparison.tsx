"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Globe, Star, Calendar, Ruler, Weight, Clock } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

interface Planet {
  id: string
  name: string
  hostStar: string
  type: string
  discoveryYear: number
  discoveryMethod: string
  distance: number
  radius: number
  mass: number
  orbitalPeriod: number
  habitableZone: boolean
}

interface ExoplanetComparisonProps {
  planets: Planet[]
  onClear: () => void
}

export function ExoplanetComparison({ planets, onClear }: ExoplanetComparisonProps) {
  // Normalize data for radar chart (0-100 scale)
  const normalizeValue = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  const radarData = [
    {
      attribute: "Radius",
      ...planets.reduce(
        (acc, planet, idx) => ({
          ...acc,
          [planet.name]: normalizeValue(planet.radius, 10),
        }),
        {},
      ),
    },
    {
      attribute: "Mass",
      ...planets.reduce(
        (acc, planet, idx) => ({
          ...acc,
          [planet.name]: normalizeValue(planet.mass, 300),
        }),
        {},
      ),
    },
    {
      attribute: "Distance",
      ...planets.reduce(
        (acc, planet, idx) => ({
          ...acc,
          [planet.name]: normalizeValue(planet.distance, 2000),
        }),
        {},
      ),
    },
    {
      attribute: "Orbital Period",
      ...planets.reduce(
        (acc, planet, idx) => ({
          ...acc,
          [planet.name]: normalizeValue(planet.orbitalPeriod, 500),
        }),
        {},
      ),
    },
  ]

  const colors = ["oklch(0.65 0.25 280)", "oklch(0.55 0.2 240)", "oklch(0.7 0.18 200)"]

  return (
    <Card className="border-primary/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Planet Comparison</CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparing {planets.length} planet{planets.length !== 1 ? "s" : ""} (max 3)
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Property Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="oklch(0.22 0.02 265)" />
                <PolarAngleAxis dataKey="attribute" tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 10 }} />
                {planets.map((planet, idx) => (
                  <Radar
                    key={planet.id}
                    name={planet.name}
                    dataKey={planet.name}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Table */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Detailed Comparison</h3>
            <div className="space-y-4">
              {planets.map((planet) => (
                <div key={planet.id} className="rounded-lg border border-border/50 bg-muted/20 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold">{planet.name}</h4>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{planet.type}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{planet.discoveryYear}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">{planet.distance} ly</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Weight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Mass:</span>
                      <span className="font-medium">{planet.mass}x</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Radius:</span>
                      <span className="font-medium">{planet.radius}x</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Period:</span>
                      <span className="font-medium">{planet.orbitalPeriod}d</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
