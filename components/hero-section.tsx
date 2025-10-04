import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:py-32">
      {/* Purple glow effect */}
      <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container relative z-10 mx-auto text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
          <Sparkles className="h-4 w-4" />
          <span>Powered by NASA Open Data</span>
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          Discover <span className="glow-purple text-primary">Exoplanets</span>
          <br />
          with AI
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          {
            "ExoVision is the end-to-end platform for classifying exoplanets using machine learning. Analyze Kepler, K2, and TESS data with explainable AI."
          }
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Start Predicting
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-border bg-card hover:bg-card/80">
            View Documentation
          </Button>
        </div>

        <div className="mt-16">
          <p className="mb-6 text-sm uppercase tracking-wider text-muted-foreground">Trusted by researchers at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-lg font-semibold">NASA</div>
            <div className="text-lg font-semibold">ESA</div>
            <div className="text-lg font-semibold">Caltech</div>
            <div className="text-lg font-semibold">MIT</div>
            <div className="text-lg font-semibold">SETI</div>
          </div>
        </div>
      </div>
    </section>
  )
}
