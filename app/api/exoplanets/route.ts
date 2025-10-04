import { NextResponse } from "next/server"

const NASA_API_URL =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=SELECT+pl_name,hostname,discoverymethod,disc_year,pl_orbper,pl_rade,pl_bmasse,sy_dist,pl_eqt,pl_orbeccen+FROM+ps+WHERE+default_flag=1&format=json"

interface Exoplanet {
  id: string
  name: string
  hostStar: string
  planetType: string
  discoveryMethod: string
  discoveryYear: number
  orbitalPeriod: number
  planetRadius: number
  planetMass: number
  stellarDistance: number
  equilibriumTemp: number
  orbitalEccentricity: number
  status: string
}

interface NASAExoplanet {
  pl_name: string
  hostname: string
  discoverymethod: string
  disc_year: number
  pl_orbper: number
  pl_rade: number
  pl_bmasse: number
  sy_dist: number
  pl_eqt: number
  pl_orbeccen: number
}

let cachedData: Exoplanet[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

async function loadExoplanetData(): Promise<Exoplanet[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
    console.log("[v0] Using cached NASA exoplanet data")
    return cachedData
  }

  try {
    console.log("[v0] Fetching exoplanet data from NASA Exoplanet Archive...")
    const response = await fetch(NASA_API_URL)

    if (!response.ok) {
      throw new Error(`NASA API request failed: ${response.status}`)
    }

    const nasaData: NASAExoplanet[] = await response.json()
    console.log("[v0] Received", nasaData.length, "exoplanets from NASA")

    const exoplanets: Exoplanet[] = nasaData
      .filter((planet) => planet.pl_name) // Filter out entries without names
      .map((planet) => {
        const planetRadius = planet.pl_rade || 0
        const planetMass = planet.pl_bmasse || 0

        // Determine planet type based on radius and mass
        let planetType = "Unknown"
        if (planetRadius > 0) {
          if (planetRadius < 1.25) planetType = "Terrestrial"
          else if (planetRadius < 2.0) planetType = "Super Earth"
          else if (planetRadius < 6.0) planetType = "Neptune-like"
          else planetType = "Gas Giant"
        } else if (planetMass > 0) {
          if (planetMass < 2) planetType = "Terrestrial"
          else if (planetMass < 10) planetType = "Super Earth"
          else if (planetMass < 50) planetType = "Neptune-like"
          else planetType = "Gas Giant"
        }

        // Normalize discovery method names
        let method = planet.discoverymethod || "Unknown"
        if (method.toLowerCase().includes("transit")) method = "Transit"
        else if (method.toLowerCase().includes("radial")) method = "Radial Velocity"
        else if (method.toLowerCase().includes("imaging")) method = "Direct Imaging"
        else if (method.toLowerCase().includes("microlensing")) method = "Microlensing"

        return {
          id: planet.pl_name.replace(/\s+/g, "-"),
          name: planet.pl_name,
          hostStar: planet.hostname || "Unknown",
          planetType,
          discoveryMethod: method,
          discoveryYear: planet.disc_year || 0,
          orbitalPeriod: planet.pl_orbper || 0,
          planetRadius: planetRadius,
          planetMass: planetMass,
          stellarDistance: planet.sy_dist || 0,
          equilibriumTemp: planet.pl_eqt || 0,
          orbitalEccentricity: planet.pl_orbeccen || 0,
          status: "Confirmed", // All NASA archive planets are confirmed
        }
      })

    cachedData = exoplanets
    cacheTimestamp = now
    console.log("[v0] Successfully loaded", exoplanets.length, "confirmed exoplanets from NASA")

    return exoplanets
  } catch (error) {
    console.error("[v0] Error loading NASA exoplanet data:", error)

    // If we have old cached data, return it
    if (cachedData) {
      console.log("[v0] Returning stale cached data due to error")
      return cachedData
    }

    // Otherwise return mock data as fallback
    console.log("[v0] Returning mock data as fallback")
    return generateMockExoplanets()
  }
}

function generateMockExoplanets(): Exoplanet[] {
  const planetTypes = ["Gas Giant", "Super Earth", "Neptune-like", "Terrestrial"]
  const methods = ["Transit", "Radial Velocity", "Direct Imaging", "Microlensing"]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `exoplanet-${1000 + i}`,
    name: `Kepler-${1000 + i} b`,
    hostStar: `Kepler-${1000 + i}`,
    planetType: planetTypes[i % planetTypes.length],
    discoveryMethod: methods[i % methods.length],
    discoveryYear: 2015 + (i % 10),
    orbitalPeriod: 1 + Math.random() * 365,
    planetRadius: 0.5 + Math.random() * 15,
    planetMass: 0.1 + Math.random() * 100,
    stellarDistance: 10 + Math.random() * 1000,
    equilibriumTemp: 200 + Math.random() * 1500,
    orbitalEccentricity: Math.random() * 0.5,
    status: "Confirmed",
  }))
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.toLowerCase() || ""
    const planetType = searchParams.get("planetType") || ""
    const discoveryMethod = searchParams.get("discoveryMethod") || ""
    const distance = searchParams.get("distance") || ""
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "8", 10)

    let exoplanets = await loadExoplanetData()

    // Apply filters
    if (query) {
      exoplanets = exoplanets.filter(
        (planet) =>
          planet.name.toLowerCase().includes(query) ||
          planet.hostStar.toLowerCase().includes(query) ||
          planet.id.toLowerCase().includes(query),
      )
    }

    if (planetType && planetType !== "all") {
      exoplanets = exoplanets.filter((planet) => planet.planetType === planetType)
    }

    if (discoveryMethod && discoveryMethod !== "all") {
      exoplanets = exoplanets.filter((planet) => planet.discoveryMethod === discoveryMethod)
    }

    if (distance && distance !== "all") {
      const [min, max] = distance.split("-").map(Number)
      if (max) {
        exoplanets = exoplanets.filter((planet) => planet.stellarDistance >= min && planet.stellarDistance <= max)
      } else {
        exoplanets = exoplanets.filter((planet) => planet.stellarDistance >= min)
      }
    }

    const total = exoplanets.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedExoplanets = exoplanets.slice(startIndex, endIndex)

    return NextResponse.json({
      exoplanets: paginatedExoplanets,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: endIndex < total,
    })
  } catch (error) {
    console.error("[v0] Error in exoplanets API:", error)
    return NextResponse.json(
      {
        error: "Failed to load exoplanet data",
        exoplanets: [],
        total: 0,
        page: 1,
        limit: 8,
        totalPages: 0,
        hasMore: false,
      },
      { status: 500 },
    )
  }
}
