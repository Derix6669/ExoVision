"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Telescope, Orbit, Lightbulb, Target } from "lucide-react"

interface LearnSectionProps {
  onClose: () => void
}

export function LearnSection({ onClose }: LearnSectionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 border-primary/20">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-4xl font-bold text-foreground">Learn About Exoplanets</h2>
            <p className="text-lg text-muted-foreground">Discover worlds beyond our solar system</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Telescope className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">What Are Exoplanets?</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Exoplanets are planets that orbit stars outside our solar system. Since the first confirmed detection in
                1992, astronomers have discovered over 5,000 exoplanets using various detection methods. These distant
                worlds range from gas giants larger than Jupiter to rocky planets smaller than Earth, offering insights
                into planetary formation and the potential for life beyond our solar system.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Detection Methods</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Transit Method</h4>
                  <p className="text-sm text-muted-foreground">
                    Detects planets by measuring the dimming of a star's light as a planet passes in front of it. This
                    is the most successful method, used by missions like Kepler and TESS.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Radial Velocity</h4>
                  <p className="text-sm text-muted-foreground">
                    Measures the wobble of a star caused by the gravitational pull of orbiting planets. This method can
                    determine a planet's mass and orbital period.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Direct Imaging</h4>
                  <p className="text-sm text-muted-foreground">
                    Captures actual images of exoplanets by blocking out the star's light. This method works best for
                    large planets far from their host stars.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Gravitational Microlensing</h4>
                  <p className="text-sm text-muted-foreground">
                    Uses the gravitational field of a star to magnify light from a background star, revealing planets
                    through their gravitational influence.
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Orbit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Types of Exoplanets</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-accent">Gas Giants</h4>
                  <p className="text-sm text-muted-foreground">
                    Large planets similar to Jupiter and Saturn, composed mainly of hydrogen and helium. Hot Jupiters
                    orbit very close to their stars.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-accent">Super-Earths</h4>
                  <p className="text-sm text-muted-foreground">
                    Rocky planets larger than Earth but smaller than Neptune. They may have thick atmospheres and could
                    potentially harbor life.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-accent">Neptune-like</h4>
                  <p className="text-sm text-muted-foreground">
                    Ice giants with thick atmospheres of hydrogen, helium, and methane. Similar in size to Neptune and
                    Uranus.
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-accent">Terrestrial</h4>
                  <p className="text-sm text-muted-foreground">
                    Rocky planets similar to Earth, Mars, and Venus. These are prime candidates in the search for
                    habitable worlds.
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Lightbulb className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">The Habitable Zone</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The habitable zone, or "Goldilocks zone," is the region around a star where conditions might be just
                right for liquid water to exist on a planet's surface. This zone varies depending on the star's
                temperature and size. Planets in the habitable zone are of particular interest in the search for
                extraterrestrial life, as liquid water is considered essential for life as we know it.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={onClose} size="lg" className="bg-primary hover:bg-primary/90">
              Start Exploring
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
