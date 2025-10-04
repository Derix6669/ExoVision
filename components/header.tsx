import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Telescope } from "lucide-react"

export function Header() {
  return (
    <header className="relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Telescope className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">ExoVision</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#predict" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Predict
          </Link>
          <Link href="#visualize" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Visualize
          </Link>
          <Link href="#data" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Datasets
          </Link>
          <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  )
}
