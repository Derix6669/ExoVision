import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".csv")) {
      return NextResponse.json({ detail: "File must be a CSV file" }, { status: 400 })
    }

    // Read CSV content
    const text = await file.text()
    const lines = text.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ detail: "CSV file is empty or invalid" }, { status: 400 })
    }

    // Parse CSV header
    const header = lines[0].split(",").map((h) => h.trim())
    const requiredColumns = [
      "orbital_period",
      "transit_duration",
      "transit_depth",
      "planet_radius",
      "signal_to_noise",
      "koi_score",
    ]

    // Check for required columns
    const missingColumns = requiredColumns.filter((col) => !header.includes(col))
    if (missingColumns.length > 0) {
      return NextResponse.json({ detail: `Missing required columns: ${missingColumns.join(", ")}` }, { status: 400 })
    }

    const predictions = []
    let confirmedCount = 0
    let falsePositiveCount = 0

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const row: Record<string, number> = {}

      header.forEach((col, idx) => {
        row[col] = Number.parseFloat(values[idx])
      })

      // Simple prediction logic
      const koiScore = row.koi_score || 0
      const signalToNoise = row.signal_to_noise || 0
      const transitDepth = row.transit_depth || 0

      const score = koiScore * 0.5 + Math.min(signalToNoise / 20, 1) * 0.3 + Math.min(transitDepth / 2000, 1) * 0.2
      const isConfirmed = score > 0.6
      const confidence = isConfirmed ? Math.min(0.7 + score * 0.2, 0.98) : Math.min(0.6 + (1 - score) * 0.3, 0.95)

      if (isConfirmed) confirmedCount++
      else falsePositiveCount++

      predictions.push({
        row: i,
        prediction: isConfirmed ? "confirmed" : "false-positive",
        confidence,
        probabilities: {
          false_positive: isConfirmed ? 1 - confidence : confidence,
          confirmed: isConfirmed ? confidence : 1 - confidence,
        },
      })
    }

    return NextResponse.json({
      predictions,
      summary: {
        total: predictions.length,
        confirmed: confirmedCount,
        false_positive: falsePositiveCount,
        avg_confidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
      },
    })
  } catch (error) {
    console.error("[v0] CSV prediction error:", error)
    return NextResponse.json(
      { detail: error instanceof Error ? error.message : "CSV prediction failed" },
      { status: 500 },
    )
  }
}
