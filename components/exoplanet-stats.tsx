"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const discoveryMethodData = [
  { name: "Transit", value: 3800, color: "oklch(0.65 0.25 280)" },
  { name: "Radial Velocity", value: 1050, color: "oklch(0.55 0.2 240)" },
  { name: "Direct Imaging", value: 70, color: "oklch(0.7 0.18 200)" },
  { name: "Microlensing", value: 180, color: "oklch(0.75 0.15 320)" },
]

const planetTypeData = [
  { type: "Gas Giant", count: 1600 },
  { type: "Neptune-like", count: 1900 },
  { type: "Super Earth", count: 1400 },
  { type: "Terrestrial", count: 200 },
]

const discoveryYearData = [
  { year: "1995-2000", count: 50 },
  { year: "2001-2005", count: 120 },
  { year: "2006-2010", count: 450 },
  { year: "2011-2015", count: 1800 },
  { year: "2016-2020", count: 2200 },
  { year: "2021-2024", count: 480 },
]

export function ExoplanetStats() {
  return (
    <section className="relative z-10 border-y border-border/30 bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">Discovery Statistics</h2>
          <p className="text-muted-foreground">
            Explore patterns in exoplanet discoveries across methods, types, and time
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Discovery Methods Pie Chart */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Discovery Methods</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of planets by detection technique</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={discoveryMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {discoveryMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.02 265)",
                      border: "1px solid oklch(0.22 0.02 265)",
                      borderRadius: "0.5rem",
                      color: "oklch(0.98 0.01 265)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Planet Types Bar Chart */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Planet Types</CardTitle>
              <p className="text-sm text-muted-foreground">Number of planets by classification</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={planetTypeData}>
                  <XAxis
                    dataKey="type"
                    stroke="oklch(0.65 0.01 265)"
                    tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 12 }}
                  />
                  <YAxis stroke="oklch(0.65 0.01 265)" tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.02 265)",
                      border: "1px solid oklch(0.22 0.02 265)",
                      borderRadius: "0.5rem",
                      color: "oklch(0.98 0.01 265)",
                    }}
                  />
                  <Bar dataKey="count" fill="oklch(0.65 0.25 280)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Discovery Timeline */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Discovery Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">Exoplanet discoveries over time</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={discoveryYearData}>
                  <XAxis
                    dataKey="year"
                    stroke="oklch(0.65 0.01 265)"
                    tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 12 }}
                  />
                  <YAxis stroke="oklch(0.65 0.01 265)" tick={{ fill: "oklch(0.65 0.01 265)", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.12 0.02 265)",
                      border: "1px solid oklch(0.22 0.02 265)",
                      borderRadius: "0.5rem",
                      color: "oklch(0.98 0.01 265)",
                    }}
                  />
                  <Bar dataKey="count" fill="oklch(0.55 0.2 240)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm lg:col-span-2">
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="glow-purple mb-2 text-4xl font-bold">5,100+</div>
                  <div className="text-sm text-muted-foreground">Confirmed Planets</div>
                </div>
                <div className="text-center">
                  <div className="glow-blue mb-2 text-4xl font-bold">3,800+</div>
                  <div className="text-sm text-muted-foreground">Planetary Systems</div>
                </div>
                <div className="text-center">
                  <div className="glow-cyan mb-2 text-4xl font-bold">850+</div>
                  <div className="text-sm text-muted-foreground">Multi-Planet Systems</div>
                </div>
                <div className="text-center">
                  <div className="mb-2 text-4xl font-bold text-chart-3">60+</div>
                  <div className="text-sm text-muted-foreground">Potentially Habitable</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
