import { Telescope, Github, Twitter } from "lucide-react"

export function ExoplanetFooter() {
  return (
    <footer className="relative z-10 border-t border-border/30 bg-background/80 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Telescope className="h-5 w-5 text-primary" />
              <span className="font-bold">Exoplanet Discovery</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Explore the universe and discover thousands of confirmed exoplanets beyond our solar system.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  NASA Exoplanet Archive
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Discovery Methods
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Planet Types
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Research Papers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Data sourced from NASA Exoplanet Archive and scientific publications.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
          <p>Built with Next.js and powered by real astronomical data</p>
        </div>
      </div>
    </footer>
  )
}
