"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Telescope, Waves, Camera, Lightbulb, Globe, Flame, Wind, Droplets } from "lucide-react"

export function ExoplanetEducation() {
  return (
    <section className="relative z-10 border-t border-border/30 bg-muted/20 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="glow-blue mb-4 text-3xl font-bold md:text-4xl">Learn About Exoplanets</h2>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground">
            Discover how scientists find planets beyond our solar system and what makes each type unique
          </p>
        </div>

        <Tabs defaultValue="methods" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="methods">Discovery Methods</TabsTrigger>
            <TabsTrigger value="types">Planet Types</TabsTrigger>
          </TabsList>

          <TabsContent value="methods" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-1/20 p-2">
                      <Waves className="h-6 w-6 text-chart-1" />
                    </div>
                    <CardTitle>Transit Method</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-1/20 text-chart-1">Most Common - 75%</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Detects planets by measuring the slight dimming of a star's light when a planet passes in front of
                    it. This method has discovered the majority of known exoplanets.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <h4 className="mb-2 text-xs font-semibold">Key Advantages:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Can detect small, Earth-sized planets</li>
                      <li>• Provides planet size and orbital period</li>
                      <li>• Used by Kepler and TESS missions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-2/20 p-2">
                      <Waves className="h-6 w-6 text-chart-2" />
                    </div>
                    <CardTitle>Radial Velocity</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-2/20 text-chart-2">Second Most Common - 20%</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Measures the wobble of a star caused by the gravitational pull of an orbiting planet. The star's
                    light shifts slightly red and blue as it moves.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <h4 className="mb-2 text-xs font-semibold">Key Advantages:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Provides planet mass information</li>
                      <li>• Works for planets at various distances</li>
                      <li>• First method to find exoplanets (1995)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-3/20 p-2">
                      <Camera className="h-6 w-6 text-chart-3" />
                    </div>
                    <CardTitle>Direct Imaging</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-3/20 text-chart-3">Rare - 1%</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Captures actual images of exoplanets by blocking out the star's bright light. Only works for large
                    planets far from their stars.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <h4 className="mb-2 text-xs font-semibold">Key Advantages:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Provides direct visual confirmation</li>
                      <li>• Can study planet's atmosphere</li>
                      <li>• Best for young, hot planets</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-4/20 p-2">
                      <Lightbulb className="h-6 w-6 text-chart-4" />
                    </div>
                    <CardTitle>Gravitational Microlensing</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-4/20 text-chart-4">Specialized - 4%</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Uses gravity as a lens to magnify light from distant stars. When a planet passes in front, it
                    creates a unique light signature.
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <h4 className="mb-2 text-xs font-semibold">Key Advantages:</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Can find planets very far away</li>
                      <li>• Detects low-mass planets</li>
                      <li>• One-time observation events</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-4/20 p-2">
                      <Wind className="h-6 w-6 text-chart-4" />
                    </div>
                    <CardTitle>Gas Giants</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-4/20 text-chart-4">Jupiter-like</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Massive planets composed primarily of hydrogen and helium. Similar to Jupiter and Saturn in our
                    solar system, but can be much larger.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Mass:</span>
                      <span className="font-medium">50-5000x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Radius:</span>
                      <span className="font-medium">1-2x Jupiter</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Habitability:</span>
                      <span className="font-medium">Not habitable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-1/20 p-2">
                      <Droplets className="h-6 w-6 text-chart-1" />
                    </div>
                    <CardTitle>Neptune-like</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-1/20 text-chart-1">Ice Giants</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Planets similar in size to Neptune, with thick atmospheres of hydrogen and helium over icy cores.
                    Very common in the galaxy.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Mass:</span>
                      <span className="font-medium">10-50x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Radius:</span>
                      <span className="font-medium">2-6x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Habitability:</span>
                      <span className="font-medium">Unlikely</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-2/20 p-2">
                      <Globe className="h-6 w-6 text-chart-2" />
                    </div>
                    <CardTitle>Super Earths</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-2/20 text-chart-2">Rocky Worlds</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Rocky planets larger than Earth but smaller than Neptune. May have thick atmospheres and could
                    potentially harbor life.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Mass:</span>
                      <span className="font-medium">2-10x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Radius:</span>
                      <span className="font-medium">1.25-2x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Habitability:</span>
                      <span className="font-medium text-chart-3">Possible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-lg bg-chart-3/20 p-2">
                      <Telescope className="h-6 w-6 text-chart-3" />
                    </div>
                    <CardTitle>Terrestrial</CardTitle>
                  </div>
                  <Badge className="w-fit bg-chart-3/20 text-chart-3">Earth-like</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Rocky planets similar in size to Earth. The most exciting for astrobiology as they could have
                    conditions suitable for life.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Mass:</span>
                      <span className="font-medium">0.5-2x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Typical Radius:</span>
                      <span className="font-medium">0.8-1.25x Earth</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Habitability:</span>
                      <span className="font-medium text-chart-3">High potential</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/30 bg-gradient-to-br from-chart-3/10 to-chart-2/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-chart-3" />
                  The Habitable Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  The habitable zone, also called the "Goldilocks zone," is the region around a star where conditions
                  are just right for liquid water to exist on a planet's surface. Not too hot, not too cold. This is
                  considered the most important factor in the search for life beyond Earth.
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-card/50 p-4">
                    <h4 className="mb-2 font-semibold text-chart-4">Too Hot</h4>
                    <p className="text-sm text-muted-foreground">
                      Water evaporates, creating runaway greenhouse effect
                    </p>
                  </div>
                  <div className="rounded-lg bg-chart-3/20 p-4">
                    <h4 className="mb-2 font-semibold text-chart-3">Just Right</h4>
                    <p className="text-sm text-muted-foreground">Liquid water can exist, life may be possible</p>
                  </div>
                  <div className="rounded-lg bg-card/50 p-4">
                    <h4 className="mb-2 font-semibold text-chart-2">Too Cold</h4>
                    <p className="text-sm text-muted-foreground">Water freezes solid, making life unlikely</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
