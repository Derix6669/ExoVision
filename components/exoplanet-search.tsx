"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SearchFilters {
  query: string
  planetType: string
  discoveryMethod: string
  distance: string
}

interface ExoplanetSearchProps {
  onSearch: (filters: SearchFilters) => void
}

export function ExoplanetSearch({ onSearch }: ExoplanetSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [query, setQuery] = useState("")
  const [planetType, setPlanetType] = useState("all")
  const [discoveryMethod, setDiscoveryMethod] = useState("all")
  const [distance, setDistance] = useState("all")

  const handleSearch = () => {
    onSearch({
      query,
      planetType,
      discoveryMethod,
      distance,
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="relative z-10 py-12">
      <div className="container mx-auto px-4">
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="search" className="mb-2 block text-sm">
                Search Exoplanets
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, star, or discovery method..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="md:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button className="md:w-auto" onClick={handleSearch}>
              Search
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-4 border-t border-border/50 pt-6 md:grid-cols-3">
              <div>
                <Label htmlFor="planet-type" className="mb-2 block text-sm">
                  Planet Type
                </Label>
                <Select value={planetType} onValueChange={setPlanetType}>
                  <SelectTrigger id="planet-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="gas-giant">Gas Giant</SelectItem>
                    <SelectItem value="neptune-like">Neptune-like</SelectItem>
                    <SelectItem value="super-earth">Super Earth</SelectItem>
                    <SelectItem value="terrestrial">Terrestrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discovery-method" className="mb-2 block text-sm">
                  Discovery Method
                </Label>
                <Select value={discoveryMethod} onValueChange={setDiscoveryMethod}>
                  <SelectTrigger id="discovery-method">
                    <SelectValue placeholder="All methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="transit">Transit</SelectItem>
                    <SelectItem value="radial-velocity">Radial Velocity</SelectItem>
                    <SelectItem value="imaging">Direct Imaging</SelectItem>
                    <SelectItem value="microlensing">Microlensing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="distance" className="mb-2 block text-sm">
                  Distance Range
                </Label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger id="distance">
                    <SelectValue placeholder="Any distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="near">{"< 50 light years"}</SelectItem>
                    <SelectItem value="medium">50-500 light years</SelectItem>
                    <SelectItem value="far">{"> 500 light years"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  )
}
