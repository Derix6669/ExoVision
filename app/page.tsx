"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExoplanetHeader } from "@/components/exoplanet-header"
import { ExoplanetHero } from "@/components/exoplanet-hero"
import { ExoplanetSearch } from "@/components/exoplanet-search"
import { ExoplanetStats } from "@/components/exoplanet-stats"
import { ExoplanetGrid } from "@/components/exoplanet-grid"
import { ExoplanetEducation } from "@/components/exoplanet-education"
import { ExoplanetFooter } from "@/components/exoplanet-footer"
import { PredictionForm } from "@/components/prediction-form"
import { ModelTraining } from "@/components/model-training"
import { VisualizationSection } from "@/components/visualization-section"
import { StatsSection } from "@/components/stats-section"
import { LearnSection } from "@/components/learn-section"
import { AboutSection } from "@/components/about-section"
import { Brain, Telescope } from "lucide-react"
import { SpaceBackground } from "@/components/space-background"

export default function Home() {
  const [activeTab, setActiveTab] = useState("ml")
  const [showLearn, setShowLearn] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [searchFilters, setSearchFilters] = useState<
    | {
        query: string
        planetType: string
        discoveryMethod: string
        distance: string
      }
    | undefined
  >(undefined)

  return (
    <div className="relative">
      <SpaceBackground />

      <div className="sticky top-0 z-50">
        <ExoplanetHeader
          onLearnClick={() => setShowLearn(true)}
          onAboutClick={() => setShowAbout(true)}
          isModalOpen={showLearn || showAbout}
        />
      </div>

      {showLearn && <LearnSection onClose={() => setShowLearn(false)} />}
      {showAbout && <AboutSection onClose={() => setShowAbout(false)} />}

      <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="ml" className="gap-2">
                <Brain className="h-4 w-4" />
                ML Classification
              </TabsTrigger>
              <TabsTrigger value="discovery" className="gap-2">
                <Telescope className="h-4 w-4" />
                Discovery
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="relative z-10 min-h-screen">
        {activeTab === "ml" && (
          <>
            <section className="relative px-4 py-16">
              <div className="container relative z-10 mx-auto max-w-5xl text-center">
                <h1 className="glow-purple mb-4 text-5xl font-bold text-foreground md:text-6xl">
                  ExoVision <span className="text-primary">ML</span>
                </h1>
                <p className="text-xl text-muted-foreground">AI-Powered Exoplanet Classification System</p>
              </div>
            </section>

            <PredictionForm />
            <StatsSection />
            <VisualizationSection />
            <ModelTraining />
          </>
        )}

        {activeTab === "discovery" && (
          <>
            <ExoplanetHero />
            <ExoplanetSearch onSearch={setSearchFilters} />
            <ExoplanetGrid filters={searchFilters} />
            <ExoplanetStats />
            <ExoplanetEducation />
          </>
        )}
      </main>

      <ExoplanetFooter />
    </div>
  )
}
