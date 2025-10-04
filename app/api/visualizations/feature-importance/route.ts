import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock feature importance data
    const featureImportance = {
      features: [
        { name: "KOI Score", importance: 0.28 },
        { name: "Signal-to-Noise", importance: 0.24 },
        { name: "Transit Depth", importance: 0.19 },
        { name: "Planet Radius", importance: 0.15 },
        { name: "Orbital Period", importance: 0.09 },
        { name: "Transit Duration", importance: 0.05 },
      ],
    }

    return NextResponse.json(featureImportance)
  } catch (error) {
    console.error("[v0] Feature importance error:", error)
    return NextResponse.json({ error: "Failed to generate feature importance" }, { status: 500 })
  }
}
