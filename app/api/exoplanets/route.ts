import { NextResponse } from "next/server"

const TOI_CSV_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TOI_2025.10.04_02.54.50-uaCqXLRU6TL32vs1qw2SijkWgqSEZC.csv"

interface Exoplanet {
  id: string
  name: string
  hostStar: string
  planetType: string
  discoveryMethod: string
  discoveryYear: number
  orbitalPeriod: number
  planetRadius: number
  stellarDistance: number
  equilibriumTemp: number
  status: string
}

let cachedData: Exoplanet[] | null = null

async function loadExoplanetData(): Promise<Exoplanet[]> {
  if (cachedData) {
    return cachedData
  }

  try {
    console.log("[v0] Fetching TOI dataset from:", TOI_CSV_URL)
    const response = await fetch(TOI_CSV_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status}`)
    }

    const csvText = await response.text()
    const lines = csvText.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      throw new Error("CSV file is empty or invalid")
    }

    let headerLine = ""
    let dataStartIndex = 0

    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].startsWith("#")) {
        headerLine = lines[i]
        dataStartIndex = i + 1
        break
      }
    }

    if (!headerLine) {
      throw new Error("No header line found in CSV")
    }

    const headers = headerLine.split(",").map((h) => h.trim())
    console.log("[v0] CSV headers found:", headers.slice(0, 15))

    const exoplanets: Exoplanet[] = []

    for (let i = dataStartIndex; i < lines.length; i++) {
      const line = lines[i]
      if (line.startsWith("#") || !line.trim()) continue

      const values = line.split(",")

      if (values.length < headers.length - 5) continue

      const getVal = (key: string) => {
        const idx = headers.indexOf(key)
        return idx >= 0 ? values[idx]?.trim() : ""
      }

      const parseFloat = (val: string): number => {
        const num = Number.parseFloat(val)
        return Number.isNaN(num) ? 0 : num
      }

      const toiId = getVal("toi") || `TOI-${i}`
      const ticId = getVal("tid") || `TIC-${i}`
      const planetRadius = parseFloat(getVal("pl_rade"))
      const orbitalPeriod = parseFloat(getVal("pl_orbper"))
      const stellarDistance = parseFloat(getVal("st_dist"))
      const equilibriumTemp = parseFloat(getVal("pl_eqt"))
      const status = getVal("tfopwg_disp") || "Candidate"
      const createdDate = getVal("toi_created") || "2024"
      const discoveryYear = createdDate ? Number.parseInt(createdDate.split("-")[0]) || 2024 : 2024

      // Determine planet type based on radius
      let planetType = "Unknown"
      if (planetRadius > 0) {
        if (planetRadius < 1.25) planetType = "Terrestrial"
        else if (planetRadius < 2.0) planetType = "Super Earth"
        else if (planetRadius < 6.0) planetType = "Neptune-like"
        else planetType = "Gas Giant"
      }

      exoplanets.push({
        id: toiId,
        name: `TOI ${toiId}`,
        hostStar: `TIC ${ticId}`,
        planetType,
        discoveryMethod: "Transit",
        discoveryYear,
        orbitalPeriod: orbitalPeriod || 0,
        planetRadius: planetRadius || 0,
        stellarDistance: stellarDistance || 0,
        equilibriumTemp: equilibriumTemp || 0,
        status,
      })
    }

    cachedData = exoplanets
    console.log("[v0] Loaded", exoplanets.length, "exoplanets from TOI dataset")
    if (exoplanets.length > 0) {
      console.log("[v0] Sample exoplanet:", JSON.stringify(exoplanets[0]))
    }
    return exoplanets
  } catch (error) {
    console.error("[v0] Error loading exoplanet data:", error)
    // Return mock data as fallback
    return generateMockExoplanets()
  }
}

function generateMockExoplanets(): Exoplanet[] {
  const planetTypes = ["Gas Giant", "Super Earth", "Neptune-like", "Terrestrial"]
  const methods = ["Transit", "Radial Velocity", "Direct Imaging", "Microlensing"]

  return Array.from({ length: 50 }, (_, i) => ({
    id: `TOI-${1000 + i}`,
    name: `TOI ${1000 + i}`,
    hostStar: `TIC ${100000 + i * 100}`,
    planetType: planetTypes[i % planetTypes.length],
    discoveryMethod: methods[i % methods.length],
    discoveryYear: 2020 + (i % 5),
    orbitalPeriod: 1 + Math.random() * 365,
    planetRadius: 0.5 + Math.random() * 15,
    stellarDistance: 10 + Math.random() * 1000,
    equilibriumTemp: 200 + Math.random() * 1500,
    status: i % 3 === 0 ? "Confirmed" : "Candidate",
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
