import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const requiredFields = [
      "orbital_period",
      "transit_duration",
      "transit_depth",
      "planet_radius",
      "signal_to_noise",
      "koi_score",
    ]

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ detail: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Simple heuristic: if KOI score > 0.7 and signal-to-noise > 10, likely confirmed
    const koiScore = Number.parseFloat(body.koi_score)
    const signalToNoise = Number.parseFloat(body.signal_to_noise)
    const transitDepth = Number.parseFloat(body.transit_depth)

    // Calculate a simple score based on parameters
    const score = koiScore * 0.5 + Math.min(signalToNoise / 20, 1) * 0.3 + Math.min(transitDepth / 2000, 1) * 0.2

    const isConfirmed = score > 0.6
    const confidence = isConfirmed ? Math.min(0.7 + score * 0.2, 0.98) : Math.min(0.6 + (1 - score) * 0.3, 0.95)

    const prediction = isConfirmed ? "confirmed" : "false-positive"

    return NextResponse.json({
      prediction,
      confidence,
      probabilities: {
        false_positive: isConfirmed ? 1 - confidence : confidence,
        confirmed: isConfirmed ? confidence : 1 - confidence,
      },
    })
  } catch (error) {
    console.error("[v0] Prediction error:", error)
    return NextResponse.json({ detail: error instanceof Error ? error.message : "Prediction failed" }, { status: 500 })
  }
}
