"use client"

import { useState, useEffect } from "react"
import { ExoplanetCard } from "@/components/exoplanet-card"
import { ExoplanetComparison } from "@/components/exoplanet-comparison"
import { Button } from "@/components/ui/button"
import { GitCompare, Loader2, ChevronLeft, ChevronRight } from "lucide-react"

// Sample exoplanet data
interface Exoplanet {
  id: string
  name: string
  hostStar: string
  planetType: string
  discoveryMethod: string
  discoveryYear: number
  orbitalPeriod: number
  planetRadius: number
  planetMass?: number
  stellarDistance: number
  equilibriumTemp: number
  orbitalEccentricity?: number
  status: string
}

interface SearchFilters {
  query: string
  planetType: string
  discoveryMethod: string
  distance: string
}

interface ExoplanetGridProps {
  filters?: SearchFilters
}

export function ExoplanetGrid({ filters }: ExoplanetGridProps) {
  const [compareMode, setCompareMode] = useState(false)
  const [selectedPlanets, setSelectedPlanets] = useState<Exoplanet[]>([])
  const [filteredPlanets, setFilteredPlanets] = useState<Exoplanet[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setPage(1)
  }, [filters])

  useEffect(() => {
    const fetchExoplanets = async () => {
      setIsSearching(true)
      setError(null)

      try {
        const params = new URLSearchParams()

        params.append("page", page.toString())
        params.append("limit", "6")

        if (filters?.query) {
          params.append("query", filters.query)
        }
        if (filters?.planetType && filters.planetType !== "all") {
          const typeMap: Record<string, string> = {
            "gas-giant": "Gas Giant",
            "neptune-like": "Neptune-like",
            "super-earth": "Super Earth",
            terrestrial: "Terrestrial",
          }
          params.append("planetType", typeMap[filters.planetType] || filters.planetType)
        }
        if (filters?.discoveryMethod && filters.discoveryMethod !== "all") {
          const methodMap: Record<string, string> = {
            transit: "Transit",
            "radial-velocity": "Radial Velocity",
            imaging: "Direct Imaging",
            microlensing: "Microlensing",
          }
          params.append("discoveryMethod", methodMap[filters.discoveryMethod] || filters.discoveryMethod)
        }
        if (filters?.distance && filters.distance !== "all") {
          const distanceMap: Record<string, string> = {
            near: "0-50",
            medium: "50-500",
            far: "500-10000",
          }
          params.append("distance", distanceMap[filters.distance] || filters.distance)
        }

        console.log("[v0] Fetching exoplanets with params:", params.toString())
        const response = await fetch(`/api/exoplanets?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch exoplanets: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Received", data.exoplanets.length, "exoplanets, page", data.page, "of", data.totalPages)

        setFilteredPlanets(data.exoplanets)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error("[v0] Error fetching exoplanets:", err)
        setError(err instanceof Error ? err.message : "Failed to load exoplanets")
        setFilteredPlanets([])
      } finally {
        setIsSearching(false)
      }
    }

    fetchExoplanets()
  }, [filters, page])

  const handleCompare = (planet: Exoplanet) => {
    setSelectedPlanets((prev) => {
      const exists = prev.find((p) => p.id === planet.id)
      if (exists) {
        return prev.filter((p) => p.id !== planet.id)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, planet]
    })
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        pages.push(page - 1)
        pages.push(page)
        pages.push(page + 1)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <section className="relative z-10 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Discovered Exoplanets</h2>
            <p className="text-sm text-muted-foreground">
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Searching...
                </span>
              ) : (
                `Page ${page} of ${totalPages} (${total} total result${total !== 1 ? "s" : ""})`
              )}
            </p>
          </div>
          <Button variant={compareMode ? "default" : "outline"} onClick={() => setCompareMode(!compareMode)}>
            <GitCompare className="mr-2 h-4 w-4" />
            Compare {selectedPlanets.length > 0 && `(${selectedPlanets.length})`}
          </Button>
        </div>

        {compareMode && selectedPlanets.length > 0 && (
          <div className="mb-8">
            <ExoplanetComparison planets={selectedPlanets} onClear={() => setSelectedPlanets([])} />
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {filteredPlanets.length === 0 && !isSearching ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">🔭</div>
            <h3 className="mb-2 text-xl font-semibold">No exoplanets found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlanets.map((planet) => (
                <ExoplanetCard
                  key={planet.id}
                  planet={planet}
                  isComparing={selectedPlanets.some((p) => p.id === planet.id)}
                  onCompare={compareMode ? handleCompare : undefined}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isSearching}
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((pageNum, idx) =>
                  pageNum === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum as number)}
                      disabled={isSearching}
                      size="sm"
                      variant={page === pageNum ? "default" : "outline"}
                      className={page === pageNum ? "" : "bg-transparent"}
                    >
                      {pageNum}
                    </Button>
                  ),
                )}

                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isSearching}
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
