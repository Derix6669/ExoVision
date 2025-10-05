"use client"

import { RotatingPlanet } from "./rotating-planet"

export function ExoplanetHero() {
  return (
    <section className="relative z-10 border-b border-border/30 py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-shrink-0">
            <RotatingPlanet />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h1 className="glow-purple mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Explore the Universe
            </h1>
            <p className="mx-auto lg:mx-0 mb-8 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
              Discover thousands of confirmed exoplanets beyond our solar system. Search, compare, and learn about
              worlds orbiting distant stars.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-1" />
                <span>5,000+ Confirmed Planets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-2" />
                <span>Multiple Discovery Methods</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-chart-3" />
                <span>Real NASA Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
