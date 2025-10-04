import { Card, CardContent } from "@/components/ui/card"
import { Target, TrendingUp, Zap, Database } from "lucide-react"

const stats = [
  {
    icon: Target,
    label: "Accuracy",
    value: "94.2%",
    description: "Model accuracy on test set",
  },
  {
    icon: TrendingUp,
    label: "F1 Score",
    value: "0.91",
    description: "Balanced precision & recall",
  },
  {
    icon: Zap,
    label: "Predictions",
    value: "10K+",
    description: "Total classifications made",
  },
  {
    icon: Database,
    label: "Datasets",
    value: "3",
    description: "Kepler, K2, and TESS",
  },
]

export function StatsSection() {
  return (
    <section className="relative px-4 py-16">
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mb-1 text-sm font-medium text-foreground">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
