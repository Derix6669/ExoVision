"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Brain, Database, Rocket, Code } from "lucide-react"

interface AboutSectionProps {
  onClose: () => void
}

export function AboutSection({ onClose }: AboutSectionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card/95 border-primary/20">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-4xl font-bold text-foreground">About ExoVision</h2>
            <p className="text-lg text-muted-foreground">AI-Powered Exoplanet Discovery Platform</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ExoVision combines cutting-edge machine learning with astronomical data to help researchers and
                enthusiasts explore the universe of exoplanets. Our platform provides tools for classification,
                visualization, and discovery, making exoplanet research more accessible and interactive.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">ML Classification System</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our machine learning system uses advanced algorithms to classify exoplanet candidates based on key
                parameters such as orbital period, transit duration, planet radius, and signal-to-noise ratio. The
                system can process individual candidates or batch analyze CSV files containing multiple observations.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Upload Models</h4>
                  <p className="text-sm text-muted-foreground">
                    Support for .pkl, .h5, and .pt model formats with drag-and-drop interface
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Real-time Predictions</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant classification with confidence scores and detailed metrics
                  </p>
                </Card>
                <Card className="bg-secondary/50 p-4 border-border/50">
                  <h4 className="mb-2 font-semibold text-primary">Model Training</h4>
                  <p className="text-sm text-muted-foreground">
                    Retrain models with your own data for improved accuracy
                  </p>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Data Sources</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ExoVision utilizes data from NASA's Exoplanet Archive, which contains information on thousands of
                confirmed exoplanets and candidates from missions like Kepler, TESS, and ground-based observatories. Our
                platform processes this data to provide insights into planetary characteristics, discovery methods, and
                habitability potential.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Code className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Technology Stack</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Next.js & React for frontend</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Python & FastAPI for backend</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span className="text-muted-foreground">Scikit-learn for ML models</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span className="text-muted-foreground">Recharts for data visualization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-muted-foreground">Tailwind CSS for styling</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-accent"></div>
                  <span className="text-muted-foreground">SHAP for model explainability</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-primary/10 p-6 border border-primary/20">
              <h4 className="mb-2 font-semibold text-primary">Open Source</h4>
              <p className="text-sm text-muted-foreground">
                ExoVision is built with open-source technologies and aims to make exoplanet research accessible to
                everyone. Whether you're a researcher, student, or space enthusiast, our platform provides the tools you
                need to explore the fascinating world of exoplanets.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button onClick={onClose} size="lg" className="bg-primary hover:bg-primary/90">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
