"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Globe, Star, Calendar, Ruler, Thermometer, Clock, Orbit, Weight, Activity } from "lucide-react"

interface ExoplanetDetailsModalProps {
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
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExoplanetDetailsModal({ planet, open, onOpenChange }: ExoplanetDetailsModalProps) {
  const formatValue = (value: number | null | undefined, decimals = 2, suffix = ""): string => {
    if (value === null || value === undefined || value === 0 || isNaN(value)) {
      return "N/A"
    }
    return `${value.toFixed(decimals)}${suffix}`
  }

  const isHabitable = planet.equilibriumTemp >= 273 && planet.equilibriumTemp <= 373

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-2">{planet.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4" />
                Host Star: {planet.hostStar}
              </DialogDescription>
            </div>
            <Globe className="h-10 w-10 text-primary shrink-0" />
          </div>

          <div className="flex flex-wrap gap-2 pt-3">
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
            <Badge className={getTypeColor(planet.planetType)}>{planet.planetType || "Unknown"}</Badge>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        <div className="space-y-6">
          {/* Discovery Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Discovery Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Discovery Year</div>
                <div className="font-medium">{planet.discoveryYear || "N/A"}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Discovery Method</div>
                <div className="font-medium">{planet.discoveryMethod}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Distance from Earth</div>
                <div className="font-medium">{formatValue(planet.stellarDistance, 2, " parsecs")}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Status</div>
                <div className="font-medium">{planet.status}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Physical Properties */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Physical Properties
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  Planet Radius
                </div>
                <div className="font-medium">{formatValue(planet.planetRadius, 3, " Earth radii")}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Weight className="h-3 w-3" />
                  Planet Mass
                </div>
                <div className="font-medium">{formatValue(planet.planetMass, 3, " Earth masses")}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Thermometer className="h-3 w-3" />
                  Equilibrium Temperature
                </div>
                <div className="font-medium">{formatValue(planet.equilibriumTemp, 0, " K")}</div>
                {planet.equilibriumTemp > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatValue(planet.equilibriumTemp - 273.15, 0, " °C")}
                  </div>
                )}
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Planet Type</div>
                <div className="font-medium">{planet.planetType || "Unknown"}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Orbital Characteristics */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Orbit className="h-5 w-5 text-primary" />
              Orbital Characteristics
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Orbital Period
                </div>
                <div className="font-medium">{formatValue(planet.orbitalPeriod, 2, " days")}</div>
                {planet.orbitalPeriod > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {formatValue(planet.orbitalPeriod / 365.25, 2, " years")}
                  </div>
                )}
              </div>
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Orbital Eccentricity
                </div>
                <div className="font-medium">{formatValue(planet.orbitalEccentricity, 4)}</div>
                {planet.orbitalEccentricity !== undefined && planet.orbitalEccentricity > 0 && (
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {planet.orbitalEccentricity < 0.1
                      ? "Nearly circular"
                      : planet.orbitalEccentricity < 0.3
                        ? "Slightly elliptical"
                        : "Highly elliptical"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Additional Context */}
          {isHabitable && (
            <>
              <Separator />
              <div className="rounded-lg bg-chart-3/10 border border-chart-3/30 p-4">
                <h4 className="font-semibold text-chart-3 mb-2">Potentially Habitable</h4>
                <p className="text-sm text-muted-foreground">
                  This exoplanet's equilibrium temperature falls within the range where liquid water could exist on its
                  surface (273-373 K), making it potentially habitable.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
