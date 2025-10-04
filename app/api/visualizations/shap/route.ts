import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock SHAP values data
    const shapData = {
      features: [
        { name: "KOI Score", value: 0.85, shap: 0.42 },
        { name: "Signal-to-Noise", value: 18.5, shap: 0.31 },
        { name: "Transit Depth", value: 1200, shap: 0.18 },
        { name: "Planet Radius", value: 1.3, shap: -0.08 },
        { name: "Orbital Period", value: 287, shap: -0.12 },
        { name: "Transit Duration", value: 3.2, shap: -0.05 },
      ],
      baseValue: 0.5,
      prediction: 0.92,
    }

    return NextResponse.json(shapData)
  } catch (error) {
    console.error("[v0] SHAP error:", error)
    return NextResponse.json({ error: "Failed to generate SHAP values" }, { status: 500 })
  }
}
